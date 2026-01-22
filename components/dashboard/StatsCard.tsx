"use client"

import React from 'react'
import { ArrowUpRightIcon, ArrowDownRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface StatsCardProps {
    title: string
    value: string
    change: number
    subtext: string
    color?: 'blue' | 'green' | 'purple'
    segments?: number
    activeSegments?: number
}

export function StatsCard({
    title,
    value,
    change,
    subtext,
    color = 'blue',
    segments = 40,
    activeSegments = 30
}: StatsCardProps) {
    const isPositive = change >= 0

    const colors = {
        blue: {
            active: 'bg-blue-500',
            inactive: 'bg-blue-100',
            text: 'text-blue-600'
        },
        green: {
            active: 'bg-green-500',
            inactive: 'bg-green-100',
            text: 'text-green-600'
        },
        purple: {
            active: 'bg-purple-500',
            inactive: 'bg-purple-100',
            text: 'text-purple-600'
        }
    }

    const { active } = colors[color]

    return (
        <div className="bg-white rounded-xl border border-[#EEEEEE] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                </div>

                <div className="flex items-baseline gap-3">
                    <h3 className="text-4xl font-bold text-[#333333]">{value}</h3>
                    <div className={cn(
                        "flex items-center gap-0.5 text-sm font-semibold",
                        isPositive ? "text-green-500" : "text-red-500"
                    )}>
                        {isPositive ? <ArrowUpRightIcon className="size-4" /> : <ArrowDownRightIcon className="size-4" />}
                        {Math.abs(change)}%
                    </div>
                </div>

                {/* Segmented Progress Bar */}
                <div className="flex gap-1 h-1.5 w-full">
                    {Array.from({ length: segments }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 rounded-full",
                                i < activeSegments ? active : "bg-gray-100"
                            )}
                        />
                    ))}
                </div>

                <p className="text-xs text-gray-400 font-medium">{subtext}</p>
            </div>
        </div>
    )
}
