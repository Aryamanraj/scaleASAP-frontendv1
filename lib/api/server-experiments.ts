/**
 * Server-side Experiment API functions
 * For use in Next.js Server Actions
 */

import { serverApiClient, unwrapServerResponse, ServerApiError } from './server-client';

// ============================================================================
// Types
// ============================================================================

export type ExperimentType = 'bullseye' | 'variable_a' | 'variable_b' | 'contrarian' | 'long_shot';
export type ExperimentStatus = 'pending' | 'creating_hypotheses' | 'finding_leads' | 'prioritizing_leads' | 'warmup_initiated' | 'complete' | 'completed' | 'failed';

export interface ExperimentResponse {
  ExperimentID: number;
  ProjectID: number;
  Name: string;
  Type: ExperimentType;
  Pattern?: string;
  Industries?: string[];
  Pain?: string;
  Trigger?: string;
  WizaFilters?: object;
  OutreachAngle?: string;
  Status: ExperimentStatus;
  LeadsFound: number;
  LeadsWarming: number;
  MeetingsBooked: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface CreateExperimentRequest {
  name: string;
  type: ExperimentType;
  pattern?: string;
  industries?: string[];
  pain?: string;
  trigger?: string;
  wizaFilters?: object;
  outreachAngle?: string;
}

export interface UpdateExperimentRequest {
  name?: string;
  pattern?: string;
  industries?: string[];
  pain?: string;
  trigger?: string;
  wizaFilters?: object;
  outreachAngle?: string;
  status?: ExperimentStatus;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all experiments for a workspace
 */
export async function serverGetExperiments(workspaceId: number): Promise<ExperimentResponse[]> {
  const response = await serverApiClient.get<ExperimentResponse[]>(`/workspaces/${workspaceId}/experiments`);
  return unwrapServerResponse(response);
}

/**
 * Get a single experiment by ID
 */
export async function serverGetExperimentById(id: number): Promise<ExperimentResponse> {
  const response = await serverApiClient.get<ExperimentResponse>(`/experiments/${id}`);
  return unwrapServerResponse(response);
}

/**
 * Create a single experiment
 */
export async function serverCreateExperiment(
  workspaceId: number,
  data: CreateExperimentRequest
): Promise<ExperimentResponse> {
  const response = await serverApiClient.post<ExperimentResponse>(
    `/workspaces/${workspaceId}/experiments`,
    data
  );
  return unwrapServerResponse(response);
}

/**
 * Create multiple experiments in batch
 */
export async function serverCreateExperimentsBatch(
  workspaceId: number,
  experiments: CreateExperimentRequest[]
): Promise<ExperimentResponse[]> {
  const response = await serverApiClient.post<ExperimentResponse[]>('/experiments/batch', {
    workspaceId,
    experiments,
  });
  return unwrapServerResponse(response);
}

/**
 * Update an experiment
 */
export async function serverUpdateExperiment(
  id: number,
  data: UpdateExperimentRequest
): Promise<ExperimentResponse> {
  const response = await serverApiClient.put<ExperimentResponse>(`/experiments/${id}`, data);
  return unwrapServerResponse(response);
}

/**
 * Delete an experiment
 */
export async function serverDeleteExperiment(id: number): Promise<void> {
  await serverApiClient.delete(`/experiments/${id}`);
}

export { ServerApiError };
