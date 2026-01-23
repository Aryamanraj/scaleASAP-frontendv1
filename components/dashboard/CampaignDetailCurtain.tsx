"use client"

import React, { useState, useEffect } from 'react'
import { Campaign } from '@/app/actions/campaigns'
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
    EnvelopeIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { LeadCard } from './LeadCard'

interface CampaignDetailCurtainProps {
    campaign: Campaign | null
    experiment: Experiment | null
    isOpen: boolean
    onClose: () => void
}

export function CampaignDetailCurtain({ campaign, experiment, isOpen, onClose }: CampaignDetailCurtainProps) {
    const [activeTab, setActiveTab] = useState<'leads' | 'finder' | 'drafting'>('leads')
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [localCampaign, setLocalCampaign] = useState<Campaign | null>(campaign)
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

    useEffect(() => {
        if (campaign) {
            setLocalCampaign(campaign)
            loadLeads(campaign.id)
        }
    }, [campaign])

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

    const displayCampaign = campaign || localCampaign

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setSelectedLead(null)
                setActiveTab('leads')
            }, 500) // Wait for slide out animation
        }
    }, [isOpen])

    if (!displayCampaign) return null

    const tabs = [
        { id: 'leads', name: 'Leads', icon: UserGroupIcon },
        { id: 'finder', name: 'Finder', icon: MagnifyingGlassIcon },
        { id: 'drafting', name: 'Drafting', icon: SparklesIcon },
    ]

    return (
        <div
            className={cn(
                "bg-white rounded-2xl border border-[#EEEEEE] shadow-sm transition-all duration-500 ease-in-out flex flex-col overflow-hidden h-full",
                isOpen ? "w-[520px] opacity-100" : "w-0 opacity-0 border-none"
            )}
        >
            <div className="flex-1 overflow-y-auto bg-white flex flex-col h-full">
                {selectedLead ? (
                    <LeadDetailView
                        lead={selectedLead}
                        onBack={() => setSelectedLead(null)}
                    />
                ) : (
                    <>
                        <div className="p-6 pb-2 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Campaign</span>
                                <h2 className="text-lg font-bold text-[#333333] tracking-tight">{displayCampaign.name}</h2>
                                {experiment && (
                                    <p className="text-xs text-gray-500 mt-0.5">Strategy: {experiment.name}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="size-8 flex items-center justify-center border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <XMarkIcon className="size-4 text-gray-400" />
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
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#43B97B] rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 p-6 bg-[#F9FAFB]/30">
                            {activeTab === 'leads' && (
                                <div className="space-y-4">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <ArrowPathIcon className="size-8 text-gray-200 animate-spin" />
                                        </div>
                                    ) : leads.length > 0 ? (
                                        leads.map((lead) => (
                                            <LeadCard
                                                key={lead.id}
                                                lead={lead}
                                                onUpdateOutcome={(outcome, reason) => handleUpdateOutcome(lead.id, outcome, reason)}
                                                onClick={() => setSelectedLead(lead)}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-12 space-y-4">
                                            <div className="size-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
                                                <UserGroupIcon className="size-8 text-gray-200" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#333333]">No leads found yet</p>
                                                <p className="text-sm text-gray-500 max-w-[200px] mx-auto mt-1">Use the Finder tab to start building your lead list.</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => setActiveTab('finder')}
                                                className="text-[#43B97B] border-[#43B97B]/20 hover:bg-[#43B97B]/5 font-bold"
                                            >
                                                Go to Finder
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'finder' && (
                                <div className="space-y-6">
                                    <div className="bg-white border border-[#EEEEEE] rounded-2xl p-6 shadow-sm space-y-4">
                                        <div className="size-12 bg-[#43B97B]/10 rounded-xl flex items-center justify-center">
                                            <MagnifyingGlassIcon className="size-6 text-[#43B97B]" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-[#333333]">Lead Enrichment & Search</h3>
                                            <p className="text-sm text-gray-500">
                                                We use the targeting filters defined in the experiment to find high-intent leads on Wiza.
                                            </p>
                                        </div>
                                        <Button className="w-full bg-[#43B97B] hover:bg-[#38a86e] h-10 font-semibold rounded-md shadow-sm">
                                            Find Leads on Wiza
                                        </Button>
                                    </div>

                                    {experiment && (
                                        <div className="bg-[#43B97B]/5 rounded-2xl p-6 border border-[#43B97B]/10 space-y-4">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Targeting Logic</h4>
                                            <div className="space-y-3">
                                                {experiment.wiza_filters.job_title && (
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-600">Titles</p>
                                                        <p className="text-sm text-gray-500">{experiment.wiza_filters.job_title.map(t => t.v).join(', ')}</p>
                                                    </div>
                                                )}
                                                {experiment.wiza_filters.company_size && (
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-600">Company Size</p>
                                                        <p className="text-sm text-gray-500">{experiment.wiza_filters.company_size.join(', ')}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'drafting' && (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                    <div className="size-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                        <SparklesIcon className="size-8 text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#333333]">Content Engine</h3>
                                        <p className="text-sm text-gray-500 max-w-[280px] mx-auto mt-2">
                                            Once leads are found and researched, our AI content engine will draft personalized messages here.
                                        </p>
                                    </div>
                                    <Button disabled className="bg-gray-100 text-gray-400 font-bold border-none h-11 px-8">
                                        Coming Soon
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

function LeadDetailView({ lead, onBack }: { lead: Lead, onBack: () => void }) {
    const enrichment = lead.enrichment_data

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-6 pb-2 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="size-8 flex items-center justify-center border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <ChevronLeftIcon className="size-4 text-gray-400" />
                </button>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Lead Details</span>
                    <h2 className="text-lg font-bold text-[#333333] tracking-tight">{lead.full_name}</h2>
                </div>
            </div>

            <div className="p-8 pt-4 pb-6 flex items-center gap-6 border-b border-gray-50">
                <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center border border-gray-100 font-bold text-[#333333] text-3xl overflow-hidden shrink-0 relative">
                    {lead.avatar_url ? (
                        <img src={lead.avatar_url} alt={lead.full_name} className="size-full object-cover" />
                    ) : (
                        <span>{lead.full_name.charAt(0)}</span>
                    )}
                    <div className="absolute bottom-0 right-0 size-7 bg-white rounded-full border border-gray-100 p-1.5 flex items-center justify-center">
                        <img src="/placeholder_company_logo.png" className="size-full object-contain" alt="" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">{lead.full_name}</h2>
                    <div className="space-y-0.5 mt-1">
                        <p className="text-[#4A4A4A] font-medium">{lead.job_title}</p>
                        <p className="text-gray-400 text-sm font-medium">{lead.company}</p>
                    </div>
                </div>
            </div>

            <div className="px-8 pb-6 pt-6 flex items-center gap-2">
                <div className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded text-[10px] font-bold tracking-widest uppercase">
                    High Match
                </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-50 space-y-3">
                {lead.email && (
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <EnvelopeIcon className="size-4 shrink-0 text-gray-400" />
                        <span className="truncate">{lead.email}</span>
                    </div>
                )}
                {enrichment?.location && (
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <MapPinIcon className="size-4 shrink-0 text-gray-400" />
                        <span>{enrichment.location}</span>
                    </div>
                )}
                {lead.linkedin_url && (
                    <a href={lead.linkedin_url} target="_blank" className="flex items-center gap-4 text-sm text-[#43B97B] font-semibold hover:underline group">
                        <svg className="size-4 fill-current shrink-0 text-gray-400 group-hover:text-[#43B97B] transition-colors" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        View Profile
                    </a>
                )}
            </div>

            <div className="px-8 py-10 border-t border-gray-100 space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Why This Lead</h4>
                <p className="text-[15px] text-[#4A4A4A] leading-relaxed font-medium">
                    {enrichment?.summary || "Summary details not available."}
                </p>
            </div>

            <div className="px-8 py-10 border-t border-gray-100 space-y-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Key Signals</h4>
                {enrichment?.signals && enrichment.signals.length > 0 ? (
                    <div className="space-y-6">
                        {enrichment.signals.map((signal, idx) => (
                            <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-xl p-6 space-y-5">
                                <div className="space-y-2">
                                    <h5 className="font-bold text-[#1A1A1A] text-base tracking-tight">{signal.headline}</h5>
                                    <p className="text-[14px] text-gray-600 leading-relaxed font-medium">
                                        {signal.description}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {signal.citations.map((citation, cIdx) => (
                                        <a
                                            key={cIdx}
                                            href={citation.source_url}
                                            target="_blank"
                                            className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg group hover:border-[#43B97B]/30 transition-all w-fit shadow-xs"
                                        >
                                            <div className="size-4 shrink-0 overflow-hidden">
                                                {citation.source_logo_url ? (
                                                    <img src={citation.source_logo_url} alt="" className="size-full object-contain" />
                                                ) : (
                                                    <GlobeAltIcon className="size-full text-gray-400" />
                                                )}
                                            </div>
                                            <span className="text-[11px] font-bold text-gray-500 group-hover:text-[#43B97B] truncate">
                                                {citation.source_name}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-gray-400 italic">No key signals discovered yet</div>
                )}
            </div>

            <div className="px-8 py-10 border-t border-gray-100 space-y-6">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience</h4>
                {enrichment?.experience && enrichment.experience.length > 0 ? (
                    <div className="space-y-6">
                        {enrichment.experience.map((exp, idx) => (
                            <div key={idx} className="flex gap-5">
                                <div className="size-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                    {exp.company_logo_url ? (
                                        <img src={exp.company_logo_url} alt={exp.company_name} className="size-full object-cover" />
                                    ) : (
                                        <BriefcaseIcon className="size-5 text-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="font-bold text-[#1A1A1A] text-sm truncate">{exp.title}</h5>
                                    <p className="text-sm text-gray-600 font-medium">{exp.company_name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{exp.time_from} — {exp.time_to}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-gray-400 italic">Experience history not available</div>
                )}
            </div>
        </div>
    )
}
