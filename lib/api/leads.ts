/**
 * Leads API
 * Functions for lead CRUD operations
 */

import { apiClient, unwrapResponse } from './client';
import type {
  Lead,
  CreateLeadRequest,
  CreateLeadsBatchRequest,
  UpdateLeadRequest,
  LogOutcomeRequest,
  LeadSignal,
} from './types';

/**
 * Get all leads for a campaign
 */
export async function getLeadsForCampaign(campaignId: number): Promise<Lead[]> {
  const response = await apiClient.get<Lead[]>(`/campaigns/${campaignId}/leads`);
  return unwrapResponse(response);
}

/**
 * Get all leads for a workspace
 */
export async function getLeadsForWorkspace(workspaceId: number): Promise<Lead[]> {
  const response = await apiClient.get<Lead[]>(
    `/workspaces/${workspaceId}/leads`
  );
  return unwrapResponse(response);
}

/**
 * Get a single lead by ID
 */
export async function getLeadById(id: number): Promise<Lead> {
  const response = await apiClient.get<Lead>(`/leads/${id}`);
  return unwrapResponse(response);
}

/**
 * Create a single lead
 */
export async function createLead(
  campaignId: number,
  data: CreateLeadRequest
): Promise<Lead> {
  const response = await apiClient.post<Lead>(
    `/campaigns/${campaignId}/leads`,
    data
  );
  return unwrapResponse(response);
}

/**
 * Create multiple leads in batch
 */
export async function createLeadsBatch(
  campaignId: number,
  leads: CreateLeadRequest[]
): Promise<Lead[]> {
  const response = await apiClient.post<Lead[]>(
    `/campaigns/${campaignId}/leads/batch`,
    { leads }
  );
  return unwrapResponse(response);
}

/**
 * Update a lead
 */
export async function updateLead(
  id: number,
  data: UpdateLeadRequest
): Promise<Lead> {
  const response = await apiClient.put<Lead>(`/leads/${id}`, data);
  return unwrapResponse(response);
}

/**
 * Log outcome for a lead
 */
export async function logLeadOutcome(
  id: number,
  data: LogOutcomeRequest
): Promise<Lead> {
  const response = await apiClient.post<Lead>(`/leads/${id}/outcome`, data);
  return unwrapResponse(response);
}

/**
 * Get signals for a lead
 */
export async function getLeadSignals(id: number): Promise<LeadSignal[]> {
  const response = await apiClient.get<LeadSignal[]>(`/leads/${id}/signals`);
  return unwrapResponse(response);
}

/**
 * Update lead status
 */
export async function updateLeadStatus(
  id: number,
  status: Lead['status']
): Promise<Lead> {
  return updateLead(id, { status });
}

/**
 * Save outbound message for a lead
 */
export async function saveLeadOutboundMessage(
  id: number,
  message: string
): Promise<Lead> {
  return updateLead(id, { outboundMessage: message });
}

/**
 * Bulk update leads (convenience function)
 */
export async function bulkUpdateLeads(
  updates: Array<{ id: number; data: UpdateLeadRequest }>
): Promise<Lead[]> {
  // Execute updates in parallel
  const results = await Promise.all(
    updates.map(({ id, data }) => updateLead(id, data))
  );
  return results;
}
