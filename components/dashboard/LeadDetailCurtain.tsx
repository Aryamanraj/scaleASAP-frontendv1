"use client"

import React from 'react'
import { Lead } from '@/app/actions/leads'
import { Campaign } from '@/app/actions/campaigns'
import { cn } from '@/lib/utils'
import {
    XMarkIcon,
    EnvelopeIcon,
    LinkIcon,
    BuildingOfficeIcon,
    MegaphoneIcon,
    MapPinIcon,
    SparklesIcon,
    BoltIcon,
    GlobeAltIcon,
    BriefcaseIcon,
    ChevronLeftIcon,
    PhoneIcon,
    PlusIcon,
    ArrowPathIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface LeadDetailCurtainProps {
    lead: Lead | null
    campaign: Campaign | null
    isOpen: boolean
    onClose: () => void
}

export function LeadDetailCurtain({
    lead: initialLead,
    campaign,
    isOpen,
    onClose
}: LeadDetailCurtainProps) {
    const [selectedTab, setSelectedTab] = React.useState<'info' | 'analysis' | 'outreach'>('analysis')
    const [outreachConfig, setOutreachConfig] = React.useState({ format: 'linkedin', isFollowUp: false })
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [generatedOutreach, setGeneratedOutreach] = React.useState<string | null>(null)

    if (!initialLead) return null

    // Ensure we have dummy data for enrichment if missing
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
        <div className={cn(
            "bg-white rounded-2xl border border-[#EEEEEE] transition-all duration-500 ease-in-out flex flex-col overflow-hidden h-full",
            isOpen ? "w-[520px] opacity-100" : "w-0 opacity-0 border-none pointer-events-none"
        )}>
            {/* Standard Profile Header */}
            <div className="p-6 pb-4 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-4">
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center border border-[#EEEEEE] bg-white rounded-lg hover:bg-gray-50 transition-all"
                    >
                        <ChevronLeftIcon className="size-4 text-[#333333]" />
                    </button>
                    {campaign && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400">CAMPAIGN</span>
                            <Badge variant="outline" className="text-[10px] font-bold text-[#43B97B] border-[#43B97B]/20 bg-[#43B97B]/5">
                                {campaign.name}
                            </Badge>
                        </div>
                    )}
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
                    <span className="text-sm font-bold text-gray-600">{lead.company || 'Unknown Company'}</span>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-none bg-gray-50 text-gray-400 ml-2">
                        {lead.job_title || 'Lead'}
                    </Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-6 w-full">
                    {['Email', 'Phone', 'LinkedIn', 'X'].map((label, idx) => (
                        <div key={label} className="flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="size-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                                {label === 'Email' && <EnvelopeIcon className="size-4 text-gray-400" />}
                                {label === 'Phone' && <PhoneIcon className="size-4 text-gray-400" />}
                                {label === 'LinkedIn' && <LinkIcon className="size-4 text-gray-400" />}
                                {label === 'X' && <span className="text-sm font-bold text-gray-400">X</span>}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                        </div>
                    ))}
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

            {/* Sub-tabs */}
            <div className="flex border-b border-[#EEEEEE] px-8">
                {['info', 'analysis', 'outreach'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab as any)}
                        className={cn(
                            "py-3 text-sm font-bold transition-all relative px-4",
                            selectedTab === tab ? "text-[#333333]" : "text-gray-400 hover:text-gray-600",
                            tab !== 'info' && "ml-4"
                        )}
                    >
                        {tab === 'info' ? 'Lead info' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {selectedTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#333333]" />
                        )}
                    </button>
                ))}
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

                        {/* Experience - Standard Style */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience</h4>
                            <div className="space-y-8">
                                {enrichment?.experience?.map((exp, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="size-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                                            {exp.company_logo_url ? (
                                                <img src={exp.company_logo_url} className="size-full object-contain p-1" />
                                            ) : (
                                                <BriefcaseIcon className="size-5 text-gray-300" />
                                            )}
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
                    </div>
                ) : selectedTab === 'analysis' ? (
                    <div className="space-y-10">
                        {/* Strategic Why */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Strategic Why</h4>
                            <div className="p-6 bg-[#43B97B]/5 border border-[#43B97B]/10 rounded-2xl relative overflow-hidden">
                                <SparklesIcon className="absolute top-4 right-4 size-10 text-[#43B97B]/5" />
                                <p className="text-[15px] text-[#333333] leading-relaxed font-bold italic">
                                    "{enrichment?.summary}"
                                </p>
                            </div>
                        </div>

                        {/* Key Research Signals */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Key Research Signals</h4>
                            <div className="space-y-3">
                                {enrichment?.signals?.map((signal, idx) => (
                                    <div key={idx} className="bg-white border border-[#EEEEEE] rounded-2xl p-6 hover:border-[#43B97B] transition-all group flex flex-col cursor-default">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h5 className="font-bold text-[#333333] text-base tracking-tight">{signal.headline}</h5>
                                                {signal.citations?.[0]?.source_logo_url && (
                                                    <img src={signal.citations[0].source_logo_url} className="size-4 grayscale opacity-30" />
                                                )}
                                            </div>
                                            <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                                                {signal.description}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            {signal.citations?.map((cite, cidx) => (
                                                <span key={cidx} className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{cite.source_name}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Generated Outreach Angle (Inlined for Library view) */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generated Outreach Angle</h4>
                            <div className="p-8 bg-gray-900 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6">
                                    <MegaphoneIcon className="size-12 text-white/5" />
                                </div>
                                <p className="text-[15px] text-white/90 leading-relaxed font-medium italic relative z-10 whitespace-pre-wrap">
                                    "{lead.outbound_message}"
                                </p>
                                <div className="mt-8 flex justify-end relative z-10">
                                    <button
                                        className="text-[10px] font-bold text-[#43B97B] hover:text-white hover:bg-[#43B97B] uppercase tracking-widest transition-all px-4 py-2 border border-[#43B97B]/30 rounded-lg"
                                        onClick={() => {
                                            navigator.clipboard.writeText(lead.outbound_message || '');
                                        }}
                                    >
                                        Copy Message
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Experience History (Analysis card style) */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience History</h4>
                            <div className="space-y-3">
                                {enrichment?.experience?.map((exp, idx) => (
                                    <div key={idx} className="bg-white border border-[#EEEEEE] rounded-2xl p-6 hover:border-[#43B97B] transition-all group flex flex-col cursor-default">
                                        <div className="flex gap-4">
                                            <div className="size-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                                                {exp.company_logo_url ? (
                                                    <img src={exp.company_logo_url} className="size-full object-contain p-1" />
                                                ) : (
                                                    <BriefcaseIcon className="size-4 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-[#333333] text-sm leading-tight">{exp.title}</h5>
                                                <p className="text-xs text-[#43B97B] font-bold mt-1">{exp.company_name}</p>
                                                <p className="text-[11px] text-gray-400 mt-1 font-medium italic">{exp.time_from} — {exp.time_to}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Outreach Tab (Same as Campaign view) */}
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
                                        setGeneratedOutreach("ScaleASAP is currently analyzing the best approach for this prospect.")
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
                                        </div>
                                    ) : (
                                        <p className="text-[15px] text-white/90 leading-relaxed font-medium italic relative z-10 whitespace-pre-wrap">
                                            "{generatedOutreach}"
                                        </p>
                                    )}
                                    <div className="mt-8 flex justify-end gap-3 relative z-10">
                                        <button className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest px-4 py-2 border border-white/10 rounded-lg">
                                            Edit
                                        </button>
                                        <button
                                            className="text-[10px] font-bold text-[#43B97B] hover:text-white hover:bg-[#43B97B] uppercase tracking-widest transition-all px-4 py-2 border border-[#43B97B]/30 rounded-lg"
                                            onClick={() => {
                                                navigator.clipboard.writeText(generatedOutreach || '');
                                            }}
                                        >
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
