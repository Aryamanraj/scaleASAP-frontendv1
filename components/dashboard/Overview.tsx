"use client"

import React from 'react'
import { StatsCard } from './StatsCard'
import { ActivityFeed } from './ActivityFeed'
import { Experiment } from '@/app/actions/workspaces'
import { OverviewEmptyState } from './OverviewEmptyState'

interface OverviewProps {
    isEmpty?: boolean
    userName?: string
    onStartDiscovery?: () => void
    experiments?: Experiment[]
}

export function Overview({ isEmpty = false, userName, onStartDiscovery, experiments = [] }: OverviewProps) {
    if (isEmpty) {
        return <OverviewEmptyState userName={userName} onStartDiscovery={onStartDiscovery} />
    }

    // Calculate stats from experiments data (same as ExperimentsList)
    const totalExperiments = experiments.length
    const inProgress = experiments.filter(e =>
        ['creating_hypotheses', 'pending', 'finding_leads', 'prioritizing_leads', 'warmup_initiated'].includes(e.status)
    ).length
    const complete = experiments.filter(e => ['complete', 'completed'].includes(e.status)).length
    const totalLeads = experiments.reduce((sum, e) => sum + e.leads_found, 0)
    const totalWarming = experiments.reduce((sum, e) => sum + e.leads_warming, 0)
    const totalMeetings = experiments.reduce((sum, e) => sum + e.meetings_booked, 0)

    // Generate recent activity from actual experiments
    // Map experiments to activity items
    // Sort by date descending
    const recentActivity = experiments
        .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
        .slice(0, 5)
        .map(exp => {
            const fallbackDate = new Date().toISOString()
            return {
                id: exp.id,
                type: 'experiment_created' as const,
                user: 'System', // Or could be userName if passed down
                target: exp.name,
                time: new Date(exp.created_at || fallbackDate).toLocaleDateString(),
                timestamp: exp.created_at || fallbackDate
            }
        })

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-[#333333]">Overview</h1>
                <p className="text-gray-500">How your experiments are performing today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <StatsCard
                    title="Total Experiments"
                    value={totalExperiments.toString()}
                    change={0}
                    subtext={`${inProgress} in progress, ${complete} complete`}
                    color="blue"
                    activeSegments={totalExperiments}
                    segments={20}
                />
                <StatsCard
                    title="Leads Found"
                    value={totalLeads.toString()}
                    change={0}
                    subtext={totalExperiments > 0 ? `across ${totalExperiments} experiments` : "no leads yet"}
                    color="green"
                    activeSegments={Math.min(totalLeads, 20)}
                    segments={20}
                />
                <StatsCard
                    title="Leads Warming"
                    value={totalWarming.toString()}
                    change={0}
                    subtext={totalWarming > 0 ? "high intent signals" : "awaiting activity"}
                    color="purple"
                    activeSegments={Math.min(totalWarming, 20)}
                    segments={20}
                />
                <StatsCard
                    title="Booked Meetings"
                    value={totalMeetings.toString()}
                    change={0}
                    subtext={totalMeetings > 0 ? `${totalMeetings} meetings scheduled` : "no meetings yet"}
                    color="blue"
                    activeSegments={Math.min(totalMeetings, 20)}
                    segments={20}
                />
                <StatsCard
                    title="In Progress"
                    value={inProgress.toString()}
                    change={0}
                    subtext={inProgress > 0 ? "experiments running" : "all experiments idle"}
                    color="green"
                    activeSegments={inProgress}
                    segments={20}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ActivityFeed items={recentActivity} />
                </div>
                {/* Secondary side panel if needed later */}
                <div className="space-y-6">
                    <div className="bg-[#43B97B]/5 rounded-xl border border-[#43B97B]/20 p-6">
                        <h4 className="font-bold text-[#43B97B] text-sm uppercase tracking-wider mb-2">Growth Tip</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {totalExperiments > 0
                                ? "Monitor your experiment performance and iterate on the top-performing segments."
                                : "Start your ICP discovery to identify high-value customer segments."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
