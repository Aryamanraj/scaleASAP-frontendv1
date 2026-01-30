"use client"

import React from 'react'
import { Campaign } from '@/app/actions/campaigns'
import { Experiment } from '@/app/actions/workspaces'
import { cn } from '@/lib/utils'
import {
    MegaphoneIcon,
    CalendarIcon,
    UserGroupIcon,
    PauseIcon,
    CheckCircleIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline'
import { Lead } from '@/app/actions/leads'
import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'

interface CampaignsListProps {
    campaigns: Campaign[]
    experiments: Experiment[]
    onCampaignSelect: (campaign: Campaign) => void
    selectedId?: string
    onNewCampaign?: () => void
    hasOngoingChat?: boolean
    isDiscoveryOpen?: boolean
    leads: Lead[]
}

export function CampaignsList({
    campaigns,
    experiments,
    onCampaignSelect,
    selectedId,
    onNewCampaign,
    hasOngoingChat = false,
    isDiscoveryOpen = false,
    leads
}: CampaignsListProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-[#43B97B]/10 text-[#43B97B] border-[#43B97B]/20'
            case 'paused': return 'bg-amber-50 text-amber-700 border-amber-200'
            case 'completed': return 'bg-gray-50 text-gray-700 border-gray-200'
            default: return 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }

    const formatStatus = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1)
    }

    if (campaigns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 p-12">
                <div className="size-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <MegaphoneIcon className="size-8 text-gray-300" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#333333]">No campaigns yet</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Create a campaign from the Experiments tab to start finding and reaching out to leads.
                    </p>
                    <Button
                        variant="outline"
                        onClick={onNewCampaign}
                        className="mt-4 bg-white border-[#EEEEEE] hover:bg-gray-50 text-[#333333] font-medium"
                    >
                        New Campaign
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header Area (Optional, depending on layout preference, but keep consistent with Experiments) */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#333333]">Campaigns</h1>
                    <p className="text-sm text-gray-500 mt-1">Showing {campaigns.length} total campaigns</p>
                </div>
                {!isDiscoveryOpen && (
                    <Button
                        variant="outline"
                        onClick={onNewCampaign}
                        className="bg-white border-[#EEEEEE] hover:bg-gray-50 text-[#333333] font-medium"
                    >
                        New Campaign
                    </Button>
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Total Campaigns</p>
                    <p className="text-2xl font-bold text-[#333333]">{campaigns.length}</p>
                </div>
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Active</p>
                    <p className="text-2xl font-bold text-[#43B97B]">
                        {campaigns.filter(c => c.status === 'active').length}
                    </p>
                </div>
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Paused</p>
                    <p className="text-2xl font-bold text-amber-600">
                        {campaigns.filter(c => c.status === 'paused').length}
                    </p>
                </div>
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Performance</p>
                    <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-bold text-[#333333]">--</span>
                        <span className="text-xs text-gray-400">conversion</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#EEEEEE] rounded-lg overflow-hidden shadow-sm">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b border-[#EEEEEE] bg-gray-50/50">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide w-[100px]">ID</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide w-[140px]">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide w-[80px]">Leads</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide w-[150px]">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {campaigns.map((campaign, index) => {
                            const experiment = experiments.find(e => e.id === campaign.experiment_id)
                            const isActive = selectedId === campaign.id

                            return (
                                <tr
                                    key={campaign.id}
                                    onClick={() => onCampaignSelect(campaign)}
                                    className={cn(
                                        "transition-colors cursor-pointer border-l-2",
                                        isActive
                                            ? "bg-[#43B97B]/5 border-l-[#43B97B]"
                                            : "hover:bg-gray-50/50 border-l-transparent"
                                    )}
                                >
                                    {/* Campaign ID */}
                                    <td className="py-3.5 px-4">
                                        <span className="text-sm font-medium text-[#333333] whitespace-nowrap">
                                            CAM-{String(index + 1).padStart(4, '0')}
                                        </span>
                                    </td>

                                    {/* Name */}
                                    <td className="py-3.5 px-4 overflow-hidden">
                                        <span className="text-sm font-semibold text-[#333333] group-hover:text-[#43B97B] truncate block" title={campaign.name}>
                                            {campaign.name}
                                        </span>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="py-3.5 px-4">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-xs font-medium px-2.5 py-0.5 gap-1.5",
                                                getStatusColor(campaign.status)
                                            )}
                                        >
                                            {campaign.status === 'active' && <span className="size-1 bg-[#43B97B] rounded-full animate-pulse" />}
                                            {campaign.status === 'paused' && <PauseIcon className="size-3" />}
                                            {campaign.status === 'completed' && <CheckCircleIcon className="size-3" />}
                                            {formatStatus(campaign.status)}
                                        </Badge>
                                    </td>

                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-1.5">
                                            <UserGroupIcon className="size-3.5 text-gray-400" />
                                            <span className="text-sm font-medium text-[#333333]">
                                                {leads.filter(l => l.campaign_id === campaign.id).length}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Created Date */}
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarIcon className="size-3.5 text-gray-400 shrink-0" />
                                            <span className="text-sm text-gray-600 whitespace-nowrap">
                                                {new Date(campaign.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
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
    )
}
