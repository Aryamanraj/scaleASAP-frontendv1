"use client"

import React, { useState } from 'react'
import { Lead } from '@/app/actions/leads'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    EnvelopeIcon,
    LinkIcon,
    ChatBubbleLeftRightIcon,
    CheckIcon,
    XMarkIcon,
    ExclamationCircleIcon,
    ArrowPathIcon,
    SparklesIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

interface LeadCardProps {
    lead: Lead
    onUpdateOutcome: (outcome: Lead['outcome'], reason?: string) => Promise<void>
    onClick?: () => void
    onGenerateOutreach?: () => void
}

export function LeadCard({ lead, onUpdateOutcome, onClick, onGenerateOutreach }: LeadCardProps) {
    const [isUpdating, setIsUpdating] = useState(false)

    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-all cursor-pointer border-b border-gray-100/60 last:border-none",
                "hover:ring-1 hover:ring-[#43B97B]/10 rounded-xl mx-2"
            )}
        >
            {/* Left: Initial */}
            <div className="relative shrink-0">
                <div className="size-11 rounded-xl border-2 border-white shadow-sm flex items-center justify-center bg-gray-50">
                    <span className="text-base font-black text-[#43B97B] uppercase">
                        {lead.full_name.charAt(0)}
                    </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50">
                    <div className="size-2 rounded-full bg-[#43B97B]" title="High-intent Match" />
                </div>
            </div>

            {/* Middle: Name & Title */}
            <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-[#333333] leading-none tracking-tight truncate">
                        {lead.full_name}
                    </h3>
                </div>
                <p className="text-[13px] text-gray-500 font-medium mt-1.5 truncate leading-relaxed">
                    <span className="text-[#333333]/80">{lead.job_title}</span>
                    <span className="mx-1 text-gray-300">•</span>
                    <span className="text-gray-400 capitalize">{lead.company}</span>
                </p>
            </div>

            {/* Right: Actions/Status */}
            <div className="shrink-0 flex items-center gap-3">
                {/* Secondary Action: Craft Message (Visible on Hover) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onGenerateOutreach?.();
                    }}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 bg-[#43B97B]/10 text-[#43B97B] rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all hover:bg-[#43B97B] hover:text-white"
                >
                    <SparklesIcon className="size-3.5" />
                    <span>Craft Message</span>
                </button>

                {/* Status Badge (Default) */}
                <div className="group-hover:hidden">
                    <Badge variant="secondary" className={cn(
                        "capitalize px-2 py-0.5 text-[10px] font-bold tracking-tight rounded-md border-none",
                        lead.status === 'sent' || lead.status === 'responded' ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
                    )}>
                        {lead.status === 'found' ? 'Found' :
                            lead.status === 'enriched' ? 'Enriched' :
                                lead.status === 'drafted' ? 'Drafted' :
                                    lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </Badge>
                </div>

                <ChevronRightIcon className="size-4 text-gray-300 group-hover:text-[#43B97B] transition-colors shrink-0" />
            </div>
        </div>
    )
}
