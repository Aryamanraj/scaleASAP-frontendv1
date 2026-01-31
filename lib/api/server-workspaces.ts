/**
 * Server-side Workspace API functions
 * For use in Next.js Server Actions
 */

import { serverApiClient, unwrapServerResponse, ServerApiError } from './server-client';
import type { ChatMessage } from './types';

// Backend workspace response type (uses numeric IDs)
export interface WorkspaceResponse {
  id: number;
  name: string;
  website?: string;
  faviconUrl?: string;
  status: string;
  onboardingStatus: 'incomplete' | 'complete';
  discoveryChatHistory?: ChatMessage[];
  settings?: object;
  ownerUserId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMemberResponse {
  userId: number;
  name: string;
  email: string;
  role: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  website?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  website?: string;
  faviconUrl?: string;
  onboardingStatus?: 'incomplete' | 'complete';
  settings?: object;
}

export interface UpdateDiscoveryChatRequest {
  history: ChatMessage[];
}

export interface CreateDiscoveryFeedbackRequest {
  rating: number;
  feedback?: string;
}

// ============================================================================
// Workspace CRUD
// ============================================================================

/**
 * Get all workspaces for the current user (server-side)
 */
export async function serverGetWorkspaces(): Promise<WorkspaceResponse[]> {
  console.log('serverGetWorkspaces: Making API call to /workspaces')
  const response = await serverApiClient.get<WorkspaceResponse[]>('/workspaces');
  console.log('serverGetWorkspaces: Raw API response:', JSON.stringify(response, null, 2))
  const unwrapped = unwrapServerResponse(response);
  console.log('serverGetWorkspaces: Unwrapped response:', JSON.stringify(unwrapped, null, 2))
  return unwrapped;
}

/**
 * Get a single workspace by ID (server-side)
 */
export async function serverGetWorkspaceById(id: number): Promise<WorkspaceResponse> {
  const response = await serverApiClient.get<WorkspaceResponse>(`/workspaces/${id}`);
  return unwrapServerResponse(response);
}

/**
 * Create a new workspace (server-side)
 */
export async function serverCreateWorkspace(
  data: CreateWorkspaceRequest
): Promise<WorkspaceResponse> {
  const response = await serverApiClient.post<WorkspaceResponse>('/workspaces', data);
  return unwrapServerResponse(response);
}

/**
 * Update a workspace (server-side)
 */
export async function serverUpdateWorkspace(
  id: number,
  data: UpdateWorkspaceRequest
): Promise<WorkspaceResponse> {
  const response = await serverApiClient.put<WorkspaceResponse>(`/workspaces/${id}`, data);
  return unwrapServerResponse(response);
}

/**
 * Delete a workspace (server-side)
 */
export async function serverDeleteWorkspace(id: number): Promise<void> {
  await serverApiClient.delete(`/workspaces/${id}`);
}

// ============================================================================
// Discovery Chat
// ============================================================================

/**
 * Get discovery chat history for a workspace
 */
export async function serverGetDiscoveryChatHistory(workspaceId: number): Promise<ChatMessage[]> {
  const response = await serverApiClient.get<ChatMessage[]>(`/workspaces/${workspaceId}/discovery-chat`);
  return unwrapServerResponse(response);
}

/**
 * Update discovery chat history for a workspace
 */
export async function serverUpdateDiscoveryChatHistory(
  workspaceId: number,
  history: ChatMessage[]
): Promise<void> {
  await serverApiClient.put(`/workspaces/${workspaceId}/discovery-chat`, { history });
}

// ============================================================================
// Worldview Generation
// ============================================================================

export interface GenerateWorldviewRequest {
  onboardingData: Record<string, unknown>;
  websiteScrape?: string;
}

export interface GenerateWorldviewResponse {
  worldview: string;
  provider: string;
}

/**
 * Generate worldview document from onboarding data (server-side)
 */
export async function serverGenerateWorldview(
  workspaceId: number,
  data: GenerateWorldviewRequest
): Promise<GenerateWorldviewResponse> {
  const response = await serverApiClient.post<GenerateWorldviewResponse>(
    `/workspaces/${workspaceId}/worldview/generate`,
    data
  );
  return unwrapServerResponse(response);
}

// ============================================================================
// Discovery Feedback
// ============================================================================

/**
 * Submit discovery feedback for a workspace
 */
export async function serverSaveDiscoveryFeedback(
  workspaceId: number,
  rating: number,
  feedback?: string
): Promise<void> {
  await serverApiClient.post(`/workspaces/${workspaceId}/discovery-feedback`, {
    rating,
    feedback,
  });
}

// ============================================================================
// Workspace Members
// ============================================================================

/**
 * Get all members of a workspace
 */
export async function serverGetWorkspaceMembers(workspaceId: number): Promise<WorkspaceMemberResponse[]> {
  const response = await serverApiClient.get<WorkspaceMemberResponse[]>(`/workspaces/${workspaceId}/members`);
  return unwrapServerResponse(response);
}

export { ServerApiError };
