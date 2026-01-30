"use server"

import fs from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"
import { OnboardingData } from "@/lib/onboarding-data"
import {
    serverGetOnboardingData,
    serverUpsertOnboardingData,
    type OnboardingData as ServerOnboardingData,
} from '@/lib/api/server-onboarding'

function isOnboardingComplete(data: OnboardingData, testMode: boolean = false): boolean {
    const hasBasics = !!(data.companyName && data.website && data.companyType && data.userName);

    console.log(`[isOnboardingComplete] testMode: ${testMode}, hasBasics: ${hasBasics}`, {
        companyName: data.companyName,
        website: data.website,
        companyType: data.companyType,
        userName: data.userName
    });

    // In test mode, only basics are required
    if (testMode) {
        return hasBasics;
    }

    // Normal mode: require essential fields from the 4 new steps
    const hasOffer = data.companyType === 'services'
        ? !!data.coreOffer
        : !!data.oneSentencePitch;
    const hasVoice = !!data.contentExamples;
    const hasGoal = !!(data.onboardingGoal && data.targetICP);

    const isComplete = hasBasics && hasOffer && hasVoice && hasGoal;
    console.log(`[isOnboardingComplete] normalMode result: ${isComplete}`, {
        hasOffer, hasVoice, hasGoal
    });

    return isComplete;
}

export async function saveOnboardingDataToMarkdown(workspaceId: string, data: OnboardingData, testMode: boolean = false, isAdditionalInfo: boolean = false) {
    try {
        console.log(`[saveOnboardingData] workspaceId: ${workspaceId}, testMode: ${testMode}, isAdditionalInfo: ${isAdditionalInfo}`);
        
        // Calculate if complete
        const markComplete = isOnboardingComplete(data, testMode);
        console.log(`[saveOnboardingData] Final status for workspace ${workspaceId}: ${markComplete ? 'complete' : 'incomplete'}`);

        // Save to backend
        await serverUpsertOnboardingData(
            Number(workspaceId),
            data as ServerOnboardingData,
            markComplete
        )

        // Build markdown path for reference
        const dirPath = path.join(process.cwd(), "data", "onboarding")
        const filePath = path.join(dirPath, `${workspaceId}.md`)

        // Skip markdown save in development to prevent Next.js Fast Refresh loops
        if (process.env.NODE_ENV !== 'production') {
            revalidatePath('/workspaces')
            return { success: true, path: filePath }
        }

        let markdown = `# Onboarding Data for ${data.companyName || workspaceId}\n\n`
        markdown += `*Generated: ${new Date().toLocaleString()}*\n\n`

        markdown += `## Basic Information\n`
        markdown += `- **User Name:** ${data.userName || "Not specified"}\n`
        markdown += `- **Personal LinkedIn:** ${data.personalLinkedin || "Not specified"}\n`
        markdown += `- **Company Type:** ${data.companyType || "Not specified"}\n`
        markdown += `- **Website:** ${data.website || "Not specified"}\n`
        markdown += `- **Company LinkedIn:** ${data.linkedin || "Not specified"}\n`
        markdown += `- **Twitter:** ${data.twitter || "Not specified"}\n`
        markdown += `- **Terms URL:** ${data.termsUrl || "Not specified"}\n`
        markdown += `- **Privacy URL:** ${data.privacyUrl || "Not specified"}\n\n`

        markdown += `## Offer Strategy\n`
        if (data.companyType === 'services') {
            markdown += `### Core Offer\n${data.coreOffer || "Not specified"}\n\n`
            markdown += `- **Pricing Model:** ${data.pricingModel || "N/A"}\n`
            markdown += `- **Pricing Details:** ${data.pricingDetails || "N/A"}\n`
            markdown += `- **Pricing Page:** ${data.pricingPage || "Not specified"}\n`
            markdown += `- **Time to Results:** ${data.timeToResults || "N/A"}\n\n`
        } else {
            markdown += `### Pitch\n${data.oneSentencePitch || "Not specified"}\n\n`
            markdown += `- **Price:** ${data.price || "Not specified"}\n`
            markdown += `- **Pricing Page:** ${data.pricingPage || "Not specified"}\n`
            markdown += `- **Sales Cycle:** ${data.salesCycle || "Not specified"} days\n\n`
        }

        markdown += `### Business Stage & Scale\n`
        markdown += `- **Stage:** ${data.stage || "Not specified"}\n`
        markdown += `- **Revenue/ARR:** ${data.totalRevenue || "Not specified"}\n`
        markdown += `- **Funding:** ${data.fundingAmount || "Not specified"}\n\n`

        markdown += `## Voice DNA\n`
        markdown += `### Content Dump\n${data.contentExamples || "Not specified"}\n\n`

        markdown += `## Goal\n`
        markdown += `- **Primary Goal:** ${data.onboardingGoal || "Not specified"}\n`
        markdown += `- **Target ICP Guess:** ${data.targetICP || "Not specified"}\n`
        markdown += `- **ICP Confidence:** ${data.icpConfidence}%\n\n`

        markdown += `--- (Post-Onboarding Info) ---\n\n`

        markdown += `## Founding Story (Extended)\n`
        markdown += `### The Trigger\n${data.triggerMoment || "Not specified"}\n\n`
        markdown += `- **Founder Role:** ${data.founderRole || "Not specified"}\n`
        markdown += `- **Team Size:** ${data.teamSize || "Not specified"}\n`
        markdown += `- **Runway:** ${data.runway || "Not specified"}\n\n`

        markdown += `## Customer Evidence\n`
        markdown += `- **Has Paying Customers:** ${data.hasPayingCustomers ? "Yes" : "No"}\n`
        if (data.bestCustomers?.length > 0) {
            markdown += `### Top Customers\n`
            data.bestCustomers.forEach((cust) => {
                if (cust.name) {
                    markdown += `#### ${cust.name}\n`
                    markdown += `- **Problem:** ${cust.statedProblem}\n`
                    markdown += `- **Outcome:** ${cust.outcomes?.join(", ")}\n`
                }
            })
        }
        markdown += `\n`

        markdown += `## Worldview Intelligence\n`
        markdown += `### Customer Metaphors\n${data.customerMetaphors || "Not specified"}\n\n`
        markdown += `### One Phrase World\n${data.onePhraseWorld || "Not specified"}\n\n`

        markdown += `## Current GTM Reality\n`
        markdown += `- **List Size:** ${data.listSize || "0"}\n`
        markdown += `- **Source:** ${data.listSource || "Not specified"}\n\n`

        markdown += `## Success Definition\n`
        markdown += `- **Revenue Goal:** ${data.revenueGoal || "Not specified"}\n`
        markdown += `- **Timeline Pressure:** ${data.timelinePressure || "Not specified"}\n`
        markdown += `- **Good Meeting:** ${data.goodMeetingDefinition || "Not specified"}\n\n`

        if (data.website_scrape) {
            try {
                const parsed = JSON.parse(data.website_scrape);
                markdown += `## Scraped & Cleaned Website Data\n`
                markdown += `- **Title:** ${parsed.title || "N/A"}\n`
                markdown += `- **Description:** ${parsed.description || "N/A"}\n`
                markdown += `- **H1:** ${parsed.h1 || "N/A"}\n`
                markdown += `- **Favicon:** ${parsed.favicon || "N/A"}\n`
                markdown += `\n### AI Cleaned Content\n${parsed.content || "N/A"}\n\n`
            } catch (e) {
                console.error("Failed to parse scraped data for markdown", e);
            }
        }

        if (data.worldview_full) {
            markdown += `\n---\n\n${data.worldview_full}\n`
        }

        await fs.mkdir(dirPath, { recursive: true })
        await fs.writeFile(filePath, markdown, "utf-8")
        console.log(`Saved onboarding data to ${filePath}`)

        revalidatePath('/workspaces')
        return { success: true, path: filePath }
    } catch (error) {
        console.error("Failed to save onboarding data:", error)
        return { success: false, error: String(error) }
    }
}

export async function getOnboardingData(workspaceId: string) {
    try {
        const response = await serverGetOnboardingData(Number(workspaceId))

        if (!response) {
            console.log("No onboarding data found for workspace:", workspaceId)
            return null
        }

        return response.data as OnboardingData
    } catch (error) {
        console.error("Unexpected error fetching onboarding data:", error)
        return null
    }
}
