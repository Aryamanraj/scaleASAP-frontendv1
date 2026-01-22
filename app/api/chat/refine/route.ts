import { NextRequest } from 'next/server'
import { chatCompletion, ChatMessage } from '@/lib/ai-provider'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { experiment, feedback } = body

        if (!experiment || !feedback) {
            return new Response('Missing experiment or feedback', { status: 400 })
        }

        const promptPath = path.join(process.cwd(), 'lib/prompts/refine.md')
        const promptTemplate = await fs.readFile(promptPath, 'utf-8')

        const systemPrompt = promptTemplate
            .replace('{{experiment_name}}', experiment.name)
            .replace('{{pattern}}', experiment.pattern)
            .replace('{{pain}}', experiment.pain)
            .replace('{{trigger}}', experiment.trigger)
            .replace('{{outreach_angle}}', experiment.outreach_angle)
            .replace('{{feedback}}', feedback)

        const chatMessages: ChatMessage[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Refine this experiment based on my feedback.' }
        ]

        const chatResult = await chatCompletion({
            model: 'gpt-4o',
            messages: chatMessages,
        })

        const text = chatResult.content || ''

        // Attempt to parse JSON from the response
        try {
            const jsonStart = text.indexOf('{')
            const jsonEnd = text.lastIndexOf('}')
            if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonStr = text.substring(jsonStart, jsonEnd + 1)
                return new Response(jsonStr, {
                    headers: { 'Content-Type': 'application/json' }
                })
            }
            throw new Error('No JSON found in AI response')
        } catch {
            console.error('Error parsing AI response:', text)
            return new Response('Failed to parse AI response', { status: 500 })
        }

    } catch (error: unknown) {
        console.error('Refine API Error:', error)
        return new Response('An error occurred during refinement.', { status: 500 })
    }
}
