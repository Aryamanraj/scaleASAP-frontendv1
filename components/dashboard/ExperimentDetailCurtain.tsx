"use client"

import React, { useState } from 'react'
import { Experiment } from '@/app/actions/workspaces'
import { cn } from '@/lib/utils'
import {
    XMarkIcon,
    SparklesIcon,
    ArrowPathIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { updateExperiment } from '@/app/actions/workspaces'

interface ExperimentDetailCurtainProps {
    experiment: Experiment | null
    isOpen: boolean
    onClose: () => void
    onCreateCampaign?: (campaignName: string, experimentId: string) => Promise<void>
}

export function ExperimentDetailCurtain({ experiment, isOpen, onClose, onCreateCampaign }: ExperimentDetailCurtainProps) {
    const [localExperiment, setLocalExperiment] = useState<Experiment | null>(experiment)
    const [isRefreshingFilters, setIsRefreshingFilters] = useState(false)
    const [isCreatingCampaign, setIsCreatingCampaign] = useState(false)

    // Keep the experiment data around even when the parent nulls it out, 
    // so we can animate it sliding away with its content still visible.
    React.useEffect(() => {
        if (experiment) setLocalExperiment(experiment)
    }, [experiment])

    const displayExp = experiment || localExperiment

    if (!displayExp) return null

    // Helper function to safely access array fields (handles old format)
    const safeArray = (field: unknown): string[] => {
        if (Array.isArray(field)) return field
        return []
    }

    const handleCreateCampaign = async () => {
        if (!displayExp || !onCreateCampaign) return
        setIsCreatingCampaign(true)
        try {
            await onCreateCampaign(`${displayExp.name.replace(/^[^:]+:\s*/, '')} Campaign`, displayExp.id)
            onClose()
        } catch (error) {
            console.error('Failed to create campaign:', error)
        } finally {
            setIsCreatingCampaign(false)
        }
    }

    const handleRefreshWizaFilters = async () => {
        if (!displayExp) return
        setIsRefreshingFilters(true)
        try {
            const response = await fetch('/api/filters/regenerate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    experiment: displayExp,
                    optimize: true // Enable filter optimization
                })
            })
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`)
            }
            const data = await response.json()
            if (!data.wiza_filters) {
                throw new Error('Invalid response: missing wiza_filters')
            }

            const { success } = await updateExperiment(displayExp.id, {
                wiza_filters: data.wiza_filters
            })
            if (success) {
                setLocalExperiment({
                    ...displayExp,
                    wiza_filters: data.wiza_filters
                })
            } else {
                throw new Error('Failed to update experiment')
            }
        } catch (error) {
            console.error('Failed to refresh filters:', error)
        } finally {
            setIsRefreshingFilters(false)
        }
    }

    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-[#EEEEEE] shadow-sm transition-all duration-500 ease-in-out flex flex-col overflow-hidden h-full",
                isOpen ? "w-[480px] opacity-100" : "w-0 opacity-0 border-none"
            )}
        >
            <div className="p-6 pb-2 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Experiment Strategy</span>
                    <h2 className="text-lg font-bold text-[#333333] tracking-tight">{displayExp.name.replace(/^[^:]+:\s*/, '')}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="size-8 flex items-center justify-center border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <XMarkIcon className="size-4 text-gray-400" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Core Strategy */}
                <div className="space-y-6">
                    <div className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <SparklesIcon className="size-12 text-[#43B97B]" />
                        </div>
                        <h3 className="text-xs font-bold text-[#43B97B] uppercase tracking-wider mb-3">Growth Pattern</h3>
                        <p className="text-[15px] text-[#333333] leading-relaxed font-semibold italic">
                            {displayExp.pattern}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gray-50/50 border border-[#EEEEEE] rounded-2xl p-5 space-y-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Pain Point</h4>
                            <p className="text-[15px] text-[#333333] leading-relaxed font-medium">{displayExp.pain}</p>
                        </div>
                        <div className="bg-gray-50/50 border border-[#EEEEEE] rounded-2xl p-5 space-y-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trigger Mechanism</h4>
                            <p className="text-[15px] text-[#333333] leading-relaxed font-medium">{displayExp.trigger}</p>
                        </div>
                    </div>

                    <div className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm border-l-4 border-l-[#43B97B]">
                        <h4 className="text-xs font-bold text-[#43B97B] uppercase tracking-wider mb-3">Outreach Angle</h4>
                        <p className="text-[15px] text-[#333333] leading-relaxed font-semibold italic">
                            &ldquo;{displayExp.outreach_angle}&rdquo;
                        </p>
                    </div>
                </div>

                {/* Targeting Logic */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Targeting Filters</h4>
                        <button
                            onClick={handleRefreshWizaFilters}
                            disabled={isRefreshingFilters}
                            className="p-1.5 hover:bg-gray-50 rounded-md border border-gray-100 text-gray-400"
                        >
                            <ArrowPathIcon className={cn("size-3.5", isRefreshingFilters && "animate-spin")} />
                        </button>
                    </div>
                    <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-[#EEEEEE] space-y-4">
                        {displayExp.wiza_filters.job_title && displayExp.wiza_filters.job_title.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Decision Makers</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {displayExp.wiza_filters.job_title.map((title, i) => (
                                        <Badge key={i} variant="secondary" className="bg-white border-gray-100 text-gray-600 font-medium text-xs">
                                            {title.v}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            {displayExp.wiza_filters.company_size && safeArray(displayExp.wiza_filters.company_size).length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Company Size</p>
                                    <p className="text-sm text-[#333333] font-semibold">{safeArray(displayExp.wiza_filters.company_size).join(', ')}</p>
                                </div>
                            )}
                            {displayExp.wiza_filters.revenue && safeArray(displayExp.wiza_filters.revenue).length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Revenue</p>
                                    <p className="text-sm text-[#333333] font-semibold">{safeArray(displayExp.wiza_filters.revenue).join(', ')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-[#EEEEEE] bg-gray-50/30">
                <Button
                    onClick={handleCreateCampaign}
                    disabled={isCreatingCampaign}
                    className="w-full bg-[#43B97B] hover:bg-[#3CA66F] text-white font-semibold h-10 rounded-md shadow-sm shadow-[#43B97B]/10 flex items-center justify-center gap-2 group transition-all active:scale-[0.98]"
                >
                    {isCreatingCampaign ? (
                        <ArrowPathIcon className="size-5 animate-spin" />
                    ) : (
                        <>
                            <RocketLaunchIcon className="size-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            Create Campaign
                        </>
                    )}
                </Button>
                <p className="text-xs text-gray-400 text-center mt-3 font-medium">
                    This will initialize a new campaign based on this experiment.
                </p>
            </div>
        </div>
    )
}
