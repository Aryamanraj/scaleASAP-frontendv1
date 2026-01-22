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
            <div className="space-y-6 border-b border-gray-100 pb-8">
                <div className="space-y-2">
                    <Label htmlFor="contentExamples" className="text-base">Drop Your Content</Label>
                    <p className="text-sm text-muted-foreground">
                        Paste 5-10 examples of how you ACTUALLY communicate (LinkedIn, Emails, DMs, etc):
                    </p>
                    <Textarea
                        id="contentExamples"
                        className="min-h-[200px] font-mono text-sm bg-gray-50/50"
                        placeholder="Enter details..."
                        value={data.contentExamples}
                        onChange={(e) => updateData({ contentExamples: e.target.value })}
                    />
                </div>
            </div>

            {/* Fingerprint */}
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-[#4A4A4A]">Voice Fingerprint</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>How you start messages:</Label>
                        <Input
                            value={data.startMessages}
                            onChange={(e) => updateData({ startMessages: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>How you end messages:</Label>
                        <Input
                            value={data.endMessages}
                            onChange={(e) => updateData({ endMessages: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Words you use A LOT:</Label>
                        <Input
                            value={data.wordsUsed}
                            onChange={(e) => updateData({ wordsUsed: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Words you NEVER use:</Label>
                        <Input
                            value={data.wordsNeverUsed}
                            onChange={(e) => updateData({ wordsNeverUsed: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="space-y-3">
                        <Label>Emoji usage</Label>
                        <RadioGroup
                            value={data.emojiUsage}
                            onValueChange={(val) => updateData({ emojiUsage: val })}
                            className="flex gap-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="never" id="emoji-never" />
                                <Label htmlFor="emoji-never" className="font-normal cursor-pointer">Never</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="rarely" id="emoji-rarely" />
                                <Label htmlFor="emoji-rarely" className="font-normal cursor-pointer">Rarely (👍 ✅)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="often" id="emoji-often" />
                                <Label htmlFor="emoji-often" className="font-normal cursor-pointer">Often (🚀 💡 🔥)</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Label className="text-base">The &ldquo;Chaos Test&rdquo;</Label>
                        <p className="text-sm text-muted-foreground">Someone asks: &ldquo;How&apos;s it going?&rdquo; You say:</p>
                        <RadioGroup
                            value={data.chaosTest}
                            onValueChange={(val) => updateData({ chaosTest: val })}
                            className="grid gap-2"
                        >
                            {[
                                "Great! Just shipped X...",
                                "Honestly, a bit chaotic but...",
                                "Interesting - we're figuring out X...",
                                "Brutal. Here's what's broken...",
                            ].map((opt) => (
                                <div key={opt} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt} id={opt} />
                                    <Label htmlFor={opt} className="font-normal cursor-pointer">{opt}</Label>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="chaos-other" />
                                <Label htmlFor="chaos-other" className="font-normal cursor-pointer">Other</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>
        </StepContent>
    )
}
