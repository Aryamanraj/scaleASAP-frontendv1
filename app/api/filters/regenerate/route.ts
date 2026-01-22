import { NextRequest } from 'next/server'
import { chatCompletion, ChatMessage } from '@/lib/ai-provider'
import fs from 'fs/promises'
import path from 'path'
import { 
    getRemovableFiltersInOrder, 
    removeFilter, 
    formatFiltersForDisplay,
    OptimizationResult,
    WizaFilters
} from '@/lib/wiza/filter-optimizer'

const TARGET_PROSPECT_COUNT = 200
const MIN_ACCEPTABLE_COUNT = 50
const MAX_PAGES_PER_TEST = 3 // Test with fewer pages for speed

interface WizaSearchPayload {
    query: WizaFilters
    page_size: number
}

interface WizaClient {
    search: (payload: WizaSearchPayload, maxPages: number) => Promise<unknown[]>
}

/**
 * Initialize the Wiza client
 */
async function getWizaClient(): Promise<WizaClient> {
    try {
        // Try to import the SimpleProspectClient
        const simplePath = path.join(process.cwd(), 'linkedin-scraper/simple.cjs')
        const { SimpleProspectClient } = await import(simplePath)
        
        const client = new SimpleProspectClient({
            baseUrl: 'https://wiza.co',
            email: process.env.WIZA_EMAIL!,
            password: process.env.WIZA_PASSWORD!,
            sessionFile: path.join(process.cwd(), 'data/wiza-session.json'),
            debug: false,
        })
        
        return client
    } catch (error) {
        console.error('Failed to initialize Wiza client:', error)
        throw new Error('Wiza client not available. Make sure linkedin-scraper/simple.cjs exists.')
    }
}

/**
 * Test filters and count prospects
 */
async function testFilters(client: WizaClient, filters: WizaFilters): Promise<number> {
    try {
        const results = await client.search(
            {
                query: filters,
                page_size: 100,
            },
            MAX_PAGES_PER_TEST
        )
        return results.length
    } catch (error) {
        console.error('Error testing filters:', error)
        return 0
    }
}

/**
 * Optimize filters to reach target prospect count
 */
async function optimizeFilters(
    client: WizaClient,
    initialFilters: WizaFilters
): Promise<OptimizationResult> {
    const iterations: OptimizationResult['iterations'] = []
    let currentFilters = { ...initialFilters }
    const removedFilters: string[] = []
    
    console.log('Starting filter optimization...')
    console.log('Initial filters:', formatFiltersForDisplay(currentFilters))
    
    // Try initial filters
    const initialCount = await testFilters(client, currentFilters)
    console.log(`Initial count: ${initialCount}`)
    
    iterations.push({
        filters: Object.keys(currentFilters),
        count: initialCount,
    })
    
    if (initialCount >= MIN_ACCEPTABLE_COUNT) {
        return {
            filters: currentFilters,
            prospectCount: initialCount,
            removedFilters: [],
            iterations,
        }
    }
    
    // Get filters to try removing (least important first)
    const removableFilters = getRemovableFiltersInOrder(currentFilters)
    console.log('Removable filters (in order):', removableFilters)
    
    // Progressively remove filters
    for (const filterToRemove of removableFilters) {
        console.log(`\nTrying without: ${filterToRemove}`)
        
        currentFilters = removeFilter(currentFilters, filterToRemove)
        removedFilters.push(filterToRemove)
        
        const count = await testFilters(client, currentFilters)
        console.log(`Count without ${filterToRemove}: ${count}`)
        
        iterations.push({
            filters: Object.keys(currentFilters),
            count,
            removedFilter: filterToRemove,
        })
        
        // If we've reached acceptable count, stop
        if (count >= MIN_ACCEPTABLE_COUNT) {
            console.log(`✓ Found acceptable count: ${count}`)
            break
        }
    }
    
    const finalCount = await testFilters(client, currentFilters)
    
    return {
        filters: currentFilters,
        prospectCount: finalCount,
        removedFilters,
        iterations,
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { experiment, optimize = true } = body

        if (!experiment) {
            return new Response('Missing experiment', { status: 400 })
        }

        // Load the output schema that includes wiza_filters
        const outputSchemaPath = path.join(process.cwd(), 'lib/prompts/discovery/output.md')
        const outputSchema = await fs.readFile(outputSchemaPath, 'utf-8')

        // Extract the field reference section
        const fieldRefMatch = outputSchema.match(/WIZA FILTERS FIELD REFERENCE[\s\S]*?(?=\n-{20,}|\n\*\*STRICT RULES)/m)
        const fieldReference = fieldRefMatch ? fieldRefMatch[0] : ''

        const systemPrompt = `You are an expert at creating precise targeting filters for B2B lead generation using the Wiza API format.

Given this experiment hypothesis, generate Wiza filters to find the exact ICP:

**Experiment Details:**
- Name: ${experiment.name}
- Growth Pattern: ${experiment.pattern}
- Target Pain Point: ${experiment.pain}
- Trigger Mechanism: ${experiment.trigger}
- Outreach Angle: ${experiment.outreach_angle}

${fieldReference}

**Your Task:**
Generate comprehensive Wiza API filters that would find leads matching this ICP. Consider:
1. Job titles that would experience this pain point (use format: [{"v": "CEO", "s": "i"}])
2. Seniority levels of decision-makers (job_title_level: ["CXO", "VP", "Director", etc.])
3. Company characteristics (company_size: ["11-50", "51-200"], revenue: ["$1M-$10M"], etc.)
4. Industries that match this pattern (company_industry: [{"v": "Computer Software"}])
5. Technology skills if relevant (skill: ["Salesforce", "Python"])
6. Funding/growth signals if relevant (funding_stage, funding_type)

**Critical Format Requirements:**
- job_title: Array of objects like [{"v": "CEO", "s": "i"}, {"v": "CTO"}]
- job_title_level: Array of strings like ["CXO", "VP", "Director"]
- company_size: Array like ["11-50", "51-200", "201-500"]
- revenue: Array like ["$1M-$10M", "$10M-$50M"]
- company_industry: Array of objects like [{"v": "Computer Software"}, {"v": "Legal Services", "s": "i"}]

**Output Format:**
Return ONLY a JSON object with this exact structure:
{
  "wiza_filters": {
    "job_title": [{"v": "title1", "s": "i"}],
    "job_title_level": ["CXO", "VP"],
    "company_size": ["11-50", "51-200"],
    "revenue": ["$1M-$10M"],
    "company_industry": [{"v": "Industry Name"}]
  }
}

Only include fields that are highly relevant to finding this specific ICP. Be strategic and specific.`

        const chatMessages: ChatMessage[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Generate the wiza_filters for this experiment.' }
        ]

        const chatResult = await chatCompletion({
            model: 'gpt-4o',
            messages: chatMessages,
        })

        const text = chatResult.content || ''

        // Parse JSON from response
        let generatedFilters: WizaFilters
        try {
            const jsonStart = text.indexOf('{')
            const jsonEnd = text.lastIndexOf('}')
            if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonStr = text.substring(jsonStart, jsonEnd + 1)
                const parsed = JSON.parse(jsonStr)
                generatedFilters = parsed.wiza_filters || parsed
            } else {
                throw new Error('No JSON found in AI response')
            }
        } catch {
            console.error('Error parsing AI response:', text)
            return new Response('Failed to parse AI response', { status: 500 })
        }

        // If optimization is disabled, return generated filters as-is
        if (!optimize) {
            return new Response(JSON.stringify({ 
                wiza_filters: generatedFilters 
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Optimize filters to find acceptable prospect count
        try {
            const client = await getWizaClient()
            const optimizationResult = await optimizeFilters(client, generatedFilters)
            
            return new Response(JSON.stringify({
                wiza_filters: optimizationResult.filters,
                optimization: {
                    prospectCount: optimizationResult.prospectCount,
                    removedFilters: optimizationResult.removedFilters,
                    iterations: optimizationResult.iterations,
                    targetCount: TARGET_PROSPECT_COUNT,
                    minAcceptableCount: MIN_ACCEPTABLE_COUNT,
                }
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (error) {
            console.error('Optimization error:', error)
            // Fall back to unoptimized filters if optimization fails
            return new Response(JSON.stringify({ 
                wiza_filters: generatedFilters,
                optimization: {
                    error: 'Optimization failed, returning unoptimized filters',
                    message: error instanceof Error ? error.message : 'Unknown error'
                }
            }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }

    } catch (error: unknown) {
        console.error('Regenerate Filters API Error:', error)
        return new Response('An error occurred during filter regeneration.', { status: 500 })
    }
}
