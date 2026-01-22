import { z } from "zod";

export const BusinessContextSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    doesWhat: z.string().nullable().optional(),
    forWho: z.string().nullable().optional(),
    problem: z.string().nullable().optional(),
    onboardingContext: z.string().nullable().optional(),
    offer: z.string().nullable().optional(),
});

export const ProspectPostSchema = z.object({
    gist: z.string(),
    quote: z.string().nullable().optional(),
    date: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
    mentionsSender: z.boolean().nullable().optional(),
    senderMentionSentiment: z.string().nullable().optional(),
});

export const ProspectSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.string().min(1, "Role is required"),
    company: z.string().min(1, "Company is required"),
    careerNotables: z.array(z.string()).optional(),
    recentPosts: z.array(ProspectPostSchema).optional(),
    mentionedSender: z.object({
        didMention: z.boolean(),
        sentiment: z.string().nullable().optional(),
        whatTheySaid: z.string().nullable().optional(),
        when: z.string().nullable().optional(),
        url: z.string().nullable().optional(),
    }).optional(),
    signals: z.object({
        pain: z.array(z.string()).optional(),
        buying: z.array(z.string()).optional(),
        urgency: z.array(z.string()).optional(),
    }).optional(),
    mentionedCompetitors: z.array(z.string()).optional(),
    activityPatterns: z.object({
        activeDays: z.array(z.string()).optional(),
        activeTimes: z.array(z.string()).optional(),
        frequency: z.string().optional(),
    }).optional(),
    fullProfile: z.string().nullable().optional(),
    rawActivity: z.string().nullable().optional(),
    icpCategory: z.string().nullable().optional(),
});

export const FitSchema = z.object({
    logicalConnection: z.string().min(1, "ICP fit reason is required"),
    redFlags: z.array(z.string()).optional(),
    warmthLevel: z.string(),
    shouldProceed: z.boolean(),
});

export const OutreachRequestSchema = z.object({
    business: BusinessContextSchema,
    prospect: ProspectSchema,
    fit: FitSchema,
});
