"use client"

import { SidebarStepper } from "./SidebarStepper"
import { Button } from "@/components/ui/button"
import { BuildingOfficeIcon, WindowIcon, BeakerIcon } from "@heroicons/react/24/outline"
import { ONBOARDING_STEPS } from "@/lib/onboarding-data"

interface OnboardingLayoutProps {
    children: React.ReactNode
    currentStepId: string
    completedSteps: string[]
    onNext: () => void
    onBack?: () => void
    onSaveLater: () => void
    onStepClick?: (index: number) => void
    companyType?: string
    faviconUrl?: string
    testMode: boolean
    setTestMode: (value: boolean) => void
    isScraping?: boolean
}

export function OnboardingLayout({
    children,
    currentStepId,
    completedSteps,
    onNext,
    onBack,
    onSaveLater,
    onStepClick,
    companyType,
    faviconUrl,
    testMode,
    setTestMode,
    isScraping
}: OnboardingLayoutProps) {
    const WorkspaceIcon = companyType === 'software' ? WindowIcon : BuildingOfficeIcon

    return (
        <div className="flex h-screen w-full bg-[#F9FAFB] p-2 gap-2 overflow-hidden font-sans">
            {/* Left Sidebar - Floating Card */}
            <aside className="w-[320px] bg-white border border-[#EEEEEE] rounded-2xl shadow-sm flex-col hidden lg:flex shrink-0 z-30 relative overflow-hidden">
                <div className="p-8 pb-4">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                        {faviconUrl ? (
                            <img src={faviconUrl} alt="Company Favicon" className="h-7 w-7 object-contain" />
                        ) : (
                            <WorkspaceIcon className="h-6 w-6 text-[#43B97B]" />
                        )}
                    </div>
                    <h1 className="text-xl font-semibold text-[#4A4A4A]">Onboarding</h1>
                    <p className="text-sm text-muted-foreground">Setup your workspace</p>
                </div>
                <div className="flex-1 overflow-y-auto px-8 pb-8">
                    <SidebarStepper
                        currentStepId={currentStepId}
                        completedSteps={completedSteps}
                        onStepClick={onStepClick}
                        companyType={companyType}
                        steps={ONBOARDING_STEPS}
                    />
                </div>

                {/* Test Mode Toggle */}
                <div className="px-8 pb-6 border-t border-gray-100 pt-4">
                    <button
                        onClick={() => setTestMode(!testMode)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${testMode ? 'bg-[#43B97B] text-white' : 'bg-white border border-gray-200 text-gray-400'
                            }`}>
                            <BeakerIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="text-xs font-medium text-[#4A4A4A]">
                                Test Mode {testMode ? 'ON' : 'OFF'}
                            </div>
                            <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                                {testMode ? 'Only basics required' : 'All fields required'}
                            </div>
                        </div>
                        <div className={`w-8 h-4 rounded-full transition-colors relative ${testMode ? 'bg-[#43B97B]' : 'bg-gray-300'
                            }`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${testMode ? 'translate-x-[18px]' : 'translate-x-0.5'
                                }`} />
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content Area - Floating Card */}
            <main className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl border border-[#EEEEEE] shadow-sm relative overflow-hidden">
                {/* Header for Mobile */}
                <header className="lg:hidden h-16 border-b border-gray-100 bg-white flex items-center px-4 shrink-0">
                    <span className="font-semibold text-[#4A4A4A]">Step {ONBOARDING_STEPS.findIndex(s => s.id === currentStepId) + 1} of {ONBOARDING_STEPS.length}</span>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto min-h-0 relative">
                    <div className="p-6 md:p-12 pb-24 scroll-smooth">
                        <div className="max-w-2xl mx-auto w-full space-y-12">
                            {children}
                        </div>
                    </div>
                </div>

                {/* Fixed Footer within the card */}
                <div className="border-t border-gray-100 bg-white p-6 px-8 lg:px-12 flex items-center justify-between shrink-0 z-20">
                    <Button variant="ghost" onClick={onSaveLater} className="text-muted-foreground hover:text-[#4A4A4A]">
                        Save for later
                    </Button>

                    <div className="flex items-center gap-4">
                        {onBack && (
                            <Button
                                variant="secondary"
                                onClick={onBack}
                                className="h-9 px-8"
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={onNext}
                            disabled={isScraping}
                            className="min-w-[140px] shadow-lg shadow-[#43B97B]/10 h-9 px-8 bg-[#43B97B] hover:bg-[#3aa86d] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isScraping ? 'Analyzing...' : 'Continue'}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
