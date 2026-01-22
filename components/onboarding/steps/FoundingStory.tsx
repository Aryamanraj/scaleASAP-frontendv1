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
            {/* The Trigger Section */}
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-[#4A4A4A]">The Trigger</h3>

                <div className="space-y-3">
                    <Label htmlFor="triggerMoment" className="text-base font-medium text-[#4A4A4A]">
                        What specific moment made you think &apos;someone needs to fix this&apos;?
                    </Label>
                    <p className="text-sm text-muted-foreground/80 font-normal">Be specific - what happened? Who was involved? What broke?</p>
                    <Textarea
                        id="triggerMoment"
                        className="min-h-[140px] text-base"
                        placeholder="Enter details..."
                        value={data.triggerMoment}
                        onChange={(e) => updateData({ triggerMoment: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {/* Background */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-[#4A4A4A]">Your Background</h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Your Role</Label>
                                <Input
                                    id="role"
                                    placeholder="e.g. Founder"
                                    value={data.founderRole}
                                    onChange={(e) => updateData({ founderRole: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="teamSize" className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Team Size</Label>
                                <Select value={data.teamSize} onValueChange={(val) => updateData({ teamSize: val })}>
                                    <SelectTrigger>
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

                            <div className="space-y-3">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Stage</Label>
                                <RadioGroup
                                    value={data.stage}
                                    onValueChange={(val) => updateData({ stage: val })}
                                    className="flex flex-col gap-3 pt-1"
                                >
                                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:bg-gray-50 transition-colors">
                                        <RadioGroupItem value="pre-revenue" id="pre-rev" />
                                        <Label htmlFor="pre-rev" className="font-normal cursor-pointer text-[#4A4A4A]">Pre-revenue (building)</Label>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:bg-gray-50 transition-colors">
                                        <RadioGroupItem value="first-revenue" id="first-rev" />
                                        <Label htmlFor="first-rev" className="font-normal cursor-pointer text-[#4A4A4A]">First revenue ({'<'} $10K)</Label>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:bg-gray-50 transition-colors">
                                        <RadioGroupItem value="early-traction" id="early-trac" />
                                        <Label htmlFor="early-trac" className="font-normal cursor-pointer text-[#4A4A4A]">Early traction ($10K-100K ARR)</Label>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:bg-gray-50 transition-colors">
                                        <RadioGroupItem value="scaling" id="scaling" />
                                        <Label htmlFor="scaling" className="font-normal cursor-pointer text-[#4A4A4A]">Scaling ($100K+ ARR)</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    {/* Funding Reality */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-[#4A4A4A]">Funding Reality</h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                {['Bootstrapped', 'Friends & Family', 'Pre-seed/Seed', 'Series A+'].map((type) => (
                                    <div key={type} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors bg-white">
                                        <Checkbox
                                            id={type}
                                            className="mt-0.5 border-gray-300 data-[state=checked]:bg-[#43B97B] data-[state=checked]:border-[#43B97B]"
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
                                        <Label htmlFor={type} className="font-medium cursor-pointer text-[#4A4A4A] leading-tight">{type}</Label>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1 pt-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Runway</Label>
                                <Select value={data.runway} onValueChange={(val) => updateData({ runway: val })}>
                                    <SelectTrigger>
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
                </div>
            </div>
        </StepContent>
    )
}
