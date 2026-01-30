/**
 * Server-side Onboarding API functions
 * For use in Next.js Server Actions
 */

import { serverApiClient, unwrapServerResponse, ServerApiError } from './server-client';

// ============================================================================
// Types
// ============================================================================

export interface OnboardingDataResponse {
  id: number;
  workspaceId: number;
  data: OnboardingData;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingData {
  companyName?: string;
  website?: string;
  companyType?: 'services' | 'saas' | 'other';
  userName?: string;
  personalLinkedin?: string;
  linkedin?: string;
  twitter?: string;
  termsUrl?: string;
  privacyUrl?: string;
  coreOffer?: string;
  pricingModel?: string;
  pricingDetails?: string;
  pricingPage?: string;
  timeToResults?: string;
  oneSentencePitch?: string;
  price?: string;
  salesCycle?: string;
  stage?: string;
  totalRevenue?: string;
  fundingAmount?: string;
  contentExamples?: string;
  onboardingGoal?: string;
  targetICP?: string;
  icpConfidence?: number;
  triggerMoment?: string;
  founderRole?: string;
  teamSize?: string;
  runway?: string;
  hasPayingCustomers?: boolean;
  bestCustomers?: {
    name?: string;
    statedProblem?: string;
    outcomes?: string[];
  }[];
  customerMetaphors?: string;
  onePhraseWorld?: string;
  listSize?: string;
  listSource?: string;
  revenueGoal?: string;
  timelinePressure?: string;
  goodMeetingDefinition?: string;
  website_scrape?: string;
  worldview_full?: string;
  favicon_url?: string;
  [key: string]: unknown; // Allow additional fields
}

export interface UpsertOnboardingDataRequest {
  data: OnboardingData;
  markComplete?: boolean;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get onboarding data for a workspace
 */
export async function serverGetOnboardingData(workspaceId: number): Promise<OnboardingDataResponse | null> {
  const response = await serverApiClient.get<OnboardingDataResponse | null>(
    `/workspaces/${workspaceId}/onboarding`
  );
  return unwrapServerResponse(response);
}

/**
 * Create or update onboarding data for a workspace
 */
export async function serverUpsertOnboardingData(
  workspaceId: number,
  data: OnboardingData,
  markComplete: boolean = false
): Promise<OnboardingDataResponse> {
  const response = await serverApiClient.put<OnboardingDataResponse>(
    `/workspaces/${workspaceId}/onboarding`,
    { data, markComplete }
  );
  return unwrapServerResponse(response);
}

export { ServerApiError };
