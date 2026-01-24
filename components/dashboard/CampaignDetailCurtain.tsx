"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Campaign, deleteCampaign, updateCampaign } from '@/app/actions/campaigns'
import { Lead, getLeads, updateLead, logLeadOutcome } from '@/app/actions/leads'
import { Experiment } from '@/app/actions/workspaces'
import { cn } from '@/lib/utils'
import {
    XMarkIcon,
    UserGroupIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    ChevronLeftIcon,
    ArrowPathIcon,
    PhoneIcon,
    MapPinIcon,
    BriefcaseIcon,
    GlobeAltIcon,
    EnvelopeIcon,
    BoltIcon,
    BuildingOfficeIcon,
    LinkIcon,
    MegaphoneIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    FunnelIcon,
    MagnifyingGlassCircleIcon,
    UserPlusIcon,
    CheckBadgeIcon,
    ArrowsUpDownIcon,
    PauseCircleIcon,
    TrashIcon,
    PencilSquareIcon,
    AdjustmentsHorizontalIcon,
    ChevronRightIcon,
    PlusIcon,
    RocketLaunchIcon,
    PlayIcon
} from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/20/solid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LeadCard } from './LeadCard'
import { toast } from 'sonner'

interface CampaignDetailCurtainProps {
    campaign: Campaign | null
    experiment: Experiment | null
    isOpen: boolean
    onClose: () => void
}

export function CampaignDetailCurtain({ campaign, experiment, isOpen, onClose }: CampaignDetailCurtainProps) {
    const [activeTab, setActiveTab] = useState<'activity' | 'leads' | 'settings'>('activity')
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isScaling, setIsScaling] = useState(false)
    const [localCampaign, setLocalCampaign] = useState<Campaign | null>(campaign)
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [initialDetailTab, setInitialDetailTab] = useState<'info' | 'outreach'>('info')

    useEffect(() => {
        if (campaign) {
            // Reset view when campaign changes
            setSelectedLead(null)
            setActiveTab('activity')

            setLocalCampaign(campaign)
            loadLeads(campaign.id)
        }
    }, [campaign?.id])

    const loadLeads = async (campaignId: string) => {
        setIsLoading(true)
        const data = await getLeads(campaignId)
        setLeads(data)
        setIsLoading(false)
    }

    const handleUpdateOutcome = async (leadId: string, outcome: Lead['outcome'], reason?: string) => {
        const { success } = await logLeadOutcome(leadId, outcome, reason)
        if (success) {
            setLeads(leads.map(l => l.id === leadId ? { ...l, outcome, outcome_reason: reason } : l))
        }
    }

    const handleScale = async () => {
        if (!campaign) return
        setIsScaling(true)

        // Simulate AI search delay
        await new Promise(resolve => setTimeout(resolve, 3000))

        const newLeads: Lead[] = [
            {
                id: `scale-${Date.now()}-1`,
                full_name: "Sarah Chen",
                job_title: "Head of Logistics",
                company: "Flow State",
                avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
                status: "found",
                outcome: "no_response",
                campaign_id: campaign.id,
                workspace_id: campaign.workspace_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: `scale-${Date.now()}-2`,
                full_name: "David Miller",
                job_title: "Operations Director",
                company: "FastTrack",
                avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop",
                status: "found",
                outcome: "no_response",
                campaign_id: campaign.id,
                workspace_id: campaign.workspace_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]

        setLeads(prev => [...prev, ...newLeads])
        setIsScaling(false)
    }

    const displayCampaign = campaign || localCampaign

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setSelectedLead(null)
                setActiveTab('activity')
            }, 500) // Wait for slide out animation
        }
    }, [isOpen])

    if (!displayCampaign) return null

    const tabs = [
        { id: 'activity', name: 'Activity', icon: ChartBarIcon },
        { id: 'leads', name: 'Lead List', icon: UserGroupIcon },
        { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
    ]

    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-[#EEEEEE] transition-all duration-500 ease-in-out flex flex-col overflow-hidden h-full",
                isOpen ? "w-[520px] opacity-100" : "w-0 opacity-0 border-none"
            )}
        >
            <div className="flex-1 overflow-y-auto bg-white flex flex-col h-full">
                {selectedLead ? (
                    <LeadDetailView
                        lead={selectedLead}
                        initialTab={initialDetailTab}
                        onBack={() => setSelectedLead(null)}
                    />
                ) : (
                    <>
                        <div className="p-6 pb-0 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#43B97B] uppercase tracking-wider mb-1">Campaign</span>
                                <h2 className="text-xl font-bold text-[#4A4A4A] tracking-tight">{displayCampaign.name}</h2>
                                {experiment && (
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Strategy: {experiment.name}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="size-8 flex items-center justify-center border border-[#EEEEEE] bg-white rounded-lg hover:bg-gray-50 transition-all"
                            >
                                <XMarkIcon className="size-4 text-[#333333]" />
                            </button>
                        </div>

                        <div className="px-6 flex items-center gap-6 border-b border-[#EEEEEE]">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
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
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#43B97B]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]/30">
                            {activeTab === 'activity' && (
                                <ActivityView campaign={displayCampaign} />
                            )}

                            {activeTab === 'leads' && (
                                <LeadsListView
                                    leads={leads}
                                    isLoading={isLoading}
                                    isScaling={isScaling}
                                    onScale={handleScale}
                                    onLeadClick={(lead) => {
                                        setInitialDetailTab('info');
                                        setSelectedLead(lead);
                                    }}
                                    onGenerateOutreach={(lead) => {
                                        setInitialDetailTab('outreach');
                                        setSelectedLead(lead);
                                    }}
                                    onUpdateOutcome={handleUpdateOutcome}
                                />
                            )}

                            {activeTab === 'settings' && (
                                <SettingsView
                                    campaign={localCampaign!}
                                    onUpdate={async (updates) => {
                                        await updateCampaign(localCampaign!.id, updates)
                                        setLocalCampaign({ ...localCampaign!, ...updates })
                                    }}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

function ActivityView({ campaign }: { campaign: Campaign }) {
    const activitySteps = [
        { id: 'searching', title: 'Searching for leads', status: 'completed', description: 'Matched against strategy criteria' },
        { id: 'found', title: '124 Leads Found', status: 'completed', description: 'High-intent profiles identified' },
        { id: 'enriched', title: 'Conducting deep lead enrichment', status: 'current', description: 'Analyzing experience and recent activities' },
        { id: 'prioritizing', title: 'Prioritizing leads by warm behavior', status: 'pending', description: 'Scoring based on relevance' },
        { id: 'angles', title: 'Generating outreach angles', status: 'pending', description: 'Crafting personalized hooks' }
    ]

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Quick Summary */}
            <div className="bg-white border border-[#EEEEEE] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#43B97B]" />
                <div className="flex items-center gap-4 mb-4">
                    <div className="size-10 bg-[#43B97B]/10 rounded-xl flex items-center justify-center shrink-0">
                        <SparklesIcon className="size-6 text-[#43B97B]" />
                    </div>
                    <div>
                        <h4 className="font-bold text-[#333333]">Campaign Summary</h4>
                        <p className="text-xs text-gray-500 font-medium">Auto-pilot active • Last update 2m ago</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100/50">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leads found</p>
                        <p className="text-lg font-bold text-[#333333]">124</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100/50">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Researched</p>
                        <p className="text-lg font-bold text-[#43B97B]">82%</p>
                    </div>
                </div>
            </div>

            {/* Stepper Feed */}
            <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Campaign Activity</h4>
                <div className="relative flex flex-col gap-0 px-2">
                    {activitySteps.map((step, index) => {
                        const isLast = index === activitySteps.length - 1
                        const isCompleted = step.status === 'completed'
                        const isCurrent = step.status === 'current'

                        return (
                            <div key={step.id} className="relative flex gap-6 pb-8 group">
                                {!isLast && (
                                    <div className={cn(
                                        "absolute left-[7px] top-[24px] bottom-0 w-[2px] h-[calc(100%-20px)]",
                                        isCompleted ? "bg-[#43B97B]" : "border-l-2 border-dashed border-gray-200"
                                    )} />
                                )}

                                <div className={cn(
                                    "relative z-10 size-4 mt-1 rounded-full flex items-center justify-center shrink-0",
                                    isCompleted ? "bg-[#43B97B] text-white" : isCurrent ? "bg-white border-2 border-[#43B97B]" : "bg-white border-2 border-gray-200"
                                )}>
                                    {isCompleted ? <CheckIcon className="size-3" /> : isCurrent ? <div className="size-1.5 bg-[#43B97B] rounded-full animate-pulse" /> : null}
                                </div>

                                <div className="flex flex-col min-h-[20px]">
                                    <span className={cn(
                                        "text-sm font-bold leading-tight",
                                        isCurrent ? "text-[#333333]" : isCompleted ? "text-gray-600" : "text-gray-400"
                                    )}>
                                        {step.title}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1 font-medium italic">
                                        {step.description}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function LeadsListView({ leads, isLoading, isScaling, onScale, onLeadClick, onGenerateOutreach, onUpdateOutcome }: {
    leads: Lead[],
    isLoading: boolean,
    isScaling: boolean,
    onScale: () => void,
    onLeadClick: (lead: Lead) => void,
    onGenerateOutreach: (lead: Lead) => void,
    onUpdateOutcome: (leadId: string, outcome: Lead['outcome'], reason?: string) => void
}) {
    const [sortBy, setSortBy] = useState<'name' | 'relevance' | 'activity'>('relevance')
    const [order, setOrder] = useState<'asc' | 'desc'>('desc')

    const sortedLeads = [...leads].sort((a, b) => {
        let comparison = 0
        if (sortBy === 'name') {
            comparison = a.full_name.localeCompare(b.full_name)
        } else if (sortBy === 'relevance') {
            // High intensity match logic (simulation)
            comparison = (a.job_title?.length || 0) - (b.job_title?.length || 0)
        } else if (sortBy === 'activity') {
            comparison = new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
        }
        return order === 'asc' ? comparison : -comparison
    })

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            {/* Sorting Header */}
            <div className="px-6 py-2 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-[#EEEEEE]">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent border-none p-0 text-[11px] font-bold text-[#333333] focus:ring-0 cursor-pointer hover:text-[#43B97B] transition-colors"
                    >
                        <option value="relevance">Relevance</option>
                        <option value="name">Name</option>
                        <option value="activity">Recent</option>
                    </select>
                </div>
                <button
                    onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                    className="size-6 flex items-center justify-center border border-[#EEEEEE] bg-white rounded-md hover:bg-gray-50 transition-all text-gray-400 hover:text-[#333333]"
                >
                    <ArrowsUpDownIcon className="size-3" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-px pb-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <ArrowPathIcon className="size-8 text-gray-200 animate-spin" />
                    </div>
                ) : sortedLeads.length > 0 ? (
                    <>
                        {sortedLeads.map((lead) => (
                            <LeadCard
                                key={lead.id}
                                lead={lead}
                                onUpdateOutcome={async (outcome, reason) => await onUpdateOutcome(lead.id, outcome, reason)}
                                onClick={() => onLeadClick(lead)}
                                onGenerateOutreach={() => onGenerateOutreach(lead)}
                            />
                        ))}
                        {isScaling && (
                            <div className="space-y-px">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4 p-4 mx-2">
                                        <div className="size-11 rounded-full bg-gray-100 animate-pulse shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-100 animate-pulse rounded w-1/3" />
                                            <div className="h-3 bg-gray-50 animate-pulse rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 space-y-4">
                        <div className="size-16 bg-white rounded-full flex items-center justify-center mx-auto border border-gray-100">
                            <UserGroupIcon className="size-8 text-gray-200" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#333333]">No leads found yet</p>
                            <p className="text-sm text-gray-500 max-w-[200px] mx-auto mt-1">Found leads will appear here in cards.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Button Container */}
            <div className="p-6 pt-4 border-t border-[#EEEEEE] bg-white">
                <Button
                    onClick={onScale}
                    disabled={isScaling}
                    className="w-full bg-[#43B97B] hover:bg-[#3CA66F] text-white h-11 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                    {isScaling ? (
                        <ArrowPathIcon className="size-5 animate-spin" />
                    ) : (
                        <RocketLaunchIcon className="size-5" />
                    )}
                    {isScaling ? "Scaling Campaign..." : "Scale Campaign"}
                </Button>
                <p className="text-[11px] text-gray-400 text-center mt-3 font-medium">
                    This will initialize a new search based on this strategy criteria.
                </p>
            </div>
        </div>
    )
}

function HoldToDeleteButton({ onDelete }: { onDelete: () => void }) {
    const [progress, setProgress] = useState(0)
    const [isHolding, setIsHolding] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const startTimeRef = useRef<number>(0)

    const startHolding = () => {
        setIsHolding(true)
        startTimeRef.current = Date.now()

        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current
            const newProgress = Math.min((elapsed / 5000) * 100, 100)
            setProgress(newProgress)

            if (newProgress >= 100) {
                if (timerRef.current) clearInterval(timerRef.current)
                onDelete()
            }
        }, 50)
    }

    const stopHolding = () => {
        setIsHolding(false)
        if (timerRef.current) clearInterval(timerRef.current)
        setProgress(0)
    }

    return (
        <button
            onPointerDown={startHolding}
            onPointerUp={stopHolding}
            onPointerLeave={stopHolding}
            className="w-full relative h-14 bg-gray-50 rounded-2xl overflow-hidden border border-[#EEEEEE] group transition-all active:scale-[0.98]"
        >
            {/* Progress Fill */}
            <div
                className="absolute inset-y-0 left-0 bg-red-50 transition-all duration-75 ease-linear pointer-events-none"
                style={{ width: `${progress}%` }}
            />

            <div className="relative z-10 flex items-center justify-center gap-3 w-full h-full px-6">
                <TrashIcon className={cn("size-5 transition-colors", progress > 0 ? "text-red-500" : "text-gray-400 group-hover:text-red-500")} />
                <span className={cn(
                    "font-bold text-sm tracking-tight transition-colors",
                    progress > 0 ? "text-red-600" : "text-[#333333]"
                )}>
                    {isHolding ? 'Holding to Delete...' : 'Hold to Delete Campaign'}
                </span>
            </div>

            {/* Hint text */}
            {isHolding && (
                <div className="absolute top-1 right-3 text-[9px] font-bold text-red-300 uppercase tracking-widest animate-pulse">
                    Keep holding
                </div>
            )}
        </button>
    )
}

function SettingsView({ campaign, onUpdate }: { campaign: Campaign, onUpdate: (updates: Partial<Campaign>) => void }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [name, setName] = useState(campaign.name)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteCampaign(campaign.id)
            toast.success("Campaign deleted successfully")
            window.location.reload() // Or handle via navigation
        } catch (err) {
            toast.error("Failed to delete campaign")
            setIsDeleting(false)
        }
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500 max-w-2xl mx-auto pb-24">
            {/* Campaign Identity */}
            <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Campaign Identity</h4>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500">Campaign Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => onUpdate({ name })}
                            className="bg-white border-[#EEEEEE] focus-visible:ring-[#43B97B] rounded-xl h-11 font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Campaign Schedule/Status */}
            <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">General Settings</h4>
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-6 bg-white border border-[#EEEEEE] rounded-2xl hover:border-[#43B97B] transition-all group">
                        <div className="flex items-center gap-4">
                            <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", campaign.status === 'active' ? "bg-[#43B97B]/10 text-[#43B97B]" : "bg-amber-50 text-amber-600")}>
                                {campaign.status === 'active' ? <PauseCircleIcon className="size-5" /> : <PlayIcon className="size-5" />}
                            </div>
                            <div>
                                <p className="font-bold text-[#333333] tracking-tight">{campaign.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}</p>
                                <p className="text-xs text-gray-400 font-medium">Temporarily stop reaching out to leads</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onUpdate({ status: campaign.status === 'active' ? 'paused' : 'active' })}
                            className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                campaign.status === 'active' ? "bg-[#43B97B]" : "bg-gray-200"
                            )}
                        >
                            <span className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                campaign.status === 'active' ? "translate-x-5" : "translate-x-0"
                            )} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-white border border-[#EEEEEE] rounded-2xl hover:border-[#43B97B] transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#43B97B]/10 group-hover:text-[#43B97B]">
                                <AdjustmentsHorizontalIcon className="size-5" />
                            </div>
                            <div>
                                <p className="font-bold text-[#333333] tracking-tight">Lead Discovery Rate</p>
                                <p className="text-xs text-gray-400 font-medium">Control how fast new leads are found</p>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-[#333333]">30 / day</span>
                    </div>
                </div>
            </div>

            {/* Strategy Monitoring */}
            <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Strategy Status</h4>
                <div className="bg-[#43B97B]/5 rounded-2xl p-6 border border-[#43B97B]/10">
                    <div className="flex items-center gap-3 mb-4">
                        <MagnifyingGlassCircleIcon className="size-5 text-[#43B97B]" />
                        <h5 className="font-bold text-[#333333] text-sm uppercase tracking-wider">Auto-Pilot Monitoring</h5>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Status</span>
                            <Badge className="bg-[#43B97B] text-white border-none text-[10px] font-bold px-2">ACTIVE</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Daily Limit</span>
                            <span className="text-[#333333] font-bold">50 leads</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-6 pt-4">
                <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Danger Zone</h4>
                <div className="relative">
                    {isDeleting ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <ArrowPathIcon className="size-8 text-[#43B97B] animate-spin" />
                            <p className="text-sm font-bold text-[#333333]">Deleting Campaign...</p>
                        </div>
                    ) : (
                        <HoldToDeleteButton onDelete={handleDelete} />
                    )}
                </div>
            </div>
        </div>
    )
}

function LeadDetailView({ lead: initialLead, initialTab = 'info', onBack }: { lead: Lead, initialTab?: 'info' | 'outreach' | 'analysis', onBack: () => void }) {
    const [selectedTab, setSelectedTab] = useState<'info' | 'analysis' | 'outreach'>(initialTab)
    const [outreachConfig, setOutreachConfig] = useState({ format: 'linkedin', isFollowUp: false })
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedOutreach, setGeneratedOutreach] = useState<string | null>(null)

    // Add dummy data for all fields to ensure they are visible for review
    const lead: Lead = {
        ...initialLead,
        enrichment_data: {
            summary: initialLead.enrichment_data?.summary || "Strategic executive with over 12 years of experience in logistics and supply chain optimization. Currently focused on digital transformation and fleet automation at ScaleASAP. Known for reducing operational overhead by 25% through innovative SaaS deployments.",
            location: initialLead.enrichment_data?.location || "San Francisco, CA",
            signals: initialLead.enrichment_data?.signals?.length ? initialLead.enrichment_data.signals : [
                {
                    headline: "Series B Funding Round",
                    description: "ScaleASAP recently secured $45M in Series B funding to accelerate their AI-driven logistics platform. This indicates a massive budget for operational scaling and technology integration.",
                    citations: [
                        {
                            source_name: "TechCrunch",
                            source_url: "https://techcrunch.com",
                            source_logo_url: "https://www.google.com/s2/favicons?domain=techcrunch.com&sz=128"
                        }
                    ]
                },
                {
                    headline: "Aggressive Hiring in Ops",
                    description: "Public listings show 15+ open roles in operations and fleet management, suggesting they are hitting a scale point where your solution becomes critical for maintaining efficiency.",
                    citations: [
                        {
                            source_name: "LinkedIn",
                            source_url: "https://linkedin.com",
                            source_logo_url: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=128"
                        }
                    ]
                }
            ],
            experience: initialLead.enrichment_data?.experience?.length ? initialLead.enrichment_data.experience : [
                {
                    company_name: "Logistics Flow",
                    title: "VP of Operations",
                    time_from: "2018",
                    time_to: "Present",
                    company_logo_url: "https://www.google.com/s2/favicons?domain=fedex.com&sz=128"
                },
                {
                    company_name: "Swift Courier",
                    title: "Operations Manager",
                    time_from: "2012",
                    time_to: "2018",
                    company_logo_url: "https://www.google.com/s2/favicons?domain=ups.com&sz=128"
                }
            ]
        },
        outbound_message: initialLead.outbound_message || "Hi " + initialLead.full_name.split(' ')[0] + ", I saw that Logistics Flow is scaling its regional operations following the Series B. Given your focus on fleet automation, I thought you'd find our approach to reducing driver churn particularly relevant."
    }

    const enrichment = lead.enrichment_data

    return (
        <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-500">
            {/* Standard Profile Header from reference image */}
            <div className="p-6 pb-4 flex flex-col items-center">
                <div className="w-full flex justify-start mb-4">
                    <button
                        onClick={onBack}
                        className="size-8 flex items-center justify-center border border-[#EEEEEE] bg-white rounded-lg hover:bg-gray-50 transition-all"
                    >
                        <ChevronLeftIcon className="size-4 text-[#333333]" />
                    </button>
                </div>

                <div className="size-20 rounded-full border-4 border-[#43B97B]/10 p-1 mb-3">
                    {lead.avatar_url ? (
                        <img src={lead.avatar_url} alt={lead.full_name} className="size-full rounded-full object-cover" />
                    ) : (
                        <div className="size-full rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-3xl font-bold text-gray-400">{lead.full_name.charAt(0)}</span>
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold text-[#333333] tracking-tight">{lead.full_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <BuildingOfficeIcon className="size-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-600">Google</span>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-none bg-gray-50 text-gray-400 ml-2">
                        Tier 1
                    </Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-6 w-full">
                    <div className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="size-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                            <EnvelopeIcon className="size-4 text-gray-400" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="size-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                            <PhoneIcon className="size-4 text-gray-400" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="size-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                            <LinkIcon className="size-4 text-gray-400" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LinkedIn</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="size-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                            <span className="text-sm font-bold text-gray-400">X</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">X</span>
                    </div>
                </div>

                {selectedTab !== 'outreach' && (
                    <Button
                        className="w-full mt-6 bg-[#43B97B] hover:bg-[#3CA66F] text-white"
                        onClick={() => setSelectedTab('outreach')}
                    >
                        Generate outreach
                    </Button>
                )}

                <div className="flex items-center gap-1.5 mt-3">
                    <div className="size-1.5 bg-[#43B97B] rounded-full" />
                    <span className="text-[11px] font-medium text-gray-500">Last activity: 2 Jan 2026 at 09:00 AM</span>
                </div>
            </div>

            {/* Sub-tabs for Lead Detail */}
            <div className="flex border-b border-[#EEEEEE] px-8">
                <button
                    onClick={() => setSelectedTab('info')}
                    className={cn(
                        "py-3 text-sm font-bold transition-all relative px-4",
                        selectedTab === 'info' ? "text-[#333333]" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Lead info
                    {selectedTab === 'info' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#333333]" />
                    )}
                </button>
                <button
                    onClick={() => setSelectedTab('analysis')}
                    className={cn(
                        "py-3 text-sm font-bold transition-all relative px-4 ml-4",
                        selectedTab === 'analysis' ? "text-[#333333]" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Analysis
                    {selectedTab === 'analysis' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#333333]" />
                    )}
                </button>
                <button
                    onClick={() => setSelectedTab('outreach')}
                    className={cn(
                        "py-3 text-sm font-bold transition-all relative px-4 ml-4",
                        selectedTab === 'outreach' ? "text-[#333333]" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    Outreach Message
                    {selectedTab === 'outreach' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#333333]" />
                    )}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-6">
                {selectedTab === 'info' ? (
                    <div className="space-y-10">
                        {/* About/Summary */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">About</h4>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                {enrichment?.summary}
                            </p>
                        </div>

                        {/* Experience - LinkedIn Style */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience</h4>
                            <div className="space-y-8">
                                {enrichment?.experience?.map((exp, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="size-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                                            <BriefcaseIcon className="size-5 text-gray-300" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-[#333333] text-sm leading-tight">{exp.title}</h5>
                                            <p className="text-xs text-gray-600 font-medium mt-0.5">{exp.company_name}</p>
                                            <p className="text-[11px] text-gray-400 mt-1 font-medium italic">{exp.time_from} — {exp.time_to}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education Placeholder */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Education</h4>
                            <div className="flex gap-4">
                                <div className="size-12 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                                    <GlobeAltIcon className="size-5 text-gray-300" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-[#333333] text-sm leading-tight">University of California, Berkeley</h5>
                                    <p className="text-xs text-gray-600 font-medium mt-0.5">Bachelor of Science, Computer Science</p>
                                    <p className="text-[11px] text-gray-400 mt-1 font-medium italic">2008 — 2012</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : selectedTab === 'analysis' ? (
                    <div className="space-y-8">
                        {/* Analysis Content */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Strategic Why</h4>
                            <div className="p-6 bg-[#43B97B]/5 border border-[#43B97B]/10 rounded-2xl relative overflow-hidden">
                                <SparklesIcon className="absolute top-4 right-4 size-10 text-[#43B97B]/5" />
                                <p className="text-[15px] text-[#333333] leading-relaxed font-bold italic">
                                    "Logistics Flow's recent Series B indicates they are entering a heavy growth phase where driver attrition and route efficiency will hit scaling limits. Jerome's focus on digital transformation makes him the perfect entry point for an AI-led optimization pitch."
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Key Signals</h4>
                            <div className="space-y-3">
                                {enrichment?.signals?.map((signal, idx) => (
                                    <div key={idx} className="bg-white border border-[#EEEEEE] rounded-2xl p-6 hover:border-[#43B97B] transition-all group flex flex-col cursor-default">
                                        <div className="space-y-2">
                                            <h5 className="font-bold text-[#333333] text-base tracking-tight">{signal.headline}</h5>
                                            <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                                                {signal.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Configuration</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500">Message Format</label>
                                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                                        <button
                                            onClick={() => setOutreachConfig(prev => ({ ...prev, format: 'linkedin' }))}
                                            className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", outreachConfig.format === 'linkedin' ? "bg-white text-[#333333] shadow-sm" : "text-gray-400")}
                                        >
                                            LinkedIn
                                        </button>
                                        <button
                                            onClick={() => setOutreachConfig(prev => ({ ...prev, format: 'email' }))}
                                            className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", outreachConfig.format === 'email' ? "bg-white text-[#333333] shadow-sm" : "text-gray-400")}
                                        >
                                            Email
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500">Is Follow-up?</label>
                                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                                        <button
                                            onClick={() => setOutreachConfig(prev => ({ ...prev, isFollowUp: false }))}
                                            className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", !outreachConfig.isFollowUp ? "bg-white text-[#333333] shadow-sm" : "text-gray-400")}
                                        >
                                            No
                                        </button>
                                        <button
                                            onClick={() => setOutreachConfig(prev => ({ ...prev, isFollowUp: true }))}
                                            className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", outreachConfig.isFollowUp ? "bg-white text-[#333333] shadow-sm" : "text-gray-400")}
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-[#43B97B] hover:bg-[#3CA66F] text-white h-11 font-bold rounded-xl"
                                disabled={isGenerating}
                                onClick={async () => {
                                    setIsGenerating(true)
                                    try {
                                        const { generateOutreachAction } = await import('@/app/actions/leads')
                                        const result = await generateOutreachAction(lead, outreachConfig)
                                        setGeneratedOutreach(result.followUpDM || result.connectionRequest || '')
                                    } catch (err) {
                                        setGeneratedOutreach("ScaleASAP is currently analyzing the best approach for this prospect. Please try again in a moment.")
                                    }
                                    setIsGenerating(false)
                                }}
                            >
                                {isGenerating ? (
                                    <>
                                        <ArrowPathIcon className="size-4 animate-spin mr-2" />
                                        Generating...
                                    </>
                                ) : "Generate Personalized Message"}
                            </Button>
                        </div>

                        {(generatedOutreach || isGenerating) && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Drafted Outreach</h4>
                                <div className="p-8 bg-gray-900 rounded-3xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6">
                                        <SparklesIcon className="size-12 text-white/5" />
                                    </div>
                                    {isGenerating ? (
                                        <div className="space-y-3">
                                            <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
                                            <div className="h-4 bg-white/5 rounded-full w-1/2 animate-pulse" />
                                            <div className="h-4 bg-white/5 rounded-full w-5/6 animate-pulse" />
                                        </div>
                                    ) : (
                                        <p className="text-[15px] text-white/90 leading-relaxed font-medium italic relative z-10 whitespace-pre-wrap">
                                            "{generatedOutreach}"
                                        </p>
                                    )}
                                    <div className="mt-8 flex justify-end gap-3 relative z-10">
                                        <button className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors px-4 py-2 border border-white/10 rounded-lg">
                                            Edit
                                        </button>
                                        <button className="text-[10px] font-bold text-[#43B97B] hover:text-white hover:bg-[#43B97B] uppercase tracking-widest transition-all px-4 py-2 border border-[#43B97B]/30 rounded-lg">
                                            Copy message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
