/**
 * Campaigns API
 * Functions for campaign CRUD operations
 */

import { apiClient, unwrapResponse } from './client';
import type {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignActivity,
} from './types';

/**
 * Get all campaigns for a workspace
 */
export async function getCampaigns(workspaceId: number): Promise<Campaign[]> {
  const response = await apiClient.get<Campaign[]>(
    `/workspaces/${workspaceId}/campaigns`
  );
  return unwrapResponse(response);
}

/**
 * Get a single campaign by ID
 */
export async function getCampaignById(id: number): Promise<Campaign> {
  const response = await apiClient.get<Campaign>(`/campaigns/${id}`);
  return unwrapResponse(response);
}

/**
 * Create a new campaign
 */
export async function createCampaign(
  workspaceId: number,
  data: CreateCampaignRequest
): Promise<Campaign> {
  const response = await apiClient.post<Campaign>(
    `/workspaces/${workspaceId}/campaigns`,
    data
  );
  return unwrapResponse(response);
}

/**
 * Update a campaign
 */
export async function updateCampaign(
  id: number,
  data: UpdateCampaignRequest
): Promise<Campaign> {
  const response = await apiClient.put<Campaign>(`/campaigns/${id}`, data);
  return unwrapResponse(response);
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(id: number): Promise<void> {
  await apiClient.delete(`/campaigns/${id}`);
}

/**
 * Update campaign status
 */
export async function updateCampaignStatus(
  id: number,
  status: Campaign['status']
): Promise<Campaign> {
  return updateCampaign(id, { status });
}

/**
 * Scale a campaign (trigger lead generation via Wiza)
 */
export async function scaleCampaign(
  id: number,
  targetLeadCount?: number
): Promise<{ jobId: string; message: string }> {
  const response = await apiClient.post<{ jobId: string; message: string }>(
    `/campaigns/${id}/scale`,
    { targetLeadCount }
  );
  return unwrapResponse(response);
}

/**
 * Get campaign activities (history/logs)
 */
export async function getCampaignActivities(
  id: number
): Promise<CampaignActivity[]> {
  const response = await apiClient.get<CampaignActivity[]>(
    `/campaigns/${id}/activities`
  );
  return unwrapResponse(response);
}

/**
 * Get campaign with leads count
 */
export async function getCampaignWithStats(id: number): Promise<Campaign> {
  // The campaign response already includes stats
  return getCampaignById(id);
}
