"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Experiment } from '@/app/actions/workspaces'
import { CalendarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

interface ExperimentsListProps {
    experiments: Experiment[]
    onNewExperiment?: () => void
    onExperimentSelect?: (experiment: Experiment) => void
    selectedId?: string
    hasOngoingChat?: boolean
    isDiscoveryOpen?: boolean
}

export function ExperimentsList({
    experiments,
    onNewExperiment,
    onExperimentSelect,
    selectedId,
    hasOngoingChat = false,
    isDiscoveryOpen = false
}: ExperimentsListProps) {
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
            case 'suggested': return 'bg-blue-50 text-blue-700 border-blue-200'
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
            case 'suggested': return 'Suggested'
            default: return status.charAt(0).toUpperCase() + status.slice(1)
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'bullseye': return 'bg-green-50 text-green-700 border-green-200'
            case 'variable_a': return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'variable_b': return 'bg-purple-50 text-purple-700 border-purple-200'
            case 'contrarian': return 'bg-orange-50 text-orange-700 border-orange-200'
            case 'long_shot': return 'bg-gray-50 text-gray-700 border-gray-200'
            default: return 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }

    const formatLabel = (type: string) => {
        return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }

    if (!experiments || experiments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🧪</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[#333333]">No Experiments Yet</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Complete the ICP discovery chat to generate your experiments.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#333333]">Experiments</h1>
                    <p className="text-sm text-gray-500 mt-1">Showing {experiments.length} of {experiments.length} experiments</p>
                </div>
                {!isDiscoveryOpen && (
                    <Button
                        onClick={onNewExperiment}
                        variant="outline"
                        className="bg-white border-[#EEEEEE] hover:bg-gray-50 text-[#333333] font-medium"
                    >
                        {hasOngoingChat ? 'Continue Discovery' : '+ New Experiment'}
                    </Button>
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Total Experiments</p>
                    <p className="text-2xl font-bold text-[#333333]">{experiments.length}</p>
                </div>
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {experiments.filter(e => ['creating_hypotheses', 'pending', 'finding_leads', 'prioritizing_leads', 'warmup_initiated'].includes(e.status)).length}
                    </p>
                </div>
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Complete</p>
                    <p className="text-2xl font-bold text-green-600">
                        {experiments.filter(e => ['complete', 'completed'].includes(e.status)).length}
                    </p>
                </div>
                <div className="bg-white border border-[#EEEEEE] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Total Leads</p>
                    <p className="text-2xl font-bold text-[#43B97B]">
                        {experiments.reduce((sum, e) => sum + e.leads_found, 0)}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#EEEEEE] rounded-lg overflow-hidden">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b border-[#EEEEEE] bg-gray-50/50">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide w-[100px]">ID</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide w-[110px]">Type</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide w-[140px]">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide w-[80px]">Leads</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide w-[150px]">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {experiments.map((experiment, index) => (
                            <tr
                                key={experiment.id}
                                onClick={() => onExperimentSelect?.(experiment)}
                                className={cn(
                                    "transition-colors cursor-pointer border-l-2",
                                    selectedId === experiment.id
                                        ? "bg-[#43B97B]/5 border-l-[#43B97B]"
                                        : "hover:bg-gray-50/50 border-l-transparent"
                                )}
                            >
                                {/* Experiment ID */}
                                <td className="py-3.5 px-4">
                                    <span className="text-sm font-medium text-[#333333] whitespace-nowrap">
                                        EXP-{String(index + 1).padStart(4, '0')}
                                    </span>
                                </td>

                                {/* Name & Pattern */}
                                <td className="py-3.5 px-4 overflow-hidden">
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="text-sm font-bold text-[#333333] truncate" title={experiment.name.replace(/^[^:]+:\s*/, '')}>
                                            {experiment.name.replace(/^[^:]+:\s*/, '')}
                                        </span>
                                        <span className="text-[11px] text-gray-400 truncate font-medium" title={experiment.pattern}>
                                            {experiment.pattern}
                                        </span>
                                    </div>
                                </td>

                                {/* Type Badge */}
                                <td className="py-3.5 px-4">
                                    <Badge
                                        variant="outline"
                                        className={cn("text-xs font-medium px-2 py-0.5", getTypeColor(experiment.type))}
                                    >
                                        {formatLabel(experiment.type)}
                                    </Badge>
                                </td>

                                {/* Status Badge */}
                                <td className="py-3.5 px-4">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-xs font-medium px-2.5 py-1",
                                            getStatusColor(experiment.status)
                                        )}
                                    >
                                        {formatStatus(experiment.status)}
                                    </Badge>
                                </td>

                                {/* Leads Count */}
                                <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-1.5">
                                        <ArrowTrendingUpIcon className="size-3.5 text-gray-400" />
                                        <span className="text-sm font-medium text-[#333333]">
                                            {experiment.leads_found}
                                        </span>
                                    </div>
                                </td>

                                {/* Created Date */}
                                <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarIcon className="size-3.5 text-gray-400 shrink-0" />
                                        <span className="text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(experiment.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
