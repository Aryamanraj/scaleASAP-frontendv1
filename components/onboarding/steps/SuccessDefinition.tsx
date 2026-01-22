"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepContent } from "../StepContent"
import { OnboardingData } from "@/lib/onboarding-data"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface SuccessDefinitionProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
}

export function SuccessDefinition({ data, updateData }: SuccessDefinitionProps) {

    const toggleQuitCondition = (condition: string) => {
        const current = data.quitConditions || [];
        const newConditions = current.includes(condition)
            ? current.filter(c => c !== condition)
            : [...current, condition];
        updateData({ quitConditions: newConditions });
    };

    return (
        <StepContent
            title="Success Definition"
            description="What does winning look like in the next 90 days? We need to align on this."
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

                {/* Next 90 Days */}
                <div className="space-y-6">
                    <h3 className="font-medium text-[#4A4A4A]">What Success Looks Like (Next 90 Days)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="rev-goal">Revenue Goal ($)</Label>
                            <Input
                                id="rev-goal"
                                value={data.revenueGoal}
                                onChange={(e) => updateData({ revenueGoal: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cust-goal">Customer Goal (count)</Label>
                            <Input
                                id="cust-goal"
                                type="number"
                                value={data.customerGoal}
                                onChange={(e) => updateData({ customerGoal: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="key-metric">Key metric (meetings, trials, etc)</Label>
                        <Input
                            id="key-metric"
                            placeholder="e.g. 10 meetings"
                            value={data.keyMetric}
                            onChange={(e) => updateData({ keyMetric: e.target.value })}
                        />
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Pressure */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-base">Timeline Pressure: &ldquo;When do you need this working?&rdquo;</Label>
                        <RadioGroup
                            value={data.timelinePressure}
                            onValueChange={(val) => updateData({ timelinePressure: val })}
                            className="grid gap-3 pt-2"
                        >
                            {[
                                "NOW (burning cash, urgent)",
                                "30 days (runway pressure)",
                                "90 days (next milestone)",
                                "6+ months (building sustainable)"
                            ].map((opt) => (
                                <div key={opt} className="flex items-center space-x-2">
                                    <RadioGroupItem value={opt} id={opt} />
                                    <Label htmlFor={opt} className="font-normal cursor-pointer">{opt}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Meeting Quality */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="good-meeting" className="text-base">What qualifies as a &apos;good&apos; meeting?</Label>
                        <p className="text-sm text-muted-foreground">Examples: Decision-maker level, $1M+ revenue, specific pain point present</p>
                        <Textarea
                            id="good-meeting"
                            className="min-h-[100px]"
                            placeholder="Enter details..."
                            value={data.goodMeetingDefinition}
                            onChange={(e) => updateData({ goodMeetingDefinition: e.target.value })}
                        />
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Quit Conditions */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-base">What would make you cancel in 30 days?</Label>
                        <div className="grid gap-3 pt-2">
                            {[
                                "No quality conversations",
                                "Conversations but no deals",
                                "Getting banned on platforms",
                                "Takes too much time"
                            ].map((opt) => (
                                <div key={opt} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`quit-${opt}`}
                                        checked={data.quitConditions?.includes(opt)}
                                        onCheckedChange={() => toggleQuitCondition(opt)}
                                    />
                                    <Label htmlFor={`quit-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2">
                                <Label className="font-normal w-12">Other:</Label>
                                <Input
                                    className="h-8"
                                    value={data.quitConditionOther || ''}
                                    onChange={(e) => updateData({ quitConditionOther: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </StepContent>
    )
}
