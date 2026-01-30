/**
 * AI Services API
 * Functions for AI-powered operations
 */

import { apiClient, unwrapResponse } from './client';
import type {
  GenerateOutreachRequest,
  GenerateOutreachResponse,
  GenerateWorldviewRequest,
  GenerateWorldviewResponse,
  ScrapeWebsiteRequest,
  ScrapeWebsiteResponse,
  WizaFilters,
} from './types';

/**
 * Generate outreach message for a lead
 */
export async function generateOutreachMessage(
  data: GenerateOutreachRequest
): Promise<GenerateOutreachResponse> {
  const response = await apiClient.post<GenerateOutreachResponse>(
    '/ai/outreach/generate',
    data
  );
  return unwrapResponse(response);
}

/**
 * Analyze LinkedIn activity for a lead
 */
export async function analyzeLinkedInActivity(
  rawActivity: string,
  senderContext?: {
    senderName?: string;
    senderTitle?: string;
    companyName?: string;
  }
): Promise<{
  isActive: boolean;
  peakTime: string | null;
  summary: string;
  hasEngagedWithCompany?: boolean;
  relevantTopics?: string[];
  suggestedAngle?: string;
}> {
  const response = await apiClient.post<{
    isActive: boolean;
    peakTime: string | null;
    summary: string;
    hasEngagedWithCompany?: boolean;
    relevantTopics?: string[];
    suggestedAngle?: string;
  }>('/ai/activity/analyze', { rawActivity, senderContext });
  return unwrapResponse(response);
}

/**
 * Generate worldview from onboarding data
 */
export async function generateWorldview(
  workspaceId: number,
  data: GenerateWorldviewRequest
): Promise<GenerateWorldviewResponse> {
  const response = await apiClient.post<GenerateWorldviewResponse>(
    `/workspaces/${workspaceId}/worldview/generate`,
    data
  );
  return unwrapResponse(response);
}

/**
 * Scrape and clean website content
 */
export async function scrapeWebsite(
  url: string
): Promise<ScrapeWebsiteResponse> {
  const response = await apiClient.post<ScrapeWebsiteResponse>(
    '/scraper/website',
    { url }
  );
  return unwrapResponse(response);
}

/**
 * Regenerate Wiza filters for an experiment using AI
 */
export async function regenerateFilters(
  experimentId: number,
  options?: {
    optimize?: boolean;
    hypothesis?: string;
  }
): Promise<{
  filters: WizaFilters;
  prospectCount?: number;
  optimizationSuggestions?: string[];
}> {
  const response = await apiClient.post<{
    filters: WizaFilters;
    prospectCount?: number;
    optimizationSuggestions?: string[];
  }>(`/experiments/${experimentId}/filters/regenerate`, options);
  return unwrapResponse(response);
}

/**
 * Generate outreach content with full context
 * Higher-level function that fetches lead data and generates message
 */
export async function generateOutreachForLead(
  leadId: number,
  options?: {
    tone?: 'professional' | 'casual' | 'friendly';
    includeConnectionRequest?: boolean;
    includeFollowUp?: boolean;
  }
): Promise<GenerateOutreachResponse> {
  const response = await apiClient.post<GenerateOutreachResponse>(
    '/ai/outreach/generate',
    {
      leadId,
      ...options,
    }
  );
  return unwrapResponse(response);
}

/**
 * Batch generate outreach for multiple leads
 */
export async function batchGenerateOutreach(
  leadIds: number[],
  options?: {
    tone?: 'professional' | 'casual' | 'friendly';
  }
): Promise<Array<{ leadId: number; message: GenerateOutreachResponse | null; error?: string }>> {
  const response = await apiClient.post<
    Array<{ leadId: number; message: GenerateOutreachResponse | null; error?: string }>
  >('/ai/outreach/generate/batch', {
    leadIds,
    ...options,
  });
  return unwrapResponse(response);
}
