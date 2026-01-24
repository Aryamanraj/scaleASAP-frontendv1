"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepContent } from "../StepContent"
import { OnboardingData } from "@/lib/onboarding-data"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
                title="About Your Offer"
                description="Define what you deliver and how you deliver it."
            >
                {/* Service Type Selection */}
                <div className="space-y-2 pb-6 border-b border-gray-100">
                    <Label className="text-base text-[#4A4A4A] font-medium">What kind of service do you provide?</Label>
                    <Select value={data.serviceType} onValueChange={(val) => updateData({ serviceType: val })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="agencymarketing">Marketing Agency (SEO/PPC/Social)</SelectItem>
                            <SelectItem value="agencydev">Development Agency</SelectItem>
                            <SelectItem value="agencydesign">Design / Creative Agency</SelectItem>
                            <SelectItem value="consulting_strategy">Strategy Consulting</SelectItem>
                            <SelectItem value="consulting_ops">Operations Consulting</SelectItem>
                            <SelectItem value="consulting_gtm">GTM / Sales Consulting</SelectItem>
                            <SelectItem value="recruiting">Recruiting / Staffing</SelectItem>
                            <SelectItem value="legal">Legal Services</SelectItem>
                            <SelectItem value="financial">Financial / Accounting Services</SelectItem>
                            <SelectItem value="coaching">Business Coaching</SelectItem>
                            <SelectItem value="managed_services">Managed IT Services (MSP)</SelectItem>
                            <SelectItem value="other">Other Professional Services</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* What You Actually Do */}
                <div className="space-y-8 pb-8 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-[#4A4A4A]">What You Actually Do</h3>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="coreOffer" className="text-sm font-medium">Your Core Offer:</Label>
                            <p className="text-sm text-muted-foreground">In one sentence: What do you deliver and what outcome do you guarantee?</p>
                            <Textarea
                                id="coreOffer"
                                placeholder='Example: "We book 10 qualified meetings in 30 days using behavioral profiling"'
                                value={data.coreOffer}
                                onChange={(e) => updateData({ coreOffer: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base text-[#4A4A4A] font-medium">The Delivery Process:</Label>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-normal text-muted-foreground">Step 1 (Week 1):</Label>
                                    <Input
                                        placeholder="_____"
                                        value={data.deliveryProcess?.step1}
                                        onChange={(e) => updateDeliveryProcess('step1', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-normal text-muted-foreground">Step 2 (Week 2-3):</Label>
                                    <Input
                                        placeholder="_____"
                                        value={data.deliveryProcess?.step2}
                                        onChange={(e) => updateDeliveryProcess('step2', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-normal text-muted-foreground">Step 3 (Week 4+):</Label>
                                    <Input
                                        placeholder="_____"
                                        value={data.deliveryProcess?.step3}
                                        onChange={(e) => updateDeliveryProcess('step3', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base text-[#4A4A4A] font-medium">What They Get at the End:</Label>
                            <div className="flex flex-col gap-3">
                                {[
                                    { id: 'files', label: 'Deliverable files' },
                                    { id: 'system', label: 'Running system/process' },
                                    { id: 'dfy', label: 'Done-for-you ongoing' },
                                    { id: 'training', label: 'Training/handoff' },
                                    { id: 'other', label: 'Other' },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`del-${item.id}`}
                                            checked={data.deliverables?.includes(item.id)}
                                            onCheckedChange={() => toggleDeliverable(item.id)}
                                        />
                                        <Label htmlFor={`del-${item.id}`} className="font-normal text-sm cursor-pointer">{item.label}</Label>
                                    </div>
                                ))}

                                {data.deliverables?.includes('other') && (
                                    <div className="pt-1 pl-6">
                                        <Input
                                            className="h-9"
                                            placeholder="Please specify other deliverables"
                                            value={data.deliverablesOther || ''}
                                            onChange={(e) => updateData({ deliverablesOther: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>



                {/* Service Economics */}
                <div className="space-y-8 pb-8 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-[#4A4A4A]">Service Economics</h3>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Pricing Page URL (Optional):</Label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 pointer-events-none text-gray-500 text-sm font-medium">https://</div>
                                <Input
                                    placeholder="yourwebsite.com/pricing"
                                    value={data.pricingPage?.replace('https://', '')}
                                    onChange={(e) => updateData({ pricingPage: `https://${e.target.value}` })}
                                    className="h-10 pl-14"
                                />
                            </div>
                        </div>
                        {/* Pricing Model - Vertical */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Pricing model:</Label>
                            <RadioGroup
                                value={data.pricingModel}
                                onValueChange={(val) => updateData({ pricingModel: val as '' | 'monthly' | 'project' | 'performance' | 'hybrid' })}
                                className="flex flex-col gap-3"
                            >
                                {[
                                    { id: 'monthly', label: 'Monthly retainer' },
                                    { id: 'project', label: 'Project-based' },
                                    { id: 'performance', label: 'Performance-based' },
                                    { id: 'hybrid', label: 'Hybrid' },
                                ].map((opt) => (
                                    <div key={opt.id} className="flex items-center space-x-3">
                                        <RadioGroupItem value={opt.id} id={`price-${opt.id}`} />
                                        <Label htmlFor={`price-${opt.id}`} className="font-normal text-sm cursor-pointer">{opt.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>

                            <div className="flex items-center gap-3 pt-1">
                                <Label className="shrink-0 font-normal text-xs text-muted-foreground">Price Details:</Label>
                                <div className="relative flex-1 max-w-[180px]">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                    <Input
                                        className="h-9 pl-6 text-sm"
                                        placeholder="e.g. 5,000"
                                        value={data.pricingDetails || ''}
                                        onChange={(e) => updateData({ pricingDetails: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Economic Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Setup Fee</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                    <Input
                                        className="h-10 pl-6"
                                        placeholder="0.00"
                                        value={data.setupFee}
                                        onChange={(e) => updateData({ setupFee: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contract Length</Label>
                                <Input
                                    className="h-10"
                                    placeholder="e.g. 6 months"
                                    value={data.contractLength}
                                    onChange={(e) => updateData({ contractLength: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time to Results</Label>
                                <Input
                                    className="h-10"
                                    placeholder="e.g. 30 days"
                                    value={data.timeToResults}
                                    onChange={(e) => updateData({ timeToResults: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Capacity */}
                <div className="space-y-8 pb-8 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-[#4A4A4A]">Delivery Capacity</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Clients</Label>
                                <Input
                                    className="h-10"
                                    placeholder="e.g. 12"
                                    value={data.currentClientsCount}
                                    onChange={(e) => updateData({ currentClientsCount: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Available Slots</Label>
                                <Input
                                    className="h-10"
                                    placeholder="e.g. 3"
                                    value={data.capacityCount}
                                    onChange={(e) => updateData({ capacityCount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Delivery bottleneck:</Label>
                            <RadioGroup
                                value={data.deliveryBottleneck}
                                onValueChange={(val) => updateData({ deliveryBottleneck: val as '' | 'time' | 'team' | 'tools' | 'other' })}
                                className="flex flex-col gap-3"
                            >
                                {[
                                    { id: 'time', label: 'Your time' },
                                    { id: 'team', label: 'Team capacity' },
                                    { id: 'tools', label: 'Tool limitations' },
                                    { id: 'other', label: 'Other' },
                                ].map((opt) => (
                                    <div key={opt.id} className="flex items-center space-x-3">
                                        <RadioGroupItem value={opt.id} id={`bot-${opt.id}`} />
                                        <Label htmlFor={`bot-${opt.id}`} className="font-normal text-sm cursor-pointer">{opt.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>

                            {data.deliveryBottleneck === 'other' && (
                                <div className="pt-1 pl-7">
                                    <Input
                                        className="h-9"
                                        placeholder="Please specify bottleneck"
                                        value={data.deliveryBottleneckOther || ''}
                                        onChange={(e) => updateData({ deliveryBottleneckOther: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Business Stage & Scale */}
                <div className="space-y-6 pt-4">
                    <h3 className="text-lg font-medium text-[#4A4A4A]">Business Stage & Scale</h3>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Current Stage:</Label>
                            <RadioGroup
                                value={data.stage}
                                onValueChange={(val) => updateData({ stage: val })}
                                className="flex flex-col gap-3"
                            >
                                {[
                                    { id: 'pre-seed', label: 'Pre-seed / Ideation' },
                                    { id: 'seed', label: 'Seed / Early Traction' },
                                    { id: 'series-a', label: 'Series A+' },
                                    { id: 'bootstrapped', label: 'Bootstrapped & Profitable' },
                                ].map((opt) => (
                                    <div key={opt.id} className="flex items-center space-x-3">
                                        <RadioGroupItem value={opt.id} id={`stage-${opt.id}`} />
                                        <Label htmlFor={`stage-${opt.id}`} className="font-normal text-sm cursor-pointer">{opt.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Monthly Revenue</Label>
                            <Input
                                className="h-10"
                                placeholder="e.g. $50k MRR"
                                value={data.totalRevenue}
                                onChange={(e) => updateData({ totalRevenue: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </StepContent>
        );
    }

    return (
        <StepContent
            title="About Your Product"
            description="Define the core mechanics and economics of your business."
        >
            {/* What You Actually Built section unchanged */}
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

                    <div className="space-y-6">
                        <Label className="text-base text-[#4A4A4A] font-medium">Walk through the core mechanic:</Label>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="userDoes" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User does</Label>
                                <Input
                                    id="userDoes"
                                    placeholder="e.g. Uploads a source document"
                                    value={data.userDoes}
                                    onChange={(e) => updateData({ userDoes: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="productDoes" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product does</Label>
                                <Input
                                    id="productDoes"
                                    placeholder="e.g. Analyzes key metrics and generates a report"
                                    value={data.productDoes}
                                    onChange={(e) => updateData({ productDoes: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="userGets" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User gets</Label>
                                <Input
                                    id="userGets"
                                    placeholder="e.g. A downloadable CSV of categorized leads"
                                    value={data.userGets}
                                    onChange={(e) => updateData({ userGets: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* The Economics */}
            <div className="space-y-8 pb-8 border-b border-gray-100">
                <h3 className="text-lg font-medium text-[#4A4A4A]">The Economics</h3>

                <div className="space-y-3">
                    <Label className="text-sm font-medium">Pricing Page URL (Optional):</Label>
                    <div className="relative flex items-center">
                        <div className="absolute left-3 pointer-events-none text-gray-500 text-sm font-medium">https://</div>
                        <Input
                            placeholder="yourwebsite.com/pricing"
                            value={data.pricingPage?.replace('https://', '')}
                            onChange={(e) => updateData({ pricingPage: `https://${e.target.value}` })}
                            className="h-10 pl-14"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground italic">We use this to analyze your business model and monetization strategy.</p>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</Label>
                            <Input
                                id="price"
                                className="h-10"
                                placeholder="e.g. $100/month"
                                value={data.price}
                                onChange={(e) => updateData({ price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salesCycle" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg. Sales Cycle (Days)</Label>
                            <Input
                                id="salesCycle"
                                className="h-10"
                                type="number"
                                placeholder="e.g. 14"
                                value={data.salesCycle}
                                onChange={(e) => updateData({ salesCycle: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Decision Process:</Label>
                        <RadioGroup
                            value={data.decisionProcess}
                            onValueChange={(val) => updateData({ decisionProcess: val })}
                            className="flex flex-col gap-3"
                        >
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="first-call" id="dec-first" />
                                <Label htmlFor="dec-first" className="font-normal text-sm cursor-pointer">Decides on first call</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="trial" id="dec-trial" />
                                <Label htmlFor="dec-trial" className="font-normal text-sm cursor-pointer">Needs trial period</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="committee" id="dec-committee" />
                                <Label htmlFor="dec-committee" className="font-normal text-sm cursor-pointer">Committee/team decision</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="other" id="dec-other" />
                                <Label htmlFor="dec-other" className="font-normal text-sm cursor-pointer">Other</Label>
                            </div>
                        </RadioGroup>
                        {data.decisionProcess === 'other' && (
                            <div className="pt-1 pl-7">
                                <Input
                                    placeholder="Please specify decision process"
                                    value={data.decisionProcessOther || ''}
                                    onChange={(e) => updateData({ decisionProcessOther: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Business Stage & Scale */}
            <div className="space-y-8 pt-4">
                <h3 className="text-lg font-medium text-[#4A4A4A]">Business Stage & Scale</h3>
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Current Stage:</Label>
                        <RadioGroup
                            value={data.stage}
                            onValueChange={(val) => updateData({ stage: val })}
                            className="flex flex-col gap-3"
                        >
                            {[
                                { id: 'pre-seed', label: 'Pre-seed / Ideation' },
                                { id: 'seed', label: 'Seed / Early Traction' },
                                { id: 'series-a', label: 'Series A+' },
                                { id: 'bootstrapped', label: 'Bootstrapped & Profitable' },
                            ].map((opt) => (
                                <div key={opt.id} className="flex items-center space-x-3">
                                    <RadioGroupItem value={opt.id} id={`stage-${opt.id}`} />
                                    <Label htmlFor={`stage-${opt.id}`} className="font-normal text-sm cursor-pointer">{opt.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue (ARR/MRR)</Label>
                            <Input
                                className="h-10"
                                placeholder="e.g. $50k MRR"
                                value={data.totalRevenue}
                                onChange={(e) => updateData({ totalRevenue: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Funding Status</Label>
                            <Input
                                className="h-10"
                                placeholder="e.g. $2M Seed raised"
                                value={data.fundingAmount}
                                onChange={(e) => updateData({ fundingAmount: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </StepContent>
    )
}
