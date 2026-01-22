"use client"

import { ReactNode } from "react"

interface StepContentProps {
    title: string
    description?: string
    children: ReactNode
}

export function StepContent({ title, description, children }: StepContentProps) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 py-4">
            <div className="space-y-3 border-b border-gray-100 pb-6">
                <h2 className="text-3xl font-semibold tracking-tight text-[#4A4A4A]">{title}</h2>
                {description && (
                    <p className="text-muted-foreground text-lg text-balance leading-relaxed">{description}</p>
                )}
            </div>
            <div className="space-y-10">
                {children}
            </div>
        </div>
    )
}
