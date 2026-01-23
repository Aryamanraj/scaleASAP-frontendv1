"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
    UserIcon as UserOutline,
    ShieldCheckIcon as ShieldCheckOutline,
    LightBulbIcon as LightBulbOutline,
    DocumentTextIcon as DocumentTextOutline,
    ChevronRightIcon,
    PhoneIcon,
    EnvelopeIcon,
    ArrowLeftStartOnRectangleIcon,
    SparklesIcon
} from '@heroicons/react/24/outline'
import {
    UserIcon as UserSolid,
    ShieldCheckIcon as ShieldCheckSolid,
    LightBulbIcon as LightBulbSolid,
    DocumentTextIcon as DocumentTextSolid,
    CheckCircleIcon as CheckCircleSolid
} from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'
import { Workspace } from '@/app/actions/workspaces'
import { getOnboardingData } from '@/app/actions/onboarding'
import { OnboardingData } from '@/lib/onboarding-data'
import { OtherInfoPopup } from './OtherInfoPopup'
import { Button } from '@/components/ui/button'

interface SettingsProps {
    workspace: Workspace
    userEmail: string
}

type TabType = 'profile' | 'intelligence' | 'other-info' | 'security'

export function Settings({ workspace, userEmail }: SettingsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('profile')
    const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
    const [loading, setLoading] = useState(false)
    const [isOtherInfoOpen, setIsOtherInfoOpen] = useState(false)

    useEffect(() => {
        if ((activeTab === 'intelligence' || activeTab === 'other-info') && !onboardingData) {
            const load = async () => {
                setLoading(true)
                const data = await getOnboardingData(workspace.id)
                setOnboardingData(data)
                setLoading(false)
            }
            load()
        }
    }, [activeTab, workspace.id, onboardingData])

    const tabs = [
        { id: 'profile', outline: UserOutline, solid: UserSolid, label: 'My Profile' },
        { id: 'intelligence', outline: LightBulbOutline, solid: LightBulbSolid, label: 'Intelligence' },
        { id: 'other-info', outline: DocumentTextOutline, solid: DocumentTextSolid, label: 'Other Information' },
        { id: 'security', outline: ShieldCheckOutline, solid: ShieldCheckSolid, label: 'Security' },
    ]

    const updateOnboardingData = (updates: Partial<OnboardingData>) => {
        if (onboardingData) {
            setOnboardingData({ ...onboardingData, ...updates })
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#333333]">Setting</h1>
                    <p className="text-gray-500 mt-1">Workspace ID: {workspace.id.slice(0, 8).toUpperCase()}</p>
                </div>
            </div>

            {/* Sub-navigation */}
            <div className="flex gap-1 p-1 bg-gray-100/50 rounded-xl w-fit border border-[#EEEEEE]">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                isActive
                                    ? "bg-white text-[#333333] shadow-sm border border-[#EEEEEE]"
                                    : "text-gray-500 hover:text-[#333333] hover:bg-white/50"
                            )}
                        >
                            {isActive ? (
                                <tab.solid className="size-4 text-[#333333]" />
                            ) : (
                                <tab.outline className="size-4 text-gray-400" />
                            )}
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Content Area */}
            <div className="mt-8">
                {activeTab === 'profile' && <ProfileSection workspace={workspace} userEmail={userEmail} />}
                {activeTab === 'intelligence' && (
                    <IntelligenceSection
                        onboardingData={onboardingData}
                        loading={loading}
                    />
                )}
                {activeTab === 'other-info' && (
                    <OtherInfoSection
                        onboardingData={onboardingData}
                        loading={loading}
                        onOpenPopup={() => setIsOtherInfoOpen(true)}
                    />
                )}
                {activeTab === 'security' && <SecuritySection />}
            </div>

            {onboardingData && (
                <OtherInfoPopup
                    workspaceId={workspace.id}
                    data={onboardingData}
                    updateData={updateOnboardingData}
                    isOpen={isOtherInfoOpen}
                    onClose={() => setIsOtherInfoOpen(false)}
                />
            )}
        </div>
    )
}

function calculateConfidenceScore(data: OnboardingData): number {
    let score = 50; // Base score from onboarding
    if (data.triggerMoment) score += 10;
    if (data.founderRole) score += 2;
    if (data.teamSize) score += 2;
    if (data.runway) score += 1;
    if (data.hasPayingCustomers !== null) score += 5;
    if (data.bestCustomers?.[0]?.role) score += 10;
    if (data.bestCustomers?.[0]?.statedProblem) score += 5;
    if (data.customerMetaphors) score += 5;
    if (data.onePhraseWorld) score += 5;
    if (data.revenueGoal) score += 5;
    return Math.min(score, 100);
}

function OtherInfoSection({ onboardingData, loading, onOpenPopup }: { onboardingData: OnboardingData | null, loading: boolean, onOpenPopup: () => void }) {
    if (loading) return <div>Loading...</div>

    const score = onboardingData ? calculateConfidenceScore(onboardingData) : 0;

    return (
        <div className="max-w-3xl space-y-6">
            <div className="bg-white rounded-2xl border border-[#EEEEEE] p-8 shadow-sm">
                <div className="flex items-start gap-6">
                    <div className="p-4 bg-[#43B97B]/10 rounded-2xl">
                        <SparklesIcon className="size-8 text-[#43B97B]" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-2xl font-bold text-[#333333]">Deep Profile Your Company</h3>
                            {onboardingData && (
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Confidence Score</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-[#43B97B]">{score}%</span>
                                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#43B97B] transition-all duration-1000"
                                                style={{ width: `${score}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            Completing these questions helps our AI understand your business on a deeper level,
                            allowing it to craft much more effective outreach strategies and find higher quality leads.
                        </p>
                        <Button
                            onClick={onOpenPopup}
                            className="bg-[#43B97B] hover:bg-[#3aa86d] text-white px-8 rounded-xl h-11 transition-all font-bold shadow-lg shadow-[#43B97B]/10 flex items-center gap-2"
                        >
                            <SparklesIcon className="size-4" />
                            {onboardingData?.triggerMoment ? 'Edit Deep Profile' : 'Complete Deep Profile'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 border-t border-gray-50 pt-10">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="size-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm text-lg">💡</div>
                        <div>
                            <p className="text-xs font-bold text-[#333333]">Better Strategies</p>
                            <p className="text-[10px] text-gray-400">AI learns your unique worldview</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="size-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm text-lg">🎯</div>
                        <div>
                            <p className="text-xs font-bold text-[#333333]">Sharper Lead Discovery</p>
                            <p className="text-[10px] text-gray-400">Based on real customer evidence</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProfileSection({ workspace, userEmail }: { workspace: Workspace, userEmail: string }) {
    const [phone, setPhone] = useState('')
    const [isEditingPhone, setIsEditingPhone] = useState(false)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Personal Details Column */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#333333]">Personal Details</h2>
                </div>

                <div className="bg-white rounded-2xl border border-[#EEEEEE] p-6 shadow-sm relative group overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-16 bg-gradient-to-br from-[#43B97B]/20 to-[#43B97B]/5 rounded-2xl border border-[#43B97B]/10 flex items-center justify-center p-2.5">
                            <span className="text-2xl font-bold text-[#43B97B] uppercase">
                                {userEmail && userEmail !== 'Guest' ? userEmail.charAt(0) : 'G'}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#333333] text-lg capitalize">
                                {userEmail && userEmail !== 'Guest' ? userEmail.split('@')[0] : 'Guest User'}
                            </h3>
                            <p className="text-[11px] text-[#43B97B] font-bold uppercase tracking-widest bg-[#43B97B]/10 px-2 py-0.5 rounded-full w-fit mt-1">Active Now</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Your Role</p>
                                <div className="flex items-center gap-2 text-sm text-[#333333] font-medium">
                                    <ShieldCheckOutline className="size-4 text-gray-400" />
                                    <span>{workspace.role || 'Admin Access'}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</p>
                                <div className="flex items-center gap-2 text-sm text-[#333333] font-medium">
                                    <EnvelopeIcon className="size-4 text-gray-400" />
                                    <span className="truncate">{userEmail}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</p>
                            <div className="flex items-center justify-between group/phone bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50">
                                <div className="flex items-center gap-2 text-sm text-[#333333] font-medium">
                                    <PhoneIcon className="size-4 text-gray-400" />
                                    {isEditingPhone ? (
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Enter phone number..."
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            onBlur={() => setIsEditingPhone(false)}
                                            onKeyDown={(e) => e.key === 'Enter' && setIsEditingPhone(false)}
                                            className="bg-transparent border-none p-0 text-sm text-[#333333] focus:ring-0 w-full"
                                        />
                                    ) : (
                                        <span className={cn(!phone && "italic text-gray-300 font-normal")}>{phone || 'No phone number added'}</span>
                                    )}
                                </div>
                                {!isEditingPhone && (
                                    <button
                                        onClick={() => setIsEditingPhone(true)}
                                        className="text-xs font-bold text-[#43B97B] hover:text-[#369664] transition-colors"
                                    >
                                        {phone ? 'Edit' : 'Add'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Company Profile Column */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#333333]">Company Profile</h2>
                </div>

                <div className="bg-white rounded-2xl border border-[#EEEEEE] p-6 shadow-sm">
                    <div className="flex items-center gap-5 mb-8">
                        <div className="size-16 bg-gray-50 rounded-2xl border border-[#EEEEEE] flex items-center justify-center p-3 relative shadow-inner">
                            {(workspace.favicon_url || workspace.website) ? (
                                <img
                                    src={workspace.favicon_url || `https://www.google.com/s2/favicons?domain=${workspace.website}&sz=128`}
                                    alt=""
                                    className="h-16 w-16 object-contain"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-gray-300">{workspace.name.charAt(0)}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-[#333333] text-lg">{workspace.name}</h3>
                            <div className="flex items-center gap-2 mt-1.5">
                                <div className="size-2 rounded-full bg-[#43B97B] animate-pulse" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Workspace ID: {workspace.id.slice(0, 8)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Website</p>
                                <a
                                    href={workspace.website.startsWith('http') ? workspace.website : `https://${workspace.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold text-[#43B97B] hover:underline flex items-center gap-1"
                                >
                                    {workspace.website}
                                    <ChevronRightIcon className="size-3" />
                                </a>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Onboarding</p>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                        workspace.onboarding_status === 'complete'
                                            ? "bg-green-50 text-green-600"
                                            : "bg-amber-50 text-amber-600"
                                    )}>
                                        {workspace.onboarding_status}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start gap-3">
                            <LightBulbOutline className="size-4 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-[#333333] mb-0.5">Workspace Context</p>
                                <p className="text-[11px] text-gray-500 leading-relaxed italic">
                                    This workspace is tailored for ICP discovery. All experiments and intelligence data are isolated to this profile.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function IntelligenceSection({ onboardingData, loading }: { onboardingData: OnboardingData | null, loading: boolean }) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="size-8 border-2 border-[#43B97B] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Processing intelligence data...</p>
            </div>
        )
    }

    if (!onboardingData) {
        return (
            <div className="text-center p-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <LightBulbOutline className="size-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#333333]">No Intelligence Data Yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">Complete the onboarding process to unlock comprehensive company intelligence.</p>
            </div>
        )
    }

    const categories = [
        {
            title: "Strategy & Foundations",
            fields: [
                { label: "Company Type", value: onboardingData.companyType },
                { label: "One Sentence Pitch", value: onboardingData.oneSentencePitch },
                { label: "Target Customer (After State)", value: onboardingData.afterState },
                { label: "Success Metric", value: onboardingData.keyMetric },
            ]
        },
        {
            title: "Product Core",
            fields: [
                { label: "User Action", value: onboardingData.userDoes },
                { label: "System Action", value: onboardingData.productDoes },
                { label: "User Benefit", value: onboardingData.userGets },
                { label: "Pricing", value: onboardingData.price },
            ]
        },
        {
            title: "Customer Evidence",
            fields: [
                { label: "Has Paying Customers", value: onboardingData.hasPayingCustomers ? "Yes" : "No" },
                { label: "Total Revenue", value: onboardingData.totalRevenue },
                { label: "Monthly Recurring", value: onboardingData.monthlyRecurring },
                { label: "Top Customers", value: onboardingData.bestCustomers?.filter(c => c.name).map(c => c.name).join(", ") },
            ]
        },
        {
            title: "Worldview Details",
            fields: [
                { label: "Customer Metaphors", value: onboardingData.customerMetaphors },
                { label: "Customer Pride", value: onboardingData.customerPride },
                { label: "Customer Frustration", value: onboardingData.customerFrustration },
                { label: "One Phrase World", value: onboardingData.onePhraseWorld },
            ]
        },
        {
            title: "GTM Reality",
            fields: [
                { label: "Sales Cycle", value: `${onboardingData.salesCycle} days` },
                { label: "Revenue Goal", value: onboardingData.revenueGoal },
                { label: "Timeline Pressure", value: onboardingData.timelinePressure },
                { label: "List Size", value: onboardingData.listSize },
            ]
        },
        {
            title: "Voice DNA",
            fields: [
                { label: "Content Dump", value: onboardingData.contentExamples },
            ]
        },
        {
            title: "Goals",
            fields: [
                { label: "Primary Goal", value: onboardingData.onboardingGoal },
                { label: "Target ICP Guess", value: onboardingData.targetICP },
                { label: "ICP Confidence", value: `${onboardingData.icpConfidence}%` },
            ]
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#EEEEEE] p-6 shadow-sm">
                    <h3 className="font-bold text-[#333333] pb-4 mb-4 border-b border-gray-50">{cat.title}</h3>
                    <div className="space-y-6">
                        {cat.fields.map((field, fi) => (
                            <div key={fi}>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">{field.label}</p>
                                <p className="text-sm text-[#333333] font-medium leading-relaxed">{field.value || "Not specified"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Worldview Full Card */}
            {onboardingData.worldview_full && (
                <div className="lg:col-span-3 bg-[#F9FAFB] rounded-2xl border border-[#EEEEEE] p-8 mt-4">
                    <div className="flex items-center gap-3 mb-6">
                        <LightBulbOutline className="size-6 text-[#43B97B]" />
                        <h3 className="text-xl font-bold text-[#333333]">AI Company Worldview</h3>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                        {onboardingData.worldview_full.split('\n').map((line, li) => (
                            <p key={li}>{line}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function SecuritySection() {
    return (
        <div className="max-w-5xl space-y-12">
            {/* Header Section */}
            <div>
                <h2 className="text-2xl font-bold text-[#333333]">Security</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your account security and devices.</p>
            </div>

            {/* Main Security Options */}
            <div className="border-t border-gray-100">
                {/* Password Row */}
                <div className="flex items-center justify-between py-8 border-b border-gray-100">
                    <div className="space-y-1 max-w-sm">
                        <h4 className="font-bold text-[#333333]">Password</h4>
                        <p className="text-sm text-gray-500">Set a password to protect your account.</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className="text-lg tracking-widest text-[#333333] font-medium">••••••••••••••••</span>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-[#43B97B] bg-green-50 px-2 py-0.5 rounded-full">
                                <CheckCircleSolid className="size-3" />
                                Very secure
                            </div>
                        </div>
                        <button className="px-5 py-1.5 border border-[#EEEEEE] rounded-lg text-sm font-bold text-[#333333] hover:bg-gray-50 transition-colors">
                            Edit
                        </button>
                    </div>
                </div>

                {/* 2FA Row */}
                <div className="flex items-center justify-between py-8 border-b border-gray-100">
                    <div className="space-y-1 max-w-sm">
                        <h4 className="font-bold text-[#333333]">Two-step verification</h4>
                        <p className="text-sm text-gray-500">We recommend requiring a verification code in addition to your password.</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-[#43B97B] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm" />
                            </div>
                            <span className="text-sm font-bold text-[#333333]">Two-step verification</span>
                        </div>
                        <button className="px-5 py-1.5 border border-[#EEEEEE] rounded-lg text-sm font-bold text-[#333333] hover:bg-gray-50 transition-colors">
                            Edit
                        </button>
                    </div>
                </div>
            </div>

            {/* Browsers and Devices Section */}
            <div className="space-y-6 pt-4">
                <div>
                    <h3 className="text-lg font-bold text-[#333333]">Browsers and devices</h3>
                    <p className="text-sm text-gray-500 mt-1">These browsers and devices are currently signed in to your account. Remove any unauthorized devices.</p>
                </div>

                <div className="space-y-1">
                    {[
                        {
                            name: 'Safari on Mac OS X',
                            location: 'Ninh Binh, Vietnam',
                            status: 'Current session',
                            icon: '🌐'
                        },
                        {
                            name: "Kari's MacBook Pro",
                            location: 'Ninh Binh, Vietnam',
                            status: '1 month ago',
                            icon: '💻'
                        }
                    ].map((device, i) => (
                        <div key={i} className="flex items-center justify-between py-5 border-b border-gray-50 group px-2 hover:bg-gray-50/50 rounded-xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="size-10 bg-white border border-[#EEEEEE] rounded-xl flex items-center justify-center text-xl shadow-sm">
                                    {device.icon}
                                </div>
                                <h4 className="font-bold text-[#333333]">{device.name}</h4>
                            </div>

                            <div className="flex items-center gap-12 text-sm">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="size-4 bg-red-600 rounded-full flex items-center justify-center text-[8px] text-white font-bold">★</div>
                                    {device.location}
                                </div>
                                <span className={cn(
                                    "font-medium",
                                    device.status === 'Current session' ? "text-gray-400" : "text-gray-400"
                                )}>
                                    {device.status}
                                </span>
                                <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                    <ArrowLeftStartOnRectangleIcon className="size-4 rotate-180" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
