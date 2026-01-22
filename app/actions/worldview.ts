"use server"

import { chatCompletion } from "@/lib/ai-provider";
import { WORLDVIEW_GENERATION_PROMPT } from "@/lib/prompts/worldview";
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

        const onboardingDataStr = JSON.stringify(data, null, 2);
        const websiteScrapeStr = data.website_scrape || "No website scrape available";

        const prompt = WORLDVIEW_GENERATION_PROMPT
            .replace("{{onboardingData}}", onboardingDataStr)
            .replace("{{websiteScrape}}", websiteScrapeStr);

        const { content, provider } = await chatCompletion({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a strategic analyst. Return your analysis in the requested markdown format." },
                { role: "user", content: prompt }
            ]
        });

        console.log(`[Worldview Generation] Using provider: ${provider}`);

        if (!content) {
            return { success: false, error: "Empty response from AI" };
        }

        // Update the data object
        const updatedData = {
            ...data,
            worldview_full: content,
        };

        // Save back to backend and markdown
        await saveOnboardingDataToMarkdown(workspaceId, updatedData);

        return { success: true, worldview: content };

    } catch (error) {
        console.error("Worldview generation error:", error);
        return { success: false, error: "Failed to generate worldview" };
    }
}
