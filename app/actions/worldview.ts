"use server"

import { serverGenerateWorldview } from "@/lib/api/server-workspaces";
import { getOnboardingData, saveOnboardingDataToMarkdown } from "./onboarding";

export async function generateWorldview(workspaceId: string) {
    try {
        const data = await getOnboardingData(workspaceId);
        if (!data) {
            return { success: false, error: "Onboarding data not found" };
        }

        // Check if worldview already exists to avoid redundant calls
        if (data.worldview_full) {
            return { success: true, message: "Worldview already exists" };
        }

        // Call backend API to generate worldview
        const result = await serverGenerateWorldview(Number(workspaceId), {
            onboardingData: data,
            websiteScrape: data.website_scrape || undefined,
        });

        console.log(`[Worldview Generation] Using provider: ${result.provider}`);

        if (!result.worldview) {
            return { success: false, error: "Empty response from AI" };
        }

        // Update the data object
        const updatedData = {
            ...data,
            worldview_full: result.worldview,
        };

        // Save back to backend and markdown
        await saveOnboardingDataToMarkdown(workspaceId, updatedData);

        return { success: true, worldview: result.worldview };

    } catch (error) {
        console.error("Worldview generation error:", error);
        return { success: false, error: "Failed to generate worldview" };
    }
}
