"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Overview } from '@/components/dashboard/Overview'
import { Settings } from '@/components/dashboard/Settings'
import { OnboardingGuard } from '@/components/dashboard/OnboardingGuard'
import { getWorkspaceById, getWorkspaces, Workspace } from '@/app/actions/workspaces'
import { createClient } from '@/lib/supabase/client'
import { DiscoveryChat } from '@/components/dashboard/DiscoveryChat'
import { cn } from '@/lib/utils'
import { ExperimentsList } from '@/components/dashboard/ExperimentsList'
import { getExperiments, Experiment } from '@/app/actions/workspaces'
import { ExperimentDetailCurtain } from '@/components/dashboard/ExperimentDetailCurtain'
import { FeedbackPopup } from '@/components/dashboard/FeedbackPopup'
import { saveDiscoveryFeedback } from '@/app/actions/workspaces'
import { getCampaigns, Campaign, createCampaign } from '@/app/actions/campaigns'
import { CampaignsList } from '@/components/dashboard/CampaignsList'
import { CampaignDetailCurtain } from '@/components/dashboard/CampaignDetailCurtain'
import { Lead } from '@/app/actions/leads'

export default function DashboardPage() {
    const params = useParams()
    const router = useRouter()
    const workspaceId = params.workspaceId as string

    const [workspace, setWorkspace] = useState<Workspace | null>(null)
    const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([])
    const [currentTab, setCurrentTab] = useState('overview')
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [showDiscoveryChat, setShowDiscoveryChat] = useState(false)
    const [showFollowUpDiscovery, setShowFollowUpDiscovery] = useState(false)
    const [experiments, setExperiments] = useState<Experiment[]>([])
    const [hasJustCreatedExperiments, setHasJustCreatedExperiments] = useState(false)
    const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

    useEffect(() => {
        const load = async () => {
            const supabase = createClient()
            const [ws, list, { data: { user } }] = await Promise.all([
                getWorkspaceById(workspaceId),
                getWorkspaces(),
                supabase.auth.getUser()
            ])

            if (!ws) {
                router.push('/workspaces')
                return
            }

            setWorkspace(ws)
            setAllWorkspaces(list)
            setUserEmail(user?.email || null)
            setLoading(false)

            // Check if we should show feedback on mount (e.g. if they just created and refreshed)
            const feedbackCollected = localStorage.getItem(`feedback_collected_${workspaceId}`)
            const feedbackDismissed = localStorage.getItem(`feedback_dismissed_${workspaceId}`)
            if (!feedbackCollected && !feedbackDismissed) {
                // If we have experiments, maybe they are returning to a session where they haven't given feedback
                // But let's only do it if they have at least 5 experiments (as per user request "like 5 experiment generated")
                const exps = await getExperiments(workspaceId)
                if (exps.length >= 5) {
                    setShowFeedback(true)
                }
            }
        }
        load()
    }, [workspaceId, router])

    // Load experiments and campaigns
    useEffect(() => {
        const loadData = async () => {
            const [exps, camps] = await Promise.all([
                getExperiments(workspaceId),
                getCampaigns(workspaceId)
            ])
            setExperiments(exps)
            setCampaigns(camps)
            // If we have experiments but haven't just created them, don't show the zero state
            if (exps.length > 0 && !hasJustCreatedExperiments) {
                setHasJustCreatedExperiments(false)
            }
        }
        loadData()
    }, [workspaceId, hasJustCreatedExperiments])

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab)
        // Close curtains when switching tabs
        if (tab !== 'experiments') setSelectedExperiment(null)
        if (tab !== 'campaigns') {
            setSelectedCampaign(null)
        }
    }

    const handleExperimentsCreated = async () => {
        // Reload experiments from database
        const exps = await getExperiments(workspaceId)
        setExperiments(exps)
        // Switch to experiments tab to show the list
        handleTabChange('experiments')
        setShowFollowUpDiscovery(false)

        // Trigger feedback popup after a short delay so user can see the experiments
        if (exps.length >= 5) {
            setTimeout(() => {
                setShowFeedback(true)
            }, 1500)
        }
    }

    const handleCreateCampaign = async (name: string, experimentId: string) => {
        try {
            const newCampaign = await createCampaign(workspaceId, experimentId, name)
            setCampaigns([newCampaign, ...campaigns])
            setCurrentTab('campaigns')
            setSelectedCampaign(newCampaign)
        } catch (error) {
            console.error('Failed to create campaign:', error)
        }
    }

    // Check if we have discovery chat history
    const hasChatHistory = workspace?.discovery_chat_history && workspace.discovery_chat_history.length > 0

    if (loading || !workspace) return null // loading.tsx handles this

    return (
        <div className="flex h-screen bg-[#F9FAFB] p-2 overflow-hidden relative">
            {workspace.onboarding_status !== 'complete' && (
                <OnboardingGuard workspace={workspace} />
            )}

            <Sidebar
                workspace={workspace}
                allWorkspaces={allWorkspaces}
                currentTab={currentTab}
                onTabChange={handleTabChange}
                className="shrink-0"
            />

            <div className="w-2 shrink-0" />

            <main className="flex-1 overflow-y-auto bg-white rounded-2xl border border-[#EEEEEE] shadow-sm relative">
                <div className={cn(
                    "max-w-7xl mx-auto h-full",
                    showDiscoveryChat ? "p-0" : "p-8"
                )}>
                    {currentTab === 'overview' && (
                        <Overview
                            isEmpty={experiments.length === 0}
                            userName={userEmail?.split('@')[0].split(/[._-]/).map(s => s[0].toUpperCase() + s.slice(1)).join(' ') || 'there'}
                            onStartDiscovery={() => {
                                setCurrentTab('experiments')
                                setShowDiscoveryChat(true)
                            }}
                            experiments={experiments}
                        />
                    )}
                    {currentTab === 'experiments' && (
                        showFollowUpDiscovery ? (
                            <DiscoveryChat
                                workspaceId={workspaceId}
                                userName={userEmail?.split('@')[0].split(/[._-]/).map(s => s[0].toUpperCase() + s.slice(1)).join(' ') || 'there'}
                                onExperimentsCreated={handleExperimentsCreated}
                                isFollowUp={true}
                                previousExperiments={experiments}
                                onBack={() => setShowFollowUpDiscovery(false)}
                            />
                        ) : experiments.length > 0 ? (
                            <ExperimentsList
                                experiments={experiments}
                                onNewExperiment={() => setShowFollowUpDiscovery(true)}
                                onExperimentSelect={setSelectedExperiment}
                                selectedId={selectedExperiment?.id}
                                hasOngoingChat={hasChatHistory}
                            />
                        ) : hasChatHistory ? (
                            <DiscoveryChat
                                workspaceId={workspaceId}
                                userName={userEmail?.split('@')[0].split(/[._-]/).map(s => s[0].toUpperCase() + s.slice(1)).join(' ') || 'there'}
                                onExperimentsCreated={handleExperimentsCreated}
                                initialChatHistory={workspace.discovery_chat_history}
                            />
                        ) : (
                            <DiscoveryChat
                                workspaceId={workspaceId}
                                userName={userEmail?.split('@')[0].split(/[._-]/).map(s => s[0].toUpperCase() + s.slice(1)).join(' ') || 'there'}
                                onExperimentsCreated={handleExperimentsCreated}
                            />
                        )
                    )}
                    {currentTab === 'campaigns' && (
                        <div className="flex flex-col h-full">
                            <CampaignsList
                                campaigns={campaigns}
                                experiments={experiments}
                                onCampaignSelect={(c) => {
                                    setSelectedCampaign(c)
                                    setSelectedExperiment(null)
                                }}
                                selectedId={selectedCampaign?.id}
                            />
                        </div>
                    )}
                    {currentTab === 'library' && (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                            <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">📚</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#333333]">Lead Library</h2>
                                <p className="text-gray-500 max-w-sm mx-auto">Your repository of verified leads and their engagement history. Coming soon.</p>
                            </div>
                        </div>
                    )}
                    {currentTab === 'settings' && (
                        <Settings
                            workspace={workspace}
                            userEmail={userEmail || 'Guest'}
                        />
                    )}
                </div>
            </main>

            {(selectedExperiment || selectedCampaign) && (
                <div className="flex shrink-0 ml-2 animate-in slide-in-from-right-4 duration-500">
                    <ExperimentDetailCurtain
                        experiment={selectedExperiment}
                        isOpen={!!selectedExperiment}
                        onClose={() => setSelectedExperiment(null)}
                        onCreateCampaign={handleCreateCampaign}
                    />

                    <CampaignDetailCurtain
                        campaign={selectedCampaign}
                        experiment={experiments.find(e => e.id === selectedCampaign?.experiment_id) || null}
                        isOpen={!!selectedCampaign}
                        onClose={() => setSelectedCampaign(null)}
                    />
                </div>
            )}

            {showFeedback && (
                <FeedbackPopup
                    workspaceId={workspaceId}
                    onDismiss={() => setShowFeedback(false)}
                    onSubmit={async (rating, feedback) => {
                        await saveDiscoveryFeedback(workspaceId, rating, feedback)
                    }}
                />
            )}
        </div>
    )
}
