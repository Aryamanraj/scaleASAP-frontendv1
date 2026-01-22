"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepContent } from "../StepContent"
import { OnboardingData } from "@/lib/onboarding-data"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface ProductStrategyProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
}

export function ProductStrategy({ data, updateData }: ProductStrategyProps) {
    const isServices = data.companyType === 'services';

    const updateDeliveryProcess = (step: 'step1' | 'step2' | 'step3', value: string) => {
        const current = data.deliveryProcess || { step1: '', step2: '', step3: '' };
        updateData({ deliveryProcess: { ...current, [step]: value } });
    };

    const toggleDeliverable = (item: string) => {
        const current = data.deliverables || [];
        const next = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];
        updateData({ deliverables: next });
    };

    const updateMetrics = (field: keyof NonNullable<OnboardingData['afterStateMetrics']>, value: string) => {
        const current = data.afterStateMetrics || { timeSaved: '', revenueIncrease: '', costReduction: '', manualEliminated: '', other: '' };
        updateData({ afterStateMetrics: { ...current, [field]: value } });
    };

    if (isServices) {
        return (
            <StepContent
                title="Offer Strategy"
                description="Define what you deliver and how you deliver it."
            >
                {/* What You Actually Do */}
                <div className="space-y-8 border-b border-gray-100 pb-8">
                    <h3 className="text-lg font-medium text-[#4A4A4A]">What You Actually Do</h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="coreOffer" className="text-base">Your Core Offer:</Label>
                            <p className="text-sm text-muted-foreground">In one sentence: What do you deliver and what outcome do you guarantee?</p>
                            <Textarea
                                id="coreOffer"
                                placeholder='Example: "We book 10 qualified meetings in 30 days using behavioral profiling"'
                                value={data.coreOffer}
                                onChange={(e) => updateData({ coreOffer: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4 pt-2">
                            <Label className="text-base text-[#4A4A4A]">The Delivery Process:</Label>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4">
                                    <Label className="w-32 shrink-0 font-normal text-muted-foreground">Step 1 (Week 1):</Label>
                                    <Input
                                        placeholder="_____"
                                        value={data.deliveryProcess?.step1}
                                        onChange={(e) => updateDeliveryProcess('step1', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="w-32 shrink-0 font-normal text-muted-foreground">Step 2 (Week 2-3):</Label>
                                    <Input
                                        placeholder="_____"
                                        value={data.deliveryProcess?.step2}
                                        onChange={(e) => updateDeliveryProcess('step2', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="w-32 shrink-0 font-normal text-muted-foreground">Step 3 (Week 4+):</Label>
                                    <Input
                                        placeholder="_____"
                                        value={data.deliveryProcess?.step3}
                                        onChange={(e) => updateDeliveryProcess('step3', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <Label className="text-base text-[#4A4A4A]">What They Get at the End:</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'files', label: 'Deliverable files (what: _____) field:deliverablesOther' },
                                    { id: 'system', label: 'Running system/process' },
                                    { id: 'dfy', label: 'Done-for-you ongoing' },
                                    { id: 'training', label: 'Training/handoff' },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`del-${item.id}`}
                                            checked={data.deliverables?.includes(item.id)}
                                            onCheckedChange={() => toggleDeliverable(item.id)}
                                        />
                                        <Label htmlFor={`del-${item.id}`} className="font-normal cursor-pointer">{item.label.split(' (')[0]}</Label>
                                    </div>
                                ))}
                                <div className="flex items-center space-x-2">
                                    <Label className="font-normal">Other:</Label>
                                    <Input
                                        className="h-8"
                                        value={data.deliverablesOther || ''}
                                        onChange={(e) => updateData({ deliverablesOther: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The States */}
                <div className="space-y-8 border-b border-gray-100 pb-8">
                    <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-2">
                            <Label htmlFor="beforeState" className="text-base text-[#4A4A4A]">
                                The Before State:
                            </Label>
                            <p className="text-sm text-muted-foreground">What was broken/painful/manual before you stepped in?</p>
                            <Textarea
                                id="beforeState"
                                className="min-h-[100px]"
                                value={data.beforeState}
                                onChange={(e) => updateData({ beforeState: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base text-[#4A4A4A]">The After State:</Label>
                            <p className="text-sm text-muted-foreground">What specifically changes in their business/day-to-day?</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Label className="shrink-0 font-normal">Time saved: </Label>
                                    <Input
                                        size={5}
                                        className="h-8 w-24"
                                        placeholder="hrs/week"
                                        value={data.afterStateMetrics?.timeSaved}
                                        onChange={(e) => updateMetrics('timeSaved', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="shrink-0 font-normal">Revenue increase: $</Label>
                                    <Input
                                        className="h-8 w-32"
                                        value={data.afterStateMetrics?.revenueIncrease}
                                        onChange={(e) => updateMetrics('revenueIncrease', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="shrink-0 font-normal">Cost reduction: $</Label>
                                    <Input
                                        className="h-8 w-32"
                                        value={data.afterStateMetrics?.costReduction}
                                        onChange={(e) => updateMetrics('costReduction', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="shrink-0 font-normal">Process eliminated: </Label>
                                    <Input
                                        className="h-8"
                                        value={data.afterStateMetrics?.manualEliminated}
                                        onChange={(e) => updateMetrics('manualEliminated', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 col-span-full">
                                    <Label className="shrink-0 font-normal">Other:</Label>
                                    <Input
                                        className="h-8"
                                        value={data.afterStateMetrics?.other}
                                        onChange={(e) => updateMetrics('other', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service Economics */}
                <div className="space-y-8 border-b border-gray-100 pb-8">
                    <h3 className="text-lg font-medium text-[#4A4A4A]">Service Economics</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className="text-base">Pricing model:</Label>
                            <RadioGroup
                                value={data.pricingModel}
                                onValueChange={(val) => updateData({ pricingModel: val as '' | 'monthly' | 'project' | 'performance' | 'hybrid' })}
                                className="grid gap-2"
                            >
                                {[
                                    { id: 'monthly', label: 'Monthly retainer' },
                                    { id: 'project', label: 'Project-based' },
                                    { id: 'performance', label: 'Performance-based' },
                                    { id: 'hybrid', label: 'Hybrid' },
                                ].map((opt) => (
                                    <div key={opt.id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={opt.id} id={`price-${opt.id}`} />
                                        <Label htmlFor={`price-${opt.id}`} className="font-normal cursor-pointer">{opt.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            <div className="flex items-center gap-2 pt-1">
                                <Label className="shrink-0 font-normal">Details: $</Label>
                                <Input
                                    className="h-8"
                                    value={data.pricingDetails || ''}
                                    onChange={(e) => updateData({ pricingDetails: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Setup/onboarding fee:</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">$</span>
                                    <Input
                                        className="h-8"
                                        value={data.setupFee}
                                        onChange={(e) => updateData({ setupFee: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Contract length (months):</Label>
                                <Input
                                    className="h-8"
                                    value={data.contractLength}
                                    onChange={(e) => updateData({ contractLength: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Time to results:</Label>
                                <Input
                                    className="h-8"
                                    placeholder="e.g. 30 days"
                                    value={data.timeToResults}
                                    onChange={(e) => updateData({ timeToResults: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Capacity */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium text-[#4A4A4A]">Delivery Capacity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Current clients:</Label>
                                <Input
                                    className="h-8"
                                    value={data.currentClientsCount}
                                    onChange={(e) => updateData({ currentClientsCount: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Can take on ___ more:</Label>
                                <Input
                                    className="h-8"
                                    value={data.capacityCount}
                                    onChange={(e) => updateData({ capacityCount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base">Delivery bottleneck:</Label>
                            <RadioGroup
                                value={data.deliveryBottleneck}
                                onValueChange={(val) => updateData({ deliveryBottleneck: val as '' | 'time' | 'team' | 'tools' | 'other' })}
                                className="grid gap-2"
                            >
                                {[
                                    { id: 'time', label: 'Your time' },
                                    { id: 'team', label: 'Team capacity' },
                                    { id: 'tools', label: 'Tool limitations' },
                                    { id: 'other', label: 'Other' },
                                ].map((opt) => (
                                    <div key={opt.id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={opt.id} id={`bot-${opt.id}`} />
                                        <Label htmlFor={`bot-${opt.id}`} className="font-normal cursor-pointer">{opt.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            {data.deliveryBottleneck === 'other' && (
                                <Input
                                    className="h-8 mt-1"
                                    placeholder="Please specify"
                                    value={data.deliveryBottleneckOther || ''}
                                    onChange={(e) => updateData({ deliveryBottleneckOther: e.target.value })}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </StepContent>
        );
    }

    return (
        <StepContent
            title="Product Strategy"
            description="Define the core mechanics and economics of your business."
        >
            {/* What You Actually Built */}
            <div className="space-y-8 border-b border-gray-100 pb-8">
                <h3 className="text-lg font-medium text-[#4A4A4A]">What You Actually Built</h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="oneSentencePitch">
                            In one sentence: What problem do you solve and who pays you?
                        </Label>
                        <Textarea
                            id="oneSentencePitch"
                            placeholder="Provide a one-sentence pitch..."
                            value={data.oneSentencePitch}
                            onChange={(e) => updateData({ oneSentencePitch: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4 pt-2">
                        <Label className="text-base text-[#4A4A4A]">Walk through the core mechanic:</Label>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="userDoes" className="font-normal text-muted-foreground">User does:</Label>
                                <Input
                                    id="userDoes"
                                    placeholder="Enter action details..."
                                    value={data.userDoes}
                                    onChange={(e) => updateData({ userDoes: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="productDoes" className="font-normal text-muted-foreground">Product does:</Label>
                                <Input
                                    id="productDoes"
                                    placeholder="Enter process details..."
                                    value={data.productDoes}
                                    onChange={(e) => updateData({ productDoes: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="userGets" className="font-normal text-muted-foreground">User gets:</Label>
                                <Input
                                    id="userGets"
                                    placeholder="Enter outcome details..."
                                    value={data.userGets}
                                    onChange={(e) => updateData({ userGets: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="beforeState">
                                What&apos;s the &apos;Before State&apos; problem?
                            </Label>
                            <p className="text-xs text-muted-foreground">What was broken/painful/frustrating before your product existed?</p>
                            <Textarea
                                id="beforeState"
                                className="min-h-[100px]"
                                value={data.beforeState}
                                onChange={(e) => updateData({ beforeState: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="afterState">
                                What&apos;s the &apos;After State&apos; outcome?
                            </Label>
                            <p className="text-xs text-muted-foreground">Not features. What actually changes in their work/life?</p>
                            <Textarea
                                id="afterState"
                                className="min-h-[100px]"
                                value={data.afterState}
                                onChange={(e) => updateData({ afterState: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* The Economics */}
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-[#4A4A4A]">The Economics</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                placeholder="e.g. $100/month"
                                value={data.price}
                                onChange={(e) => updateData({ price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salesCycle">Average sales cycle (days)</Label>
                            <Input
                                id="salesCycle"
                                type="number"
                                placeholder="e.g. 14"
                                value={data.salesCycle}
                                onChange={(e) => updateData({ salesCycle: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Decision Process</Label>
                        <RadioGroup
                            value={data.decisionProcess}
                            onValueChange={(val) => updateData({ decisionProcess: val })}
                            className="flex flex-col gap-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="first-call" id="dec-first" />
                                <Label htmlFor="dec-first" className="font-normal cursor-pointer">Decides on first call</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="trial" id="dec-trial" />
                                <Label htmlFor="dec-trial" className="font-normal cursor-pointer">Needs trial period</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="committee" id="dec-committee" />
                                <Label htmlFor="dec-committee" className="font-normal cursor-pointer">Committee/team decision</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="dec-other" />
                                <Label htmlFor="dec-other" className="font-normal cursor-pointer">Other</Label>
                            </div>
                        </RadioGroup>
                        {data.decisionProcess === 'other' && (
                            <Input
                                placeholder="Please specify"
                                value={data.decisionProcessOther || ''}
                                onChange={(e) => updateData({ decisionProcessOther: e.target.value })}
                            />
                        )}
                    </div>
                </div>
            </div>
        </StepContent>
    )
}
