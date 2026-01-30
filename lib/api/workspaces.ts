/**
 * Workspaces API
 * Functions for workspace CRUD operations
 */

import { apiClient, unwrapResponse } from './client';
import type {
  Workspace,
  WorkspaceMember,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  ChatMessage,
} from './types';

/**
 * Get all workspaces for the current user
 */
export async function getWorkspaces(): Promise<Workspace[]> {
  const response = await apiClient.get<Workspace[]>('/workspaces');
  return unwrapResponse(response);
}

/**
 * Get a single workspace by ID
 */
export async function getWorkspaceById(id: number): Promise<Workspace> {
  const response = await apiClient.get<Workspace>(`/workspaces/${id}`);
  return unwrapResponse(response);
}

/**
 * Create a new workspace
 */
export async function createWorkspace(
  data: CreateWorkspaceRequest
): Promise<Workspace> {
  const response = await apiClient.post<Workspace>('/workspaces', data);
  return unwrapResponse(response);
}

/**
 * Update a workspace
 */
export async function updateWorkspace(
  id: number,
  data: UpdateWorkspaceRequest
): Promise<Workspace> {
  const response = await apiClient.put<Workspace>(`/workspaces/${id}`, data);
  return unwrapResponse(response);
}

/**
 * Delete a workspace
 */
export async function deleteWorkspace(id: number): Promise<void> {
  await apiClient.delete(`/workspaces/${id}`);
}

/**
 * Get workspace members
 */
export async function getWorkspaceMembers(
  workspaceId: number
): Promise<WorkspaceMember[]> {
  const response = await apiClient.get<WorkspaceMember[]>(
    `/workspaces/${workspaceId}/members`
  );
  return unwrapResponse(response);
}

/**
 * Add a member to a workspace
 */
export async function addWorkspaceMember(
  workspaceId: number,
  email: string,
  role: 'admin' | 'member' = 'member'
): Promise<WorkspaceMember> {
  const response = await apiClient.post<WorkspaceMember>(
    `/workspaces/${workspaceId}/members`,
    { email, role }
  );
  return unwrapResponse(response);
}

/**
 * Remove a member from a workspace
 */
export async function removeWorkspaceMember(
  workspaceId: number,
  userId: number
): Promise<void> {
  await apiClient.delete(`/workspaces/${workspaceId}/members/${userId}`);
}

/**
 * Save discovery chat history to workspace
 */
export async function saveDiscoveryChatHistory(
  workspaceId: number,
  chatHistory: ChatMessage[]
): Promise<Workspace> {
  const response = await apiClient.put<Workspace>(`/workspaces/${workspaceId}`, {
    discoveryChatHistory: chatHistory,
  });
  return unwrapResponse(response);
}

/**
 * Update workspace onboarding status
 */
export async function updateOnboardingStatus(
  workspaceId: number,
  status: 'not_started' | 'in_progress' | 'completed'
): Promise<Workspace> {
  const response = await apiClient.put<Workspace>(`/workspaces/${workspaceId}`, {
    onboardingStatus: status,
  });
  return unwrapResponse(response);
}

/**
 * Save worldview to workspace
 */
export async function saveWorldview(
  workspaceId: number,
  worldview: string
): Promise<Workspace> {
  const response = await apiClient.put<Workspace>(`/workspaces/${workspaceId}`, {
    worldview,
  });
  return unwrapResponse(response);
}

/**
 * Save website scrape content to workspace
 */
export async function saveWebsiteScrape(
  workspaceId: number,
  websiteScrape: string
): Promise<Workspace> {
  const response = await apiClient.put<Workspace>(`/workspaces/${workspaceId}`, {
    websiteScrape,
  });
  return unwrapResponse(response);
}
