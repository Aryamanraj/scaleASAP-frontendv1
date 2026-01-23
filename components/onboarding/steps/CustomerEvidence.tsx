"use client"

import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepContent } from "../StepContent"
import { OnboardingData } from "@/lib/onboarding-data"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CustomerEvidenceProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
}

export function CustomerEvidence({ data, updateData }: CustomerEvidenceProps) {

    useEffect(() => {
        // Auto-select basis last step (FoundingStory stage)
        if (data.hasPayingCustomers === null) {
            if (data.stage === 'pre-revenue') {
                updateData({ hasPayingCustomers: false });
            } else if (data.stage && data.stage !== 'pre-revenue') {
                updateData({ hasPayingCustomers: true });
            }
        }
    }, [data.stage, data.hasPayingCustomers, updateData]);

    const handleLostReasonToggle = (reason: string) => {
        const currentReasons = data.lostCustomers.perfectButDidntConvert || [];
        const newReasons = currentReasons.includes(reason)
            ? currentReasons.filter(r => r !== reason)
            : [...currentReasons, reason];
        updateData({
            lostCustomers: { ...data.lostCustomers, perfectButDidntConvert: newReasons }
        });
    };

    return (
        <StepContent
            title="Customer Evidence"
            description="A quick profile of the people who actually pay you."
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Critical Gate */}
                <div className="space-y-3">
                    <Label className="text-base font-bold text-[#4A4A4A]">Do you have paying customers?</Label>
                    <Select
                        value={data.hasPayingCustomers === null ? "" : (data.hasPayingCustomers ? "yes" : "no")}
                        onValueChange={(val) => updateData({ hasPayingCustomers: val === "yes" })}
                    >
                        <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes, we have revenue</SelectItem>
                            <SelectItem value="no">No, we are pre-revenue</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {data.hasPayingCustomers && (
                    <div className="space-y-8">
                        {/* Typical Customer Profile */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-[#4A4A4A]">Typical High-Value Customer</h3>

                            <Card className="border-gray-200 shadow-sm overflow-hidden">
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                    <div className="space-y-2">
                                        <Label className="text-base">Typical Role/Title</Label>
                                        <Input
                                            placeholder="e.g. VP of Sales, CTO"
                                            value={data.bestCustomers[0]?.role || ""}
                                            onChange={(e) => {
                                                const newBest = [...data.bestCustomers];
                                                newBest[0] = { ...newBest[0], role: e.target.value };
                                                updateData({ bestCustomers: newBest });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base">Main Industry</Label>
                                        <Input
                                            placeholder="e.g. B2B SaaS, FinTech"
                                            value={data.bestCustomers[0]?.industry || ""}
                                            onChange={(e) => {
                                                const newBest = [...data.bestCustomers];
                                                newBest[0] = { ...newBest[0], industry: e.target.value };
                                                updateData({ bestCustomers: newBest });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base">Avg. Deal Size ($)</Label>
                                        <Input
                                            placeholder="e.g. $10,000 / yr"
                                            value={data.bestCustomers[0]?.dealSize || ""}
                                            onChange={(e) => {
                                                const newBest = [...data.bestCustomers];
                                                newBest[0] = { ...newBest[0], dealSize: e.target.value };
                                                updateData({ bestCustomers: newBest });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base">Typical Close Time</Label>
                                        <Input
                                            placeholder="e.g. 30 days"
                                            value={data.bestCustomers[0]?.timeToClose || ""}
                                            onChange={(e) => {
                                                const newBest = [...data.bestCustomers];
                                                newBest[0] = { ...newBest[0], timeToClose: e.target.value };
                                                updateData({ bestCustomers: newBest });
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                <Label className="text-base font-bold text-[#4A4A4A]">How do you usually find them?</Label>
                                <Input
                                    placeholder="e.g. LinkedIn Outbound, Inbound Content..."
                                    value={data.bestCustomers[0]?.source || ""}
                                    onChange={(e) => {
                                        const newBest = [...data.bestCustomers];
                                        newBest[0] = { ...newBest[0], source: e.target.value };
                                        updateData({ bestCustomers: newBest });
                                    }}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base font-bold text-[#4A4A4A]">What is the #1 pain point they pay to solve?</Label>
                                <Textarea
                                    className="min-h-[100px]"
                                    placeholder="Details..."
                                    value={data.bestCustomers[0]?.statedProblem || ""}
                                    onChange={(e) => {
                                        const newBest = [...data.bestCustomers];
                                        newBest[0] = { ...newBest[0], statedProblem: e.target.value };
                                        updateData({ bestCustomers: newBest });
                                    }}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base font-bold text-[#4A4A4A]">What absolute result do they get?</Label>
                                <Textarea
                                    className="min-h-[100px]"
                                    placeholder="e.g. 20% more revenue in 90 days..."
                                    value={data.bestCustomers[0]?.actualUse || ""}
                                    onChange={(e) => {
                                        const newBest = [...data.bestCustomers];
                                        newBest[0] = { ...newBest[0], actualUse: e.target.value };
                                        updateData({ bestCustomers: newBest });
                                    }}
                                />
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Lost Customers */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-[#4A4A4A]">Common Pitfalls</h3>

                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Why do some perfect-looking leads not convert?</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        "No urgency signals",
                                        "Different pain trigger",
                                        "Wrong timing",
                                        "Budget constraints"
                                    ].map((reason) => (
                                        <div key={reason} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`lost-${reason}`}
                                                checked={data.lostCustomers.perfectButDidntConvert?.includes(reason)}
                                                onCheckedChange={() => handleLostReasonToggle(reason)}
                                            />
                                            <Label htmlFor={`lost-${reason}`} className="font-normal cursor-pointer text-gray-600">{reason}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base font-semibold">What is the most common reason for churn?</Label>
                                <Input
                                    placeholder="Details..."
                                    value={data.lostCustomers.churnedWhy}
                                    onChange={(e) => updateData({
                                        lostCustomers: { ...data.lostCustomers, churnedWhy: e.target.value }
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StepContent>
    )
}
