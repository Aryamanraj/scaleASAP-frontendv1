
export type OnboardingStep = {
    id: string;
    title: string;
    description?: string;
    fields?: string[];
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: "company-basics",
        title: "Company Basics",
        description: "Start with the basics.",
    },
    {
        id: "founding-story",
        title: "The Founding Story",
        description: "Your origin story and who you naturally attract.",
    },
    {
        id: "product-strategy",
        title: "Product Strategy",
        description: "The core mechanics and economics of your business.",
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
        id: "voice-dna",
        title: "Your Voice DNA",
        description: "We need your actual voice, not descriptions.",
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
    // Section 1: The Founding Story
    triggerMoment: string;
    founderRole: string;
    teamSize: string;
    stage: string;
    fundingType: string[];
    fundingAmount?: string;
    fundingDate?: string; // loosely typed for now
    runway: string;

    // Section 2: Company Foundations
    companyName: string;
    website: string;
    linkedin: string;
    twitter: string;
    youtube: string;
    telegram: string;
    slack: string;
    termsUrl: string;
    privacyUrl: string;
    companyType: 'software' | 'services' | '';
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

    // Section 3: Customer Evidence
    hasPayingCustomers: boolean | null; // null for not answered yet
    totalCustomers?: string;
    totalRevenue?: string;
    monthlyRecurring?: string;

    // Customers array
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
        perfectButDidntConvert: string[]; // reasons
        churnedWhy: string;
        churnedMissed: string;
    }

    // Section 4: Worldview
    customerMetaphors: string;
    customerPride: string;
    customerFrustration: string;
    onePhraseWorld: string;

    // Section 5: Voice DNA
    contentExamples: string;
    startMessages: string;
    endMessages: string;
    wordsUsed: string;
    wordsNeverUsed: string;
    emojiUsage: string;
    chaosTest: string;
    chaosTestOther?: string;

    // Section 6: GTM
    coldEmailStats?: { sent: string; replyRate: string; bestMessage: string };
    linkedinStats?: { sent: string; replyRate: string; bestMessage: string };
    inboundStats?: { traffic: string; qualitySource: string };
    otherChannels?: string;

    listSize: string;
    listSource: string;
    listQuality: string;
    listLastTouched: string;

    // Section 7: Success
    revenueGoal: string;
    customerGoal: string;
    keyMetric: string;
    timelinePressure: string;
    goodMeetingDefinition: string;
    quitConditions: string[];
    quitConditionOther?: string;

    // Services Specific
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

    // Generated
    website_scrape?: string;
    favicon_url?: string;
    worldview_full?: string;
};

export const INITIAL_DATA: OnboardingData = {
    triggerMoment: "",
    founderRole: "",
    teamSize: "",
    stage: "",
    fundingType: [],
    runway: "",
    companyName: "",
    website: "",
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
    hasPayingCustomers: null, // explicitly null
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
    contentExamples: "",
    startMessages: "",
    endMessages: "",
    wordsUsed: "",
    wordsNeverUsed: "",
    emojiUsage: "",
    chaosTest: "",
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
    coreOffer: "",
    deliveryProcess: { step1: "", step2: "", step3: "" },
    deliverables: [],
    afterStateMetrics: { timeSaved: "", revenueIncrease: "", costReduction: "", manualEliminated: "", other: "" },
    pricingModel: "",
    deliveryBottleneck: "",
    website_scrape: "",
    favicon_url: "",
    worldview_full: "",
};
