/**
 * Server-side API Client
 * For use in Next.js Server Actions and API routes
 */

import { createClient } from '@/lib/supabase/server';
import type { ApiResponse, ApiError } from './types';

// Get API URL from environment
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Custom error class for API errors
 */
export class ServerApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: ApiError
  ) {
    super(message);
    this.name = 'ServerApiError';
  }
}

/**
 * Get the current auth token from Supabase (server-side)
 */
async function getServerAuthToken(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error('Failed to get server auth token:', error);
    return null;
  }
}

/**
 * Base fetch function with auth and error handling (server-side)
 */
async function serverApiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = await getServerAuthToken();

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
      // Don't cache API calls by default in server actions
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ServerApiError(
        data.message || `HTTP error ${response.status}`,
        response.status,
        data
      );
    }

    return data as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ServerApiError) {
      throw error;
    }

    // Network or parsing error
    throw new ServerApiError(
      error instanceof Error ? error.message : 'Unknown error',
      0
    );
  }
}

/**
 * Server-side API client methods
 */
export const serverApiClient = {
  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return serverApiFetch<T>(endpoint, { method: 'GET' });
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return serverApiFetch<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return serverApiFetch<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return serverApiFetch<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return serverApiFetch<T>(endpoint, { method: 'DELETE' });
  },
};

/**
 * Helper to extract data from API response or throw
 */
export function unwrapServerResponse<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === null) {
    throw new ServerApiError(response.message, 0);
  }
  return response.data;
}

export default serverApiClient;
