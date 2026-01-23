"use client"

import { ReactNode } from "react"

interface StepContentProps {
    title: string
    description?: string
    children: ReactNode
}

export function StepContent({ title, description, children }: StepContentProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-2">
            <div className="space-y-2 border-b border-gray-100 pb-4">
                <h2 className="text-3xl font-bold tracking-tight text-[#4A4A4A]">{title}</h2>
                {description && (
                    <p className="text-muted-foreground text-lg text-balance leading-relaxed">{description}</p>
                )}
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    )
}
