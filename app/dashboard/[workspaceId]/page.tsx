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
import { saveDiscoveryFeedback, generateSuggestedExperiments } from '@/app/actions/workspaces'
import { getCampaigns, Campaign, createCampaign } from '@/app/actions/campaigns'
import { CampaignsList } from '@/components/dashboard/CampaignsList'
import { CampaignDetailCurtain } from '@/components/dashboard/CampaignDetailCurtain'
import { LeadDetailCurtain } from '@/components/dashboard/LeadDetailCurtain'
import { NewCampaignCurtain } from '@/components/dashboard/NewCampaignCurtain'
import { Lead, getAllLeads } from '@/app/actions/leads'
import { LeadsList } from '@/components/dashboard/LeadsList'
import { Button } from '@/components/ui/button'
import { HelpSupport } from '@/components/dashboard/HelpSupport'

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
    const [experiments, setExperiments] = useState<Experiment[]>([])
    const [hasJustCreatedExperiments, setHasJustCreatedExperiments] = useState(false)
    const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
    const [showNewCampaignCurtain, setShowNewCampaignCurtain] = useState(false)
    const [allLeads, setAllLeads] = useState<Lead[]>([])
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)

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

    // Load experiments, campaigns, and leads
    useEffect(() => {
        const loadData = async () => {
            const [exps, camps, leads] = await Promise.all([
                getExperiments(workspaceId),
                getCampaigns(workspaceId),
                getAllLeads(workspaceId)
            ])
            setExperiments(exps)
            setCampaigns(camps)
            setAllLeads(leads)
            // If we have experiments but haven't just created them, don't show the zero state
            if (exps.length > 0 && !hasJustCreatedExperiments) {
                setHasJustCreatedExperiments(false)
            }
        }
        loadData()
    }, [workspaceId, hasJustCreatedExperiments])

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab)
        // Close all curtains when switching tabs
        setShowDiscoveryChat(false)
        setSelectedExperiment(null)
        setSelectedCampaign(null)
        setShowNewCampaignCurtain(false)
        setSelectedLead(null)
    }

    const handleExperimentsCreated = async () => {
        // Reload experiments from database
        const exps = await getExperiments(workspaceId)
        setExperiments(exps)
        // Switch to experiments tab to show the list
        handleTabChange('experiments')
        setShowDiscoveryChat(false)

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

    const handleSuggestedExperiments = async () => {
        try {
            setIsGeneratingSuggestions(true)
            await generateSuggestedExperiments(workspaceId)
            // Reload experiments
            const exps = await getExperiments(workspaceId)
            setExperiments(exps)
            // Switch to experiments tab
            handleTabChange('experiments')
        } catch (error) {
            console.error('Failed to generate suggested experiments:', error)
        } finally {
            setIsGeneratingSuggestions(false)
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
                {/* Discovery Chat 0-state: Full screen coverage */}
                {currentTab === 'experiments' && experiments.length === 0 ? (
                    <DiscoveryChat
                        workspaceId={workspaceId}
                        userName={userEmail?.split('@')[0].split(/[._-]/).map(s => s[0].toUpperCase() + s.slice(1)).join(' ') || 'there'}
                        onExperimentsCreated={handleExperimentsCreated}
                        isFollowUp={false}
                        previousExperiments={[]}
                        isMainView={true}
                        initialChatHistory={workspace.discovery_chat_history}
                    />
                ) : (
                    <div className="max-w-7xl mx-auto h-full p-8 px-8">
                        {currentTab === 'overview' && (
                            <Overview
                                isEmpty={experiments.length === 0}
                                userName={userEmail?.split('@')[0].split(/[._-]/).map(s => s[0].toUpperCase() + s.slice(1)).join(' ') || 'there'}
                                onStartDiscovery={() => {
                                    setCurrentTab('experiments')
                                    setShowDiscoveryChat(true)
                                }}
                                onSuggestedExperiments={handleSuggestedExperiments}
                                isLoading={isGeneratingSuggestions}
                                experiments={experiments}
                            />
                        )}
                        {currentTab === 'experiments' && experiments.length > 0 && (
                            <ExperimentsList
                                experiments={experiments}
                                onNewExperiment={() => {
                                    setShowDiscoveryChat(true)
                                    setSelectedExperiment(null)
                                    setSelectedCampaign(null)
                                    setShowNewCampaignCurtain(false)
                                }}
                                onExperimentSelect={(exp) => {
                                    setSelectedExperiment(exp)
                                    setShowDiscoveryChat(false)
                                    setSelectedCampaign(null)
                                    setShowNewCampaignCurtain(false)
                                }}
                                selectedId={selectedExperiment?.id}
                                hasOngoingChat={hasChatHistory}
                                isDiscoveryOpen={showDiscoveryChat}
                            />
                        )}
                        {currentTab === 'campaigns' && (
                            <div className="flex flex-col h-full">
                                <CampaignsList
                                    campaigns={campaigns}
                                    experiments={experiments}
                                    onCampaignSelect={(c: Campaign) => {
                                        setSelectedCampaign(c)
                                        setShowNewCampaignCurtain(false)
                                        setSelectedExperiment(null)
                                        setShowDiscoveryChat(false)
                                    }}
                                    selectedId={selectedCampaign?.id}
                                    onNewCampaign={() => {
                                        setShowNewCampaignCurtain(true)
                                        setSelectedCampaign(null)
                                        setSelectedExperiment(null)
                                        setShowDiscoveryChat(false)
                                    }}
                                    hasOngoingChat={hasChatHistory}
                                    isDiscoveryOpen={showDiscoveryChat}
                                />
                            </div>
                        )}
                        {currentTab === 'library' && (
                            <LeadsList
                                leads={allLeads}
                                campaigns={campaigns}
                                onLeadSelect={(lead) => setSelectedLead(lead)}
                                selectedId={selectedLead?.id}
                            />
                        )}
                        {currentTab === 'settings' && (
                            <Settings
                                workspace={workspace}
                                userEmail={userEmail || 'Guest'}
                            />
                        )}
                        {currentTab === 'help' && (
                            <HelpSupport />
                        )}
                    </div>
                )}
            </main>

            {/* Curtains Container - Unified sliding orchestration */}
            <div className={cn(
                "flex shrink-0 transition-all duration-500 ease-in-out overflow-hidden h-full",
                ((showDiscoveryChat || !!selectedExperiment) && currentTab === 'experiments') || ((showDiscoveryChat || !!selectedCampaign || showNewCampaignCurtain) && currentTab === 'campaigns') || (!!selectedLead && currentTab === 'library')
                    ? "ml-2"
                    : "ml-0"
            )}>
                {/* Lead Detail Curtain (for Library tab) */}
                <LeadDetailCurtain
                    lead={selectedLead}
                    campaign={campaigns.find(c => c.id === selectedLead?.campaign_id) || null}
                    isOpen={!!selectedLead && currentTab === 'library'}
                    onClose={() => setSelectedLead(null)}
                />

                {/* Discovery Curtain */}
                <div className={cn(
                    "bg-white rounded-2xl border border-[#EEEEEE] shadow-sm transition-all duration-500 ease-in-out flex flex-col overflow-hidden h-full",
                    (showDiscoveryChat && experiments.length > 0 && (currentTab === 'experiments' || currentTab === 'campaigns')) ? "w-[480px] opacity-100" : "w-0 opacity-0 border-none pointer-events-none"
                )}>
                    <DiscoveryChat
                        key={experiments.length > 0 ? 'followup' : 'initial'}
                        workspaceId={workspaceId}
                        userName={userEmail?.split('@')[0].split(/[._-]/).map(s => s[0].toUpperCase() + s.slice(1)).join(' ') || 'there'}
                        onExperimentsCreated={handleExperimentsCreated}
                        isFollowUp={experiments.length > 0}
                        previousExperiments={experiments}
                        onBack={() => setShowDiscoveryChat(false)}
                        initialChatHistory={experiments.length > 0 ? undefined : workspace.discovery_chat_history}
                    />
                </div>

                <ExperimentDetailCurtain
                    experiment={selectedExperiment}
                    isOpen={!!selectedExperiment && currentTab === 'experiments'}
                    onClose={() => setSelectedExperiment(null)}
                    onCreateCampaign={handleCreateCampaign}
                    hasCampaignStarted={campaigns.some(c => c.experiment_id === selectedExperiment?.id)}
                />

                <CampaignDetailCurtain
                    campaign={selectedCampaign}
                    experiment={experiments.find(e => e.id === selectedCampaign?.experiment_id) || null}
                    isOpen={!!selectedCampaign && currentTab === 'campaigns'}
                    onClose={() => setSelectedCampaign(null)}
                />

                <NewCampaignCurtain
                    isOpen={showNewCampaignCurtain && currentTab === 'campaigns'}
                    onClose={() => setShowNewCampaignCurtain(false)}
                    onCreate={(data) => {
                        console.log('New campaign data:', data)
                        setShowNewCampaignCurtain(false)
                    }}
                />
            </div>

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
