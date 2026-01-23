"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StepContent } from "../StepContent"
import { OnboardingData } from "@/lib/onboarding-data"
import { GlobeAltIcon, BuildingOfficeIcon, WindowIcon, ArrowPathIcon, DocumentTextIcon, ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { SocialIcon } from "../SocialIcon"
import { scrapeWebsite } from "@/app/actions/scrape"

interface CompanyBasicsProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
    isScraping?: boolean
    setIsScraping?: (value: boolean) => void
    setFaviconUrl?: (url: string | undefined) => void
}

export function CompanyBasics({ data, updateData, isScraping = false, setIsScraping, setFaviconUrl }: CompanyBasicsProps) {
    const [scrapingStatus, setScrapingStatus] = useState<string>("")
    const lastScrapedUrl = useRef<string>("")

    const handleWebsiteBlur = async () => {
        const url = data.website;
        if (!url || url === "https://" || url.length < 10) return;

        // Don't re-scrape the same URL
        if (url === lastScrapedUrl.current) return;
        lastScrapedUrl.current = url;

        // Clear previous socials immediately when starting a new scrape
        updateData({
            linkedin: "",
            twitter: "",
            youtube: "",
            telegram: "",
            slack: "",
            termsUrl: "",
            privacyUrl: "",
            companyDescription: "",
            favicon_url: "",
            website_scrape: ""
        });

        setIsScraping?.(true);
        setScrapingStatus("Fetching website data...");

        try {
            const result = await scrapeWebsite(url);
            if (result.success && result.data) {
                console.log("Website scraped successfully");
                const parsed = JSON.parse(result.data);

                // Update favicon immediately
                if (parsed.favicon) {
                    setFaviconUrl?.(parsed.favicon);
                    updateData({ favicon_url: parsed.favicon });
                }

                setScrapingStatus("Extracting social profiles...");

                // Update socials immediately
                updateData({
                    linkedin: parsed.socials?.linkedin || "",
                    twitter: parsed.socials?.twitter || "",
                    youtube: parsed.socials?.youtube || "",
                    telegram: parsed.socials?.telegram || "",
                    slack: parsed.socials?.slack || "",
                    termsUrl: parsed.policies?.terms || "",
                    privacyUrl: parsed.policies?.privacy || ""
                });

                setScrapingStatus("Generating AI summary...");

                // Update the full scrape data and description
                updateData({
                    website_scrape: result.data,
                    companyDescription: parsed.companyDescription || parsed.description || ""
                });
            }
        } catch (error) {
            console.error("Scraping failed", error);
            setScrapingStatus("");
        } finally {
            setIsScraping?.(false);
            setScrapingStatus("");
        }
    }
    return (
        <StepContent
            title="Company Basics"
            description="Let's start with the basics."
        >
            <div className="space-y-8">
                {/* Company Type Selection Section unchanged */}
                <div className="space-y-4">
                    <Label className="text-base text-[#4A4A4A] font-medium">What type of company is this?</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => updateData({ companyType: 'services' })}
                            className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all duration-200 text-left hover:border-[#43B97B]/50 ${data.companyType === 'services'
                                ? 'border-[#43B97B] bg-[#43B97B]/5 ring-1 ring-[#43B97B]'
                                : 'border-gray-100 bg-white hover:bg-gray-50'
                                }`}
                        >
                            <BuildingOfficeIcon className={`w-8 h-8 mb-4 ${data.companyType === 'services' ? 'text-[#43B97B]' : 'text-gray-400'}`} />
                            <h3 className="font-semibold text-[#4A4A4A] mb-1">Services</h3>
                            <p className="text-sm text-gray-500">Agencies, consultancies, and service providers.</p>
                        </button>

                        <button
                            onClick={() => updateData({ companyType: 'software' })}
                            className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all duration-200 text-left hover:border-[#43B97B]/50 ${data.companyType === 'software'
                                ? 'border-[#43B97B] bg-[#43B97B]/5 ring-1 ring-[#43B97B]'
                                : 'border-gray-100 bg-white hover:bg-gray-50'
                                }`}
                        >
                            <WindowIcon className={`w-8 h-8 mb-4 ${data.companyType === 'software' ? 'text-[#43B97B]' : 'text-gray-400'}`} />
                            <h3 className="font-semibold text-[#4A4A4A] mb-1">Software</h3>
                            <p className="text-sm text-gray-500">SaaS, apps, and digital platforms.</p>
                        </button>
                    </div>
                </div>

                {/* Company Basics Inputs */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company name</Label>
                        <Input
                            id="companyName"
                            placeholder="Acme Corp"
                            value={data.companyName}
                            onChange={(e) => updateData({ companyName: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="userName">Your Name</Label>
                            <Input
                                id="userName"
                                placeholder="John Doe"
                                value={data.userName}
                                onChange={(e) => updateData({ userName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="personalLinkedin">Personal LinkedIn URL</Label>
                            <Input
                                id="personalLinkedin"
                                placeholder="linkedin.com/in/johndoe"
                                value={data.personalLinkedin}
                                onChange={(e) => updateData({ personalLinkedin: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3 flex items-center pointer-events-none text-gray-400">
                                {isScraping ? (
                                    <ArrowPathIcon className="h-4 w-4 animate-spin text-[#43B97B]" />
                                ) : (
                                    <GlobeAltIcon className="h-4 w-4" />
                                )}
                            </div>
                            <div className="absolute left-10 h-5 w-[1px] bg-gray-200"></div>
                            <div className="absolute left-14 pointer-events-none text-gray-500 text-sm font-medium">https://</div>
                            <Input
                                id="website"
                                placeholder="yourwebsite.com"
                                value={data.website.replace('https://', '')}
                                onChange={(e) => updateData({ website: `https://${e.target.value}` })}
                                onBlur={handleWebsiteBlur}
                                className="pl-[6.5rem]"
                            />
                        </div>

                        {/* Scraping Status Banner */}
                        {isScraping && scrapingStatus && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#43B97B]/10 border border-[#43B97B]/20 animate-in fade-in slide-in-from-top-2 duration-300">
                                <ArrowPathIcon className="h-4 w-4 animate-spin text-[#43B97B]" />
                                <span className="text-sm font-medium text-[#43B97B]">{scrapingStatus}</span>
                            </div>
                        )}

                        {/* AI Summary Box */}
                        {data.companyDescription && !isScraping && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-[#43B97B]/5 to-transparent border border-[#43B97B]/10 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#43B97B]/10 flex items-center justify-center">
                                    <SparklesIcon className="h-4 w-4 text-[#43B97B]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-[#43B97B] uppercase tracking-wide mb-1">AI Summary</p>
                                    <p className="text-sm text-[#4A4A4A] leading-relaxed">{data.companyDescription}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <SocialIcon brand="linkedin" className="h-5 w-5" />
                                </div>
                                <Input
                                    id="linkedin"
                                    placeholder="company-name"
                                    value={data.linkedin}
                                    onChange={(e) => updateData({ linkedin: e.target.value })}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter / X</Label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <SocialIcon brand="twitter" className="h-4 w-4" />
                                </div>
                                <Input
                                    id="twitter"
                                    placeholder="username"
                                    value={data.twitter}
                                    onChange={(e) => updateData({ twitter: e.target.value })}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* More Socials - Only show if any additional socials are found */}
                    {(data.youtube || data.telegram || data.slack) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            {data.youtube && (
                                <div className="space-y-2">
                                    <Label htmlFor="youtube">YouTube</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <SocialIcon brand="youtube" className="h-5 w-5" />
                                        </div>
                                        <Input
                                            id="youtube"
                                            placeholder="C/channel-name"
                                            value={data.youtube}
                                            onChange={(e) => updateData({ youtube: e.target.value })}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            )}

                            {data.telegram && (
                                <div className="space-y-2">
                                    <Label htmlFor="telegram">Telegram</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <SocialIcon brand="telegram" className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="telegram"
                                            placeholder="t.me/username"
                                            value={data.telegram}
                                            onChange={(e) => updateData({ telegram: e.target.value })}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            )}

                            {data.slack && (
                                <div className="space-y-2">
                                    <Label htmlFor="slack">Slack Community</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <SocialIcon brand="slack" className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="slack"
                                            placeholder="workspace.slack.com"
                                            value={data.slack}
                                            onChange={(e) => updateData({ slack: e.target.value })}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </StepContent>
    )
}
