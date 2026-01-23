"use client"

import { CheckIcon } from "@heroicons/react/20/solid"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ONBOARDING_STEPS, OnboardingStep } from "@/lib/onboarding-data"

interface SidebarStepperProps {
    currentStepId: string
    completedSteps: string[]
    onStepClick?: (index: number) => void
    companyType?: string
    steps: OnboardingStep[]
}

export function SidebarStepper({ currentStepId, completedSteps, onStepClick, companyType, steps }: SidebarStepperProps) {
    return (
        <div className="w-full max-w-xs py-4 hidden lg:block">
            <div className="relative flex flex-col gap-0">
                {steps.map((step: OnboardingStep, index: number) => {
                    const isCompleted = completedSteps.includes(step.id)
                    const isCurrent = currentStepId === step.id
                    const isLast = index === steps.length - 1

                    const canNavigateTo = completedSteps.includes(step.id) || isCompleted || index === steps.findIndex((s: OnboardingStep) => s.id === currentStepId)

                    const title = step.title;

                    return (
                        <div
                            key={step.id}
                            className={cn(
                                "relative flex gap-4 pb-8 h-full group",
                                canNavigateTo ? "cursor-pointer" : "cursor-default"
                            )}
                            onClick={() => canNavigateTo && onStepClick?.(index)}
                        >
                            {/* Vertical Line */}
                            {!isLast && (
                                <div
                                    className={cn(
                                        "absolute left-[7px] top-[24px] bottom-0 w-[2px] h-[calc(100%-20px)] border-l-2",
                                        isCompleted ? "border-[#43B97B]" : "border-dashed border-gray-200"
                                    )}
                                />
                            )}

                            {/* Circle/Icon */}
                            <div
                                className={cn(
                                    "relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-200 mt-1",
                                    isCompleted
                                        ? "bg-[#43B97B] text-white"
                                        : isCurrent
                                            ? "bg-white text-[#43B97B]"
                                            : "border-2 border-gray-200 bg-white"
                                )}
                            >
                                {isCompleted ? (
                                    <CheckIcon className="h-3 w-3 stroke-[3]" />
                                ) : isCurrent ? (
                                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                                ) : (
                                    <div className="h-2 w-2 rounded-full bg-transparent" />
                                )}
                            </div>

                            {/* Text */}
                            <div className="flex flex-col justify-center min-h-[16px]">
                                <span
                                    className={cn(
                                        "text-sm font-medium transition-colors duration-200 leading-tight",
                                        isCurrent ? "text-[#4A4A4A]" : isCompleted ? "text-[#4A4A4A]/80" : "text-gray-400"
                                    )}
                                >
                                    {title}
                                </span>
                                {/* Only show description for current step to keep it tight */}
                                {isCurrent && step.description && (
                                    <span
                                        className="text-xs leading-snug mt-1 text-muted-foreground/70 max-w-[200px] animate-in fade-in slide-in-from-left-2 duration-300"
                                    >
                                        {step.description}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
