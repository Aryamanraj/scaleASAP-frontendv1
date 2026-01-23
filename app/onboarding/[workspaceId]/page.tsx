"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ONBOARDING_STEPS, INITIAL_DATA, OnboardingData } from "@/lib/onboarding-data"
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout"
import { CompanyBasics } from "@/components/onboarding/steps/CompanyBasics"
import { ProductStrategy } from "@/components/onboarding/steps/ProductStrategy"
import { VoiceDNA } from "@/components/onboarding/steps/VoiceDNA"
import { Goal } from "@/components/onboarding/steps/Goal"
import { saveOnboardingDataToMarkdown, getOnboardingData } from "@/app/actions/onboarding"
import { generateWorldview } from "@/app/actions/worldview"
import { getWorkspaceById } from "@/app/actions/workspaces"


export default function OnboardingPage() {
    const params = useParams()
    const router = useRouter()
    const workspaceId = params.workspaceId as string

    const [data, setData] = useState<OnboardingData>(INITIAL_DATA)
    const [faviconUrl, setFaviconUrl] = useState<string | undefined>()
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [completedSteps, setCompletedSteps] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isNavigating, setIsNavigating] = useState(false)
    const [isScraping, setIsScraping] = useState(false)
    const [testMode, setTestMode] = useState(false)

    // Load from local storage AND server on mount
    useEffect(() => {
        const load = async () => {
            // Check if workspace exists
            const ws = await getWorkspaceById(workspaceId)
            if (!ws) {
                console.warn("Workspace not found, redirecting to workspaces list", workspaceId)
                router.push('/workspaces')
                return
            }

            setFaviconUrl(ws.favicon_url)

            let loadedData = INITIAL_DATA

            // 1. Try fetching from server first (single source of truth for "Edit Details")
            try {
                const serverData = await getOnboardingData(workspaceId)
                if (serverData) {
                    console.log("Loaded context from server")
                    loadedData = { ...loadedData, ...serverData }
                }
            } catch (err) {
                console.error("Failed to load from server", err)
            }

            if (typeof window !== "undefined") {
                const savedData = localStorage.getItem(`onboarding_data_${workspaceId}`)
                const savedStep = localStorage.getItem(`onboarding_step_${workspaceId}`)
                const savedCompleted = localStorage.getItem(`onboarding_completed_${workspaceId}`)
                const savedTestMode = localStorage.getItem(`onboarding_testmode_${workspaceId}`)

                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData)
                        loadedData = { ...loadedData, ...parsed }
                    } catch (e) {
                        console.error("Failed to parse saved data", e)
                    }
                }

                setData(loadedData)

                if (savedStep) {
                    const stepIdx = parseInt(savedStep);
                    if (stepIdx < ONBOARDING_STEPS.length) {
                        setCurrentStepIndex(stepIdx)
                    }
                }
                if (savedCompleted) setCompletedSteps(JSON.parse(savedCompleted))
                if (savedTestMode) setTestMode(savedTestMode === 'true')

                setIsLoading(false)
                console.log("OnboardingPage: Loading complete")
            }
        }
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceId])

    // Save to local storage on change
    useEffect(() => {
        if (!isLoading && !isNavigating) {
            localStorage.setItem(`onboarding_data_${workspaceId}`, JSON.stringify(data))
            localStorage.setItem(`onboarding_step_${workspaceId}`, currentStepIndex.toString())
            localStorage.setItem(`onboarding_completed_${workspaceId}`, JSON.stringify(completedSteps))
            localStorage.setItem(`onboarding_testmode_${workspaceId}`, testMode.toString())
        }
    }, [data, currentStepIndex, completedSteps, testMode, workspaceId, isLoading, isNavigating])

    const updateData = (updates: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...updates }))
    }

    const handleNext = async () => {
        const currentStepId = ONBOARDING_STEPS[currentStepIndex].id

        // Mark current step as completed if not already
        if (!completedSteps.includes(currentStepId)) {
            setCompletedSteps((prev) => [...prev, currentStepId])
        }

        // Save to Markdown file (with test mode flag)
        await saveOnboardingDataToMarkdown(workspaceId, data, testMode)

        if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
            setCurrentStepIndex((prev) => prev + 1)
            // Scroll to top
            const scrollContainer = document.querySelector('main > div.overflow-y-auto')
            if (scrollContainer) scrollContainer.scrollTop = 0
        } else {
            setIsNavigating(true)
            // Trigger worldview generation on completion
            generateWorldview(workspaceId).catch(err => console.error("Background worldview gen failed", err))

            // Clear local storage on final completion
            localStorage.removeItem(`onboarding_data_${workspaceId}`)
            localStorage.removeItem(`onboarding_step_${workspaceId}`)
            localStorage.removeItem(`onboarding_completed_${workspaceId}`)
            localStorage.removeItem(`onboarding_testmode_${workspaceId}`)

            // Completed last step
            window.location.assign('/workspaces')
        }
    }

    const handleSaveLater = async () => {
        // In Test Mode, autofill missing basics to ensure success
        if (testMode) {
            if (!data.companyType) updateData({ companyType: 'software' })
            if (!data.companyName) updateData({ companyName: 'Test Company' })
            if (!data.website) updateData({ website: 'https://example.com' })

            const dataToSave = {
                ...data,
                companyType: data.companyType || 'software',
                companyName: data.companyName || 'Test Company',
                website: data.website || 'https://example.com'
            }

            await saveWithData(dataToSave)
            return
        }

        // Guard: Don't save if data is still INITIAL_DATA (to prevent empty overwrites)
        if (!data.website && !data.companyName) {
            console.warn("handleSaveLater blocked: data is empty/uninitialized. Either the user clicked too fast or something triggered this automatically.", { workspaceId, data })
            return
        }

        await saveWithData(data)
    }

    const saveWithData = async (dataToSave: OnboardingData) => {

        try {
            setIsNavigating(true)
            console.log("Saving for later...", { testMode, hasBasics: !!(dataToSave.companyName && dataToSave.website && dataToSave.companyType) })

            // Clear local storage first to prevent it from reloading if the page somehow sticks/refreshes
            localStorage.removeItem(`onboarding_data_${workspaceId}`)
            localStorage.removeItem(`onboarding_step_${workspaceId}`)
            localStorage.removeItem(`onboarding_completed_${workspaceId}`)
            localStorage.removeItem(`onboarding_testmode_${workspaceId}`)

            const result = await saveOnboardingDataToMarkdown(workspaceId, dataToSave, testMode)
            if (result.success) {
                console.log("Save successful")
                // Trigger worldview generation on save for later
                generateWorldview(workspaceId).catch(err => console.error("Background worldview gen failed", err))
            } else {
                console.error("Save failed result:", result)
            }
            // Force a full reload to ensure fresh workspace status
            window.location.href = "/workspaces"
        } catch (error) {
            console.error("handleSaveLater error:", error)
            window.location.href = "/workspaces"
        }
    }

    if (isLoading) return <div className="flex h-screen items-center justify-center bg-white">Loading...</div>

    const currentStep = ONBOARDING_STEPS[currentStepIndex]

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1)
            const scrollContainer = document.querySelector('main > div.overflow-y-auto')
            if (scrollContainer) scrollContainer.scrollTop = 0
        }
    }

    const handleStepClick = async (index: number) => {
        if (completedSteps.includes(ONBOARDING_STEPS[index].id) || index < currentStepIndex) {
            await saveOnboardingDataToMarkdown(workspaceId, data, testMode)
            setCurrentStepIndex(index)
            const scrollContainer = document.querySelector('main > div.overflow-y-auto')
            if (scrollContainer) scrollContainer.scrollTop = 0
        }
    }

    return (
        <OnboardingLayout
            currentStepId={currentStep.id}
            completedSteps={completedSteps}
            onNext={handleNext}
            onBack={currentStepIndex > 0 ? handleBack : undefined}
            onStepClick={handleStepClick}
            onSaveLater={handleSaveLater}
            companyType={data.companyType}
            faviconUrl={faviconUrl}
            testMode={testMode}
            setTestMode={setTestMode}
            isScraping={isScraping}
        >
            {currentStep.id === 'company-basics' && <CompanyBasics data={data} updateData={updateData} isScraping={isScraping} setIsScraping={setIsScraping} setFaviconUrl={setFaviconUrl} />}
            {currentStep.id === 'offer-strategy' && <ProductStrategy data={data} updateData={updateData} />}
            {currentStep.id === 'voice-dna' && <VoiceDNA data={data} updateData={updateData} />}
            {currentStep.id === 'goal' && <Goal data={data} updateData={updateData} />}
        </OnboardingLayout>
    )
}
