
export type OnboardingStep = {
    id: string;
    title: string;
    description?: string;
    fields?: string[];
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: "company-basics",
        title: "Basic Information",
        description: "Company Basics + Personal Info",
    },
    {
        id: "offer-strategy",
        title: "Offer Strategy",
        description: "Your product or service strategy.",
    },
    {
        id: "voice-dna",
        title: "Your Voice DNA",
        description: "Dump your content to help us find your voice.",
    },
    {
        id: "goal",
        title: "Your Goal",
        description: "What are you looking to achieve with ScaleASAP?",
    },
];

export const OTHER_INFO_STEPS: OnboardingStep[] = [
    {
        id: "founding-story",
        title: "The Founding Story",
        description: "Your origin story and who you naturally attract.",
    },
    {
        id: "customer-evidence",
        title: "Customer Evidence",
        description: "Forensic detail on who actually converted and why.",
    },
    {
        id: "worldview-intelligence",
        title: "Worldview Intelligence",
        description: "How your customers see their world.",
    },
    {
        id: "gtm-reality",
        title: "Current GTM Reality",
        description: "What you have tried and your current list status.",
    },
    {
        id: "success-definition",
        title: "Success Definition",
        description: "What success looks like in the next 90 days.",
    },
];

export type OnboardingData = {
    // Section 1: Basic Information
    companyName: string;
    website: string;
    userName: string;
    personalLinkedin: string;
    linkedin: string; // Company LinkedIn
    twitter: string;
    youtube: string;
    telegram: string;
    slack: string;
    termsUrl: string;
    privacyUrl: string;
    companyType: 'software' | 'services' | '';

    // Section 2: Product / Offer Strategy
    oneSentencePitch: string;
    userDoes: string;
    productDoes: string;
    userGets: string;
    beforeState: string;
    afterState: string;
    price: string;
    salesCycle: string;
    decisionProcess: string;
    decisionProcessOther?: string;

    // Services Specific
    serviceType?: string;
    coreOffer?: string;
    deliveryProcess?: { step1: string; step2: string; step3: string };
    deliverables?: string[];
    deliverablesOther?: string;
    afterStateMetrics?: { timeSaved: string; revenueIncrease: string; costReduction: string; manualEliminated: string; other: string };
    pricingModel?: 'monthly' | 'project' | 'performance' | 'hybrid' | '';
    pricingDetails?: string;
    setupFee?: string;
    contractLength?: string;
    timeToResults?: string;
    currentClientsCount?: string;
    capacityCount?: string;
    deliveryBottleneck?: 'time' | 'team' | 'tools' | 'other' | '';
    deliveryBottleneckOther?: string;

    // Financials (Moved to Offer Strategy)
    fundingType: string[];
    fundingAmount?: string;
    fundingDate?: string;
    totalRevenue?: string;
    monthlyRecurring?: string;
    totalCustomers?: string;
    stage: string;

    // Section 3: Voice DNA
    contentExamples: string;
    startMessages: string;
    endMessages: string;
    wordsUsed: string;
    wordsNeverUsed: string;
    emojiUsage: string;
    chaosTest: string;
    chaosTestOther?: string;

    // Section 4: Goal
    onboardingGoal: 'discover' | 'refine' | '';
    targetICP: string;
    icpConfidence: number;
    icpConfidenceReason?: string; // This was missing in the original provided file but likely implicitly updated if added to params elsewhere? Or I should just stick to pure addition.
    // I will stick to pure addition of serviceType

    // Post-Onboarding Sections (Other Information)
    // Founding Story
    triggerMoment: string;
    founderRole: string;
    teamSize: string;
    runway: string;

    // Customer Evidence
    hasPayingCustomers: boolean | null;
    bestCustomers: Array<{
        name: string;
        role: string;
        companySize: string;
        industry: string;
        dealSize: string;
        source: string;
        timeToClose: string;
        statedProblem: string;
        actualUse: string;
        signals: string[];
        otherSignal?: string;
        quote: string;
        outcomes: string[];
        otherOutcome?: string;
    }>;
    lostCustomers: {
        perfectButDidntConvert: string[];
        churnedWhy: string;
        churnedMissed: string;
    }

    // Worldview
    customerMetaphors: string;
    customerPride: string;
    customerFrustration: string;
    onePhraseWorld: string;

    // GTM
    coldEmailStats?: { sent: string; replyRate: string; bestMessage: string };
    linkedinStats?: { sent: string; replyRate: string; bestMessage: string };
    inboundStats?: { traffic: string; qualitySource: string };
    otherChannels?: string;
    listSize: string;
    listSource: string;
    listQuality: string;
    listLastTouched: string;

    // Success
    revenueGoal: string;
    customerGoal: string;
    keyMetric: string;
    timelinePressure: string;
    goodMeetingDefinition: string;
    quitConditions: string[];
    quitConditionOther?: string;

    // Generated
    companyDescription?: string;
    website_scrape?: string;
    favicon_url?: string;
    worldview_full?: string;
};

export const INITIAL_DATA: OnboardingData = {
    companyName: "",
    website: "",
    userName: "",
    personalLinkedin: "",
    linkedin: "",
    twitter: "",
    youtube: "",
    telegram: "",
    slack: "",
    termsUrl: "",
    privacyUrl: "",
    companyType: "",
    oneSentencePitch: "",
    userDoes: "",
    productDoes: "",
    userGets: "",
    beforeState: "",
    afterState: "",
    price: "",
    salesCycle: "",
    decisionProcess: "",
    coreOffer: "",
    deliveryProcess: { step1: "", step2: "", step3: "" },
    deliverables: [],
    afterStateMetrics: { timeSaved: "", revenueIncrease: "", costReduction: "", manualEliminated: "", other: "" },
    pricingModel: "",
    deliveryBottleneck: "",
    fundingType: [],
    stage: "",
    contentExamples: "",
    startMessages: "",
    endMessages: "",
    wordsUsed: "",
    wordsNeverUsed: "",
    emojiUsage: "",
    chaosTest: "",
    onboardingGoal: "",
    targetICP: "",
    icpConfidence: 50,
    triggerMoment: "",
    founderRole: "",
    teamSize: "",
    runway: "",
    hasPayingCustomers: null,
    bestCustomers: [
        { name: "", role: "", companySize: "", industry: "", dealSize: "", source: "", timeToClose: "", statedProblem: "", actualUse: "", signals: [], quote: "", outcomes: [] },
        { name: "", role: "", companySize: "", industry: "", dealSize: "", source: "", timeToClose: "", statedProblem: "", actualUse: "", signals: [], quote: "", outcomes: [] },
        { name: "", role: "", companySize: "", industry: "", dealSize: "", source: "", timeToClose: "", statedProblem: "", actualUse: "", signals: [], quote: "", outcomes: [] },
    ],
    lostCustomers: {
        perfectButDidntConvert: [],
        churnedWhy: "",
        churnedMissed: ""
    },
    customerMetaphors: "",
    customerPride: "",
    customerFrustration: "",
    onePhraseWorld: "",
    listSize: "",
    listSource: "",
    listQuality: "",
    listLastTouched: "",
    revenueGoal: "",
    customerGoal: "",
    keyMetric: "",
    timelinePressure: "",
    goodMeetingDefinition: "",
    quitConditions: [],
    website_scrape: "",
    companyDescription: "",
    favicon_url: "",
    worldview_full: "",
};
