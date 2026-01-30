/**
 * Onboarding API
 * Functions for onboarding data management
 */

import { apiClient, unwrapResponse, ApiClientError } from './client';
import type { OnboardingData } from './types';

/**
 * Get onboarding data for a workspace
 */
export async function getOnboardingData(
  workspaceId: number
): Promise<OnboardingData | null> {
  try {
    const response = await apiClient.get<OnboardingData>(
      `/workspaces/${workspaceId}/onboarding`
    );
    return unwrapResponse(response);
  } catch (error) {
    // Return null if not found (404)
    if (error instanceof ApiClientError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Save onboarding data for a workspace
 */
export async function saveOnboardingData(
  workspaceId: number,
  data: Record<string, unknown>
): Promise<OnboardingData> {
  const response = await apiClient.put<OnboardingData>(
    `/workspaces/${workspaceId}/onboarding`,
    { data }
  );
  return unwrapResponse(response);
}

/**
 * Update specific fields in onboarding data
 */
export async function updateOnboardingFields(
  workspaceId: number,
  fields: Record<string, unknown>
): Promise<OnboardingData> {
  // First get existing data
  const existing = await getOnboardingData(workspaceId);
  const existingData = existing?.data || {};

  // Merge with new fields
  const mergedData = {
    ...existingData,
    ...fields,
  };

  return saveOnboardingData(workspaceId, mergedData);
}

/**
 * Check if onboarding is complete
 */
export async function isOnboardingComplete(
  workspaceId: number
): Promise<boolean> {
  const data = await getOnboardingData(workspaceId);

  if (!data?.data) return false;

  // Check required fields
  const requiredFields = [
    'companyName',
    'businessType',
    'targetAudience',
    'valueProposition',
  ];

  return requiredFields.every((field) => {
    const value = (data.data as Record<string, unknown>)[field];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Get onboarding progress percentage
 */
export async function getOnboardingProgress(
  workspaceId: number
): Promise<number> {
  const data = await getOnboardingData(workspaceId);

  if (!data?.data) return 0;

  // All onboarding fields
  const allFields = [
    'companyName',
    'businessType',
    'targetAudience',
    'valueProposition',
    'foundingTrigger',
    'beforeState',
    'afterState',
    'competitiveEdge',
    'pricingModel',
    'existingCustomers',
    'customerWorldview',
  ];

  const filledCount = allFields.filter((field) => {
    const value = (data.data as Record<string, unknown>)[field];
    return value !== undefined && value !== null && value !== '';
  }).length;

  return Math.round((filledCount / allFields.length) * 100);
}

/**
 * Format onboarding data as markdown for AI context
 */
export function formatOnboardingAsMarkdown(
  data: Record<string, unknown>
): string {
  const sections = [
    { key: 'companyName', title: 'Company Name' },
    { key: 'businessType', title: 'Business Type' },
    { key: 'targetAudience', title: 'Target Audience' },
    { key: 'valueProposition', title: 'Value Proposition' },
    { key: 'foundingTrigger', title: 'Founding Trigger' },
    { key: 'beforeState', title: 'Before State' },
    { key: 'afterState', title: 'After State' },
    { key: 'competitiveEdge', title: 'Competitive Edge' },
    { key: 'pricingModel', title: 'Pricing Model' },
    { key: 'existingCustomers', title: 'Existing Customers' },
    { key: 'customerWorldview', title: 'Customer Worldview' },
  ];

  let markdown = '# Onboarding Data\n\n';

  for (const section of sections) {
    const value = data[section.key];
    if (value !== undefined && value !== null && value !== '') {
      markdown += `## ${section.title}\n`;
      markdown += `${value}\n\n`;
    }
  }

  return markdown;
}
