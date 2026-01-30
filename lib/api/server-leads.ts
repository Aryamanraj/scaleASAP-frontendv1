/**
 * Server-side Lead API functions
 * For use in Next.js Server Actions
 */

import { serverApiClient, unwrapServerResponse, ServerApiError } from './server-client';

// ============================================================================
// Types
// ============================================================================

export type LeadStatus = 'found' | 'enriched' | 'drafted' | 'sent' | 'responded';
export type LeadOutcome = 'meeting_booked' | 'meeting_done' | 'closed' | 'rejected' | 'interested' | 'no_response';

export interface LeadSignal {
  headline: string;
  description: string;
  citations: {
    source_name: string;
    source_url: string;
    source_logo_url?: string;
  }[];
}

export interface LeadExperience {
  company_name: string;
  company_logo_url?: string;
  title: string;
  time_from: string;
  time_to: string;
}

export interface LeadEnrichmentData {
  signals?: LeadSignal[];
  experience?: LeadExperience[];
  summary?: string;
  phone?: string;
  location?: string;
  socials?: {
    platform: string;
    url: string;
    icon?: string;
  }[];
}

export interface LeadResponse {
  LeadID: number;
  CampaignID: number;
  ProjectID: number;
  PersonID?: number;
  FullName: string;
  JobTitle?: string;
  Company?: string;
  LinkedinUrl?: string;
  Email?: string;
  Phone?: string;
  Location?: string;
  AvatarUrl?: string;
  Summary?: string;
  EnrichmentData?: LeadEnrichmentData;
  OutboundMessage?: string;
  Status: LeadStatus;
  Outcome?: LeadOutcome;
  OutcomeReason?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface CreateLeadRequest {
  fullName: string;
  jobTitle?: string;
  company?: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  enrichmentData?: LeadEnrichmentData;
}

export interface UpdateLeadRequest {
  fullName?: string;
  jobTitle?: string;
  company?: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  summary?: string;
  enrichmentData?: LeadEnrichmentData;
  outboundMessage?: string;
  status?: LeadStatus;
  outcome?: LeadOutcome;
  outcomeReason?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all leads for a campaign
 */
export async function serverGetLeadsForCampaign(campaignId: number): Promise<LeadResponse[]> {
  const response = await serverApiClient.get<LeadResponse[]>(`/campaigns/${campaignId}/leads`);
  return unwrapServerResponse(response);
}

/**
 * Get all leads for a workspace
 */
export async function serverGetLeadsForWorkspace(workspaceId: number): Promise<LeadResponse[]> {
  const response = await serverApiClient.get<LeadResponse[]>(`/workspaces/${workspaceId}/leads`);
  return unwrapServerResponse(response);
}

/**
 * Get a single lead by ID
 */
export async function serverGetLeadById(id: number): Promise<LeadResponse> {
  const response = await serverApiClient.get<LeadResponse>(`/leads/${id}`);
  return unwrapServerResponse(response);
}

/**
 * Create a single lead for a campaign
 */
export async function serverCreateLead(
  campaignId: number,
  data: CreateLeadRequest
): Promise<LeadResponse> {
  const response = await serverApiClient.post<LeadResponse>(`/campaigns/${campaignId}/leads`, data);
  return unwrapServerResponse(response);
}

/**
 * Create multiple leads in batch
 */
export async function serverCreateLeadsBatch(
  campaignId: number,
  workspaceId: number,
  leads: CreateLeadRequest[]
): Promise<LeadResponse[]> {
  const response = await serverApiClient.post<LeadResponse[]>('/leads/batch', {
    campaignId,
    workspaceId,
    leads,
  });
  return unwrapServerResponse(response);
}

/**
 * Update a lead
 */
export async function serverUpdateLead(
  id: number,
  data: UpdateLeadRequest
): Promise<LeadResponse> {
  const response = await serverApiClient.put<LeadResponse>(`/leads/${id}`, data);
  return unwrapServerResponse(response);
}

/**
 * Log outcome for a lead
 */
export async function serverLogLeadOutcome(
  id: number,
  outcome: LeadOutcome,
  reason?: string
): Promise<LeadResponse> {
  const response = await serverApiClient.post<LeadResponse>(`/leads/${id}/outcome`, {
    outcome,
    reason,
  });
  return unwrapServerResponse(response);
}

/**
 * Get signals for a lead
 */
export async function serverGetLeadSignals(leadId: number): Promise<unknown[]> {
  const response = await serverApiClient.get<unknown[]>(`/leads/${leadId}/signals`);
  return unwrapServerResponse(response);
}

export { ServerApiError };
