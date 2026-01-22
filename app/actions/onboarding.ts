"use server"

import fs from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"
import { OnboardingData } from "@/lib/onboarding-data"
import { createClient } from "@/lib/supabase/server"

function isOnboardingComplete(data: OnboardingData, testMode: boolean = false): boolean {
    const hasBasics = !!(data.companyName && data.website && data.companyType);

    // In test mode, only basics are required
    if (testMode) {
        return hasBasics;
    }

    // Normal mode: require all fields
    const hasStory = !!data.triggerMoment;
    const hasStrategy = data.companyType === 'services'
        ? !!data.coreOffer
        : !!data.oneSentencePitch;
    const hasSuccess = !!(data.revenueGoal && data.timelinePressure);

    return hasBasics && hasStory && hasStrategy && hasSuccess;
}

export async function saveOnboardingDataToMarkdown(workspaceId: string, data: OnboardingData, testMode: boolean = false) {
    try {
        // 1. Save to Supabase
        const supabase = await createClient()
        const { data: existing } = await supabase.from('onboarding_data').select('id').eq('workspace_id', workspaceId).single()

        const payload = {
            workspace_id: workspaceId,
            updated_at: new Date().toISOString(),
            data: data
        }

        let error;
        if (existing) {
            const { error: updateError } = await supabase
                .from('onboarding_data')
                .update(payload)
                .eq('workspace_id', workspaceId)
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('onboarding_data')
                .insert(payload)
                .eq('workspace_id', workspaceId)
            error = insertError;
        }

        // Sync basic info to parent workspaces table
        if (!error) {
            const isComplete = isOnboardingComplete(data, testMode);
            console.log(`🧪 Test mode: ${testMode}, Workspace complete: ${isComplete}`, {
                hasBasics: !!(data.companyName && data.website && data.companyType),
                companyName: data.companyName,
                website: data.website,
                companyType: data.companyType
            });
            const { error: wsError } = await supabase
                .from('workspaces')
                .update({
                    name: data.companyName || 'Untitled Workspace',
                    website: data.website || '',
                    favicon_url: data.favicon_url || '',
                    onboarding_status: isComplete ? 'complete' : 'incomplete'
                })
                .eq('id', workspaceId)

            if (wsError) {
                console.error("Failed to sync workspace info:", wsError)
            } else {
                console.log(`✅ Synced workspace info:`, {
                    workspaceId,
                    status: isComplete ? 'complete' : 'incomplete',
                    name: data.companyName || 'Untitled Workspace'
                })
            }
        }

        if (error) {
            console.error("Supabase save error:", error)
        } else {
            console.log(`Saved onboarding data to Supabase for ${workspaceId}`)
        }

        // 2. Save to Markdown (Backup/Legacy)
        const dirPath = path.join(process.cwd(), "data", "onboarding")
        const filePath = path.join(dirPath, `${workspaceId}.md`)

        // Skip in development to prevent Next.js Fast Refresh loops
        if (process.env.NODE_ENV !== 'production') {
            console.log("Skipping markdown file write and revalidation in development to prevent Fast Refresh.")
            return { success: true, path: filePath }
        }

        let markdown = `# Onboarding Data for ${data.companyName || workspaceId}\n\n`
        markdown += `*Generated: ${new Date().toLocaleString()}*\n\n`

        markdown += `## Company Basics\n`
        markdown += `- **Company Type:** ${data.companyType || "Not specified"}\n`
        markdown += `- **Website:** ${data.website || "Not specified"}\n`
        markdown += `- **LinkedIn:** ${data.linkedin || "Not specified"}\n`
        markdown += `- **Twitter:** ${data.twitter || "Not specified"}\n`
        markdown += `- **YouTube:** ${data.youtube || "Not specified"}\n`
        markdown += `- **Telegram:** ${data.telegram || "Not specified"}\n`
        markdown += `- **Slack:** ${data.slack || "Not specified"}\n`
        markdown += `- **Terms URL:** ${data.termsUrl || "Not specified"}\n`
        markdown += `- **Privacy URL:** ${data.privacyUrl || "Not specified"}\n\n`

        markdown += `## Founding Story\n`
        markdown += `### The Trigger\n${data.triggerMoment || "Not specified"}\n\n`
        markdown += `- **Founder Role:** ${data.founderRole || "Not specified"}\n`
        markdown += `- **Team Size:** ${data.teamSize || "Not specified"}\n`
        markdown += `- **Stage:** ${data.stage || "Not specified"}\n`
        markdown += `- **Funding Type:** ${data.fundingType?.join(", ") || "None"}\n`
        markdown += `- **Runway:** ${data.runway || "Not specified"}\n\n`

        markdown += `## Product / Offer Strategy\n`
        if (data.companyType === 'services') {
            markdown += `### Core Offer\n${data.coreOffer || "Not specified"}\n\n`
            markdown += `### Delivery Process\n`
            markdown += `- **Step 1:** ${data.deliveryProcess?.step1 || "N/A"}\n`
            markdown += `- **Step 2:** ${data.deliveryProcess?.step2 || "N/A"}\n`
            markdown += `- **Step 3:** ${data.deliveryProcess?.step3 || "N/A"}\n\n`
            markdown += `### Deliverables\n`
            markdown += `- **Items:** ${data.deliverables?.join(", ") || "None"}\n`
            markdown += `- **Other:** ${data.deliverablesOther || "None"}\n\n`
            markdown += `### After State Metrics\n`
            markdown += `- **Time Saved:** ${data.afterStateMetrics?.timeSaved || "N/A"}\n`
            markdown += `- **Revenue Increase:** ${data.afterStateMetrics?.revenueIncrease || "N/A"}\n`
            markdown += `- **Cost Reduction:** ${data.afterStateMetrics?.costReduction || "N/A"}\n`
            markdown += `- **Process Eliminated:** ${data.afterStateMetrics?.manualEliminated || "N/A"}\n`
            markdown += `- **Other:** ${data.afterStateMetrics?.other || "N/A"}\n\n`
            markdown += `### Service Economics\n`
            markdown += `- **Pricing Model:** ${data.pricingModel || "Not specified"}\n`
            markdown += `- **Pricing Details:** ${data.pricingDetails || "N/A"}\n`
            markdown += `- **Setup Fee:** ${data.setupFee || "N/A"}\n`
            markdown += `- **Contract Length:** ${data.contractLength || "N/A"}\n`
            markdown += `- **Time to Results:** ${data.timeToResults || "N/A"}\n\n`
            markdown += `### Delivery Capacity\n`
            markdown += `- **Current Clients:** ${data.currentClientsCount || "0"}\n`
            markdown += `- **Taking on more:** ${data.capacityCount || "0"}\n`
            markdown += `- **Bottleneck:** ${data.deliveryBottleneck || "Not specified"}\n`
            markdown += `- **Bottleneck Other:** ${data.deliveryBottleneckOther || "N/A"}\n\n`
        } else {
            markdown += `### Pitch\n${data.oneSentencePitch || "Not specified"}\n\n`
            markdown += `### Core Mechanic\n`
            markdown += `- **User Does:** ${data.userDoes || "Not specified"}\n`
            markdown += `- **Product Does:** ${data.productDoes || "Not specified"}\n`
            markdown += `- **User Gets:** ${data.userGets || "Not specified"}\n\n`
            markdown += `### State Change\n`
            markdown += `- **Before State:** ${data.beforeState || "Not specified"}\n`
            markdown += `- **After State:** ${data.afterState || "Not specified"}\n\n`
            markdown += `### Economics\n`
            markdown += `- **Price:** ${data.price || "Not specified"}\n`
            markdown += `- **Sales Cycle:** ${data.salesCycle || "Not specified"} days\n`
            markdown += `- **Decision Process:** ${data.decisionProcess || "Not specified"}\n\n`
        }

        markdown += `## Customer Evidence\n`
        markdown += `- **Has Paying Customers:** ${data.hasPayingCustomers ? "Yes" : "No"}\n`
        if (data.hasPayingCustomers) {
            markdown += `- **Total Customers:** ${data.totalCustomers || "0"}\n`
            markdown += `- **Total Revenue:** ${data.totalRevenue || "$0"}\n`
            markdown += `- **Monthly Recurring:** ${data.monthlyRecurring || "$0"}\n\n`

            markdown += `### Top 3 Customers\n`
            data.bestCustomers.forEach((cust, i) => {
                markdown += `#### Customer #${i + 1}: ${cust.name || "Anonymous"}\n`
                markdown += `- **Role:** ${cust.role || "N/A"}\n`
                markdown += `- **Company Size:** ${cust.companySize || "N/A"}\n`
                markdown += `- **Industry:** ${cust.industry || "N/A"}\n`
                markdown += `- **Deal Size:** ${cust.dealSize || "N/A"}\n`
                markdown += `- **Source:** ${cust.source || "N/A"}\n`
                markdown += `- **Time to Close:** ${cust.timeToClose || "N/A"}\n`
                markdown += `- **Stated Problem:** ${cust.statedProblem || "N/A"}\n`
                markdown += `- **Actual Use:** ${cust.actualUse || "N/A"}\n`
                markdown += `- **Quote:** "${cust.quote || "N/A"}"\n`
                markdown += `- **Signals:** ${cust.signals?.join(", ") || "None"}\n`
                markdown += `- **Outcomes:** ${cust.outcomes?.join(", ") || "None"}\n\n`
            })
        }

        markdown += `## Worldview Intelligence\n`
        markdown += `### Customer Metaphors\n${data.customerMetaphors || "Not specified"}\n\n`
        markdown += `### Customer Pride\n${data.customerPride || "Not specified"}\n\n`
        markdown += `### Customer Frustration\n${data.customerFrustration || "Not specified"}\n\n`
        markdown += `### One Phrase World\n${data.onePhraseWorld || "Not specified"}\n\n`

        markdown += `## Voice DNA\n`
        markdown += `### Examples\n${data.contentExamples || "Not specified"}\n\n`
        markdown += `- **Start Messages:** ${data.startMessages || "Not specified"}\n`
        markdown += `- **End Messages:** ${data.endMessages || "Not specified"}\n`
        markdown += `- **Words Used Often:** ${data.wordsUsed || "Not specified"}\n`
        markdown += `- **Words Never Used:** ${data.wordsNeverUsed || "Not specified"}\n`
        markdown += `- **Emoji Usage:** ${data.emojiUsage || "Not specified"}\n`
        markdown += `- **Chaos Test Response:** ${data.chaosTest || "Not specified"}\n\n`

        markdown += `## Current GTM Reality\n`
        markdown += `### Cold Email Stats\n`
        markdown += `- **Sent:** ${data.coldEmailStats?.sent || "0"}\n`
        markdown += `- **Reply Rate:** ${data.coldEmailStats?.replyRate || "0"}%\n`
        markdown += `- **Best Message:** ${data.coldEmailStats?.bestMessage || "N/A"}\n\n`
        markdown += `### LinkedIn Stats\n`
        markdown += `- **Sent:** ${data.linkedinStats?.sent || "0"}\n`
        markdown += `- **Reply Rate:** ${data.linkedinStats?.replyRate || "0"}%\n`
        markdown += `- **Best Message:** ${data.linkedinStats?.bestMessage || "N/A"}\n\n`
        markdown += `### Inbound/Content\n`
        markdown += `- **Traffic:** ${data.inboundStats?.traffic || "0"} visitors/mo\n`
        markdown += `- **Quality Source:** ${data.inboundStats?.qualitySource || "N/A"}\n\n`
        markdown += `- **Other Channels:** ${data.otherChannels || "None"}\n\n`
        markdown += `### Leads List\n`
        markdown += `- **List Size:** ${data.listSize || "0"}\n`
        markdown += `- **Source:** ${data.listSource || "Not specified"}\n`
        markdown += `- **Quality:** ${data.listQuality || "Not specified"}\n`
        markdown += `- **Last Touched:** ${data.listLastTouched || "Not specified"}\n\n`

        markdown += `## Success Definition\n`
        markdown += `- **Revenue Goal:** ${data.revenueGoal || "Not specified"}\n`
        markdown += `- **Customer Goal:** ${data.customerGoal || "Not specified"}\n`
        markdown += `- **Key Metric:** ${data.keyMetric || "Not specified"}\n`
        markdown += `- **Timeline Pressure:** ${data.timelinePressure || "Not specified"}\n`
        markdown += `### Good Meeting Definition\n${data.goodMeetingDefinition || "Not specified"}\n\n`
        markdown += `- **Quit Conditions:** ${data.quitConditions?.join(", ") || "None"}\n\n`

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
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('onboarding_data')
            .select('data')
            .eq('workspace_id', workspaceId)
            .single()

        if (error) {
            console.error("Error fetching onboarding data:", error)
            return null
        }

        return data?.data as OnboardingData
    } catch (error) {
        console.error("Unexpected error fetching onboarding data:", error)
        return null
    }
}
