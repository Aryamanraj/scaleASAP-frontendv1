'use server';

/**
 * Messages Server Actions
 * Handles generated messages CRUD operations via backend API
 */

import {
  serverGetGeneratedMessages,
  serverSaveGeneratedMessage,
  serverDeleteGeneratedMessage,
  type GeneratedMessageResponse,
  type CreateGeneratedMessageRequest,
  type MessagePlatform,
  type MessageType,
  ServerApiError,
} from '@/lib/api/server-leads';

// ============================================================================
// Types for Frontend
// ============================================================================

export interface GeneratedMessage {
  id: string;
  lead_id: string;
  platform: MessagePlatform;
  message_type: MessageType;
  content: string;
  context?: string;
  thinking?: string;
  timestamp: string;
  created_at: string;
}

// ============================================================================
// Transform Functions
// ============================================================================

function transformGeneratedMessage(msg: GeneratedMessageResponse): GeneratedMessage {
  return {
    id: String(msg.GeneratedMessageID),
    lead_id: String(msg.LeadID),
    platform: msg.Platform,
    message_type: msg.MessageType,
    content: msg.Content,
    context: msg.Context,
    thinking: msg.Thinking?.whyThisApproach || undefined,
    timestamp: msg.Timestamp,
    created_at: msg.CreatedAt,
  };
}

// ============================================================================
// Server Actions
// ============================================================================

/**
 * Get all generated messages for a lead
 */
export async function getGeneratedMessages(leadId: string): Promise<GeneratedMessage[]> {
  try {
    const numericId = parseInt(leadId, 10);
    if (isNaN(numericId)) {
      console.error('[messages] Invalid lead ID:', leadId);
      return [];
    }

    const response = await serverGetGeneratedMessages(numericId);
    return response.map(transformGeneratedMessage);
  } catch (error) {
    console.error('[messages] Error getting generated messages:', error);
    return [];
  }
}

/**
 * Save a generated message for a lead
 */
export async function saveGeneratedMessage(data: {
  lead_id: string;
  platform: MessagePlatform;
  message_type: string;
  content: string;
  context?: string;
  thinking?: string;
  timestamp: string;
}): Promise<GeneratedMessage | null> {
  try {
    const numericId = parseInt(data.lead_id, 10);
    if (isNaN(numericId)) {
      console.error('[messages] Invalid lead ID:', data.lead_id);
      return null;
    }

    const request: CreateGeneratedMessageRequest = {
      platform: data.platform,
      messageType: data.message_type as MessageType,
      content: data.content,
      context: data.context,
      thinking: data.thinking ? { whyThisApproach: data.thinking } : undefined,
    };

    const response = await serverSaveGeneratedMessage(numericId, request);
    return transformGeneratedMessage(response);
  } catch (error) {
    console.error('[messages] Error saving generated message:', error);
    return null;
  }
}

/**
 * Delete a generated message
 */
export async function deleteGeneratedMessage(messageId: string): Promise<boolean> {
  try {
    const numericId = parseInt(messageId, 10);
    if (isNaN(numericId)) {
      console.error('[messages] Invalid message ID:', messageId);
      return false;
    }

    await serverDeleteGeneratedMessage(numericId);
    return true;
  } catch (error) {
    console.error('[messages] Error deleting generated message:', error);
    return false;
  }
}
