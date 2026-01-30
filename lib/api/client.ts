/**
 * API Client
 * Base client for making authenticated requests to backend-v1
 */

import { createClient } from '@/lib/supabase/client';
import type { ApiResponse, ApiError } from './types';

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: ApiError
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Get the current auth token from Supabase
 */
async function getAuthToken(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Base fetch function with auth and error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiClientError(
        data.message || `HTTP error ${response.status}`,
        response.status,
        data
      );
    }

    return data as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    // Network or parsing error
    throw new ApiClientError(
      error instanceof Error ? error.message : 'Unknown error',
      0
    );
  }
}

/**
 * API client methods
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return apiFetch<T>(endpoint, { method: 'GET' });
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return apiFetch<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return apiFetch<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return apiFetch<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return apiFetch<T>(endpoint, { method: 'DELETE' });
  },

  /**
   * SSE (Server-Sent Events) streaming request
   * Used for discovery chat and other streaming endpoints
   */
  async stream(
    endpoint: string,
    body: unknown,
    onMessage: (data: string) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ): Promise<void> {
    const token = await getAuthToken();

    const url = `${API_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
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

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete?.();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        
        // Handle SSE format: data: {...}\n\n
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete?.();
              return;
            }
            onMessage(data);
          }
        }
      }
    } catch (error) {
      if (error instanceof ApiClientError) {
        onError?.(error);
      } else {
        onError?.(
          new ApiClientError(
            error instanceof Error ? error.message : 'Stream error',
            0
          )
        );
      }
    }
  },
};

/**
 * Helper to extract data from API response or throw
 */
export function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === null) {
    throw new ApiClientError(response.message, 0);
  }
  return response.data;
}

/**
 * Helper to handle API errors and show toast
 */
export function handleApiError(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

export default apiClient;
