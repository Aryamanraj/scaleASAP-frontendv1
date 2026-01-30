/**
 * API Response Types
 * Standard response format from backend-v1
 */

// Base API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

// Error response
export interface ApiError {
  success: false;
  message: string;
  data: null;
  statusCode?: number;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Workspace Types
// ============================================================================

export interface Workspace {
  id: number;
  name: string;
  website: string | null;
  faviconUrl: string | null;
  onboardingStatus: 'not_started' | 'in_progress' | 'completed';
  discoveryChatHistory: ChatMessage[] | null;
  worldview: string | null;
  websiteScrape: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: number;
  userId: string;
  workspaceId: number;
  role: 'owner' | 'admin' | 'member';
  user: {
    id: string;
    email: string;
    displayName: string | null;
  };
  createdAt: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  website?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  website?: string;
  faviconUrl?: string;
  onboardingStatus?: 'not_started' | 'in_progress' | 'completed';
  discoveryChatHistory?: ChatMessage[];
  worldview?: string;
  websiteScrape?: string;
}

// ============================================================================
// Onboarding Types
// ============================================================================

export interface OnboardingData {
  workspaceId: number;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SaveOnboardingRequest {
  data: Record<string, unknown>;
}

// ============================================================================
// Experiment Types
// ============================================================================

export type ExperimentType =
  | 'bullseye'
  | 'variable_a'
  | 'variable_b'
  | 'contrarian'
  | 'long_shot';

export type ExperimentStatus =
  | 'draft'
  | 'ready'
  | 'running'
  | 'paused'
  | 'completed'
  | 'archived';

export interface WizaFilters {
  job_title?: Array<{ v: string; s: string }>;
  job_title_level?: string[];
  company_industry?: Array<{ v: string }>;
  company_size?: string[];
  [key: string]: unknown;
}

export interface Experiment {
  id: number;
  workspaceId: number;
  name: string;
  type: ExperimentType;
  pattern: string | null;
  industries: string[];
  pain: string | null;
  trigger: string | null;
  wizaFilters: WizaFilters | null;
  outreachAngle: string | null;
  status: ExperimentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperimentRequest {
  name: string;
  type: ExperimentType;
  pattern?: string;
  industries?: string[];
  pain?: string;
  trigger?: string;
  wizaFilters?: WizaFilters;
  outreachAngle?: string;
  status?: ExperimentStatus;
}

export interface CreateExperimentsBatchRequest {
  experiments: CreateExperimentRequest[];
}

export interface UpdateExperimentRequest {
  name?: string;
  type?: ExperimentType;
  pattern?: string;
  industries?: string[];
  pain?: string;
  trigger?: string;
  wizaFilters?: WizaFilters;
  outreachAngle?: string;
  status?: ExperimentStatus;
}

// ============================================================================
// Campaign Types
// ============================================================================

export type CampaignStatus =
  | 'draft'
  | 'ready'
  | 'running'
  | 'paused'
  | 'completed'
  | 'archived';

export interface Campaign {
  id: number;
  workspaceId: number;
  experimentId: number | null;
  name: string;
  status: CampaignStatus;
  totalLeads: number;
  contactedCount: number;
  repliedCount: number;
  meetingsBooked: number;
  createdAt: string;
  updatedAt: string;
  experiment?: Experiment;
}

export interface CreateCampaignRequest {
  name: string;
  experimentId?: number;
  status?: CampaignStatus;
}

export interface UpdateCampaignRequest {
  name?: string;
  experimentId?: number;
  status?: CampaignStatus;
}

export interface CampaignActivity {
  id: number;
  campaignId: number;
  activityType: string;
  description: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// ============================================================================
// Lead Types
// ============================================================================

export type LeadStatus =
  | 'new'
  | 'enriched'
  | 'contacted'
  | 'replied'
  | 'meeting_booked'
  | 'converted'
  | 'not_interested'
  | 'bounced'
  | 'unsubscribed';

export type LeadOutcome =
  | 'positive'
  | 'negative'
  | 'neutral'
  | 'no_response'
  | 'meeting_booked'
  | 'not_interested'
  | 'wrong_person'
  | 'bounced';

export interface Lead {
  id: number;
  campaignId: number;
  workspaceId: number;
  wizaId: string | null;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  jobTitle: string | null;
  company: string | null;
  companyLinkedinUrl: string | null;
  companyWebsite: string | null;
  industry: string | null;
  location: string | null;
  enrichmentData: Record<string, unknown> | null;
  status: LeadStatus;
  outcome: LeadOutcome | null;
  outcomeNotes: string | null;
  outboundMessage: string | null;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  jobTitle?: string;
  company?: string;
  companyLinkedinUrl?: string;
  companyWebsite?: string;
  industry?: string;
  location?: string;
  enrichmentData?: Record<string, unknown>;
  wizaId?: string;
}

export interface CreateLeadsBatchRequest {
  leads: CreateLeadRequest[];
}

export interface UpdateLeadRequest {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  jobTitle?: string;
  company?: string;
  status?: LeadStatus;
  outcome?: LeadOutcome;
  outcomeNotes?: string;
  outboundMessage?: string;
}

export interface LogOutcomeRequest {
  outcome: LeadOutcome;
  notes?: string;
}

export interface LeadSignal {
  id: number;
  leadId: number;
  signalType: string;
  signalData: Record<string, unknown>;
  confidence: number;
  createdAt: string;
}

// ============================================================================
// Discovery Types
// ============================================================================

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface DiscoverySession {
  id: number;
  workspaceId: number;
  status: 'active' | 'completed' | 'abandoned';
  turnCount: number;
  messages: ChatMessage[];
  experimentsGenerated: number[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryChatRequest {
  message: string;
  sessionId?: number;
}

export interface DiscoveryChatResponse {
  message: string;
  placeholder?: string;
  experiments?: Experiment[];
  sessionId: number;
  turnCount: number;
}

export interface DiscoveryFeedback {
  rating: number;
  feedback?: string;
}

// ============================================================================
// AI Service Types
// ============================================================================

export interface GenerateOutreachRequest {
  leadId: number;
  context?: {
    senderName?: string;
    senderTitle?: string;
    companyName?: string;
    companyDescription?: string;
    valueProposition?: string;
    tone?: 'professional' | 'casual' | 'friendly';
  };
}

export interface GenerateOutreachResponse {
  subject?: string;
  body: string;
  connectionRequest?: string;
  followUp?: string;
}

export interface RegenerateFiltersRequest {
  experimentId: number;
  optimize?: boolean;
}

export interface RegenerateFiltersResponse {
  filters: WizaFilters;
  prospectCount?: number;
}

export interface GenerateWorldviewRequest {
  onboardingData: Record<string, unknown>;
  websiteScrape?: string;
}

export interface GenerateWorldviewResponse {
  worldview: string;
}

export interface ScrapeWebsiteRequest {
  url: string;
}

export interface ScrapeWebsiteResponse {
  content: string;
  title?: string;
  description?: string;
  favicon?: string;
}

// ============================================================================
// Outreach Message Types
// ============================================================================

export type MessageChannel = 'linkedin' | 'email' | 'other';
export type MessageType =
  | 'connection_request'
  | 'initial_outreach'
  | 'follow_up'
  | 'reply';
export type MessageStatus = 'draft' | 'sent' | 'delivered' | 'read' | 'replied';

export interface OutreachMessage {
  id: number;
  leadId: number;
  channel: MessageChannel;
  messageType: MessageType;
  subject: string | null;
  body: string;
  status: MessageStatus;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOutreachMessageRequest {
  channel: MessageChannel;
  messageType: MessageType;
  subject?: string;
  body: string;
}

export interface UpdateOutreachMessageRequest {
  subject?: string;
  body?: string;
  status?: MessageStatus;
}
