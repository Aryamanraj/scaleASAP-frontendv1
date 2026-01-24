"use client"

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
    XMarkIcon,
    SparklesIcon,
    EnvelopeIcon,
    ChatBubbleLeftEllipsisIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface NewCampaignCurtainProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (data: any) => void
}

const ICP_IDEAS = [
    "SaaS Founder living in San Francisco running a digital platform in AI and is making $1M ARR per year with a team of 10-50",
    "Marketing Director living in London running a/an E-commerce brand in Fashion and is making $5M ARR per year with a team of 50-100",
    "Head of Sales living in New York running a FinTech company in Payments and is making $10M ARR per year with a team of 100+",
    "CEO living in Austin running a/an HealthTech startup in Wellness and is making $500k ARR per year with a team of 1-10",
    "CTO living in Berlin running a/an AI/ML startup in DevTools and is making $2M ARR per year with a team of 11-50"
]

const CHANNELS = [
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: (props: any) => (
            <img src="https://svgl.app/library/linkedin.svg" className={props.className} alt="LinkedIn" />
        )
    },
    {
        id: 'email',
        name: 'Email',
        icon: (props: any) => (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
                <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
        )
    },
    { id: 'text', name: 'Text Message', icon: ChatBubbleLeftEllipsisIcon },
]

const FILTERS = {
    FUNCTION: ['Sales', 'Marketing', 'Engineering', 'Product', 'Finance', 'HR', 'Operations', 'Legal'],
    TITLE: ['CEO', 'CTO', 'CFO', 'VP', 'Director', 'Manager', 'Head of', 'Lead', 'Engineer', 'Analyst'],
    SENIORITY: ['Entry', 'Senior', 'Manager', 'Director', 'VP', 'C-Suite'],
    SIZE: ['1-10', '11-50', '51-200', '201-500', '500-1K', '1K-5K', '5K-10K', '10K+'],
    COMPANIES: [],
    GEO: ['US', 'CA', 'NY', 'TX', 'UK', 'EU', 'APAC'],
    INDUSTRY: ['SaaS', 'FinTech', 'HealthTech', 'E-commerce', 'DevTools', 'AI/ML', 'Cyber']
}

export function NewCampaignCurtain({ isOpen, onClose, onCreate }: NewCampaignCurtainProps) {
    const [campaignName, setCampaignName] = useState('')
    const [selectedChannels, setSelectedChannels] = useState<string[]>([])
    const [prompt, setPrompt] = useState('')
    const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
    const [icpIndex, setIcpIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        FUNCTION: [],
        TITLE: [],
        SENIORITY: [],
        SIZE: [],
        GEO: [],
        INDUSTRY: []
    })

    // Typewriter effect logic
    useEffect(() => {
        const fullText = ICP_IDEAS[icpIndex]
        let timer: NodeJS.Timeout

        if (!isDeleting) {
            if (displayedPlaceholder.length < fullText.length) {
                timer = setTimeout(() => {
                    setDisplayedPlaceholder(fullText.substring(0, displayedPlaceholder.length + 1))
                }, 30) // Faster typing speed
            } else {
                timer = setTimeout(() => {
                    setIsDeleting(true)
                }, 4000) // Pause at the end
            }
        } else {
            if (displayedPlaceholder.length > 0) {
                timer = setTimeout(() => {
                    setDisplayedPlaceholder(fullText.substring(0, displayedPlaceholder.length - 1))
                }, 15) // Faster deleting speed
            } else {
                setIsDeleting(false)
                setIcpIndex((prev) => (prev + 1) % ICP_IDEAS.length)
            }
        }

        return () => clearTimeout(timer)
    }, [displayedPlaceholder, isDeleting, icpIndex])

    const toggleFilter = (category: string, value: string) => {
        setSelectedFilters(prev => {
            const current = prev[category] || []
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value]
            return { ...prev, [category]: next }
        })
    }

    const toggleChannel = (channelId: string) => {
        setSelectedChannels(prev =>
            prev.includes(channelId)
                ? prev.filter(id => id !== channelId)
                : [...prev, channelId]
        )
    }

    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-[#EEEEEE] transition-all duration-500 ease-in-out flex flex-col overflow-hidden h-full",
                isOpen ? "w-[520px] opacity-100" : "w-0 opacity-0 border-none pointer-events-none"
            )}
        >
            <div className="flex-1 overflow-y-auto bg-white flex flex-col h-full">
                <div className="p-6 pb-2 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#43B97B] uppercase tracking-wider mb-1">New Campaign</span>
                        <h2 className="text-xl font-bold text-[#4A4A4A] tracking-tight">Create your campaign</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center border border-[#EEEEEE] bg-white rounded-lg hover:bg-gray-50 transition-all"
                    >
                        <XMarkIcon className="size-4 text-[#333333]" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Campaign Info */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="campaignName" className="text-sm font-semibold text-[#4A4A4A]">Campaign Name</Label>
                            <Input
                                id="campaignName"
                                placeholder="e.g. Q1 SaaS Founders Outreach"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                className="h-9 focus-visible:ring-[#43B97B]"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-[#4A4A4A]">Channel Selection</Label>
                            <div className="flex flex-wrap gap-3">
                                {CHANNELS.map((channel) => {
                                    const isSelected = selectedChannels.includes(channel.id)
                                    return (
                                        <button
                                            key={channel.id}
                                            onClick={() => toggleChannel(channel.id)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 text-left",
                                                isSelected
                                                    ? "border-[#43B97B] bg-[#43B97B]/5 ring-1 ring-[#43B97B] text-[#43B97B] font-semibold"
                                                    : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50 hover:border-[#43B97B]/50"
                                            )}
                                        >
                                            <channel.icon className="size-4" />
                                            <span className="text-sm">{channel.name}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-sm font-semibold text-[#4A4A4A]">Who are you looking for?</Label>
                        <div className="relative group">
                            <Textarea
                                className="min-h-[120px] focus-visible:ring-[#43B97B] text-sm"
                                placeholder={`e.g. ${displayedPlaceholder}`}
                                value={prompt}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                            />
                            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest pointer-events-none">
                                AI Powered
                            </div>
                        </div>
                        <Button
                            className="w-full bg-[#43B97B] hover:bg-[#38a86e] text-white shadow-sm h-9 font-medium rounded-md"
                            onClick={() => {/* Mock generation */ }}
                        >
                            <SparklesIcon className="size-4" />
                            Generate Filters
                        </Button>
                    </div>

                    {/* Categorized Filters */}
                    <div className="space-y-6 pt-4 border-t border-gray-50">
                        {Object.entries(FILTERS).map(([category, values]) => (
                            <div key={category} className="space-y-3">
                                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{category}</Label>
                                <div className="flex flex-wrap gap-2">
                                    {values.map((value) => {
                                        const isSelected = selectedFilters[category]?.includes(value)
                                        return (
                                            <button
                                                key={value}
                                                onClick={() => toggleFilter(category, value)}
                                                className={cn(
                                                    "px-3 py-1 rounded-full border text-xs font-medium transition-all",
                                                    isSelected
                                                        ? "border-[#43B97B] bg-[#43B97B] text-white shadow-sm"
                                                        : "border-gray-100 bg-white text-gray-500 hover:border-[#43B97B]/50 hover:bg-gray-50"
                                                )}
                                            >
                                                {value}
                                            </button>
                                        )
                                    })}
                                    {(category === 'COMPANIES' || category === 'INDUSTRY') && (
                                        <div className="w-full mt-1">
                                            <Input
                                                placeholder={category === 'COMPANIES' ? "e.g. Stripe, Notion..." : "Search or add industry..."}
                                                className="h-8 text-xs border-dashed bg-transparent focus-visible:ring-[#43B97B] rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 pt-2 mt-auto border-t border-gray-50 sticky bottom-0 bg-white/80 backdrop-blur-md">
                    <Button
                        className="w-full bg-[#43B97B] hover:bg-[#3CA66F] text-white h-10 font-medium rounded-md transition-all"
                        disabled={!campaignName || selectedChannels.length === 0}
                    >
                        Create Campaign
                    </Button>
                </div>
            </div>
        </div>
    )
}
