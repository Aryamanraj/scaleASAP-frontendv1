"use client"

import React, { useEffect } from 'react'
import { CalendarIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCalApi } from "@calcom/embed-react"
import { toast } from "sonner"

export function HelpSupport() {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({ "namespace": "30min" })
            cal("ui", { "hideEventTypeDetails": false, "layout": "month_view" })
        })()
    }, [])

    const handleSendEmail = () => {
        // Open email client with pre-filled email
        window.location.href = 'mailto:sahil@scaleasap.com?subject=Support Request&body=Hi ScaleASAP team,%0D%0A%0D%0A'
    }

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('sahil@scaleasap.com')
        toast.success('Email copied to clipboard!')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-[#333333]">Help & Support</h1>
                <p className="text-gray-500 max-w-md">
                    We're here to help! Choose how you'd like to reach us.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                {/* Book a Meeting Card */}
                <Card
                    className="hover:border-[#43B97B] transition-colors shadow-sm hover:shadow-md group flex flex-col"
                >
                    <CardHeader className="space-y-1">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#43B97B]/10 transition-colors h-12 w-12 flex items-center justify-center">
                            <CalendarIcon className="h-6 w-6 text-gray-500 group-hover:text-[#43B97B] transition-colors" />
                        </div>
                        <CardTitle className="text-xl pt-4 text-[#4A4A4A]">Book a Meeting</CardTitle>
                        <CardDescription>Schedule a call with our founder</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="h-px w-full bg-gray-100" />
                        <p className="text-sm text-gray-600 mt-4">
                            Get personalized guidance and discuss how ScaleASAP can help you scale your outreach effectively.
                        </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button
                            className="w-full bg-[#43B97B] hover:bg-[#3CA66F] text-white"
                            data-cal-namespace="30min"
                            data-cal-link="scaleasap/30min"
                            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                        >
                            Schedule Now
                        </Button>
                    </CardFooter>
                </Card>

                {/* Write Us a Mail Card */}
                <Card
                    className="hover:border-[#43B97B] transition-colors shadow-sm hover:shadow-md group flex flex-col"
                >
                    <CardHeader className="space-y-1">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#43B97B]/10 transition-colors h-12 w-12 flex items-center justify-center">
                            <EnvelopeIcon className="h-6 w-6 text-gray-500 group-hover:text-[#43B97B] transition-colors" />
                        </div>
                        <CardTitle className="text-xl pt-4 text-[#4A4A4A]">Write Us a Mail</CardTitle>
                        <CardDescription>Send us your questions or feedback</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="h-px w-full bg-gray-100" />
                        <p className="text-sm text-gray-600 mt-4">
                            Have a question or suggestion? Drop us an email and we'll get back to you as soon as possible.
                        </p>
                    </CardContent>
                    <CardFooter className="pt-0 flex gap-2">
                        <Button
                            className="flex-1 bg-[#43B97B] hover:bg-[#3CA66F] text-white"
                            onClick={handleSendEmail}
                        >
                            Send Email
                        </Button>
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={handleCopyEmail}
                        >
                            Copy Email
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
