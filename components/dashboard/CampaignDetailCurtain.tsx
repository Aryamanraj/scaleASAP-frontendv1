"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Campaign, deleteCampaign, updateCampaign } from '@/app/actions/campaigns'
import { Lead, getLeads, updateLead, logLeadOutcome } from '@/app/actions/leads'
import { Experiment } from '@/app/actions/workspaces'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LeadCard } from './LeadCard'
import { LeadProfileUI } from './LeadProfileUI'
import { toast } from 'sonner'
import { Tabs } from "@/components/dashboard/profile/tabs";
import { ArrowLeft, HelpCircle, Rocket, BarChart2, Users, Settings as SettingsIcon, Zap, MessageSquare, Plus, Trash2, Edit3, Check, MoreHorizontal, Play, ExternalLink, RefreshCw } from "lucide-react";
import { Textarea } from '@/components/ui/textarea'
import {
    CheckIcon,
    ArrowsUpDownIcon,
    PauseCircleIcon,
    PlayIcon
} from '@heroicons/react/20/solid'

interface CampaignDetailCurtainProps {
    campaign: Campaign | null
    experiment: Experiment | null
    isOpen: boolean
    onClose: () => void
}

export function CampaignDetailCurtain({ campaign, experiment, isOpen, onClose }: CampaignDetailCurtainProps) {
    const [activeTab, setActiveTab] = useState('activity')
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isScaling, setIsScaling] = useState(false)
    const [localCampaign, setLocalCampaign] = useState<Campaign | null>(campaign)
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [initialDetailTab, setInitialDetailTab] = useState<'analysis' | 'overview' | 'outreach'>('analysis')

    // Helper to convert hex to rgba with opacity
    const getDataUrlColor = (hex: string, opacity: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    useEffect(() => {
        if (campaign) {
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
        await new Promise(resolve => setTimeout(resolve, 3000))
        const newLeads: Lead[] = [
            {
                id: `scale-${Date.now()}-1`,
                full_name: "Sarah Chen",
                job_title: "Head of Logistics",
                company: "Flow State",
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
            }, 500)
        }
    }, [isOpen])

    if (!displayCampaign) return null

    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-[#EEEEEE] transition-all duration-500 ease-in-out flex flex-col overflow-hidden h-full relative",
                isOpen ? "w-[480px] opacity-100" : "w-0 opacity-0 border-none"
            )}
        >
            <div className="flex-1 overflow-y-auto bg-white flex flex-col h-full no-scrollbar">
                {selectedLead ? (
                    <LeadDetailView
                        lead={selectedLead}
                        onBack={() => setSelectedLead(null)}
                    />
                ) : (
                    <>
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
                                    <span className="text-[10px] font-black text-[#43B97B] uppercase tracking-widest">Active Campaign</span>
                                    <h2 className="text-2xl font-bold text-[#434343] tracking-tight leading-tight">
                                        {displayCampaign.name}
                                    </h2>
                                </div>
                                <div className="bg-[#43B97B]/10 px-2 py-1 rounded-md text-[10px] font-bold text-[#43B97B] tracking-widest h-fit mt-1 whitespace-nowrap">
                                    ACTIVE
                                </div>
                            </div>
                            <div className="text-[13px] text-[#434343] font-medium font-geist mt-1">
                                Autonomous Outreach • <span className="font-bold text-[#10B981]">{leads.length} Leads Found</span>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="mt-6 border-b border-[#EEEEEE]">
                            <div className="px-6">
                                <Tabs
                                    tabs={[
                                        { id: "activity", label: "Activity" },
                                        { id: "leads", label: "Lead List" },
                                        { id: "settings", label: "Settings" },
                                    ]}
                                    activeTab={activeTab}
                                    onTabChange={(id) => setActiveTab(id as any)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0">
                            {activeTab === 'activity' && (
                                <ActivityView outcomes={leads.filter(l => l.outcome).map(l => ({ id: l.id, lead_name: l.full_name, outcome: l.outcome!, date: l.updated_at }))} />
                            )}
                            {activeTab === 'leads' && (
                                <LeadsListView
                                    leads={leads}
                                    isLoading={isLoading}
                                    isScaling={isScaling}
                                    onScale={handleScale}
                                    onLeadClick={(lead) => {
                                        setInitialDetailTab('analysis');
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
                                    campaign={displayCampaign}
                                    onUpdate={(updates) => setLocalCampaign(prev => prev ? { ...prev, ...updates } : null)}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>

            {!selectedLead && (activeTab === 'activity' || activeTab === 'leads') && (
                <div className="p-6 pt-0 border-t border-[#EEEEEE] bg-white">
                    <Button
                        onClick={handleScale}
                        disabled={isScaling}
                        className="w-full bg-[#43B97B] hover:bg-[#3ca86d] text-white h-12 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#43B97B]/10 hover:scale-[1.02] active:scale-95 border-none mt-6"
                    >
                        {isScaling ? <RefreshCw size={20} className="animate-spin" /> : <Rocket size={20} fill="currentColor" />}
                        {isScaling ? "SCALING..." : "SCALE CAMPAIGN"}
                    </Button>
                </div>
            )}
        </div>
    )
}

function ActivityView({ outcomes }: { outcomes: { id: string, lead_name: string, outcome: string, date: string }[] }) {
    const activitySteps = [
        { id: 'searching', title: 'Searching for leads', status: 'completed', description: 'Matched against strategy criteria' },
        { id: 'found', title: '124 Leads Found', status: 'completed', description: 'High-intent profiles identified' },
        { id: 'enriched', title: 'Conducting deep lead enrichment', status: 'current', description: 'Analyzing experience and recent activities' },
        { id: 'prioritizing', title: 'Prioritizing leads by warm behavior', status: 'pending', description: 'Scoring based on relevance' },
        { id: 'angles', title: 'Generating outreach angles', status: 'pending', description: 'Crafting personalized hooks' }
    ]

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <div className="bg-white border border-[#EEEEEE] rounded-2xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#43B97B]" />
                <div className="flex items-center gap-4 mb-4">
                    <div className="size-10 bg-[#43B97B]/10 rounded-xl flex items-center justify-center shrink-0">
                        <Zap size={20} className="text-[#43B97B]" fill="#43B97B" />
                    </div>
                    <div>
                        <h4 className="font-bold text-[#333333]">Campaign Summary</h4>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Auto-pilot active</p>
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
                                    {isCompleted ? <Check size={10} strokeWidth={3} /> : isCurrent ? <div className="size-1.5 bg-[#43B97B] rounded-full animate-pulse" /> : null}
                                </div>
                                <div className="flex flex-col min-h-[20px]">
                                    <span className={cn(
                                        "text-sm font-bold leading-tight uppercase tracking-tight",
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
        if (sortBy === 'name') comparison = a.full_name.localeCompare(b.full_name)
        else if (sortBy === 'relevance') comparison = (a.job_title?.length || 0) - (b.job_title?.length || 0)
        else if (sortBy === 'activity') comparison = new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
        return order === 'asc' ? comparison : -comparison
    })

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
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

            <div className="flex-1 overflow-y-auto space-y-px">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCw className="size-8 text-gray-200 animate-spin" />
                    </div>
                ) : (
                    sortedLeads.map((lead) => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            onUpdateOutcome={async (outcome, reason) => await onUpdateOutcome(lead.id, outcome, reason)}
                            onClick={() => onLeadClick(lead)}
                            onGenerateOutreach={() => onGenerateOutreach(lead)}
                        />
                    ))
                )}
            </div>
        </div>
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
            window.location.reload()
        } catch (err) {
            toast.error("Failed to delete campaign")
            setIsDeleting(false)
        }
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500 max-w-2xl mx-auto pb-24">
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

            <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">General Settings</h4>
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-6 bg-white border border-[#EEEEEE] rounded-2xl hover:border-[#43B97B] transition-all group shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", campaign.status === 'active' ? "bg-[#43B97B]/10 text-[#43B97B]" : "bg-amber-50 text-amber-600")}>
                                {campaign.status === 'active' ? <PauseCircleIcon className="size-5" /> : <PlayIcon className="size-5" />}
                            </div>
                            <div>
                                <p className="font-bold text-[#333333] tracking-tight">{campaign.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}</p>
                                <p className="text-xs text-gray-400 font-medium italic">Auto-pilot reachout status</p>
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
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Danger Zone</h4>
                <div className="relative">
                    {isDeleting ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <RefreshCw className="size-8 text-[#43B97B] animate-spin" />
                            <p className="text-sm font-bold text-[#333333] uppercase tracking-widest">DELETING...</p>
                        </div>
                    ) : (
                        <HoldToDeleteButton onDelete={handleDelete} />
                    )}
                </div>
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
            className="w-full relative h-14 bg-gray-50 rounded-2xl overflow-hidden border border-[#EEEEEE] group transition-all active:scale-[0.98] shadow-sm"
        >
            <div className="absolute inset-y-0 left-0 bg-red-50 transition-all duration-75 ease-linear pointer-events-none" style={{ width: `${progress}%` }} />
            <div className="relative z-10 flex items-center justify-center gap-3 w-full h-full px-6">
                <Trash2 className={cn("size-5 transition-colors", progress > 0 ? "text-red-500" : "text-gray-400 group-hover:text-red-500")} />
                <span className={cn("font-bold text-sm tracking-tight uppercase tracking-widest transition-colors", progress > 0 ? "text-red-600" : "text-[#333333]")}>
                    {isHolding ? 'Holding...' : 'Hold to Delete'}
                </span>
            </div>
        </button>
    )
}

function LeadDetailView({ lead, onBack }: { lead: Lead, onBack: () => void }) {
    return <LeadProfileUI lead={lead} onBack={onBack} />
}
