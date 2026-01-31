import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createExperiments, saveDiscoveryChatHistory, ICPData } from '@/app/actions/workspaces'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011';

export async function POST(req: NextRequest) {
    let step = 'parsing-json'
    try {
        const body = await req.json()
        const { messages, workspaceId, isFollowUp, previousExperiments, userName } = body

        if (!workspaceId) {
            return new Response('Missing workspaceId', { status: 400 })
        }

        const supabase = await createClient()
        const { data: { session }, error: authError } = await supabase.auth.getSession()

        if (authError || !session) {
            return new Response('Unauthorized', { status: 401 })
        }

        step = 'calling-backend'
        
        // Call backend discovery chat endpoint
        const backendResponse = await fetch(`${API_URL}/workspaces/${workspaceId}/discovery/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                messages,
                isFollowUp: isFollowUp || false,
                previousExperiments: previousExperiments || [],
                userName: userName || undefined,
            }),
        })

        if (!backendResponse.ok) {
            const errorText = await backendResponse.text()
            console.error('Backend discovery chat error:', errorText)
            return new Response('Backend API error', { status: backendResponse.status })
        }

        // Set up streaming response
        const encoder = new TextEncoder()
        let fullContent = ''

        const transformStream = new TransformStream({
            async transform(chunk, controller) {
                const text = new TextDecoder().decode(chunk)
                
                // Parse SSE events
                const lines = text.split('\n')
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6))
                            
                            if (data.type === 'chunk') {
                                fullContent += data.content
                                controller.enqueue(encoder.encode(data.content))
                            } else if (data.type === 'done') {
                                // Handle experiments if returned
                                if (data.experiments?.icps) {
                                    try {
                                        await createExperiments(workspaceId, data.experiments.icps as ICPData[])
                                        console.log('Experiments created from backend response')
                                        controller.enqueue(encoder.encode('\n\n[[EXPERIMENTS_CREATED]]'))
                                    } catch (e) {
                                        console.error('Failed to create experiments:', e)
                                    }
                                }
                            } else if (data.type === 'error') {
                                console.error('Backend stream error:', data.message)
                            }
                        } catch (e) {
                            // Not JSON, skip
                        }
                    }
                }
            },
            async flush() {
                // Save full history to DB
                const lastUserMessage = messages[messages.length - 1]
                const newHistory = [...messages.slice(0, -1), lastUserMessage, { role: 'assistant', content: fullContent }]
                await saveDiscoveryChatHistory(workspaceId, newHistory as Array<{role: string, content: string}>)
            }
        })

        return new Response(backendResponse.body?.pipeThrough(transformStream), {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            }
        })
    } catch (error: unknown) {
        console.error(`Chat API Error at step [${step}]:`, error)
        return new Response(`An error occurred during discovery. Please try again.`, { status: 500 })
    }
}
