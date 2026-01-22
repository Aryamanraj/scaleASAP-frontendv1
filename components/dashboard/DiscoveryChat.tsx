"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArrowLongRightIcon, ArrowPathIcon, ArrowLongLeftIcon, PlayIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ICPAccordion } from './ICPAccordion'
import { saveDiscoveryChatHistory, createExperiments, ICPData, Experiment } from '@/app/actions/workspaces'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider as ShadcnTooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

// Helper to parse content for JSON block
const parseContent = (content: string) => {
    // Look for JSON block markers
    const jsonStartMarker = '--- JSON_OUTPUT_START ---'
    const jsonEndMarker = '--- JSON_OUTPUT_END ---'

    const jsonStartIndex = content.indexOf(jsonStartMarker)
    const jsonEndIndex = content.indexOf(jsonEndMarker)

    let jsonString = ''
    let text = content

    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        text = content.substring(0, jsonStartIndex).trim()
        jsonString = content.substring(jsonStartIndex + jsonStartMarker.length, jsonEndIndex).trim()
    } else {
        // Fallback: look for markdown json block
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
        if (jsonMatch) {
            text = content.split(jsonMatch[0])[0].trim()
            jsonString = jsonMatch[1].trim()
        } else {
            // Last resort: look for anything that looks like a JSON object at the end
            const lastBraceIndex = content.lastIndexOf('}')
            const firstBraceIndex = content.indexOf('{', content.indexOf('"strategic_insight"')) // Look for our specific key

            if (firstBraceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
                text = content.substring(0, firstBraceIndex).trim()
                jsonString = content.substring(firstBraceIndex, lastBraceIndex + 1).trim()
            }
        }
    }

    if (!jsonString) {
        return { text: content, icpData: null }
    }

    try {
        // Extract JSON block if marked with markdown code fences (in case nested)
        const cleanJson = jsonString.replace(/```json\n|\n```/g, '')
        const icpData = JSON.parse(cleanJson)
        return { text, icpData }
    } catch (e) {
        console.warn("Incomplete or invalid JSON output (ignoring):", e)
        return { text: content, icpData: null }
    }
}

// Typewriter component for assistant messages
const TypewriterText = ({ content }: { content: string }) => {
    const [displayedContent, setDisplayedContent] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (currentIndex < content.length) {
            const timeout = setTimeout(() => {
                const charsToAdd = Math.ceil((content.length - currentIndex) / 10)
                const nextChunk = content.slice(currentIndex, currentIndex + charsToAdd)
                setDisplayedContent(prev => prev + nextChunk)
                setCurrentIndex(prev => prev + charsToAdd)
            }, 10)
            return () => clearTimeout(timeout)
        }
    }, [content, currentIndex])

    useEffect(() => {
        if (content.length < currentIndex) {
            setDisplayedContent(content)
            setCurrentIndex(content.length)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content])

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {displayedContent}
        </ReactMarkdown>
    )
}

interface DiscoveryChatProps {
    workspaceId: string
    userName: string
    onExperimentsCreated?: () => void
    initialChatHistory?: ChatMessage[]
    isFollowUp?: boolean
    previousExperiments?: Experiment[]
    onBack?: () => void
}

// Helper functions for experiment summary
const getStatusColor = (status: string) => {
    switch (status) {
        case 'creating_hypotheses':
        case 'pending': return 'bg-purple-50 text-purple-700 border-purple-200'
        case 'finding_leads': return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'prioritizing_leads': return 'bg-amber-50 text-amber-700 border-amber-200'
        case 'warmup_initiated': return 'bg-orange-50 text-orange-700 border-orange-200'
        case 'complete':
        case 'completed': return 'bg-green-50 text-green-700 border-green-200'
        case 'failed': return 'bg-red-50 text-red-700 border-red-200'
        default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
}

const formatStatus = (status: string) => {
    switch (status) {
        case 'creating_hypotheses':
        case 'pending': return 'Creating Hypotheses'
        case 'finding_leads': return 'Finding Leads'
        case 'prioritizing_leads': return 'Prioritizing Leads'
        case 'warmup_initiated': return 'Warmup Initiated'
        case 'complete':
        case 'completed': return 'Complete'
        case 'failed': return 'Failed'
        default: return status.charAt(0).toUpperCase() + status.slice(1)
    }
}

export function DiscoveryChat({ workspaceId, userName, onExperimentsCreated, initialChatHistory, isFollowUp = false, previousExperiments = [], onBack }: DiscoveryChatProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [currentPlaceholder, setCurrentPlaceholder] = useState('My main objective today is...')
    const [isLoading, setIsLoading] = useState(false)
    const [showExperiments, setShowExperiments] = useState(false)
    const [isCreatingExperiments, setIsCreatingExperiments] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const hasInitialized = useRef(false)

    // Check if experiments are present in the last message
    useEffect(() => {
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1]
            if (lastMsg.role === 'assistant') {
                const { icpData } = parseContent(lastMsg.content)
                if (icpData) {
                    setShowExperiments(true)
                    // Save chat history when experiments are generated
                    saveDiscoveryChatHistory(workspaceId, messages).catch(err =>
                        console.error("Failed to save discovery chat history:", err)
                    )
                }
            }
        }
    }, [messages, workspaceId])

    const handleSend = useCallback(async (isInitial = false, overrideMessages?: Message[]) => {
        if (!isInitial && (!input.trim() || isLoading)) return

        const currentMessages = overrideMessages || messages
        const userMsg: Message | null = isInitial ? null : { role: 'user', content: input }
        const newMessages = userMsg ? [...currentMessages, userMsg] : currentMessages

        if (!isInitial) {
            setMessages(newMessages)
            setInput('')
        }
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat/discovery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    workspaceId,
                    userName,
                    isFollowUp,
                    previousExperiments: isFollowUp ? previousExperiments.map(exp => ({
                        name: exp.name,
                        type: exp.type,
                        pattern: exp.pattern,
                        industries: exp.industries,
                        status: exp.status
                    })) : []
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Server Error Details:', errorText)
                throw new Error(`Failed to fetch: ${response.status} ${errorText}`)
            }

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let assistantContent = ''

            setMessages(prev => [...prev, { role: 'assistant', content: '' }])

            while (true) {
                const { done, value } = await reader!.read()
                if (done) break

                const chunk = decoder.decode(value)
                assistantContent += chunk

                // Extract placeholder if present [[PLACEHOLDER: ...]]
                let cleanContent = assistantContent
                const placeholderMatch = assistantContent.match(/\[\[PLACEHOLDER:\s*(.*?)\]\]/i)

                if (placeholderMatch) {
                    cleanContent = assistantContent.replace(/\[\[PLACEHOLDER:\s*.*?\]\]/i, '').trim()
                    const newP = placeholderMatch[1].replace(/[\[\]]/g, '').trim()
                    if (newP) setCurrentPlaceholder(newP)
                } else if (assistantContent.includes('[[')) {
                    const partialIndex = assistantContent.lastIndexOf('[[')
                    cleanContent = assistantContent.slice(0, partialIndex).trim()
                }

                setMessages(prev => {
                    const last = prev[prev.length - 1]
                    if (last && last.role === 'assistant') {
                        return [...prev.slice(0, -1), { ...last, content: cleanContent }]
                    }
                    return prev
                })
            }
        } catch (error) {
            console.error('Chat error:', error)
        } finally {
            setIsLoading(false)
        }
    }, [input, isLoading, messages, workspaceId, userName, isFollowUp, previousExperiments])

    // Load initial session or trigger dynamic greeting
    useEffect(() => {
        if (hasInitialized.current) return
        hasInitialized.current = true

        // For follow-up sessions, we ALWAYS start fresh to discover new ICPs
        if (isFollowUp) {
            localStorage.removeItem(`chat_${workspaceId}_followup`)
            setMessages([])
            setIsLoading(true)
            handleSend(true, [])
            return
        }

        // First check if we have chat history from the workspace (Supabase)
        if (initialChatHistory && initialChatHistory.length > 0) {
            setMessages(initialChatHistory)
            return
        }

        // Fall back to localStorage for backward compatibility
        const savedMessages = localStorage.getItem(`chat_${workspaceId}`)
        const savedPlaceholder = localStorage.getItem(`placeholder_${workspaceId}`)

        if (savedMessages) {
            const parsed = JSON.parse(savedMessages)
            setMessages(parsed)
        } else {
            // Trigger dynamic AI greeting if no messages
            setIsLoading(true) // Immediate visual feedback
            handleSend(true, [])
        }

        if (savedPlaceholder) {
            setCurrentPlaceholder(savedPlaceholder)
        }
    }, [workspaceId, handleSend, initialChatHistory, isFollowUp])

    // Save session
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`chat_${workspaceId}`, JSON.stringify(messages))
        }
        localStorage.setItem(`placeholder_${workspaceId}`, currentPlaceholder)
    }, [messages, currentPlaceholder, workspaceId])

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            const scroll = () => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                        top: scrollRef.current.scrollHeight,
                        behavior: 'smooth'
                    })
                }
            }
            // Immediate scroll
            scroll()
            // Delayed scroll for any dynamic content (accordions, images)
            const timer = setTimeout(scroll, 100)
            return () => clearTimeout(timer)
        }
    }, [messages, isLoading])

    const handleRestart = () => {
        localStorage.removeItem(`chat_${workspaceId}`)
        localStorage.removeItem(`placeholder_${workspaceId}`)

        setMessages([])
        setShowExperiments(false) // Reset experiments state
        handleSend(true, [])
        setCurrentPlaceholder('My main objective today is...')
        setInput('')
        setIsLoading(false)
    }

    return (
        <div className="flex flex-col h-full w-full relative">
            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />

            {/* Back Button for Follow-up Mode */}
            {isFollowUp && onBack && (
                <div className="absolute top-4 left-4 z-10">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLongLeftIcon className="size-4" />
                        <span className="font-medium">Back to Experiments</span>
                    </Button>
                </div>
            )}

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto px-6 pt-12 pb-48 no-scrollbar"
                ref={scrollRef}
            >
                <div className="max-w-[700px] mx-auto space-y-12 transition-all">
                    {/* Experiment Summary as System Message for Follow-up Mode */}
                    {isFollowUp && previousExperiments.length > 0 && (
                        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="size-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs">ℹ️</span>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="text-xs font-semibold text-blue-900">Current Experiments ({previousExperiments.length})</p>
                                        <div className="space-y-1.5">
                                            {previousExperiments.slice(0, 5).map((exp) => (
                                                <div key={exp.id} className="flex items-center gap-2 text-xs">
                                                    <span className="text-blue-700 font-medium truncate flex-1">{exp.name}</span>
                                                    <Badge variant="outline" className={cn("text-[10px] py-0 px-1.5 h-5 capitalize border", getStatusColor(exp.status))}>
                                                        {formatStatus(exp.status)}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {messages.map((m, i) => {
                        const { text, icpData } = m.role === 'assistant' ? parseContent(m.content) : { text: m.content, icpData: null }
                        return (
                            <div key={i} className={cn(
                                "group flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500",
                                m.role === 'user' ? "items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "flex gap-4 w-full",
                                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}>
                                    {m.role === 'assistant' && (
                                        <div className="size-8 mt-1 rounded-lg flex items-center justify-center shrink-0 bg-transparent transition-all">
                                            <AsapLogo size={20} />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "text-[15px] leading-relaxed tracking-tight w-full", // Added w-full so accordion takes space
                                        m.role === 'user'
                                            ? "bg-[#F7F7F7] px-5 py-3 rounded-2xl max-w-[85%] flex flex-col gap-1"
                                            : "text-[#4A4A4A] prose prose-sm max-w-none pt-0.5 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1"
                                    )}>
                                        {m.role === 'user' && (
                                            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-tight text-gray-400 uppercase">
                                                <span>{userName}</span>
                                                <span className="text-[8px] text-gray-300">•</span>
                                                <span className="font-normal text-gray-400/70 capitalize">Just now</span>
                                            </div>
                                        )}
                                        <div className={cn(m.role === 'user' ? "text-[#4A4A4A]" : "")}>
                                            {m.role === 'user' ? (
                                                m.content
                                            ) : (
                                                <>
                                                    <TypewriterText content={text} />
                                                    {/* Accordion renders only if valid data parsed */}
                                                    {icpData && (
                                                        <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                                            <ICPAccordion
                                                                icps={icpData.icps}
                                                                strategicInsight={icpData.strategic_insight}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {/* Show loader if loading AND (either initial load OR waiting for assistant response) */}
                    {isLoading && (
                        (messages.length === 0 || messages[messages.length - 1].role === 'user') ? (
                            <div className="flex flex-col items-start gap-2 animate-in fade-in duration-300">
                                <div className="flex gap-4 w-full">
                                    <div className="size-8 mt-1 rounded-lg flex items-center justify-center shrink-0 animate-shimmer">
                                        <AsapLogo size={20} />
                                    </div>
                                    <div className="flex items-center gap-1.5 pt-3">
                                        <div className="size-1.5 bg-[#43B97B]/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="size-1.5 bg-[#43B97B]/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="size-1.5 bg-[#43B97B]/30 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            </div>

            {/* Sticky Bottom Input Bar (Refined Style from Image) */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pt-0 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
                <div className="max-w-[700px] mx-auto pointer-events-auto">
                    <div className="bg-white border border-[#EEEEEE] rounded-[22px] transition-all duration-200 focus-within:border-[#43B97B] focus-within:ring-1 focus-within:ring-[#43B97B]/10 overflow-hidden flex flex-col min-h-[120px]">
                        <textarea
                            placeholder={currentPlaceholder}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                            className="w-full bg-transparent border-none resize-none px-5 py-4 text-[15px] focus:ring-0 placeholder:text-gray-400 font-medium min-h-[70px] outline-none"
                        />
                        <div className="flex items-center justify-between px-4 pb-4 mt-auto">
                            <div className="flex items-center gap-2">
                                <ShadcnTooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span tabIndex={0} className="inline-flex">
                                                <Button
                                                    onClick={async () => {
                                                        if (!showExperiments || isCreatingExperiments) return

                                                        setIsCreatingExperiments(true)
                                                        try {
                                                            // Extract ICP data from last message
                                                            const lastMsg = messages[messages.length - 1]
                                                            if (lastMsg.role === 'assistant') {
                                                                const { icpData } = parseContent(lastMsg.content)
                                                                if (icpData && icpData.icps) {
                                                                    // Create experiments in database
                                                                    await createExperiments(workspaceId, icpData.icps as ICPData[])
                                                                    // Notify parent to transition UI
                                                                    onExperimentsCreated?.()
                                                                }
                                                            }
                                                        } catch (error) {
                                                            console.error('Failed to create experiments:', error)
                                                        } finally {
                                                            setIsCreatingExperiments(false)
                                                        }
                                                    }}
                                                    disabled={!showExperiments || isCreatingExperiments}
                                                    variant="outline"
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-1.5 h-auto rounded-lg transition-colors border bg-white hover:bg-gray-50 group/run shadow-none",
                                                        "disabled:bg-white disabled:border-[#EEEEEE] disabled:text-gray-300 disabled:opacity-100 disabled:cursor-not-allowed",
                                                        showExperiments
                                                            ? "border-[#EEEEEE] text-[#4A4A4A] hover:text-[#43B97B]"
                                                            : ""
                                                    )}
                                                >
                                                    <span className="text-[13px] font-medium">
                                                        {isCreatingExperiments ? 'Creating...' : 'Run experiments'}
                                                    </span>
                                                    {isCreatingExperiments ? (
                                                        <ArrowPathIcon className="size-3.5 animate-spin text-[#4A4A4A]" />
                                                    ) : (
                                                        <PlayIcon className={cn("size-3.5 transition-colors", showExperiments ? "text-[#4A4A4A] group-hover/run:text-[#43B97B]" : "text-gray-300")} />
                                                    )}
                                                </Button>
                                            </span>
                                        </TooltipTrigger>
                                        {!showExperiments && (
                                            <TooltipContent side="top" className="max-w-[200px] text-center bg-black text-white border-black">
                                                <p>Active once experiments are defined.</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </ShadcnTooltipProvider>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#EEEEEE] bg-white hover:bg-gray-50 transition-colors group/restart text-red-500/80 hover:text-red-600">
                                            <span className="text-[13px] font-medium">Restart Chat</span>
                                            <ArrowPathIcon className="size-3.5 text-red-400 group-hover/restart:text-red-500" />
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                                                <ExclamationTriangleIcon className="h-5 w-5" />
                                                Restart Conversation
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to restart? This will clear your current chat history and start a fresh discovery session. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleRestart}
                                                className="bg-red-600 hover:bg-red-700 border-none ring-0 focus:ring-0 shadow-none outline-none"
                                            >
                                                Restart Chat
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <Button
                                onClick={() => handleSend()}
                                disabled={isLoading || !input.trim()}
                                className={cn(
                                    "h-9 w-9 rounded-full transition-all duration-300 flex items-center justify-center p-0 bg-[#43B97B] hover:bg-[#3CA66F] text-white",
                                    !input.trim() && "opacity-50"
                                )}
                            >
                                {isLoading ? <ArrowPathIcon className="size-4 animate-spin" /> : <ArrowLongRightIcon className="size-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AsapLogo({ className, size = 24 }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 44 44"
            fill="none"
            className={cn(className)}
        >
            <style>
                {`
                @keyframes shimmer {
                    0% { opacity: 0.25; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.25; }
                }
                .animate-shimmer path {
                    animation: shimmer 1.5s infinite ease-in-out;
                }
                .animate-shimmer path:nth-child(2) { animation-delay: 0.2s; }
                .animate-shimmer path:nth-child(3) { animation-delay: 0.4s; }
                .animate-shimmer path:nth-child(4) { animation-delay: 0.6s; }
                .animate-shimmer path:nth-child(5) { animation-delay: 0.8s; }
                .animate-shimmer path:nth-child(6) { animation-delay: 1.0s; }
                .animate-shimmer path:nth-child(7) { animation-delay: 1.2s; }
                `}
            </style>
            <g>
                <path d="M0 0H14.6667V14.6667H0V0Z" fill="#43B97B" fillOpacity="0.8" />
                <path d="M14.6667 0H29.3333V14.6667H14.6667V0Z" fill="#43B97B" fillOpacity="0.8" />
                <path d="M29.3333 0H44V14.6667H29.3333V0Z" fill="#43B97B" fillOpacity="0.8" />
                <path d="M29.3333 14.6667H44V29.3333H29.3333V14.6667Z" fill="#43B97B" fillOpacity="0.8" />
                <path d="M29.3333 29.3333H44V44H29.3333V29.3333Z" fill="#43B97B" fillOpacity="0.8" />
                <path d="M14.6667 14.6667H29.3333V29.3333H14.6667V14.6667Z" fill="#43B97B" fillOpacity="0.8" />
                <path d="M0 29.3333H14.6667V44H0V29.3333Z" fill="#43B97B" fillOpacity="0.8" />
            </g>
        </svg>
    )
}
