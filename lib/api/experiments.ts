/**
 * Experiments API
 * Functions for experiment CRUD operations
 */

import { apiClient, unwrapResponse } from './client';
import type {
  Experiment,
  CreateExperimentRequest,
  CreateExperimentsBatchRequest,
  UpdateExperimentRequest,
  WizaFilters,
} from './types';

/**
 * Get all experiments for a workspace
 */
export async function getExperiments(workspaceId: number): Promise<Experiment[]> {
  const response = await apiClient.get<Experiment[]>(
    `/workspaces/${workspaceId}/experiments`
  );
  return unwrapResponse(response);
}

/**
 * Get a single experiment by ID
 */
export async function getExperimentById(id: number): Promise<Experiment> {
  const response = await apiClient.get<Experiment>(`/experiments/${id}`);
  return unwrapResponse(response);
}

/**
 * Create a single experiment
 */
export async function createExperiment(
  workspaceId: number,
  data: CreateExperimentRequest
): Promise<Experiment> {
  const response = await apiClient.post<Experiment>(
    `/workspaces/${workspaceId}/experiments`,
    data
  );
  return unwrapResponse(response);
}

/**
 * Create multiple experiments in batch
 * Used after discovery chat generates ICPs
 */
export async function createExperimentsBatch(
  workspaceId: number,
  experiments: CreateExperimentRequest[]
): Promise<Experiment[]> {
  const response = await apiClient.post<Experiment[]>(
    `/workspaces/${workspaceId}/experiments/batch`,
    { experiments }
  );
  return unwrapResponse(response);
}

/**
 * Update an experiment
 */
export async function updateExperiment(
  id: number,
  data: UpdateExperimentRequest
): Promise<Experiment> {
  const response = await apiClient.put<Experiment>(`/experiments/${id}`, data);
  return unwrapResponse(response);
}

/**
 * Delete an experiment
 */
export async function deleteExperiment(id: number): Promise<void> {
  await apiClient.delete(`/experiments/${id}`);
}

/**
 * Update experiment status
 */
export async function updateExperimentStatus(
  id: number,
  status: Experiment['status']
): Promise<Experiment> {
  return updateExperiment(id, { status });
}

/**
 * Update experiment filters
 */
export async function updateExperimentFilters(
  id: number,
  wizaFilters: WizaFilters
): Promise<Experiment> {
  return updateExperiment(id, { wizaFilters });
}

/**
 * Regenerate filters for an experiment using AI
 * @param id - Experiment ID
 * @param optimize - Whether to optimize filters against Wiza API
 */
export async function regenerateExperimentFilters(
  id: number,
  optimize: boolean = false
): Promise<{ filters: WizaFilters; prospectCount?: number }> {
  const response = await apiClient.post<{
    filters: WizaFilters;
    prospectCount?: number;
  }>(`/experiments/${id}/filters/regenerate`, { optimize });
  return unwrapResponse(response);
}
