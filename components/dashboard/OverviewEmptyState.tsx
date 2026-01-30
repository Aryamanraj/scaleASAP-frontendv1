"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { EmptyStateIllustration } from './EmptyStateIllustration'

interface OverviewEmptyStateProps {
    userName?: string
    onStartDiscovery?: () => void
    onSuggestedExperiments?: () => void
    isLoading?: boolean
}

export function OverviewEmptyState({ userName, onStartDiscovery, onSuggestedExperiments, isLoading }: OverviewEmptyStateProps) {
    const firstName = userName && userName !== 'there' ? userName.split(' ')[0] : 'there'
    const headline = isLoading ? "Generating Your Experiments..." : `Hey ${firstName === 'there' ? 'there' : firstName}, Let's Find your ICP`

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-md space-y-8">
                {/* Icon - keeping it minimal but floating */}
                <div className="flex justify-center mb-6">
                    <EmptyStateIllustration />
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-semibold text-[#4A4A4A] tracking-tight">
                        {headline}
                    </h2>
                    <p className="text-[#666666] text-sm leading-relaxed max-w-[480px] mx-auto min-h-[40px]">
                        {isLoading
                            ? "Analyzing your target ICP and goals to curate the best experiments for your business."
                            : "Your company worldview is ready. Let's launch your first experiment and start finding your ideal customers."
                        }
                    </p>
                </div>

                {/* Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                        onClick={onStartDiscovery}
                        disabled={isLoading}
                        className="bg-[#43B97B] hover:bg-[#3CA66F] text-white h-9 px-8 rounded-md text-sm font-medium transition-all w-full sm:w-auto"
                    >
                        Start ICP Discovery
                    </Button>
                    <Button
                        onClick={onSuggestedExperiments}
                        disabled={isLoading}
                        variant="outline"
                        className="bg-white hover:bg-gray-50 text-[#4A4A4A] border-[#EEEEEE] h-9 px-8 rounded-md text-sm font-medium transition-all w-full sm:w-auto"
                    >
                        {isLoading ? "Generating..." : "Suggest Experiments"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
