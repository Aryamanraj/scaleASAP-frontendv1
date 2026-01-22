"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { EmptyStateIllustration } from './EmptyStateIllustration'

interface OverviewEmptyStateProps {
    userName?: string
    onStartDiscovery?: () => void
}

export function OverviewEmptyState({ userName, onStartDiscovery }: OverviewEmptyStateProps) {
    const firstName = userName && userName !== 'there' ? userName.split(' ')[0] : 'Sahil'
    const headline = `Hey ${firstName}, Let&apos;s Find your ICP`

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
                    <p className="text-[#666666] text-sm leading-relaxed max-w-[480px] mx-auto">
                        Your company worldview is ready. Let&apos;s launch your first experiment and start finding your ideal customers.
                    </p>
                </div>

                {/* Action */}
                <div className="pt-2">
                    <Button
                        onClick={onStartDiscovery}
                        className="bg-[#43B97B] hover:bg-[#3CA66F] text-white h-9 px-8 rounded-md text-sm font-medium transition-all"
                    >
                        Start ICP Discovery
                    </Button>
                </div>
            </div>
        </div>
    )
}
