"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface FeedbackPopupProps {
    workspaceId: string
    onSubmit: (rating: number, feedback: string) => void
    onDismiss: () => void
}

export function FeedbackPopup({ workspaceId, onSubmit, onDismiss }: FeedbackPopupProps) {
    const [rating, setRating] = useState<number | null>(null)
    const [feedback, setFeedback] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = () => {
        if (rating === null) return
        onSubmit(rating, feedback)
        setIsSubmitted(true)
        // Store in localStorage that we've collected feedback for this session
        localStorage.setItem(`feedback_collected_${workspaceId}`, 'true')
        setTimeout(() => {
            onDismiss()
        }, 3000)
    }

    const handleDismiss = () => {
        localStorage.setItem(`feedback_dismissed_${workspaceId}`, 'true')
        onDismiss()
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-8 right-8 w-[360px] bg-white rounded-2xl shadow-2xl border border-[#EEEEEE] z-[100] overflow-hidden"
            >
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <XMarkIcon className="size-5" />
                </button>

                <div className="p-6">
                    {isSubmitted ? (
                        <div className="py-4 text-center space-y-3">
                            <div className="size-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-xl">✨</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#333333]">Thank you!</h3>
                            <p className="text-sm text-gray-500">Your feedback helps us improve Scale ASAP.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[17px] font-semibold text-[#333333] leading-tight pr-6">
                                    How satisfied are you with the experiments generated?*
                                </h3>
                            </div>

                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setRating(num)}
                                        className={`flex-1 h-12 rounded-xl border-2 transition-all duration-200 font-semibold text-lg
                                            ${rating === num
                                                ? 'border-[#43B97B] bg-[#43B97B]/5 text-[#43B97B] scale-105'
                                                : 'border-[#EAF6F0] bg-[#EAF6F0] text-gray-600 hover:border-[#43B97B]/30'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between text-[11px] font-medium text-gray-400 uppercase tracking-wider px-1">
                                <span>Not satisfied</span>
                                <span>Very satisfied</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Quick feedback (optional)</label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="What could we do better?"
                                    className="w-full min-h-[80px] p-3 text-sm bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#43B97B]/30 focus:ring-0 outline-none transition-all resize-none"
                                />
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={rating === null}
                                className="w-full bg-[#43B97B] hover:bg-[#3ca66f] text-white rounded-xl h-11 font-semibold shadow-lg shadow-[#43B97B]/20"
                            >
                                Submit Feedback
                            </Button>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
