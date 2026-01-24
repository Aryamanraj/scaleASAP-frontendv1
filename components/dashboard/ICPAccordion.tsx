import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ICP {
    name: string
    type: 'bullseye' | 'variable_a' | 'variable_b' | 'contrarian' | 'long_shot'
    pattern: string
    industries: string[]
    pain: string
    trigger: string
    wiza_filters: {
        job_title?: Array<{ v: string, s?: string }>
        job_title_level?: string[]
        job_role?: string[]
        job_sub_role?: string[]
        location?: { v: string, b?: string, s?: string }
        skill?: string[]
        school?: string[]
        major?: string[]
        company_industry?: Array<{ v: string, s?: string }>
        company_size?: string[]
        company_annual_growth?: string
        department_size?: string[]
        revenue?: string[]
        funding_date?: { t: string, v: string }
        last_funding_min?: string
        last_funding_max?: string
        funding_min?: string
        funding_max?: string
        funding_stage?: { t: string, v: string[] }
        funding_type?: { t: string, v: string[] }
        company_type?: string[]
        company_summary?: Array<{ v: string, s?: string }>
        year_founded_start?: string
        year_founded_end?: string
    }
    outreach_angle: string
}

interface ICPAccordionProps {
    icps: ICP[]
    strategicInsight?: string
}

export function ICPAccordion({ icps, strategicInsight }: ICPAccordionProps) {
    if (!icps || icps.length === 0) return null

    // Helper function to safely access array fields
    const safeArray = (field: unknown): string[] => {
        if (Array.isArray(field)) return field
        return []
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'bullseye': return 'bg-green-100 text-green-800 border-green-200'
            case 'variable_a': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'variable_b': return 'bg-purple-100 text-purple-800 border-purple-200'
            case 'contrarian': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'long_shot': return 'bg-gray-100 text-gray-800 border-gray-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const formatLabel = (type: string) => {
        return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }

    return (
        <div className="w-full space-y-4">
            {strategicInsight && (
                <div className="bg-green-50/50 border border-green-100 p-4 rounded-xl text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold text-green-800 block mb-1">Strategic Insight</span>
                    {strategicInsight}
                </div>
            )}

            <Accordion type="single" collapsible className="w-full space-y-2">
                {icps.map((icp, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl bg-white px-2">
                        <AccordionTrigger className="hover:no-underline px-2 py-3">
                            <div className="flex items-center gap-3 text-left">
                                <Badge variant="outline" className={cn("shrink-0", getTypeColor(icp.type))}>
                                    {formatLabel(icp.type)}
                                </Badge>
                                <span className="text-sm font-medium text-gray-900">{icp.name.replace(/^[^:]+:\s*/, '')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pb-4">
                            <div className="space-y-4 pt-2">
                                {/* Pattern & Pain */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">The Pattern</span>
                                        <p className="text-sm text-gray-700">{icp.pattern}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">The Pain</span>
                                        <p className="text-sm text-gray-700">{icp.pain}</p>
                                    </div>
                                </div>

                                {/* Trigger */}
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">The Trigger</span>
                                    <p className="text-sm text-gray-700 italic">&ldquo;{icp.trigger}&rdquo;</p>
                                </div>

                                {/* Filters */}
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prospecting Filters</span>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        {icp.wiza_filters.job_title && icp.wiza_filters.job_title.length > 0 && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Job Titles</span>
                                                <span className="text-gray-900 font-medium">{icp.wiza_filters.job_title.map(t => t.v).join(', ')}</span>
                                            </div>
                                        )}
                                        {icp.wiza_filters.job_title_level && safeArray(icp.wiza_filters.job_title_level).length > 0 && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Title Levels</span>
                                                <span className="text-gray-900 font-medium">{safeArray(icp.wiza_filters.job_title_level).join(', ')}</span>
                                            </div>
                                        )}
                                        {icp.wiza_filters.company_size && safeArray(icp.wiza_filters.company_size).length > 0 && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Company Size</span>
                                                <span className="text-gray-900 font-medium">{safeArray(icp.wiza_filters.company_size).join(', ')}</span>
                                            </div>
                                        )}
                                        {icp.wiza_filters.revenue && safeArray(icp.wiza_filters.revenue).length > 0 && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Revenue</span>
                                                <span className="text-gray-900 font-medium">{safeArray(icp.wiza_filters.revenue).join(', ')}</span>
                                            </div>
                                        )}
                                        {icp.wiza_filters.location && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Location</span>
                                                <span className="text-gray-900 font-medium">{icp.wiza_filters.location.v}</span>
                                            </div>
                                        )}
                                        {icp.wiza_filters.company_industry && icp.wiza_filters.company_industry.length > 0 && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Industries</span>
                                                <span className="text-gray-900 font-medium">{icp.wiza_filters.company_industry.map(i => i.v).join(', ')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Outreach */}
                                <div className="bg-[#43B97B]/5 p-3 rounded-lg border border-[#43B97B]/10 flex items-start gap-4">
                                    <div className="shrink-0 pt-1">
                                        <span className="text-xs font-semibold text-[#43B97B] uppercase tracking-wider block">Outreach Angle</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{icp.outreach_angle}</p>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
