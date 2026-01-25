import { NextRequest } from 'next/server'
import { chatCompletionStream, ChatMessage } from '@/lib/ai-provider'
import { createClient } from '@/lib/supabase/server'
import { createExperiments, saveDiscoveryChatHistory, ICPData } from '@/app/actions/workspaces'

export async function POST(req: NextRequest) {
    let step = 'parsing-json'
    try {
        const body = await req.json()
        const { messages, workspaceId, isFollowUp, previousExperiments, userName } = body

        if (!workspaceId) {
            return new Response('Missing workspaceId', { status: 400 })
        }

        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return new Response('Unauthorized', { status: 401 })
        }

        step = 'fetching-workspace-data'
        // Fetch workspace to get server-side history
        const { data: workspace } = await supabase
            .from('workspaces')
            .select('discovery_chat_history, role') // Select specific fields 
            .eq('id', workspaceId)
            //.eq('user_id', user.id) // Security check implicit if RLS is on, but good to be sure
            .single()

        // Use server history + new user message
        // The client sends 'messages' but we only really trust the *last* one (the new user input)
        // OR we trust the client state but we prefer server state to ensure we include the "hidden" JSON context
        // stored in DB from previous turns.

        const lastUserMessage = messages[messages.length - 1]
        let serverHistory = (workspace?.discovery_chat_history as any[]) || []

        // If it's a follow-up, we might want to start fresh or keep context? 
        // Logic in client sends empty history for follow-up, but server might have it.
        // If isFollowUp is true, maybe we proceed with what the client sent (which is just the new message)? 
        // But the prompt needs context.

        let processedMessages: any[] = []
        if (isFollowUp) {
            // For follow up, client sends limited context. Let's respect client intent? 
            // Actually, if we want to hide JSON, we must have been the one source of truth.
            // But if isFollowUp is true, previous history might be irrelevant or we want to reference previous experiments.
            processedMessages = messages // Use client messages for follow up start?
        } else {
            // For standard chat, merge server history + new message
            // Check if server history already has the last message (dedup)
            // Usually only need to append if it's new.

            // Client sends [history..., newUserMsg]
            // Server has [history...]
            // So we take server history and append message if not present.

            processedMessages = [...serverHistory]
            if (lastUserMessage && lastUserMessage.role === 'user') {
                processedMessages.push(lastUserMessage)
            }
        }

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
            turnCount: processedMessages.length || 0,
            isFollowUp: isFollowUp || false,
            previousExperiments: previousExperiments || []
        })

        step = 'preparing-messages'
        // Implement sliding window to stay under token limits
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
        const { stream: originalStream, provider } = await chatCompletionStream({
            model: 'gpt-4o',
            messages: chatMessages,
        })

        console.log(`[Discovery Chat] Using provider: ${provider}`)

        // Create a TransformStream to intercept and sanitize
        const encoder = new TextEncoder()
        const decoder = new TextDecoder()

        let fullContent = ''
        let jsonBuffer = ''
        let isCollectingJSON = false
        const jsonStartMarker = '--- JSON_OUTPUT_START ---'

        const transformStream = new TransformStream({
            async transform(chunk, controller) {
                const text = decoder.decode(chunk, { stream: true })
                fullContent += text

                // Check for JSON start
                if (!isCollectingJSON && (text.includes(jsonStartMarker) || fullContent.includes(jsonStartMarker))) {
                    isCollectingJSON = true
                    // If we just hit the marker, finding where it starts to only send the text BEFORE it
                    const markerIndex = text.indexOf(jsonStartMarker)
                    if (markerIndex !== -1) {
                        const safeText = text.substring(0, markerIndex)
                        if (safeText) controller.enqueue(encoder.encode(safeText))
                    } else {
                        // Marker was split or is in fullContent. 
                        // We rely on fullContent to detect, but 'text' is the current chunk.
                        // This is tricky if marker is split across chunks.
                        // Simplified: if current chunk triggers detection, we stop sending.
                        // Better: check if fullContent has the marker, identify where it is, and only output up to that point.
                        // Since we are buffering `fullContent`, we could theoretically output `fullContent` up to marker.
                        // But we want to stream.

                        // Safe heuristic: if we are collecting JSON, we output NOTHING.
                        // If we just started, we assume the previous chunks were safe (sent).
                        // We only need to be careful about the edge case where the marker is in THIS chunk.
                    }
                    // Start buffering for JSON processing
                    // We capture the JSON part from fullContent later
                }

                if (!isCollectingJSON) {
                    controller.enqueue(chunk)
                }
            },
            async flush(controller) {
                // Stream finished. Process the full content.
                // 1. Parse JSON if exists
                let finalContentForClient = fullContent // Default if no JSON

                if (fullContent.includes(jsonStartMarker)) {
                    const parts = fullContent.split(jsonStartMarker)
                    const textPart = parts[0]
                    const jsonPart = parts[1] // Includes END marker usually

                    // Try to clean and parse
                    const jsonString = jsonPart.replace('--- JSON_OUTPUT_END ---', '').trim()

                    try {
                        // Extract JSON block if marked with markdown code fences
                        const cleanJson = jsonString.replace(/```json\n|\n```/g, '').replace(/```/g, '')
                        const icpData = JSON.parse(cleanJson)

                        // 2. Create Experiments Server-Side
                        if (icpData && icpData.icps) {
                            await createExperiments(workspaceId, icpData.icps as ICPData[])
                            console.log('Experiments created server-side')

                            // Signal client
                            controller.enqueue(encoder.encode('\n\n[[EXPERIMENTS_CREATED]]'))
                        }
                    } catch (e) {
                        console.error('Failed to parse/create experiments server-side:', e)
                    }
                }

                // 3. Save FULL history to DB (including the JSON)
                // We append the assistant's full response
                const newHistory = [...processedMessages, { role: 'assistant', content: fullContent }]

                // We need to match the type expected by saveDiscoveryChatHistory
                // which is Array<{role: string, content: string}>.
                // processedMessages might have 'any' type but structure is same.

                await saveDiscoveryChatHistory(workspaceId, newHistory as any)
            }
        })

        return new Response(originalStream.pipeThrough(transformStream))
    } catch (error: unknown) {
        console.error(`Chat API Error at step [${step}]:`, error)
        return new Response(`An error occurred during discovery. Please try again.`, { status: 500 })
    }
}
