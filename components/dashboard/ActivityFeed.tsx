"use client"

import React from 'react'
import { BoltIcon, UserPlusIcon, CheckCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface ActivityItem {
    id: string
    type: 'experiment_created' | 'leads_found' | 'experiment_completed' | 'response' | 'meeting' | 'warming'
    user: string
    target: string
    time: string
    timestamp: string
}

interface ActivityFeedProps {
    items?: ActivityItem[]
}

export function ActivityFeed({ items = [] }: ActivityFeedProps) {
    const hasActivity = items.length > 0

    // Helper to get icon and color based on type
    const getActivityStyle = (type: ActivityItem['type']) => {
        switch (type) {
            case 'experiment_created':
                return { icon: BoltIcon, color: 'text-blue-500', bg: 'bg-blue-50' }
            case 'leads_found':
                return { icon: UserPlusIcon, color: 'text-green-500', bg: 'bg-green-50' }
            case 'warming':
                return { icon: BoltIcon, color: 'text-yellow-500', bg: 'bg-yellow-50' }
            case 'meeting':
                return { icon: CheckCircleIcon, color: 'text-purple-500', bg: 'bg-purple-50' }
            case 'response':
                return { icon: ChatBubbleLeftRightIcon, color: 'text-indigo-500', bg: 'bg-indigo-50' }
            default:
                return { icon: BoltIcon, color: 'text-gray-500', bg: 'bg-gray-50' }
        }
    }

    return (
        <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#EEEEEE] bg-gray-50/50">
                <h3 className="font-semibold text-[#333333]">Recent Activity</h3>
            </div>
            {hasActivity ? (
                <div className="divide-y divide-gray-50">
                    {items.map((activity) => {
                        const style = getActivityStyle(activity.type)
                        return (
                            <div key={activity.id} className="p-4 hover:bg-gray-50/50 transition-colors flex items-center gap-4">
                                <div className={cn("size-10 rounded-full flex items-center justify-center shrink-0", style.bg)}>
                                    <style.icon className={cn("size-5", style.color)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[#333333]">
                                        {activity.user}
                                        <span className="font-normal text-gray-500"> — {activity.target}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="p-12 text-center">
                    <div className="size-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">📊</span>
                    </div>
                    <p className="text-sm text-gray-500">No activity yet</p>
                    <p className="text-xs text-gray-400 mt-1">Activity will appear as experiments run</p>
                </div>
            )}
        </div>
    )
}

