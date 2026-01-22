"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepContent } from "../StepContent"
import { OnboardingData } from "@/lib/onboarding-data"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CustomerEvidenceProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
}

export function CustomerEvidence({ data, updateData }: CustomerEvidenceProps) {

    const updateBestCustomer = (index: number, field: string, value: string | string[]) => {
        const newCustomers = [...data.bestCustomers];
        newCustomers[index] = { ...newCustomers[index], [field]: value };
        updateData({ bestCustomers: newCustomers });
    };

    const toggleSignal = (index: number, signal: string) => {
        const currentSignals = data.bestCustomers[index].signals || [];
        const newSignals = currentSignals.includes(signal)
            ? currentSignals.filter(s => s !== signal)
            : [...currentSignals, signal];
        updateBestCustomer(index, 'signals', newSignals);
    };

    const toggleOutcome = (index: number, outcome: string) => {
        const currentOutcomes = data.bestCustomers[index].outcomes || [];
        const newOutcomes = currentOutcomes.includes(outcome)
            ? currentOutcomes.filter(o => o !== outcome)
            : [...currentOutcomes, outcome];
        updateBestCustomer(index, 'outcomes', newOutcomes);
    };

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
            title="Customer Evidence ⚡"
            description="We need forensic detail on who actually converted and why."
        >
            {/* Critical Gate */}
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-[#4A4A4A] mb-4">CRITICAL GATE: Do you have paying customers?</h3>
                <RadioGroup
                    value={data.hasPayingCustomers === null ? undefined : (data.hasPayingCustomers ? "yes" : "no")}
                    onValueChange={(val) => updateData({ hasPayingCustomers: val === "yes" })}
                    className="flex gap-8"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="has-paying-yes" />
                        <Label htmlFor="has-paying-yes" className="font-semibold cursor-pointer">YES</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="has-paying-no" />
                        <Label htmlFor="has-paying-no" className="font-semibold cursor-pointer">NO (Skip this section)</Label>
                    </div>
                </RadioGroup>
            </div>

            {data.hasPayingCustomers && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">

                    {/* Revenue Reality */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Total paying customers</Label>
                            <Input
                                type="number"
                                value={data.totalCustomers}
                                onChange={(e) => updateData({ totalCustomers: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total revenue to date</Label>
                            <Input
                                placeholder="$"
                                value={data.totalRevenue}
                                onChange={(e) => updateData({ totalRevenue: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Monthly recurring</Label>
                            <Input
                                placeholder="$"
                                value={data.monthlyRecurring}
                                onChange={(e) => updateData({ monthlyRecurring: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-[#4A4A4A]">Your Best 3 Customers</h3>
                            <span className="text-sm text-muted-foreground">Forensic detail needed</span>
                        </div>

                        <Tabs defaultValue="customer-0" className="w-full">
                            <TabsList className="w-full justify-start h-auto p-1 bg-gray-100 rounded-lg mb-6">
                                <TabsTrigger value="customer-0" className="flex-1 py-2">Customer #1 (Best)</TabsTrigger>
                                <TabsTrigger value="customer-1" className="flex-1 py-2">Customer #2</TabsTrigger>
                                <TabsTrigger value="customer-2" className="flex-1 py-2">Customer #3</TabsTrigger>
                            </TabsList>

                            {[0, 1, 2].map((index) => (
                                <TabsContent key={index} value={`customer-${index}`} className="space-y-6">
                                    <Card className="border-gray-200 shadow-sm">
                                        <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
                                            <CardTitle className="text-base font-medium">Basic Info</CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                                            <div className="space-y-2">
                                                <Label>Name/Company</Label>
                                                <Input
                                                    value={data.bestCustomers[index].name}
                                                    onChange={(e) => updateBestCustomer(index, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Their role</Label>
                                                <Input
                                                    value={data.bestCustomers[index].role}
                                                    onChange={(e) => updateBestCustomer(index, 'role', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Company size</Label>
                                                <Input
                                                    value={data.bestCustomers[index].companySize}
                                                    onChange={(e) => updateBestCustomer(index, 'companySize', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Industry</Label>
                                                <Input
                                                    value={data.bestCustomers[index].industry}
                                                    onChange={(e) => updateBestCustomer(index, 'industry', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Deal size ($)</Label>
                                                <Input
                                                    value={data.bestCustomers[index].dealSize}
                                                    onChange={(e) => updateBestCustomer(index, 'dealSize', e.target.value)}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="space-y-4">
                                        <h4 className="font-medium">The Journey</h4>
                                        <div className="grid gap-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>How&apos;d you find them?</Label>
                                                    <Input
                                                        value={data.bestCustomers[index].source}
                                                        onChange={(e) => updateBestCustomer(index, 'source', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Days to close</Label>
                                                    <Input
                                                        value={data.bestCustomers[index].timeToClose}
                                                        onChange={(e) => updateBestCustomer(index, 'timeToClose', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>What they said their problem was:</Label>
                                                <Input
                                                    value={data.bestCustomers[index].statedProblem}
                                                    onChange={(e) => updateBestCustomer(index, 'statedProblem', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>What they ACTUALLY use it for:</Label>
                                                <Input
                                                    value={data.bestCustomers[index].actualUse}
                                                    onChange={(e) => updateBestCustomer(index, 'actualUse', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium">Behavioral Signals</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                "Just raised funding",
                                                "Recent hire/fire",
                                                "Posted about pain publicly",
                                                "Came inbound",
                                                "Job change",
                                                "Company hit milestone",
                                                "Busy season approaching",
                                                "Tool/process failed"
                                            ].map((signal) => (
                                                <div key={signal} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`signal-${index}-${signal}`}
                                                        checked={data.bestCustomers[index].signals?.includes(signal)}
                                                        onCheckedChange={() => toggleSignal(index, signal)}
                                                    />
                                                    <Label htmlFor={`signal-${index}-${signal}`} className="font-normal cursor-pointer">{signal}</Label>
                                                </div>
                                            ))}
                                            <div className="flex items-center space-x-2">
                                                <Label className="font-normal w-12">Other:</Label>
                                                <Input
                                                    className="h-8"
                                                    value={data.bestCustomers[index].otherSignal || ''}
                                                    onChange={(e) => updateBestCustomer(index, 'otherSignal', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Their Exact Words (Quote)</Label>
                                        <Textarea
                                            placeholder="Enter details..."
                                            value={data.bestCustomers[index].quote}
                                            onChange={(e) => updateBestCustomer(index, 'quote', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium">What Changed (Results)</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                "Time saved",
                                                "Money saved",
                                                "Revenue gained",
                                                "Problem eliminated"
                                            ].map((outcome) => (
                                                <div key={outcome} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`outcome-${index}-${outcome}`}
                                                        checked={data.bestCustomers[index].outcomes?.includes(outcome)}
                                                        onCheckedChange={() => toggleOutcome(index, outcome)}
                                                    />
                                                    <Label htmlFor={`outcome-${index}-${outcome}`} className="font-normal cursor-pointer">{outcome}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Lost Customers */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-[#4A4A4A]">The Ones That Got Away</h3>

                        <div className="space-y-4">
                            <Label className="text-base">Who looked perfect but didn&apos;t convert?</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    "No urgency signals",
                                    "Different pain trigger",
                                    "Wrong timing"
                                ].map((reason) => (
                                    <div key={reason} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`lost-${reason}`}
                                            checked={data.lostCustomers.perfectButDidntConvert?.includes(reason)}
                                            onCheckedChange={() => handleLostReasonToggle(reason)}
                                        />
                                        <Label htmlFor={`lost-${reason}`} className="font-normal cursor-pointer">{reason}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Who churned or stopped using? Why?</Label>
                                <Input
                                    value={data.lostCustomers.churnedWhy}
                                    onChange={(e) => updateData({
                                        lostCustomers: { ...data.lostCustomers, churnedWhy: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>What you missed:</Label>
                                <Input
                                    value={data.lostCustomers.churnedMissed}
                                    onChange={(e) => updateData({
                                        lostCustomers: { ...data.lostCustomers, churnedMissed: e.target.value }
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StepContent>
    )
}
