"use client"

import React, { useState } from 'react'
import { Experiment } from '@/app/actions/workspaces'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { updateExperiment } from '@/app/actions/workspaces'
import { Tabs } from "@/components/dashboard/profile/tabs";
import { ArrowLeft, HelpCircle, Rocket, Sparkles, Zap, AlertTriangle, MessageSquare, Filter, Share2, ClipboardList, RefreshCw } from "lucide-react";

interface ExperimentDetailCurtainProps {
    experiment: Experiment | null
    isOpen: boolean
    onClose: () => void
    onCreateCampaign?: (campaignName: string, experimentId: string) => Promise<void>
    hasCampaignStarted?: boolean
}

export function ExperimentDetailCurtain({ experiment, isOpen, onClose, onCreateCampaign, hasCampaignStarted }: ExperimentDetailCurtainProps) {
    const [localExperiment, setLocalExperiment] = useState<Experiment | null>(experiment)
    const [isRefreshingFilters, setIsRefreshingFilters] = useState(false)
    const [isCreatingCampaign, setIsCreatingCampaign] = useState(false)
    const [activeTab, setActiveTab] = useState("strategy")

    React.useEffect(() => {
        if (experiment) setLocalExperiment(experiment)
    }, [experiment])

    const displayExp = experiment || localExperiment

    if (!displayExp) return null

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
                    optimize: true
                })
            })
            if (!response.ok) throw new Error(`API error: ${response.statusText}`)
            const data = await response.json()
            if (!data.wiza_filters) throw new Error('Invalid response: missing wiza_filters')

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

    // Helper function to safely access array fields (handles old format)
    const safeArray = (field: unknown): string[] => {
        if (Array.isArray(field)) return field
        return []
    }

    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-[#EEEEEE] transition-all duration-500 ease-in-out flex flex-col overflow-hidden h-full relative",
                isOpen ? "w-[480px] opacity-100" : "w-0 opacity-0 border-none"
            )}
        >
            <div className="flex-1 overflow-y-auto bg-white flex flex-col h-full no-scrollbar">
                {/* Fixed Top Controls */}
                <div className="px-6 pt-6 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-30 pb-4">
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center border border-[#EEEEEE] bg-white rounded-lg hover:bg-gray-50 transition-all"
                    >
                        <ArrowLeft size={16} color="#4a4a4a" />
                    </button>
                    <button
                        className="size-8 flex items-center justify-center border border-[#EEEEEE] bg-white rounded-lg hover:bg-gray-50 transition-all"
                    >
                        <HelpCircle size={16} color="#4a4a4a" />
                    </button>
                </div>

                {/* Identity Header */}
                <div className="px-6 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-[#43B97B] uppercase tracking-widest">Experiment Protocol</span>
                            <h2 className="text-2xl font-bold text-[#434343] tracking-tight leading-tight">
                                {displayExp.name.replace(/^[^:]+:\s*/, '')}
                            </h2>
                        </div>
                        <div className="bg-[#43B97B]/10 px-2 py-1 rounded-md text-[10px] font-bold text-[#43B97B] tracking-widest h-fit mt-1 whitespace-nowrap">
                            READY TO SCALE
                        </div>
                    </div>
                    <div className="text-[13px] text-[#434343] font-medium font-geist mt-1">
                        Growth Strategy • <span className="font-bold text-[#10B981]">Optimized Performance</span>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mt-6 border-b border-[#EEEEEE]">
                    <div className="px-6">
                        <Tabs
                            tabs={[
                                { id: "strategy", label: "Strategy" },
                                { id: "filters", label: "Targeting" },
                            ]}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>
                </div>

                {/* Content Sections */}
                <div className="flex-1 bg-gray-50/30 p-6 space-y-6">
                    {activeTab === 'strategy' && (
                        <div className="flex flex-col gap-6">
                            {/* Growth Pattern */}
                            <div className="bg-white border border-[#eeeeee] rounded-2xl p-6 space-y-3 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#10B981]" />
                                <div className="flex items-center gap-2 text-[#10B981]">
                                    <Zap size={16} fill="#10B981" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Growth Pattern</span>
                                </div>
                                <p className="text-[14px] leading-relaxed text-[#434343] font-medium font-geist italic">
                                    {displayExp.pattern}
                                </p>
                            </div>

                            {/* Split Sections */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white border border-[#eeeeee] rounded-2xl p-5 space-y-3 shadow-sm">
                                    <div className="flex items-center gap-2 text-[#434343]">
                                        <AlertTriangle size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pain Point</span>
                                    </div>
                                    <p className="text-[13px] leading-relaxed text-[#434343] font-medium font-geist">
                                        {displayExp.pain}
                                    </p>
                                </div>
                                <div className="bg-white border border-[#eeeeee] rounded-2xl p-5 space-y-3 shadow-sm">
                                    <div className="flex items-center gap-2 text-[#434343]">
                                        <Zap size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Key Trigger</span>
                                    </div>
                                    <p className="text-[13px] leading-relaxed text-[#434343] font-medium font-geist">
                                        {displayExp.trigger}
                                    </p>
                                </div>
                            </div>

                            {/* Outreach Angle */}
                            <div className="bg-white border border-[#43B97B]/20 rounded-2xl p-6 space-y-3 shadow-sm shadow-[#43B97B]/5">
                                <div className="flex items-center gap-2 text-[#43B97B]">
                                    <MessageSquare size={16} fill="#43B97B" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Outreach Angle</span>
                                </div>
                                <p className="text-[16px] leading-relaxed text-[#111827] font-bold font-geist italic">
                                    &ldquo;{displayExp.outreach_angle}&rdquo;
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'filters' && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-white border border-[#eeeeee] rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 text-[#434343]">
                                        <Filter size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Targeting Filters</span>
                                    </div>
                                    <button
                                        onClick={handleRefreshWizaFilters}
                                        disabled={isRefreshingFilters}
                                        className="px-3 py-1.5 bg-[#10B981]/5 text-[#10B981] text-[10px] font-bold rounded-lg flex items-center gap-2 hover:bg-[#10B981]/10 transition-all border border-[#10B981]/10"
                                    >
                                        <RefreshCw size={12} className={cn(isRefreshingFilters && "animate-spin")} />
                                        OPTIMIZE FILTERS
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {displayExp.wiza_filters.job_title && displayExp.wiza_filters.job_title.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <ClipboardList size={14} />
                                                Decision Makers
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {displayExp.wiza_filters.job_title.map((title, i) => (
                                                    <div key={i} className="bg-gray-50 border border-gray-100 text-gray-600 font-semibold text-[11px] rounded-lg px-2.5 py-1.5 font-geist">
                                                        {title.v}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                                        {displayExp.wiza_filters.company_size && safeArray(displayExp.wiza_filters.company_size).length > 0 && (
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company Size</p>
                                                <p className="text-[13px] text-[#333333] font-bold font-geist">{safeArray(displayExp.wiza_filters.company_size).join(', ')}</p>
                                            </div>
                                        )}
                                        {displayExp.wiza_filters.revenue && safeArray(displayExp.wiza_filters.revenue).length > 0 && (
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue</p>
                                                <p className="text-[13px] text-[#333333] font-bold font-geist">{safeArray(displayExp.wiza_filters.revenue).join(', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions Footer */}
            {!hasCampaignStarted && (
                <div className="p-6 border-t border-[#EEEEEE] bg-white">
                    <Button
                        onClick={handleCreateCampaign}
                        disabled={isCreatingCampaign}
                        className="w-full bg-[#43B97B] hover:bg-[#3ca86d] text-white h-12 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#43B97B]/10 hover:scale-[1.02] active:scale-95 border-none"
                    >
                        {isCreatingCampaign ? (
                            <RefreshCw size={20} className="animate-spin" />
                        ) : (
                            <>
                                <Rocket size={20} fill="currentColor" />
                                Launch Campaign
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
