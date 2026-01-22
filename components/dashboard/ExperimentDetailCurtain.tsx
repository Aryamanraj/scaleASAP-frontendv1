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
    ArrowPathIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { updateExperiment } from '@/app/actions/workspaces'
import { RefineProposalDialog } from './RefineProposalDialog'
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
    const [selectedFeedback, setSelectedFeedback] = useState<string>('')
    const [isRefining, setIsRefining] = useState(false)
    const [proposal, setProposal] = useState<{pattern: string, pain: string, trigger: string, outreach_angle: string, reasoning: string} | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [copiedToClipboard, setCopiedToClipboard] = useState(false)
    const [isRefreshingFilters, setIsRefreshingFilters] = useState(false)
    const [filterRefreshError, setFilterRefreshError] = useState<string | null>(null)
    const [optimizationResults, setOptimizationResults] = useState<{prospectCount: number, appliedFilters: string[], prospects?: WizaProspect[]} | null>(null)
    const [viewMode, setViewMode] = useState<'experiment' | 'prospects'>('experiment')

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

    const feedbackOptions = [
        { id: 'broad_triggers', label: 'Too broad, focus on specific triggers' },
        { id: 'wrong_seniority', label: 'Targeting the wrong seniority' },
        { id: 'generic_pain', label: 'Pain point is too generic' },
        { id: 'industry_off', label: 'Industry focus is off' },
        { id: 'outreach_soft', label: 'Outreach angle is too soft' },
    ]

    const handleRefine = async () => {
        if (!displayExp || !selectedFeedback) return
        setIsRefining(true)
        setIsDialogOpen(true)
        try {
            const response = await fetch('/api/chat/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    experiment: displayExp,
                    feedback: feedbackOptions.find(f => f.id === selectedFeedback)?.label
                })
            })
            if (response.ok) {
                const data: {pattern: string, pain: string, trigger: string, outreach_angle: string, reasoning: string} = await response.json()
                setProposal(data)
            }
        } catch (error) {
            console.error('Refinement error:', error)
        } finally {
            setIsRefining(false)
        }
    }

    const handleApproveRefinement = async (refined: {pattern: string, pain: string, trigger: string, outreach_angle: string}) => {
        if (!displayExp) return
        try {
            const { success } = await updateExperiment(displayExp.id, {
                pattern: refined.pattern,
                pain: refined.pain,
                trigger: refined.trigger,
                outreach_angle: refined.outreach_angle
            })
            if (success) {
                setLocalExperiment({
                    ...displayExp,
                    ...refined
                })
                setIsDialogOpen(false)
            }
        } catch (error) {
            console.error('Update error:', error)
        }
    }

    const handleCopyWizaFilters = async () => {
        if (!displayExp) return
        try {
            // If we have optimization results, use those filters, otherwise use the experiment's filters
            const filtersToCopy = displayExp.wiza_filters
            await navigator.clipboard.writeText(JSON.stringify(filtersToCopy, null, 2))
            setCopiedToClipboard(true)
            setTimeout(() => setCopiedToClipboard(false), 2000)
        } catch (error) {
            console.error('Failed to copy:', error)
        }
    }

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

    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-[#EEEEEE] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-in-out flex flex-col overflow-hidden h-full",
                isOpen ? "w-[480px] opacity-100" : "w-0 opacity-0 border-none"
            )}
        >
            {/* Header with subtle gradient */}
            <div className="p-6 border-b border-[#EEEEEE] flex items-center justify-between bg-gradient-to-r from-white to-gray-50/30">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        {viewMode === 'prospects' && (
                            <button
                                onClick={() => setViewMode('experiment')}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all hover:shadow-sm mr-2"
                            >
                                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back
                            </button>
                        )}
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-[#43B97B] bg-[#43B97B]/5 border-[#43B97B]/20">
                            {viewMode === 'prospects' ? 'Prospect Details' : 'Experiment Details'}
                        </Badge>
                        <span className="text-[10px] font-mono text-gray-400 font-medium">ID: {displayExp.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-[#333333] tracking-tight leading-tight">
                        {viewMode === 'prospects' ? 'Found Prospects' : displayExp.name.replace(/^[^:]+:\s*/, '')}
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2.5 hover:bg-white hover:shadow-md hover:scale-105 active:scale-95 rounded-xl transition-all duration-200 group border border-transparent hover:border-[#EEEEEE]"
                >
                    <XMarkIcon className="size-5 text-gray-400 group-hover:text-gray-900" />
                </button>
            </div>

            {/* Tabs - Only show in experiment mode */}
            {viewMode === 'experiment' && (
            <div className="px-6 flex items-center gap-6 border-b border-[#EEEEEE]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'hypothesis' | 'leads' | 'activity')}
                        className={cn(
                            "py-4 text-sm font-medium transition-all relative",
                            activeTab === tab.id
                                ? "text-[#43B97B]"
                                : "text-gray-500 hover:text-gray-700"
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

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                {viewMode === 'prospects' ? (
                    <div className="space-y-4">
                        {/* Prospect List */}
                        {optimizationResults?.prospects && optimizationResults.prospects.length > 0 ? (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-gray-900">
                                        {optimizationResults.prospectCount} Prospects Found
                                    </h3>
                                    <Badge variant="secondary" className="bg-[#43B97B]/10 text-[#43B97B] border-[#43B97B]/20">
                                        Optimized Results
                                    </Badge>
                                </div>
                                <div className="space-y-3">
                                    {optimizationResults.prospects.map((prospect: WizaProspect, index: number) => (
                                        <div key={index} className="bg-white border border-[#EEEEEE] rounded-xl p-4 hover:shadow-md transition-shadow space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <h4 className="font-bold text-[#333333]">
                                                        {prospect.full_name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">{prospect.job_title}</p>
                                                </div>
                                            </div>
                                            {prospect.job_company_name && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">@</span>
                                                    <span className="font-medium text-gray-700">{prospect.job_company_name}</span>
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#EEEEEE]">
                                                {prospect.location_name && (
                                                    <Badge variant="outline" className="text-[10px]">📍 {prospect.location_name}</Badge>
                                                )}
                                                {prospect.job_company_industry && (
                                                    <Badge variant="outline" className="text-[10px]">🏢 {prospect.job_company_industry}</Badge>
                                                )}
                                                {prospect.job_company_size && (
                                                    <Badge variant="outline" className="text-[10px]">👥 {prospect.job_company_size}</Badge>
                                                )}
                                                {prospect.job_company_inferred_revenue && (
                                                    <Badge variant="outline" className="text-[10px]">💰 {prospect.job_company_inferred_revenue}</Badge>
                                                )}
                                                {prospect.linkedin_url && (
                                                    <Badge variant="outline" className="text-[10px]">
                                                        <a href={`https://${prospect.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#43B97B]">
                                                            🔗 LinkedIn
                                                        </a>
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <MagnifyingGlassIcon className="size-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-sm">No prospect data available</p>
                                <p className="text-xs mt-1">Click Refresh to generate new filters and find prospects</p>
                            </div>
                        )}
                    </div>
                ) : activeTab === 'hypothesis' && (
                    <div className="space-y-8">
                        {/* Pattern Container */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <span className="size-2 bg-[#43B97B] rounded-full" />
                                Growth Pattern
                            </h3>
                            <div className="bg-[#43B97B]/5 border border-[#43B97B]/10 rounded-xl p-4">
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                    {displayExp.pattern}
                                </p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target Pain Point</h4>
                                <p className="text-sm text-[#333333] leading-relaxed">{displayExp.pain}</p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trigger Mechanism</h4>
                                <p className="text-sm text-[#333333] leading-relaxed">{displayExp.trigger}</p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Outreach Angle</h4>
                                <p className="text-sm text-[#333333] leading-relaxed italic border-l-2 border-gray-100 pl-3">
                                    &ldquo;{displayExp.outreach_angle}&rdquo;
                                </p>
                            </div>
                        </div>

                        {/* Wiza Filters */}
                        <div className="space-y-4 pt-4 border-t border-[#EEEEEE]">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sourcing Filters (Wiza)</h4>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleRefreshWizaFilters}
                                        disabled={isRefreshingFilters}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Regenerate filters based on current hypothesis"
                                    >
                                        <ArrowPathIcon className={cn("size-3.5", isRefreshingFilters && "animate-spin")} />
                                        {isRefreshingFilters ? 'Refreshing...' : 'Refresh'}
                                    </button>
                                    <button
                                        onClick={handleCopyWizaFilters}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all hover:shadow-sm"
                                    >
                                        <ClipboardDocumentIcon className="size-3.5" />
                                        {copiedToClipboard ? 'Copied!' : 'Copy JSON'}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Optimization Results */}
                            {optimizationResults && (
                                <div className="bg-gradient-to-r from-[#43B97B]/10 to-[#43B97B]/5 border border-[#43B97B]/20 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Optimization Results</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-2xl font-extrabold text-[#43B97B]">{optimizationResults.prospectCount.toLocaleString()}</p>
                                                <p className="text-xs font-medium text-gray-600">prospects found</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setViewMode('prospects')}
                                            className="size-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                                            title="View prospect details"
                                        >
                                            <MagnifyingGlassIcon className="size-6 text-[#43B97B]" />
                                        </button>
                                    </div>
                                    <div className="pt-2 border-t border-[#43B97B]/10">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Applied Filters</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {optimizationResults.appliedFilters.map((filter, i) => (
                                                <Badge key={i} variant="secondary" className="bg-white/90 border-[#43B97B]/20 text-gray-700 text-[10px] font-medium px-2 py-0.5">
                                                    {filter.replace(/_/g, ' ')}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {filterRefreshError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                                    <strong>Error:</strong> {filterRefreshError}
                                </div>
                            )}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                                {displayExp.wiza_filters.job_title && displayExp.wiza_filters.job_title.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Job Titles</p>
                                        <div className="flex flex-wrap gap-2">
                                            {displayExp.wiza_filters.job_title.map((title, i) => (
                                                <Badge key={i} variant="secondary" className="bg-white border-gray-200 text-gray-600 font-normal">
                                                    {title.v}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {displayExp.wiza_filters.job_title_level && displayExp.wiza_filters.job_title_level.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Job Title Levels</p>
                                        <div className="flex flex-wrap gap-2">
                                            {displayExp.wiza_filters.job_title_level.map((level, i) => (
                                                <Badge key={i} variant="secondary" className="bg-white border-gray-200 text-gray-600 font-normal">
                                                    {level}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {displayExp.wiza_filters.company_industry && displayExp.wiza_filters.company_industry.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Industries</p>
                                        <div className="flex flex-wrap gap-2">
                                            {displayExp.wiza_filters.company_industry.map((industry, i) => (
                                                <Badge key={i} variant="secondary" className="bg-white border-gray-200 text-gray-600 font-normal">
                                                    {industry.v}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    {displayExp.wiza_filters.company_size && safeArray(displayExp.wiza_filters.company_size).length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Company Size</p>
                                            <p className="text-sm text-[#333333] font-medium">{safeArray(displayExp.wiza_filters.company_size).join(', ')}</p>
                                        </div>
                                    )}
                                    {displayExp.wiza_filters.revenue && safeArray(displayExp.wiza_filters.revenue).length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Revenue</p>
                                            <p className="text-sm text-[#333333] font-medium">{safeArray(displayExp.wiza_filters.revenue).join(', ')}</p>
                                        </div>
                                    )}
                                    {displayExp.wiza_filters.location && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                                            <p className="text-sm text-[#333333] font-medium">{displayExp.wiza_filters.location.v}</p>
                                        </div>
                                    )}
                                    {displayExp.wiza_filters.year_founded_start && displayExp.wiza_filters.year_founded_end && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Year Founded</p>
                                            <p className="text-sm text-[#333333] font-medium">{displayExp.wiza_filters.year_founded_start} - {displayExp.wiza_filters.year_founded_end}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Narrow ICP Section */}
                        <div className="space-y-4 pt-6 mt-6 border-t border-[#EEEEEE] bg-gradient-to-b from-[#43B97B]/5 to-transparent -mx-6 px-6 pb-6 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.02)]">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <AdjustmentsHorizontalIcon className="size-3.5" />
                                    Narrow Your ICP
                                </h4>
                                <Badge variant="outline" className="text-[10px] font-bold text-[#43B97B] border-[#43B97B]/20 bg-white shadow-sm px-2 py-0.5">
                                    AI Powered
                                </Badge>
                            </div>

                            <p className="text-xs text-gray-500 leading-relaxed">
                                If this experiment feels too broad, choose an area to focus on and let AI suggest a narrower hypothesis.
                            </p>

                            <div className="flex flex-col gap-3 pt-2">
                                <Select value={selectedFeedback} onValueChange={setSelectedFeedback}>
                                    <SelectTrigger className="w-full bg-white border-[#EEEEEE] h-9 rounded-md text-sm font-medium focus:ring-[#43B97B]/20 shadow-sm">
                                        <SelectValue placeholder="How can we narrow this?" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-[#EEEEEE] shadow-xl">
                                        {feedbackOptions.map(opt => (
                                            <SelectItem key={opt.id} value={opt.id} className="text-sm font-medium py-2.5">
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button
                                    onClick={handleRefine}
                                    disabled={!selectedFeedback || isRefining}
                                    className="w-full h-9 bg-[#43B97B] hover:bg-[#3CA66F] text-white rounded-md text-sm font-medium shadow-sm shadow-[#43B97B]/20 transition-all flex items-center justify-center gap-2 group/refine active:scale-[0.98] border-none"
                                >
                                    <SparklesIcon className="size-4 text-white group-hover:scale-110 transition-transform" />
                                    Refine with AI
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
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
                )}

                {activeTab === 'activity' && (
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
                                    <div key={i} className={cn(
                                        "flex gap-3",
                                        item.disabled ? "opacity-30" : "opacity-100"
                                    )}>
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
                )}
            </div>

            <RefineProposalDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                proposal={proposal}
                onApprove={handleApproveRefinement}
                isLoading={isRefining}
            />
        </div>
    )
}
