"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StepContent } from "../StepContent"
import { OnboardingData } from "@/lib/onboarding-data"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface FoundingStoryProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
}

export function FoundingStory({ data, updateData }: FoundingStoryProps) {
    return (
        <StepContent
            title="The Founding Story"
            description="Your origin story reveals your worldview and who you naturally attract."
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                    <Label htmlFor="trigger" className="text-base">
                        What was the &ldquo;Eureka&rdquo; moment?
                    </Label>
                    <p className="text-sm text-muted-foreground">Why did you start this? What absolute truth did you see that everyone else was missing?</p>
                    <Textarea
                        id="trigger"
                        className="min-h-[120px]"
                        placeholder="e.g. I realized that X was broken because of Y, and nobody was doing Z..."
                        value={data.triggerMoment}
                        onChange={(e) => updateData({ triggerMoment: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label htmlFor="role" className="text-base">Your Role</Label>
                        <Input
                            id="role"
                            placeholder="e.g. Founder/CEO"
                            value={data.founderRole}
                            onChange={(e) => updateData({ founderRole: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="teamSize" className="text-base">Team Size</Label>
                        <Select value={data.teamSize} onValueChange={(val) => updateData({ teamSize: val })}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="solo">Solo</SelectItem>
                                <SelectItem value="2-3">2-3 People</SelectItem>
                                <SelectItem value="4-10">4-10 People</SelectItem>
                                <SelectItem value="10+">10+ People</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-base">Stage</Label>
                        <RadioGroup
                            value={data.stage}
                            onValueChange={(val) => updateData({ stage: val })}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {[
                                { id: 'pre-rev', value: 'pre-revenue', label: 'Pre-revenue (building)' },
                                { id: 'first-rev', value: 'first-revenue', label: 'First revenue (< $10K)' },
                                { id: 'early-trac', value: 'early-traction', label: 'Early traction ($10K-100K ARR)' },
                                { id: 'scaling', value: 'scaling', label: 'Scaling ($100K+ ARR)' }
                            ].map((opt) => (
                                <div key={opt.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt.value} id={opt.id} />
                                    <Label htmlFor={opt.id} className="font-normal cursor-pointer">{opt.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-base">Funding Type</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {['Bootstrapped', 'Friends & Family', 'Pre-seed/Seed', 'Series A+'].map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={type}
                                        checked={data.fundingType?.includes(type)}
                                        onCheckedChange={(checked) => {
                                            const current = data.fundingType || [];
                                            if (checked) {
                                                updateData({ fundingType: [...current, type] });
                                            } else {
                                                updateData({ fundingType: current.filter(t => t !== type) });
                                            }
                                        }}
                                    />
                                    <Label htmlFor={type} className="font-normal cursor-pointer">{type}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-base">Current Runway</Label>
                        <p className="text-sm text-muted-foreground">Be honest—it helps us understand your timeline pressure.</p>
                        <Select value={data.runway} onValueChange={(val) => updateData({ runway: val })}>
                            <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select runway" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="<3mo">{'<'} 3 months</SelectItem>
                                <SelectItem value="3-6mo">3-6 months</SelectItem>
                                <SelectItem value="6-12mo">6-12 months</SelectItem>
                                <SelectItem value="12mo+">12 months +</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </StepContent>
    )
}
