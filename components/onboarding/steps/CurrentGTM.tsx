"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StepContent } from "../StepContent"
import { OnboardingData } from "@/lib/onboarding-data"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CurrentGTMProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
}

export function CurrentGTM({ data, updateData }: CurrentGTMProps) {

    const updateStats = (section: 'coldEmailStats' | 'linkedinStats', field: string, value: string) => {
        const current = data[section] || { sent: '', replyRate: '', bestMessage: '' };
        updateData({ [section]: { ...current, [field]: value } });
    };

    const updateInbound = (field: string, value: string) => {
        const current = data.inboundStats || { traffic: '', qualitySource: '' };
        updateData({ inboundStats: { ...current, [field]: value } });
    };

    return (
        <StepContent
            title="Current GTM Reality"
            description="What have you tried so far? Be honest about the numbers."
        >
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

                    {/* Cold Email */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-[#4A4A4A]">Cold Email</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="ce-sent" className="text-base">Sent to (leads)</Label>
                                <Input
                                    id="ce-sent"
                                    type="number"
                                    placeholder="0"
                                    value={data.coldEmailStats?.sent}
                                    onChange={(e) => updateStats('coldEmailStats', 'sent', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ce-rate" className="text-base">Reply rate (%)</Label>
                                <Input
                                    id="ce-rate"
                                    placeholder="%"
                                    value={data.coldEmailStats?.replyRate}
                                    onChange={(e) => updateStats('coldEmailStats', 'replyRate', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ce-msg" className="text-base">Best message that worked</Label>
                            <Textarea
                                id="ce-msg"
                                placeholder="Enter details..."
                                className="min-h-[100px]"
                                value={data.coldEmailStats?.bestMessage}
                                onChange={(e) => updateStats('coldEmailStats', 'bestMessage', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* LinkedIn */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-[#4A4A4A]">LinkedIn</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="li-sent" className="text-base">Sent to (people)</Label>
                                <Input
                                    id="li-sent"
                                    type="number"
                                    placeholder="0"
                                    value={data.linkedinStats?.sent}
                                    onChange={(e) => updateStats('linkedinStats', 'sent', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="li-rate" className="text-base">Reply rate (%)</Label>
                                <Input
                                    id="li-rate"
                                    placeholder="%"
                                    value={data.linkedinStats?.replyRate}
                                    onChange={(e) => updateStats('linkedinStats', 'replyRate', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="li-msg" className="text-base">Best message that worked</Label>
                            <Textarea
                                id="li-msg"
                                placeholder="Enter details..."
                                className="min-h-[100px]"
                                value={data.linkedinStats?.bestMessage}
                                onChange={(e) => updateStats('linkedinStats', 'bestMessage', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Inbound */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-[#4A4A4A]">Inbound/Content</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="in-traffic" className="text-base">Traffic (visitors/mo)</Label>
                                <Input
                                    id="in-traffic"
                                    placeholder="0"
                                    value={data.inboundStats?.traffic}
                                    onChange={(e) => updateInbound('traffic', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="in-source" className="text-base">What drove quality leads?</Label>
                                <Input
                                    id="in-source"
                                    placeholder="e.g. SEO"
                                    value={data.inboundStats?.qualitySource}
                                    onChange={(e) => updateInbound('qualitySource', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="other-channels" className="text-base">Other (ads, events, referrals)</Label>
                        <Input
                            id="other-channels"
                            value={data.otherChannels}
                            onChange={(e) => updateData({ otherChannels: e.target.value })}
                        />
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* List */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-[#4A4A4A]">Your List</h3>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="list-size" className="text-base">I have a list of (contacts)</Label>
                                <Input
                                    id="list-size"
                                    placeholder="e.g. 500"
                                    value={data.listSize}
                                    onChange={(e) => updateData({ listSize: e.target.value })}
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-base">Source</Label>
                                <RadioGroup
                                    value={data.listSource}
                                    onValueChange={(val) => updateData({ listSource: val })}
                                    className="flex flex-wrap gap-6"
                                >
                                    {['Scraped', 'Bought', 'Built manually', "Don't have one"].map((src) => (
                                        <div key={src} className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={src}
                                                id={`src-${src}`}
                                            />
                                            <Label htmlFor={`src-${src}`} className="font-normal cursor-pointer text-gray-600">{src}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-4">
                                <Label className="text-base">Quality</Label>
                                <RadioGroup
                                    value={data.listQuality}
                                    onValueChange={(val) => updateData({ listQuality: val })}
                                    className="flex flex-wrap gap-6"
                                >
                                    {['Clean', 'Rough', 'Terrible'].map((q) => (
                                        <div key={q} className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={q}
                                                id={`q-${q}`}
                                            />
                                            <Label htmlFor={`q-${q}`} className="font-normal cursor-pointer text-gray-600">{q}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-base">Last touched</Label>
                                <RadioGroup
                                    value={data.listLastTouched}
                                    onValueChange={(val) => updateData({ listLastTouched: val })}
                                    className="flex flex-wrap gap-6"
                                >
                                    {['<1mo', '1-3mo', '3-6mo', 'Never'].map((t) => (
                                        <div key={t} className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={t}
                                                id={`t-${t}`}
                                            />
                                            <Label htmlFor={`t-${t}`} className="font-normal cursor-pointer text-gray-600">{t}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </StepContent>
    )
}
