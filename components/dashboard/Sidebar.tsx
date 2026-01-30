"use client"

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
    Squares2X2Icon as Squares2X2Outline,
    BeakerIcon as BeakerOutline,
    MagnifyingGlassIcon as MagnifyingGlassOutline,
    PlusIcon as PlusOutline,
    ChevronUpDownIcon,
    ArrowTopRightOnSquareIcon,
    Cog6ToothIcon as Cog6ToothOutline,
    ArrowLeftStartOnRectangleIcon,
    MegaphoneIcon as MegaphoneOutline,
    QuestionMarkCircleIcon as QuestionMarkCircleOutline,
    MapIcon as MapOutline
} from '@heroicons/react/24/outline'
import {
    Squares2X2Icon as Squares2X2Solid,
    BeakerIcon as BeakerSolid,
    MagnifyingGlassIcon as MagnifyingGlassSolid,
    Cog6ToothIcon as Cog6ToothSolid,
    CheckIcon as CheckSolid,
    MegaphoneIcon as MegaphoneSolid,
    QuestionMarkCircleIcon as QuestionMarkCircleSolid
} from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Workspace, createWorkspace } from '@/app/actions/workspaces'
import { ScaleLogo } from '@/components/scale-logo'

interface SidebarProps {
    workspace: Workspace
    allWorkspaces: Workspace[]
    currentTab: string
    onTabChange: (tab: string) => void
    className?: string
}

const navItems = [
    { id: 'overview', outline: Squares2X2Outline, solid: Squares2X2Solid, label: 'Overview' },
    { id: 'experiments', outline: BeakerOutline, solid: BeakerSolid, label: 'Experiments' },
    { id: 'campaigns', outline: MegaphoneOutline, solid: MegaphoneSolid, label: 'Campaigns' },
    { id: 'library', outline: MagnifyingGlassOutline, solid: MagnifyingGlassSolid, label: 'Lead Library' },
]

export function Sidebar({ workspace, allWorkspaces, currentTab, onTabChange, className }: SidebarProps) {
    const router = useRouter()
    const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const switcherRef = useRef<HTMLDivElement>(null)

    const handleCreateWorkspace = async () => {
        try {
            setIsCreating(true)
            const newWs = await createWorkspace({ name: 'New Workspace' })
            if (newWs?.id) {
                router.push(`/onboarding/${newWs.id}`)
            }
        } catch (error) {
            console.error('Failed to create workspace:', error)
        } finally {
            setIsCreating(false)
            setIsSwitcherOpen(false)
        }
    }

    // Close switcher on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
                setIsSwitcherOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <aside className={cn("w-64 border border-[#EEEEEE] bg-white rounded-2xl shadow-sm flex flex-col h-full overflow-hidden relative", className)}>
            {/* Workspace Switcher Trigger */}
            <div className="p-4 mb-2 relative" ref={switcherRef}>
                <button
                    onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                    className={cn(
                        "w-full flex items-center justify-between p-2 rounded-lg border border-[#EEEEEE] bg-white hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]",
                        isSwitcherOpen && "ring-2 ring-[#43B97B]/10 border-[#43B97B]/40"
                    )}
                >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="p-1.5 bg-gray-100 rounded-[6px] h-7 w-7 flex items-center justify-center shrink-0 overflow-hidden relative border border-[#EEEEEE]">
                            {(workspace.favicon_url || workspace.website) && (
                                <Image
                                    src={workspace.favicon_url || `https://www.google.com/s2/favicons?domain=${workspace.website?.replace('https://', '').replace('http://', '').split('/')[0]}&sz=128`}
                                    alt=""
                                    width={16}
                                    height={16}
                                    className="h-4 w-4 object-contain relative z-10"
                                />
                            )}
                        </div>
                        <span className="font-semibold text-[#333333] text-sm truncate">{workspace.name}</span>
                    </div>
                    <ChevronUpDownIcon className="size-3.5 text-gray-400 shrink-0" />
                </button>

                {/* Dropdown Menu (LeadPilot Style) */}
                {isSwitcherOpen && (
                    <div className="absolute top-[calc(100%-8px)] left-4 right-4 z-50 mt-2 bg-white border border-[#EEEEEE] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-1.5">
                            {allWorkspaces.map((ws) => (
                                <button
                                    key={ws.id}
                                    onClick={() => {
                                        router.push(`/dashboard/${ws.id}`)
                                        setIsSwitcherOpen(false)
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all mb-0.5",
                                        ws.id === workspace.id
                                            ? "bg-gray-50 text-[#333333]"
                                            : "hover:bg-gray-50 text-gray-600"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5 overflow-hidden">
                                        <div className="p-1 bg-gray-100 rounded-[4px] h-6 w-6 flex items-center justify-center shrink-0 overflow-hidden border border-[#EEEEEE]">
                                            <Image
                                                src={ws.favicon_url || (ws.website ? `https://www.google.com/s2/favicons?domain=${ws.website.replace('https://', '').replace('http://', '').split('/')[0]}&sz=128` : "https://pub-3d3b224ee6544903a80a5051e75e33a4.r2.dev/BLUE_BG.png")}
                                                alt=""
                                                width={14}
                                                height={14}
                                                className="h-3.5 w-3.5 object-contain"
                                            />
                                            {!ws.favicon_url && !ws.website && (
                                                <span className="text-[10px] font-bold text-gray-400">
                                                    {ws.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium truncate">{ws.name}</span>
                                    </div>
                                    {ws.id === workspace.id && (
                                        <div className="size-4 bg-[#333333] rounded-full flex items-center justify-center">
                                            <CheckSolid className="size-2.5 text-white" strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}

                            <button
                                onClick={handleCreateWorkspace}
                                disabled={isCreating}
                                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PlusOutline className={cn("size-4", isCreating && "animate-spin")} strokeWidth={2.5} />
                                <span className="font-medium">{isCreating ? 'Creating...' : 'New Workspace'}</span>
                            </button>
                        </div>

                        <div className="border-t border-[#F5F5F5] p-1.5 mt-0.5">
                            <button
                                onClick={() => router.push('/workspaces')}
                                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-gray-500 hover:text-[#333333] hover:bg-gray-50 rounded-lg transition-all"
                            >
                                <ArrowTopRightOnSquareIcon className="size-3.5 text-gray-400" />
                                <span className="font-medium">See all workspaces</span>
                            </button>
                        </div>

                        <div className="px-5 py-3 bg-gray-50/50 border-t border-[#F5F5F5] flex items-center justify-between">
                            <p className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                                v1.0.0
                            </p>
                            <ScaleLogo className="h-2 w-auto opacity-70" />
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = currentTab === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative",
                                isActive
                                    ? "bg-gray-100/80 text-[#333333]"
                                    : "text-gray-500 hover:text-[#333333] hover:bg-gray-100/50"
                            )}
                        >
                            {isActive ? (
                                <item.solid className={cn("size-4 shrink-0 text-[#333333]")} />
                            ) : (
                                <item.outline className={cn("size-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600")} />
                            )}
                            <span className="truncate flex-1 text-left">
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </nav>

            {/* Bottom section */}
            <div className="p-4 border-t border-gray-100 bg-white/50 space-y-1 mt-auto">
                <button
                    onClick={() => onTabChange('settings')}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors group",
                        currentTab === 'settings'
                            ? "bg-gray-100/80 text-[#333333]"
                            : "text-gray-500 hover:text-[#333333] hover:bg-gray-100/50"
                    )}
                >
                    {currentTab === 'settings' ? (
                        <Cog6ToothSolid className="size-4 shrink-0 text-[#333333]" />
                    ) : (
                        <Cog6ToothOutline className="size-4 shrink-0 text-gray-400 group-hover:text-gray-600" />
                    )}
                    <span>Settings</span>
                </button>
                <button
                    onClick={() => onTabChange('help')}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors group",
                        currentTab === 'help'
                            ? "bg-gray-100/80 text-[#333333]"
                            : "text-gray-500 hover:text-[#333333] hover:bg-gray-100/50"
                    )}
                >
                    {currentTab === 'help' ? (
                        <QuestionMarkCircleSolid className="size-4 shrink-0 text-[#333333]" />
                    ) : (
                        <QuestionMarkCircleOutline className="size-4 shrink-0 text-gray-400 group-hover:text-gray-600" />
                    )}
                    <span>Help & Support</span>
                </button>
                <button
                    onClick={() => window.open('https://scaleasap.featurebase.app/roadmap', '_blank')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-[#333333] hover:bg-gray-100/50 rounded-lg transition-colors group"
                >
                    <MapOutline className="size-4 shrink-0 text-gray-400 group-hover:text-gray-600" />
                    <span>Roadmap</span>
                </button>
                <button
                    onClick={() => router.push('/workspaces')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-[#333333] hover:bg-gray-100/50 rounded-lg transition-colors group"
                >
                    <ArrowTopRightOnSquareIcon className="size-4 text-gray-400 group-hover:text-gray-600" />
                    <span>Exit Workspace</span>
                </button>
            </div>
        </aside>
    )
}
