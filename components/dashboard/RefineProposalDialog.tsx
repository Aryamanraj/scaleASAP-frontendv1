"use client"

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface RefinedHypothesis {
    pattern: string
    pain: string
    trigger: string
    outreach_angle: string
    reasoning: string
}

interface RefineProposalDialogProps {
    isOpen: boolean
    onClose: () => void
    proposal: RefinedHypothesis | null
    onApprove: (proposal: RefinedHypothesis) => void
    isLoading?: boolean
}

export function RefineProposalDialog({
    isOpen,
    onClose,
    proposal,
    onApprove,
    isLoading
}: RefineProposalDialogProps) {
    if (!proposal && !isLoading) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] border-none shadow-2xl p-0 overflow-hidden">
                <div className="p-8 space-y-6">
                    <DialogHeader className="space-y-2 text-left">
                        <div className="flex items-center gap-2 text-[#43B97B]">
                            <SparklesIcon className="size-5" />
                            <DialogTitle className="text-xl font-bold tracking-tight text-gray-900">Refined Hypothesis</DialogTitle>
                        </div>
                        <DialogDescription className="text-sm font-medium text-gray-500 leading-relaxed">
                            AI has generated a narrower ICP based on your feedback. Review the proposal below to apply the refinement.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="size-10 border-4 border-gray-100 border-t-[#43B97B] rounded-full animate-spin" />
                                <p className="text-sm font-medium text-gray-400">Analysing feedback...</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-[#43B97B]/5 border border-[#43B97B]/10 rounded-xl p-5 space-y-2">
                                    <p className="text-[10px] font-bold text-[#43B97B] uppercase tracking-widest">Strategic Rationale</p>
                                    <p className="text-[13px] text-gray-700 leading-relaxed italic">&ldquo;{proposal?.reasoning}&rdquo;</p>
                                </div>

                                <div className="grid gap-5">
                                    <div className="space-y-1.5">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Pattern</h4>
                                        <p className="text-sm font-semibold text-gray-900 leading-snug">{proposal?.pattern}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Pain Point</h4>
                                        <p className="text-sm font-medium text-gray-800 leading-relaxed">{proposal?.pain}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trigger Mechanism</h4>
                                        <p className="text-sm font-medium text-gray-800 leading-relaxed">{proposal?.trigger}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Outreach Angle</h4>
                                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                                            <p className="text-sm text-gray-700 italic leading-relaxed">&ldquo;{proposal?.outreach_angle}&rdquo;</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter className="bg-gray-50/50 p-6 flex flex-row gap-3 border-t border-[#EEEEEE]">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 h-9 bg-white border border-[#EEEEEE] text-[#4A4A4A] hover:text-[#43B97B] hover:bg-gray-50 rounded-md text-sm font-medium transition-all shadow-sm"
                    >
                        Discard
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={() => proposal && onApprove(proposal)}
                        className="flex-1 h-9 bg-[#43B97B] hover:bg-[#3CA66F] text-white rounded-md text-sm font-medium flex items-center justify-center gap-2 border-none ring-0 shadow-sm shadow-[#43B97B]/20 transition-all active:scale-[0.98]"
                    >
                        <CheckIcon className="size-4" />
                        Apply Refinement
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
