/**
 * Server-side Campaign API functions
 * For use in Next.js Server Actions
 */

import { serverApiClient, unwrapServerResponse, ServerApiError } from './server-client';

// ============================================================================
// Types
// ============================================================================

export type CampaignStatus = 'active' | 'paused' | 'completed';

export interface CampaignResponse {
  CampaignID: number;
  ProjectID: number;
  ExperimentID?: number;
  Name: string;
  Status: CampaignStatus;
  Settings?: object;
  DailyLeadLimit: number;
  AutopilotEnabled: boolean;
  LastDiscoveryRun?: string;
  NextDiscoveryRun?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface CreateCampaignRequest {
  name: string;
  experimentId?: number;
  settings?: object;
  dailyLeadLimit?: number;
  autopilotEnabled?: boolean;
}

export interface UpdateCampaignRequest {
  name?: string;
  status?: CampaignStatus;
  settings?: object;
  dailyLeadLimit?: number;
  autopilotEnabled?: boolean;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all campaigns for a workspace
 */
export async function serverGetCampaigns(workspaceId: number): Promise<CampaignResponse[]> {
  const response = await serverApiClient.get<CampaignResponse[]>(`/workspaces/${workspaceId}/campaigns`);
  return unwrapServerResponse(response);
}

/**
 * Get a single campaign by ID
 */
export async function serverGetCampaignById(id: number): Promise<CampaignResponse> {
  const response = await serverApiClient.get<CampaignResponse>(`/campaigns/${id}`);
  return unwrapServerResponse(response);
}

/**
 * Create a new campaign
 */
export async function serverCreateCampaign(
  workspaceId: number,
  data: CreateCampaignRequest
): Promise<CampaignResponse> {
  const response = await serverApiClient.post<CampaignResponse>(
    `/workspaces/${workspaceId}/campaigns`,
    data
  );
  return unwrapServerResponse(response);
}

/**
 * Update a campaign
 */
export async function serverUpdateCampaign(
  id: number,
  data: UpdateCampaignRequest
): Promise<CampaignResponse> {
  const response = await serverApiClient.put<CampaignResponse>(`/campaigns/${id}`, data);
  return unwrapServerResponse(response);
}

/**
 * Delete a campaign
 */
export async function serverDeleteCampaign(id: number): Promise<void> {
  await serverApiClient.delete(`/campaigns/${id}`);
}

export { ServerApiError };
