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
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline'

interface LeadCardProps {
    lead: Lead
    onUpdateOutcome: (outcome: Lead['outcome'], reason?: string) => Promise<void>
    onClick?: () => void
}

export function LeadCard({ lead, onUpdateOutcome, onClick }: LeadCardProps) {
    const [isUpdating, setIsUpdating] = useState(false)

    const outcomes: { label: string, value: Lead['outcome'], icon: any, color: string }[] = [
        { label: 'Meeting Booked', value: 'meeting_booked', icon: CheckCircleIcon, color: 'text-green-600 bg-green-50' },
        { label: 'Interested', value: 'interested', icon: ChatBubbleLeftRightIcon, color: 'text-blue-600 bg-blue-50' },
        { label: 'Rejected', value: 'rejected', icon: XCircleIcon, color: 'text-red-600 bg-red-50' },
        { label: 'No Response', value: 'no_response', icon: ExclamationCircleIcon, color: 'text-gray-600 bg-gray-50' },
    ]

    const handleUpdate = async (value: Lead['outcome']) => {
        setIsUpdating(true)
        await onUpdateOutcome(value)
        setIsUpdating(false)
    }

    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white border border-[#EEEEEE] rounded-2xl p-6 space-y-6 transition-all",
                onClick ? "cursor-pointer hover:border-[#43B97B]/30 hover:shadow-md active:scale-[0.99]" : ""
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 font-bold text-gray-400 text-lg">
                        {lead.full_name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#333333]">{lead.full_name}</h3>
                        <p className="text-sm text-gray-500">{lead.job_title} @ {lead.company}</p>
                    </div>
                </div>
                <Badge variant="secondary" className={cn(
                    "capitalize px-2.5 py-1",
                    lead.status === 'sent' ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-600"
                )}>
                    {lead.status}
                </Badge>
            </div>

            <div className="flex gap-3">
                {lead.linkedin_url && (
                    <a
                        href={lead.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-md text-xs font-semibold text-gray-600 hover:bg-white hover:shadow-sm transition-all"
                    >
                        <LinkIcon className="size-3.5" />
                        LinkedIn
                    </a>
                )}
                {lead.email && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-md text-xs font-semibold text-gray-600">
                        <EnvelopeIcon className="size-3.5" />
                        {lead.email}
                    </div>
                )}
            </div>

            {lead.outbound_message && (
                <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-[#EEEEEE] space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Outbound Message</p>
                    <p className="text-sm text-[#333333] italic leading-relaxed">
                        "{lead.outbound_message}"
                    </p>
                </div>
            )}

            <div className="space-y-3 pt-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update Outcome</p>
                <div className="grid grid-cols-2 gap-2">
                    {outcomes.map((o) => (
                        <button
                            key={o.value}
                            disabled={isUpdating}
                            onClick={() => handleUpdate(o.value)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition-all border",
                                lead.outcome === o.value
                                    ? `${o.color} border-current`
                                    : "bg-white border-[#EEEEEE] text-gray-500 hover:border-gray-300"
                            )}
                        >
                            <o.icon className="size-4" />
                            {o.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
