/**
 * Discovery API
 * Functions for discovery chat and session management
 */

import { apiClient, unwrapResponse, ApiClientError } from './client';
import type {
  DiscoverySession,
  DiscoveryChatRequest,
  DiscoveryChatResponse,
  DiscoveryFeedback,
  ChatMessage,
  Experiment,
} from './types';

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Get all discovery sessions for a workspace
 */
export async function getDiscoverySessions(
  workspaceId: number
): Promise<DiscoverySession[]> {
  const response = await apiClient.get<DiscoverySession[]>(
    `/workspaces/${workspaceId}/discovery/sessions`
  );
  return unwrapResponse(response);
}

/**
 * Get a single discovery session
 */
export async function getDiscoverySession(
  workspaceId: number,
  sessionId: number
): Promise<DiscoverySession> {
  const response = await apiClient.get<DiscoverySession>(
    `/workspaces/${workspaceId}/discovery/sessions/${sessionId}`
  );
  return unwrapResponse(response);
}

/**
 * Send a message in discovery chat (non-streaming)
 */
export async function sendDiscoveryMessage(
  workspaceId: number,
  data: DiscoveryChatRequest
): Promise<DiscoveryChatResponse> {
  const response = await apiClient.post<DiscoveryChatResponse>(
    `/workspaces/${workspaceId}/discovery/chat`,
    data
  );
  return unwrapResponse(response);
}

/**
 * Stream discovery chat response
 * Uses Server-Sent Events (SSE) for real-time streaming
 */
export async function streamDiscoveryChat(
  workspaceId: number,
  data: DiscoveryChatRequest,
  callbacks: {
    onToken: (token: string) => void;
    onComplete: (response: {
      fullMessage: string;
      placeholder?: string;
      experiments?: Experiment[];
    }) => void;
    onError: (error: Error) => void;
  }
): Promise<void> {
  const { onToken, onComplete, onError } = callbacks;

  // Get auth token
  const { createClient } = await import('@/lib/supabase/client');
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    onError(new Error('Not authenticated'));
    return;
  }

  const url = `${API_URL}/workspaces/${workspaceId}/discovery/chat/stream`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiClientError(
        errorData.message || `HTTP error ${response.status}`,
        response.status,
        errorData
      );
    }

    if (!response.body) {
      throw new ApiClientError('No response body', 0);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullMessage = '';
    let placeholder: string | undefined;
    let experiments: Experiment[] | undefined;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });

      // Handle SSE format
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);

          if (dataStr === '[DONE]') {
            onComplete({ fullMessage, placeholder, experiments });
            return;
          }

          try {
            const parsed = JSON.parse(dataStr);

            if (parsed.type === 'token') {
              fullMessage += parsed.content;
              onToken(parsed.content);
            } else if (parsed.type === 'placeholder') {
              placeholder = parsed.content;
            } else if (parsed.type === 'experiments') {
              experiments = parsed.content;
            } else if (parsed.type === 'error') {
              throw new Error(parsed.content);
            }
          } catch (parseError) {
            // If it's not JSON, treat as raw token
            if (!dataStr.startsWith('{')) {
              fullMessage += dataStr;
              onToken(dataStr);
            }
          }
        }
      }
    }

    onComplete({ fullMessage, placeholder, experiments });
  } catch (error) {
    if (error instanceof ApiClientError) {
      onError(error);
    } else {
      onError(
        error instanceof Error ? error : new Error('Unknown streaming error')
      );
    }
  }
}

/**
 * Save discovery feedback
 */
export async function saveDiscoveryFeedback(
  workspaceId: number,
  feedback: DiscoveryFeedback
): Promise<void> {
  await apiClient.post(`/workspaces/${workspaceId}/discovery/feedback`, feedback);
}

/**
 * Complete a discovery session
 */
export async function completeDiscoverySession(
  workspaceId: number,
  sessionId: number
): Promise<DiscoverySession> {
  const response = await apiClient.post<DiscoverySession>(
    `/workspaces/${workspaceId}/discovery/sessions/${sessionId}/complete`
  );
  return unwrapResponse(response);
}

/**
 * Helper to extract placeholder from AI response
 */
export function extractPlaceholder(message: string): {
  cleanMessage: string;
  placeholder: string | null;
} {
  const placeholderMatch = message.match(/\[\[PLACEHOLDER:\s*(.+?)\]\]/);

  if (placeholderMatch) {
    return {
      cleanMessage: message.replace(placeholderMatch[0], '').trim(),
      placeholder: placeholderMatch[1].trim(),
    };
  }

  return {
    cleanMessage: message,
    placeholder: null,
  };
}

/**
 * Helper to extract experiments JSON from AI response
 */
export function extractExperimentsFromResponse(message: string): {
  cleanMessage: string;
  experiments: Experiment[] | null;
  strategicInsight: string | null;
} {
  const startMarker = '--- JSON_OUTPUT_START ---';
  const endMarker = '--- JSON_OUTPUT_END ---';

  const startIndex = message.indexOf(startMarker);
  const endIndex = message.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    return {
      cleanMessage: message,
      experiments: null,
      strategicInsight: null,
    };
  }

  const jsonContent = message
    .substring(startIndex + startMarker.length, endIndex)
    .trim();

  // Remove markdown code fence if present
  const cleanJson = jsonContent
    .replace(/```json\s*/, '')
    .replace(/```\s*$/, '')
    .trim();

  try {
    const parsed = JSON.parse(cleanJson);
    const cleanMessage = message.substring(0, startIndex).trim();

    return {
      cleanMessage,
      experiments: parsed.icps || null,
      strategicInsight: parsed.strategic_insight || null,
    };
  } catch {
    return {
      cleanMessage: message,
      experiments: null,
      strategicInsight: null,
    };
  }
}
