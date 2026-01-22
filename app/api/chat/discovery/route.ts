import { NextRequest } from 'next/server'
import { chatCompletionStream, ChatMessage } from '@/lib/ai-provider'

export async function POST(req: NextRequest) {
    let step = 'parsing-json'
    try {
        const body = await req.json()
        const { messages, workspaceId, isFollowUp, previousExperiments, userName } = body

        if (!workspaceId) {
            return new Response('Missing workspaceId', { status: 400 })
        }

        step = 'fetching-workspace-data'
        const { getOnboardingData } = await import('@/app/actions/onboarding')
        const context = await getOnboardingData(workspaceId)

        if (!context) {
            return new Response('Workspace data not found', { status: 404 })
        }

        step = 'reading-prompt'
        const { getDiscoverySystemPrompt } = await import('@/lib/prompts/discovery/orchestrator')

        const systemPrompt = await getDiscoverySystemPrompt({
            userName: userName || context.companyName || 'User',
            companyName: context.companyName || 'the company',
            worldview: context.worldview_full || '',
            website: context.website_scrape || '',
            turnCount: messages?.length || 0,
            isFollowUp: isFollowUp || false,
            previousExperiments: previousExperiments || []
        })

        step = 'preparing-messages'
        // Implement sliding window to stay under token limits
        // We keep the first message (usually the greeting) and the last 11 messages (total 12)
        let processedMessages = messages || []
        if (processedMessages.length > 12) {
            const firstMessage = processedMessages[0]
            const lastMessages = processedMessages.slice(-11)
            processedMessages = [firstMessage, ...lastMessages]
        }

        const chatMessages: ChatMessage[] = [
            { role: 'system', content: systemPrompt }
        ]

        if (processedMessages.length === 0) {
            chatMessages.push({ role: 'user', content: 'Hi, I am ready to start the discovery process.' })
        } else {
            chatMessages.push(...processedMessages)
        }

        step = 'ai-call'
        const { stream, provider } = await chatCompletionStream({
            model: 'gpt-4o',
            messages: chatMessages,
        })

        console.log(`[Discovery Chat] Using provider: ${provider}`)

        return new Response(stream)
    } catch (error: unknown) {
        console.error(`Chat API Error at step [${step}]:`, error)
        // Return a generic error to the client to avoid leaking sensitive info
        return new Response(`An error occurred during discovery. Please try again.`, { status: 500 })
    }
}
