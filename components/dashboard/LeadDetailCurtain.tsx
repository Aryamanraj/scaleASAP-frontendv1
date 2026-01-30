"use client"

import React, { useState } from 'react'
import { Lead } from '@/app/actions/leads'
import { Campaign } from '@/app/actions/campaigns'
import { cn } from '@/lib/utils'
import {
    XMarkIcon
} from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import { LeadProfileUI } from './LeadProfileUI'

interface LeadDetailCurtainProps {
    lead: Lead | null
    campaign: Campaign | null
    isOpen: boolean
    onClose: () => void
}

const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg className={cn("size-4 text-[#0077B5] fill-current", className)} viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
)

const XIcon = ({ className }: { className?: string }) => (
    <svg className={cn("size-4 text-black fill-current", className)} viewBox="0 0 24 24">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
    </svg>
)

export function LeadDetailCurtain({
    lead,
    campaign,
    isOpen,
    onClose
}: LeadDetailCurtainProps) {
    return (
        <div className={cn(
            "bg-white rounded-2xl border border-[#EEEEEE] transition-all duration-500 ease-in-out flex flex-col overflow-hidden h-full relative",
            isOpen ? "w-[480px] opacity-100" : "w-0 opacity-0 border-none"
        )}>
            {lead && (
                <LeadProfileUI lead={lead} onBack={onClose} campaign={campaign || undefined} />
            )}
        </div>
    )
}
