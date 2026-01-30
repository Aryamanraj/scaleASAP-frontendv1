/**
 * Outreach Messages API
 * Functions for outreach message CRUD operations
 */

import { apiClient, unwrapResponse } from './client';
import type {
  OutreachMessage,
  CreateOutreachMessageRequest,
  UpdateOutreachMessageRequest,
} from './types';

/**
 * Get all outreach messages for a lead
 */
export async function getMessagesForLead(
  leadId: number
): Promise<OutreachMessage[]> {
  const response = await apiClient.get<OutreachMessage[]>(
    `/leads/${leadId}/messages`
  );
  return unwrapResponse(response);
}

/**
 * Get a single outreach message by ID
 */
export async function getMessageById(id: number): Promise<OutreachMessage> {
  const response = await apiClient.get<OutreachMessage>(`/messages/${id}`);
  return unwrapResponse(response);
}

/**
 * Create an outreach message for a lead
 */
export async function createMessage(
  leadId: number,
  data: CreateOutreachMessageRequest
): Promise<OutreachMessage> {
  const response = await apiClient.post<OutreachMessage>(
    `/leads/${leadId}/messages`,
    data
  );
  return unwrapResponse(response);
}

/**
 * Update an outreach message
 */
export async function updateMessage(
  id: number,
  data: UpdateOutreachMessageRequest
): Promise<OutreachMessage> {
  const response = await apiClient.put<OutreachMessage>(`/messages/${id}`, data);
  return unwrapResponse(response);
}

/**
 * Delete an outreach message
 */
export async function deleteMessage(id: number): Promise<void> {
  await apiClient.delete(`/messages/${id}`);
}

/**
 * Mark message as sent
 */
export async function markMessageSent(id: number): Promise<OutreachMessage> {
  return updateMessage(id, { status: 'sent' });
}

/**
 * Mark message as delivered
 */
export async function markMessageDelivered(id: number): Promise<OutreachMessage> {
  return updateMessage(id, { status: 'delivered' });
}

/**
 * Mark message as read
 */
export async function markMessageRead(id: number): Promise<OutreachMessage> {
  return updateMessage(id, { status: 'read' });
}

/**
 * Mark message as replied
 */
export async function markMessageReplied(id: number): Promise<OutreachMessage> {
  return updateMessage(id, { status: 'replied' });
}

/**
 * Create a connection request message
 */
export async function createConnectionRequest(
  leadId: number,
  body: string
): Promise<OutreachMessage> {
  return createMessage(leadId, {
    channel: 'linkedin',
    messageType: 'connection_request',
    body,
  });
}

/**
 * Create an initial outreach message
 */
export async function createInitialOutreach(
  leadId: number,
  data: {
    channel: 'linkedin' | 'email';
    subject?: string;
    body: string;
  }
): Promise<OutreachMessage> {
  return createMessage(leadId, {
    channel: data.channel,
    messageType: 'initial_outreach',
    subject: data.subject,
    body: data.body,
  });
}

/**
 * Create a follow-up message
 */
export async function createFollowUp(
  leadId: number,
  data: {
    channel: 'linkedin' | 'email';
    subject?: string;
    body: string;
  }
): Promise<OutreachMessage> {
  return createMessage(leadId, {
    channel: data.channel,
    messageType: 'follow_up',
    subject: data.subject,
    body: data.body,
  });
}
