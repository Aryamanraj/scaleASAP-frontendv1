"use client"

import React from 'react'
import { Lead } from '@/app/actions/leads'
import { Campaign } from '@/app/actions/campaigns'
import { cn } from '@/lib/utils'
import {
    UserGroupIcon,
    CalendarIcon,
    CircleStackIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface LeadsListProps {
    leads: Lead[]
    campaigns: Campaign[]
    onLeadSelect?: (lead: Lead) => void
    selectedId?: string
}

export function LeadsList({
    leads,
    campaigns,
    onLeadSelect,
    selectedId,
}: LeadsListProps) {
    const [searchQuery, setSearchQuery] = React.useState('')

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'responded': return 'bg-[#43B97B]/10 text-[#43B97B] border-[#43B97B]/20'
            case 'sent': return 'bg-green-50 text-green-600 border-green-200'
            case 'drafted': return 'bg-purple-50 text-purple-700 border-purple-200'
            case 'enriched': return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'found': return 'bg-gray-50 text-gray-700 border-gray-200'
            default: return 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }

    const formatStatus = (status: string) => {
        if (status === 'found') return 'Found'
        if (status === 'enriched') return 'Enriched'
        if (status === 'drafted') return 'Drafted'
        return status.charAt(0).toUpperCase() + status.slice(1)
    }

    const filteredLeads = leads.filter(lead =>
        lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.job_title?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 p-12">
                <div className="size-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <UserGroupIcon className="size-8 text-gray-300" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#333333]">No leads found</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Total leads will appear here once your campaigns start generating results.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#333333]">Lead Library</h1>
                    <p className="text-sm text-gray-500 mt-1">Showing {filteredLeads.length} of {leads.length} total leads</p>
                </div>
                <div className="relative w-72">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white border-[#EEEEEE] focus:ring-[#43B97B] focus:border-[#43B97B]"
                    />
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Total Leads</p>
                    <p className="text-2xl font-bold text-[#333333]">{leads.length}</p>
                </div>
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Enriched</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {leads.filter(l => l.status === 'enriched' || l.status === 'drafted' || l.status === 'sent' || l.status === 'responded').length}
                    </p>
                </div>
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Messages Sent</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {leads.filter(l => l.status === 'sent' || l.status === 'responded').length}
                    </p>
                </div>
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Engagement Rate</p>
                    <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-bold text-[#43B97B]">
                            {leads.filter(l => l.status === 'sent' || l.status === 'responded').length > 0
                                ? Math.round((leads.filter(l => l.status === 'responded').length / leads.filter(l => l.status === 'sent' || l.status === 'responded').length) * 100)
                                : 0}%
                        </span>
                        <span className="text-xs text-gray-400">responses</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#EEEEEE] rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#EEEEEE] bg-gray-50/50">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Lead</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Job Title</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Company</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Campaign</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Added</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLeads.map((lead) => {
                                const campaign = campaigns.find(c => c.id === lead.campaign_id)
                                const isActive = selectedId === lead.id

                                return (
                                    <tr
                                        key={lead.id}
                                        onClick={() => onLeadSelect?.(lead)}
                                        className={cn(
                                            "transition-colors cursor-pointer border-l-2",
                                            isActive
                                                ? "bg-[#43B97B]/5 border-l-[#43B97B]"
                                                : "hover:bg-gray-50/50 border-l-transparent"
                                        )}
                                    >
                                        {/* Lead Name */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-black text-[#43B97B] uppercase shrink-0">
                                                    {lead.full_name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-[#333333] tracking-tight">
                                                    {lead.full_name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Job Title */}
                                        <td className="py-3.5 px-4">
                                            <span className="text-sm text-gray-600">
                                                {lead.job_title || '--'}
                                            </span>
                                        </td>

                                        {/* Company */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm text-[#333333] font-medium">
                                                    {lead.company || '--'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Campaign */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-1.5">
                                                <CircleStackIcon className="size-3.5 text-gray-400" />
                                                <span className="text-sm text-gray-600 truncate max-w-[150px]">
                                                    {campaign?.name || 'Unknown'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="py-3.5 px-4">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs font-medium px-2.5 py-0.5 whitespace-nowrap",
                                                    getStatusColor(lead.status)
                                                )}
                                            >
                                                {formatStatus(lead.status)}
                                            </Badge>
                                        </td>

                                        {/* Created Date */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-1.5">
                                                <CalendarIcon className="size-3.5 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {new Date(lead.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
