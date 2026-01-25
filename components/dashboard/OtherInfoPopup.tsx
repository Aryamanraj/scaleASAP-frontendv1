"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { OTHER_INFO_STEPS, OnboardingData } from '@/lib/onboarding-data'
import { FoundingStory } from '../onboarding/steps/FoundingStory'
import { CustomerEvidence } from '../onboarding/steps/CustomerEvidence'
import { WorldviewIntelligence } from '../onboarding/steps/WorldviewIntelligence'
import { CurrentGTM } from '../onboarding/steps/CurrentGTM'
import { SuccessDefinition } from '../onboarding/steps/SuccessDefinition'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { saveOnboardingDataToMarkdown } from '@/app/actions/onboarding'

interface OtherInfoPopupProps {
    workspaceId: string
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
    isOpen: boolean
    onClose: () => void
}

import { SidebarStepper } from '../onboarding/SidebarStepper'
import { BuildingOfficeIcon } from '@heroicons/react/24/outline'

export function OtherInfoPopup({ workspaceId, data, updateData, isOpen, onClose }: OtherInfoPopupProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [isSaving, setIsSaving] = useState(false)

    const currentStep = OTHER_INFO_STEPS[currentStepIndex]
    const completedSteps = OTHER_INFO_STEPS.slice(0, currentStepIndex).map(s => s.id)

    const handleNext = async () => {
        if (currentStepIndex < OTHER_INFO_STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1)
        } else {
            setIsSaving(true)
            await saveOnboardingDataToMarkdown(workspaceId, data, false, true)
            setIsSaving(false)
            onClose()
        }
    }

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1)
        }
    }

    const handleSaveForLater = async () => {
        setIsSaving(true)
        await saveOnboardingDataToMarkdown(workspaceId, data, false, true)
        setIsSaving(false)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent showCloseButton={false} className="sm:max-w-[1050px] w-[1050px] h-[750px] p-0 overflow-hidden bg-[#F9FAFB] border-none shadow-2xl rounded-3xl flex flex-row gap-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <VisuallyHidden>
                    <DialogTitle>Complete Deep Profile</DialogTitle>
                </VisuallyHidden>

                {/* Left Sidebar - Floating Card Style */}
                <aside className="w-[300px] bg-white border border-[#EEEEEE] rounded-2xl shadow-sm flex flex-col shrink-0 overflow-hidden m-2">
                    <div className="p-8 pb-4">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
                            <BuildingOfficeIcon className="h-6 w-6 text-[#43B97B]" />
                        </div>
                        <h1 className="text-xl font-semibold text-[#4A4A4A]">Other Details</h1>
                        <p className="text-sm text-muted-foreground">Forensic ICP Info</p>
                    </div>
                    <div className="flex-1 overflow-y-auto px-8 pb-8">
                        <SidebarStepper
                            currentStepId={currentStep.id}
                            completedSteps={completedSteps}
                            onStepClick={(idx) => setCurrentStepIndex(idx)}
                            steps={OTHER_INFO_STEPS}
                        />
                    </div>
                </aside>

                {/* Main Content Area - Floating Card Style */}
                <main className="w-[720px] flex flex-col shrink-0 bg-white rounded-2xl border border-[#EEEEEE] shadow-sm relative overflow-hidden m-2 ml-0">
                    {/* Close Button UI */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 z-30"
                    >
                        <XMarkIcon className="size-5" />
                    </button>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto min-h-0 relative">
                        <div className="p-12 pb-24 scroll-smooth">
                            <div className="max-w-2xl mx-auto w-full">
                                {currentStep.id === 'founding-story' && <FoundingStory data={data} updateData={updateData} />}
                                {currentStep.id === 'customer-evidence' && <CustomerEvidence data={data} updateData={updateData} />}
                                {currentStep.id === 'worldview-intelligence' && <WorldviewIntelligence data={data} updateData={updateData} />}
                                {currentStep.id === 'gtm-reality' && <CurrentGTM data={data} updateData={updateData} />}
                                {currentStep.id === 'success-definition' && <SuccessDefinition data={data} updateData={updateData} />}
                            </div>
                        </div>
                    </div>

                    {/* Fixed Footer within the card */}
                    <div className="border-t border-gray-100 bg-white p-6 px-12 flex items-center justify-between shrink-0 z-20">
                        <Button variant="ghost" onClick={handleSaveForLater} className="text-muted-foreground hover:text-[#4A4A4A]">
                            Save for later
                        </Button>

                        <div className="flex items-center gap-4">
                            {currentStepIndex > 0 && (
                                <Button
                                    variant="secondary"
                                    onClick={handleBack}
                                    className="h-9 px-8"
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                onClick={handleNext}
                                disabled={isSaving}
                                className="min-w-[140px] shadow-lg shadow-[#43B97B]/10 h-9 px-8 bg-[#43B97B] hover:bg-[#3aa86d] text-white"
                            >
                                {currentStepIndex === OTHER_INFO_STEPS.length - 1 ? (isSaving ? 'Saving...' : 'Finish') : 'Continue'}
                            </Button>
                        </div>
                    </div>
                </main>
            </DialogContent>
        </Dialog>
    )
}
