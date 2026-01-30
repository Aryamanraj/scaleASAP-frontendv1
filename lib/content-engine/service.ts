import { chatCompletion, ChatMessage } from '@/lib/ai-provider';
import { OUTREACH_SYSTEM_PROMPT } from './prompt';
import { GenerationRequest, OutreachResult } from './types';
import { OutreachRequestSchema } from './schemas';

/**
 * Service to handle content generation using the outreach system prompt.
 */
export class ContentEngineService {
    /**
     * Generates a cold outreach message based on business context and prospect data.
     */
    static async generateOutreach(request: GenerationRequest): Promise<OutreachResult> {
        // 1. Validate input
        const validated = OutreachRequestSchema.parse(request);

        // 2. Step 1: Analyze Activity
        // We first use recent activity to make sure the person is active or not, 
        // then crunch the time of highest activity.
        const activityAnalysis = await this.analyzeLinkedInActivity(validated.prospect.rawActivity || '');

        // 3. Prepare contextual inputs for the waterfall
        // We skip "pass most info" if we hit token limits, but gpt-4o handles 128k,
        // so "waterfall style" here means structured priority: Activity -> Profile -> Posts -> Business Context.

        const businessString = JSON.stringify({
            ...validated.business,
            onboardingContext: validated.business.onboardingContext,
            offer: validated.business.offer
        }, null, 2);

        const prospectString = JSON.stringify({
            ...validated.prospect,
            activityAnalysis, // Include the crunched activity time
            icpCategory: validated.prospect.icpCategory
        }, null, 2);

        // 4. Final generation
        const messages: ChatMessage[] = [
            { role: 'system', content: OUTREACH_SYSTEM_PROMPT },
            {
                role: 'user',
                content: `Here is the context for the outreach generation:

BUSINESS CONTEXT (from onboarding and offer):
${businessString}

PROSPECT DATA (including full profile and recent activity analysis):
${prospectString}

ICP FIT ANALYSIS (from experiments):
${JSON.stringify(validated.fit, null, 2)}

Please generate the BEST ACTION and the BEST MESSAGE for that action. 
Ensure the message is optimized for the user's peak activity time if available.
The response must be in JSON format as specified in the system prompt.`,
            },
        ];

        // 5. Call AI provider
        const { content } = await chatCompletion({
            model: 'gpt-4o',
            messages,
            temperature: 0.7,
        });

        // 6. Parse and return result
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : content;
            const result = JSON.parse(jsonString) as OutreachResult;

            return result;
        } catch {
            console.error('[ContentEngineService] Failed to parse AI response:', content);
            throw new Error('Failed to parse content generation response');
        }
    }

    /**
     * Analyzes raw LinkedIn activity data to determine if active and find peak times.
     */
    static async analyzeLinkedInActivity(rawActivity: string): Promise<{
        isActive: boolean;
        peakTime: string;
        summary: string;
    }> {
        if (!rawActivity) {
            return { isActive: false, peakTime: 'Unknown', summary: 'No activity data provided.' };
        }

        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: 'You are a LinkedIn activity analyzer. Your goal is to determine if a user is active and identify their most active time of day/week based on raw activity logs.'
            },
            {
                role: 'user',
                content: `Analyze this raw LinkedIn activity:
                
${rawActivity}

Return a JSON object with:
"isActive": boolean,
"peakTime": "string (e.g. Tuesday mornings)",
"summary": "brief summary of activity patterns"`
            }
        ];

        const { content } = await chatCompletion({
            model: 'gpt-4o',
            messages,
            temperature: 0,
        });

        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : content;
            return JSON.parse(jsonString);
        } catch {
            return { isActive: true, peakTime: 'Recent', summary: 'Active user.' };
        }
    }

    /**
     * Generates a custom outreach message based on business context, prospect data, and custom parameters.
     */
    static async generateCustomOutreach(
        request: GenerationRequest,
        platform: string,
        messageType: string,
        userContext?: string
    ): Promise<OutreachResult> {
        // 1. Validate input
        const validated = OutreachRequestSchema.parse(request);

        // 2. Analyze Activity
        const activityAnalysis = await this.analyzeLinkedInActivity(validated.prospect.rawActivity || '');

        // 3. Prepare contextual inputs
        const businessString = JSON.stringify({
            ...validated.business,
            onboardingContext: validated.business.onboardingContext,
            offer: validated.business.offer
        }, null, 2);

        const prospectString = JSON.stringify({
            ...validated.prospect,
            activityAnalysis,
            icpCategory: validated.prospect.icpCategory
        }, null, 2);

        // 4. Final generation with custom instructions
        const messages: ChatMessage[] = [
            { role: 'system', content: OUTREACH_SYSTEM_PROMPT },
            {
                role: 'user',
                content: `Here is the context for the outreach generation:

BUSINESS CONTEXT:
${businessString}

PROSPECT DATA:
${prospectString}

ICP FIT ANALYSIS:
${JSON.stringify(validated.fit, null, 2)}

CUSTOM CONSTRAINTS:
- Platform: ${platform}
- Message Type: ${messageType}
${userContext ? `- Additional Context (e.g. user response): ${userContext}` : ''}

Please generate a message that explicitly respects these custom constraints. 
The message should be optimized for the ${platform} platform and be a ${messageType}.
If the platform is 'Email', ignore the LinkedIn-specific constraints like character limits for connection requests, but keep the concise, conversation-first primary mindset.
If additional context or user response is provided, ensure the message incorporates or addresses it naturally.

The response must be in JSON format as specified in the system prompt.`,
            },
        ];

        // 5. Call AI provider
        const { content } = await chatCompletion({
            model: 'gpt-4o',
            messages,
            temperature: 0.7,
        });

        // 6. Parse and return result
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : content;
            const result = JSON.parse(jsonString) as OutreachResult;

            return result;
        } catch {
            console.error('[ContentEngineService] Failed to parse AI response:', content);
            throw new Error('Failed to parse content generation response');
        }
    }

    /**
     * Default logistics company context (ShipSync) if none provided.
     */
    static getShipSyncContext() {
        return {
            companyName: 'ShipSync',
            doesWhat: 'Automated freight forwarding and logistics orchestration for mid-sized manufacturers.',
            forWho: 'Logistics managers and VPs of Supply Chain at manufacturing companies with $50M-$500M in revenue.',
            problem: 'Fragmented communication with multiple carriers, lack of real-time visibility, and manual data entry in shipping workflows.',
            onboardingContext: 'We are a logistics tech firm looking to automate the messy middle of freight.',
            offer: 'A 30-day pilot focusing on your top 3 pain-point routes.'
        };
    }
}
