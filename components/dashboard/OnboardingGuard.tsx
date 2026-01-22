"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Workspace } from '@/app/actions/workspaces'

interface OnboardingGuardProps {
    workspace: Workspace
}

export function OnboardingGuard({ workspace }: OnboardingGuardProps) {
    const router = useRouter()
    const domain = workspace.website?.replace('https://', '').replace('http://', '').split('/')[0]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white border border-[#EEEEEE] rounded-[32px] shadow-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="mx-auto mb-6 size-20 bg-gray-100 rounded-[20px] flex items-center justify-center border border-[#EEEEEE] p-4 overflow-hidden">
                    {(workspace.favicon_url || domain) ? (
                        <img
                            src={workspace.favicon_url || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
                            alt=""
                            className="h-10 w-10 object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://pub-3d3b224ee6544903a80a5051e75e33a4.r2.dev/BLUE_BG.png";
                            }}
                        />
                    ) : (
                        <img
                            src="https://pub-3d3b224ee6544903a80a5051e75e33a4.r2.dev/BLUE_BG.png"
                            alt=""
                            className="h-10 w-10 object-contain"
                        />
                    )}
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-[#4A4A4A] mb-3">Onboarding Incomplete</h2>
                <p className="text-gray-500 mb-8 leading-relaxed max-w-[320px] mx-auto">
                    You haven&apos;t finished setting up <span className="font-semibold text-[#333333]">{workspace.name}</span>. Please complete the onboarding to unlock your dashboard.
                </p>

                <div className="flex gap-3 w-full">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex-1 h-9 bg-white border-[#EEEEEE] hover:bg-gray-50 text-[#4A4A4A] rounded-md text-sm font-medium transition-all active:scale-[0.98]"
                    >
                        Go Back
                    </Button>

                    <Button
                        onClick={() => router.push(`/onboarding/${workspace.id}`)}
                        className="flex-1 h-9 bg-[#43B97B] hover:bg-[#3CA66F] text-white rounded-md text-sm font-medium transition-all active:scale-[0.98] shadow-sm shadow-[#43B97B]/20"
                    >
                        Complete Onboarding
                    </Button>
                </div>

            </div>
        </div>
    )
}
