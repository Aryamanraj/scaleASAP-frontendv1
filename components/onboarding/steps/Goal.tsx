"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepContent } from "../StepContent"
import { OnboardingData } from "@/lib/onboarding-data"
import { MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline"

interface GoalProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
}

export function Goal({ data, updateData }: GoalProps) {
    return (
        <StepContent
            title="Your Goal"
            description="Help us understand what you want to achieve with ScaleASAP."
        >
            <div className="space-y-10">
                {/* Goal Selection */}
                <div className="space-y-4">
                    <Label className="text-base text-[#4A4A4A] font-medium">What is your primary goal right now?</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => updateData({ onboardingGoal: 'discover' })}
                            className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all duration-200 text-left hover:border-[#43B97B]/50 ${data.onboardingGoal === 'discover'
                                ? 'border-[#43B97B] bg-[#43B97B]/5 ring-1 ring-[#43B97B]'
                                : 'border-gray-100 bg-white hover:bg-gray-50'
                                }`}
                        >
                            <MagnifyingGlassIcon className={`w-8 h-8 mb-4 ${data.onboardingGoal === 'discover' ? 'text-[#43B97B]' : 'text-gray-400'}`} />
                            <h3 className="font-semibold text-[#4A4A4A] mb-1">Discover my ICP</h3>
                            <p className="text-sm text-gray-500">I want ScaleASAP to help me find who my best customers are.</p>
                        </button>

                        <button
                            onClick={() => updateData({ onboardingGoal: 'refine' })}
                            className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all duration-200 text-left hover:border-[#43B97B]/50 ${data.onboardingGoal === 'refine'
                                ? 'border-[#43B97B] bg-[#43B97B]/5 ring-1 ring-[#43B97B]'
                                : 'border-gray-100 bg-white hover:bg-gray-50'
                                }`}
                        >
                            <SparklesIcon className={`w-8 h-8 mb-4 ${data.onboardingGoal === 'refine' ? 'text-[#43B97B]' : 'text-gray-400'}`} />
                            <h3 className="font-semibold text-[#4A4A4A] mb-1">Refine my direction</h3>
                            <p className="text-sm text-gray-500">I already have an idea of my ICP, I want to optimize and scale it.</p>
                        </button>
                    </div>
                </div>

                {/* ICP Definition */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="targetICP" className="text-base font-medium text-[#4A4A4A]">
                            Who do you think is your Ideal Customer Profile (ICP)?
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Even if you want to discover it, tell us your &quot;best guess&quot; or who you&apos;ve been targeting so far.
                        </p>
                        <Textarea
                            id="targetICP"
                            className="min-h-[120px]"
                            placeholder="Example: Series A B2B SaaS founders in the US who just hired their first sales lead..."
                            value={data.targetICP}
                            onChange={(e) => updateData({ targetICP: e.target.value })}
                        />
                    </div>
                </div>

                {/* Confidence Level */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-base font-medium text-[#4A4A4A]">
                            How confident are you in this ICP?
                        </Label>
                        <p className="text-sm text-muted-foreground">Scale from &quot;Just Guessing&quot; to &quot;Highly Confident&quot;.</p>
                    </div>

                    <div className="px-4">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#43B97B]"
                            value={data.icpConfidence}
                            onChange={(e) => updateData({ icpConfidence: parseInt(e.target.value) })}
                        />
                        <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                            <span>Just Guessing</span>
                            <span>Directionally Correct</span>
                            <span>Highly Confident</span>
                        </div>
                    </div>

                    <div className="bg-[#43B97B]/5 border border-[#43B97B]/20 rounded-lg p-4 mt-6">
                        <p className="text-sm text-[#43B97B] font-medium flex items-center gap-2">
                            <SparklesIcon className="w-4 h-4" />
                            {data.icpConfidence <= 30 && "That's okay! We'll start with broad experiments to find your winners."}
                            {data.icpConfidence > 30 && data.icpConfidence <= 70 && "Solid start. We'll help you sharpen this into a scalable system."}
                            {data.icpConfidence > 70 && "Great! We'll look for hidden patterns to make your outreach even more effective."}
                        </p>
                    </div>
                </div>
            </div>
        </StepContent>
    )
}
