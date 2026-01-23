"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepContent } from "../StepContent"
import { OnboardingData } from "@/lib/onboarding-data"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface VoiceDNAProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
}

export function VoiceDNA({ data, updateData }: VoiceDNAProps) {
    return (
        <StepContent
            title="Your Voice DNA"
            description="We need your actual voice, not descriptions. This enables authentic engagement."
        >

            {/* Examples */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="contentExamples" className="text-base text-[#4A4A4A] font-semibold">Voice DNA Content</Label>
                    <p className="text-sm text-muted-foreground">
                        Paste examples of how you communicate (LinkedIn posts, emails, DMs). This helps us capture your natural style, tone, and vocabulary.
                    </p>
                    <Textarea
                        id="contentExamples"
                        className="min-h-[400px] font-mono text-sm bg-gray-50/50 focus:bg-white transition-colors"
                        placeholder="Paste your content here... (more is better)"
                        value={data.contentExamples}
                        onChange={(e) => updateData({ contentExamples: e.target.value })}
                    />
                </div>
            </div>
        </StepContent>
    )
}
