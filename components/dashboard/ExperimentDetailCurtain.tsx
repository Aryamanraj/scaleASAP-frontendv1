"use client"

import React, { useState } from 'react'
import { Experiment } from '@/app/actions/workspaces'
import { cn } from '@/lib/utils'
import {
    XMarkIcon,
    BeakerIcon,
    UserIcon,
    ChartBarIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    AdjustmentsHorizontalIcon,
    ClipboardDocumentIcon,
    ArrowPathIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { updateExperiment } from '@/app/actions/workspaces'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface WizaProspect {
    id: string
    full_name: string
    job_title: string
    job_company_name?: string
    location_name?: string
    job_company_industry?: string
    job_company_size?: string
    job_company_inferred_revenue?: string
    linkedin_url?: string
}

interface ExperimentDetailCurtainProps {
    experiment: Experiment | null
    isOpen: boolean
    onClose: () => void
}

export function ExperimentDetailCurtain({ experiment, isOpen, onClose }: ExperimentDetailCurtainProps) {
    const [activeTab, setActiveTab] = useState<'hypothesis' | 'leads' | 'activity'>('hypothesis')
    const [localExperiment, setLocalExperiment] = useState<Experiment | null>(experiment)
    const [isRefreshingFilters, setIsRefreshingFilters] = useState(false)
    const [filterRefreshError, setFilterRefreshError] = useState<string | null>(null)
    const [optimizationResults, setOptimizationResults] = useState<{ prospectCount: number, appliedFilters: string[], prospects?: WizaProspect[] } | null>(null)
    const [viewMode, setViewMode] = useState<'experiment' | 'prospects' | 'prospect-detail'>('experiment')
    const [selectedProspect, setSelectedProspect] = useState<WizaProspect | null>(null)

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

    const tabs = [
        { id: 'hypothesis', name: 'Hypothesis', icon: BeakerIcon },
        { id: 'leads', name: 'Lead Finder', icon: UserIcon },
        { id: 'activity', name: 'Activity', icon: ChartBarIcon },
    ]





    const handleRefreshWizaFilters = async () => {
        if (!displayExp) return
        setIsRefreshingFilters(true)
        setFilterRefreshError(null)
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

            // Show optimization results if available
            if (data.optimization) {
                console.log('Filter optimization results:', {
                    prospectCount: data.optimization.prospectCount,
                    removedFilters: data.optimization.removedFilters,
                    iterations: data.optimization.iterations?.length
                })
                // Store optimization results for UI display
                setOptimizationResults({
                    prospectCount: data.optimization.prospectCount,
                    appliedFilters: Object.keys(data.wiza_filters),
                    prospects: data.optimization.prospects
                })
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
            setFilterRefreshError(error instanceof Error ? error.message : 'Failed to refresh filters')
        } finally {
            setIsRefreshingFilters(false)
        }
    }

    const renderContent = () => {
        if (viewMode === 'prospect-detail') {
            return <ProspectDetail prospect={selectedProspect} />
        }

        if (viewMode === 'prospects') {
            return (
                <div className="space-y-4">
                    {optimizationResults?.prospects && optimizationResults.prospects.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-gray-900">
                                    {optimizationResults.prospectCount} Prospects Found
                                </h3>
                                <Badge variant="secondary" className="bg-[#43B97B]/10 text-[#43B97B] border-[#43B97B]/20">
                                    Optimized
                                </Badge>
                            </div>
                            <div className="space-y-3">
                                {optimizationResults.prospects.map((prospect: WizaProspect, index: number) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setSelectedProspect(prospect);
                                            setViewMode('prospect-detail');
                                        }}
                                        className="bg-white border border-[#EEEEEE] rounded-2xl p-4 hover:shadow-sm transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 font-bold text-gray-400">
                                                {prospect.full_name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-[#333333] group-hover:text-[#43B97B] transition-colors">{prospect.full_name}</h4>
                                                <p className="text-xs text-gray-500 truncate">{prospect.job_title} @ {prospect.job_company_name}</p>
                                            </div>
                                            <ChevronRightIcon className="size-4 text-gray-300 group-hover:text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <MagnifyingGlassIcon className="size-10 mx-auto mb-4 opacity-20" />
                            <p className="text-sm">No prospect data available</p>
                        </div>
                    )}
                </div>
            )
        }

        if (activeTab === 'hypothesis') {
            return (
                <div className="space-y-6">
                    <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-sm">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Growth Pattern</h3>
                        <p className="text-sm text-[#333333] leading-relaxed font-medium">{displayExp.pattern}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-sm">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Target Pain Point</h4>
                            <p className="text-sm text-[#333333] leading-relaxed">{displayExp.pain}</p>
                        </div>
                        <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-sm">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Trigger Mechanism</h4>
                            <p className="text-sm text-[#333333] leading-relaxed">{displayExp.trigger}</p>
                        </div>
                        <div className="bg-white border border-[#EEEEEE] rounded-2xl p-5 shadow-sm">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Outreach Angle</h4>
                            <p className="text-sm text-[#333333] leading-relaxed italic border-l-2 border-[#43B97B]/20 pl-4 py-1">
                                &ldquo;{displayExp.outreach_angle}&rdquo;
                            </p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sourcing Filters</h4>
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
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Titles</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {displayExp.wiza_filters.job_title.map((title, i) => (
                                            <Badge key={i} variant="secondary" className="bg-white border-gray-100 text-gray-600 font-medium text-[10px]">
                                                {title.v}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                {displayExp.wiza_filters.company_size && safeArray(displayExp.wiza_filters.company_size).length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Company Size</p>
                                        <p className="text-xs text-[#333333] font-semibold">{safeArray(displayExp.wiza_filters.company_size).join(', ')}</p>
                                    </div>
                                )}
                                {displayExp.wiza_filters.revenue && safeArray(displayExp.wiza_filters.revenue).length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Revenue</p>
                                        <p className="text-xs text-[#333333] font-semibold">{safeArray(displayExp.wiza_filters.revenue).join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (activeTab === 'leads') {
            return (
                <div className="h-full flex flex-col space-y-6">
                    <div className="bg-[#43B97B]/5 border border-[#43B97B]/10 rounded-xl p-6 text-center space-y-4">
                        <div className="size-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                            <MagnifyingGlassIcon className="size-6 text-[#43B97B]" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-[#333333]">Find Targeted Leads</h3>
                            <p className="text-xs text-gray-500 max-w-[240px] mx-auto">
                                Export your ICP filters directly to Wiza to generate a verified lead list.
                            </p>
                        </div>
                        <Button className="w-full bg-[#43B97B] hover:bg-[#38a86e] text-white font-bold h-11">
                            Find Leads on Wiza
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wiza Filter Summary</h4>
                        <div className="border border-[#EEEEEE] rounded-xl overflow-hidden text-sm">
                            {displayExp.wiza_filters.job_title && displayExp.wiza_filters.job_title.length > 0 && (
                                <div className="flex items-center justify-between p-3 border-b border-[#EEEEEE]">
                                    <span className="text-gray-500">Job Titles</span>
                                    <span className="font-medium text-[#333333]">{displayExp.wiza_filters.job_title.length} selected</span>
                                </div>
                            )}
                            {displayExp.wiza_filters.job_title_level && safeArray(displayExp.wiza_filters.job_title_level).length > 0 && (
                                <div className="flex items-center justify-between p-3 border-b border-[#EEEEEE]">
                                    <span className="text-gray-500">Title Levels</span>
                                    <span className="font-medium text-[#333333]">{safeArray(displayExp.wiza_filters.job_title_level).join(', ')}</span>
                                </div>
                            )}
                            {displayExp.wiza_filters.company_size && safeArray(displayExp.wiza_filters.company_size).length > 0 && (
                                <div className="flex items-center justify-between p-3">
                                    <span className="text-gray-500">Company Size</span>
                                    <span className="font-medium text-[#333333]">{safeArray(displayExp.wiza_filters.company_size).join(', ')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        }

        if (activeTab === 'activity') {
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Leads Found</p>
                            <p className="text-xl font-bold text-[#333333]">{displayExp.leads_found}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Meetings</p>
                            <p className="text-xl font-bold text-[#43B97B]">{displayExp.meetings_booked}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h4>
                        <div className="space-y-4">
                            {[
                                { title: 'Experiment Created', time: 'Just now', icon: BeakerIcon },
                                { title: 'Warmup Initiated', time: '2 hours ago', icon: ChartBarIcon, disabled: displayExp.status === 'pending' || displayExp.status === 'creating_hypotheses' },
                            ].map((item, i) => (
                                <div key={i} className={cn("flex gap-3", item.disabled ? "opacity-30" : "opacity-100")}>
                                    <div className="size-8 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                                        <item.icon className="size-4 text-gray-400" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-[#333333]">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }

        return null
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
                    <div className="flex items-center gap-2 mb-1">
                        {(viewMode === 'prospects' || viewMode === 'prospect-detail') && (
                            <button
                                onClick={() => setViewMode(viewMode === 'prospect-detail' ? 'prospects' : 'experiment')}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <ChevronLeftIcon className="size-4 text-gray-500" />
                            </button>
                        )}
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {viewMode === 'experiment' ? 'Experiment' : viewMode === 'prospects' ? 'Prospects' : 'Details'}
                        </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#333333] tracking-tight">
                        {viewMode === 'prospect-detail' ? 'Lead Profile' : viewMode === 'prospects' ? 'Search Results' : displayExp.name.replace(/^[^:]+:\s*/, '')}
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="size-8 flex items-center justify-center border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <XMarkIcon className="size-4 text-gray-400" />
                </button>
            </div>

            {viewMode === 'experiment' && (
                <div className="px-6 flex items-center gap-6 border-b border-[#EEEEEE]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'hypothesis' | 'leads' | 'activity')}
                            className={cn(
                                "py-4 text-sm font-medium transition-all relative",
                                activeTab === tab.id ? "text-[#43B97B]" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <tab.icon className="size-4" />
                                {tab.name}
                            </div>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#43B97B] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">
                {renderContent()}
            </div>
        </div>
    )
}

function ProspectDetail({ prospect }: { prospect: WizaProspect | null }) {
    if (!prospect) return null

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-5 bg-white border border-[#EEEEEE] p-6 rounded-2xl shadow-sm">
                <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 font-bold text-gray-400 text-xl shadow-inner">
                    {prospect.full_name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-[#333333]">{prospect.full_name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{prospect.job_title}</p>
                    <p className="text-xs text-[#43B97B] font-bold uppercase tracking-widest mt-1">Found via Wiza</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {prospect.linkedin_url && (
                    <a
                        href={`https://${prospect.linkedin_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-600 hover:bg-white hover:shadow-sm transition-all"
                    >
                        🔗 LinkedIn Profile
                    </a>
                )}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-600">
                    📧 {prospect.full_name.split(' ')[0].toLowerCase()}@company.co
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Company Intelligence</h4>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Company</p>
                            <p className="text-xs text-[#333333] font-bold">{prospect.job_company_name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Location</p>
                            <p className="text-xs text-[#333333] font-bold">{prospect.location_name || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Industry</p>
                            <p className="text-xs text-[#333333] font-bold">{prospect.job_company_industry || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Company Size</p>
                            <p className="text-xs text-[#333333] font-bold">{prospect.job_company_size || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Activity History</h4>
                    <div className="flex items-center gap-4 py-2 opacity-40 italic">
                        <div className="size-2 bg-gray-200 rounded-full" />
                        <p className="text-[11px] text-gray-400">No previous engagement recorded</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
