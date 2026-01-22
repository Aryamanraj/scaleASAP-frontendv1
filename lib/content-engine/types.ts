export interface BusinessContext {
    companyName: string;
    doesWhat?: string | null;
    forWho?: string | null;
    problem?: string | null;
    onboardingContext?: string | null;
    offer?: string | null;
}

export interface ProspectPost {
    gist: string;
    quote?: string | null;
    date?: string | null;
    url?: string | null;
    mentionsSender?: boolean | null;
    senderMentionSentiment?: string | null;
}

export interface Prospect {
    firstName: string;
    lastName: string;
    role: string;
    company: string;
    careerNotables?: string[];
    recentPosts?: ProspectPost[];
    mentionedSender?: {
        didMention: boolean;
        sentiment?: string | null;
        whatTheySaid?: string | null;
        when?: string | null;
        url?: string | null;
    };
    signals?: {
        pain?: string[];
        buying?: string[];
        urgency?: string[];
    };
    mentionedCompetitors?: string[];
    activityPatterns?: {
        activeDays?: string[];
        activeTimes?: string[];
        frequency?: string;
    };
    fullProfile?: string | null;
    rawActivity?: string | null;
    icpCategory?: string | null;
}

export interface Fit {
    logicalConnection: string;
    redFlags?: string[];
    warmthLevel: string;
    shouldProceed: boolean;
}

export interface OutreachResult {
    shouldReachOut: boolean;
    reason: string;
    bestAction: string;
    outreachType: "linkedin_dm" | "linkedin_connection" | "email" | "text" | string;
    validation: {
        alreadyAware: string;
        hasNeed: string;
        connectionIsReal: string;
    };
    connectionRequest?: string;
    followUpDM: string;
    approach: {
        hook: string;
        question: string;
        productMention: string;
        ask: string;
    };
    thinking: {
        whatIKnowAboutThem: string;
        whatTheyMightCareAbout: string;
        whyThisApproach: string;
        risks: string;
    };
    optimalOutreachWindow?: {
        bestDay: string;
        bestTime: string;
        reasoning: string;
    };
    sources?: {
        what?: string;
        where?: string;
        how?: string;
        url?: string;
        reason?: string;
    }[];
}

export interface GenerationRequest {
    business: BusinessContext;
    prospect: Prospect;
    fit: Fit;
}
