"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepContent } from "../StepContent"
import { OnboardingData } from "@/lib/onboarding-data"

interface WorldviewIntelligenceProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
}

export function WorldviewIntelligence({ data, updateData }: WorldviewIntelligenceProps) {
    return (
        <StepContent
            title="Worldview Intelligence"
            description="This is what separates you from every other outbound tool. How do your customers see their world?"
        >
            <div className="space-y-8">

                <div className="space-y-2">
                    <Label htmlFor="metaphors" className="text-base">
                        When your best customer describes their day-to-day struggles, what metaphors do they use?
                    </Label>
                    <p className="text-sm text-muted-foreground">Examples: Farmers say &ldquo;drought years&rdquo; / Founders say &ldquo;runway&rdquo; / Operations say &ldquo;putting out fires&rdquo;</p>
                    <Textarea
                        id="metaphors"
                        className="min-h-[100px]"
                        placeholder="Enter details..."
                        value={data.customerMetaphors}
                        onChange={(e) => updateData({ customerMetaphors: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pride" className="text-base">
                        What are they proud of that others wouldn&apos;t understand?
                    </Label>
                    <p className="text-sm text-muted-foreground">What identity do they hold that matters to them?</p>
                    <Textarea
                        id="pride"
                        className="min-h-[100px]"
                        placeholder="Enter details..."
                        value={data.customerPride}
                        onChange={(e) => updateData({ customerPride: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="frustration" className="text-base">
                        What frustration feels uniquely theirs?
                    </Label>
                    <p className="text-sm text-muted-foreground">Not generic pain - what specific thing makes them different?</p>
                    <Textarea
                        id="frustration"
                        className="min-h-[100px]"
                        placeholder="Enter details..."
                        value={data.customerFrustration}
                        onChange={(e) => updateData({ customerFrustration: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="onePhrase" className="text-base">
                        If you could only use one phrase to describe their world, what is it?
                    </Label>
                    <Textarea
                        id="onePhrase"
                        placeholder="Enter details..."
                        value={data.onePhraseWorld}
                        onChange={(e) => updateData({ onePhraseWorld: e.target.value })}
                    />
                </div>

            </div>
        </StepContent>
    )
}
