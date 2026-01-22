"use server"

import { chatCompletion } from "@/lib/ai-provider";
import { SCRAPE_CLEANUP_PROMPT } from "@/lib/prompts/scrape-cleanup";

export async function scrapeWebsite(url: string) {
    if (!url) return { success: false, error: "No URL provided" };

    try {
        // Add protocol if missing
        let targetUrl = url.trim();
        if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(targetUrl, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; OnboardingBot/1.0; +http://localhost)'
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return { success: false, error: `Failed to fetch website: ${response.statusText}` };
        }

        const html = await response.text();

        // extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : "";

        // extract meta description
        const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
        const description = metaDescMatch ? metaDescMatch[1].trim() : "";

        // extract h1
        const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        const h1 = h1Match ? h1Match[1].trim() : "";

        // Use Google Favicon API for better reliability
        const domain = new URL(targetUrl).hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

        // extract body text
        const rawText = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        // extract socials and policy links
        const extractLink = (patterns: string[]) => {
            for (const pattern of patterns) {
                const regex = new RegExp(`href=["']([^"']*(?:${pattern})[^"']*)["']`, 'i');
                const match = html.match(regex);
                if (match) return match[1];
            }
            return "";
        };

        const linkedin = extractLink(['linkedin.com/company', 'linkedin.com/in']);
        const twitter = extractLink(['twitter.com/', 'x.com/']);
        const youtube = extractLink(['youtube.com/', 'youtu.be/']);
        const telegram = extractLink(['t.me/']);
        const slack = extractLink(['slack.com/']);

        const termsUrl = extractLink(['terms', 'tos', 'conditions']);
        const privacyUrl = extractLink(['privacy']);

        // AI Cleaning with fallback
        let cleanContent = rawText;
        try {
            const { content, provider } = await chatCompletion({
                model: "gpt-4o-mini",
                temperature: 0.3, // Lower temperature for more factual and specific output
                messages: [
                    {
                        role: "system",
                        content: "You are a precise content extractor. Your goal is to cleanly extract and structure specific facts from scraped website text. Do NOT use generic language. Retain actual product names, feature descriptions, and specific claims exactly as they appear."
                    },
                    { role: "user", content: SCRAPE_CLEANUP_PROMPT.replace("{{rawText}}", rawText.substring(0, 10000)) }
                ]
            });
            console.log(`[Website Scrape] AI cleaning using provider: ${provider}`);
            cleanContent = content || rawText;
        } catch (aiErr) {
            console.warn("AI cleaning failed, using raw text", aiErr);
        }

        const scrapedData = {
            url: targetUrl,
            title,
            description,
            h1,
            favicon: faviconUrl,
            content: cleanContent,
            socials: {
                linkedin,
                twitter,
                youtube,
                telegram,
                slack
            },
            policies: {
                terms: termsUrl,
                privacy: privacyUrl
            },
            scrapedAt: new Date().toISOString()
        };

        return { success: true, data: JSON.stringify(scrapedData) };

    } catch (error) {
        console.error("Scraping error:", error);
        return { success: false, error: "Failed to scrape website" };
    }
}
