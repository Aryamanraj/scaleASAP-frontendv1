/**
 * API Module Index
 * Central export for all API functions
 */

// Client and utilities
export { apiClient, ApiClientError, unwrapResponse, handleApiError } from './client';

// Types
export type {
  // Base types
  ApiResponse,
  ApiError,
  PaginatedResponse,
  // Workspace types
  Workspace,
  WorkspaceMember,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  // Onboarding types
  OnboardingData,
  SaveOnboardingRequest,
  // Experiment types
  Experiment,
  ExperimentType,
  ExperimentStatus,
  WizaFilters,
  CreateExperimentRequest,
  CreateExperimentsBatchRequest,
  UpdateExperimentRequest,
  // Campaign types
  Campaign,
  CampaignStatus,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignActivity,
  // Lead types
  Lead,
  LeadStatus,
  LeadOutcome,
  CreateLeadRequest,
  CreateLeadsBatchRequest,
  UpdateLeadRequest,
  LogOutcomeRequest,
  LeadSignal,
  // Discovery types
  ChatMessage,
  DiscoverySession,
  DiscoveryChatRequest,
  DiscoveryChatResponse,
  DiscoveryFeedback,
  // AI types
  GenerateOutreachRequest,
  GenerateOutreachResponse,
  RegenerateFiltersRequest,
  RegenerateFiltersResponse,
  GenerateWorldviewRequest,
  GenerateWorldviewResponse,
  ScrapeWebsiteRequest,
  ScrapeWebsiteResponse,
  // Outreach message types
  OutreachMessage,
  MessageChannel,
  MessageType,
  MessageStatus,
  CreateOutreachMessageRequest,
  UpdateOutreachMessageRequest,
} from './types';

// Workspaces API
export {
  getWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  addWorkspaceMember,
  removeWorkspaceMember,
  saveDiscoveryChatHistory,
  updateOnboardingStatus,
  saveWorldview,
  saveWebsiteScrape,
} from './workspaces';

// Onboarding API
export {
  getOnboardingData,
  saveOnboardingData,
  updateOnboardingFields,
  isOnboardingComplete,
  getOnboardingProgress,
  formatOnboardingAsMarkdown,
} from './onboarding';

// Experiments API
export {
  getExperiments,
  getExperimentById,
  createExperiment,
  createExperimentsBatch,
  updateExperiment,
  deleteExperiment,
  updateExperimentStatus,
  updateExperimentFilters,
  regenerateExperimentFilters,
} from './experiments';

// Campaigns API
export {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  updateCampaignStatus,
  scaleCampaign,
  getCampaignActivities,
  getCampaignWithStats,
} from './campaigns';

// Leads API
export {
  getLeadsForCampaign,
  getLeadsForWorkspace,
  getLeadById,
  createLead,
  createLeadsBatch,
  updateLead,
  logLeadOutcome,
  getLeadSignals,
  updateLeadStatus,
  saveLeadOutboundMessage,
  bulkUpdateLeads,
} from './leads';

// Discovery API
export {
  getDiscoverySessions,
  getDiscoverySession,
  sendDiscoveryMessage,
  streamDiscoveryChat,
  saveDiscoveryFeedback,
  completeDiscoverySession,
  extractPlaceholder,
  extractExperimentsFromResponse,
} from './discovery';

// AI Services API
export {
  generateOutreachMessage,
  analyzeLinkedInActivity,
  generateWorldview,
  scrapeWebsite,
  regenerateFilters,
  generateOutreachForLead,
  batchGenerateOutreach,
} from './ai';

// Outreach Messages API
export {
  getMessagesForLead,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  markMessageSent,
  markMessageDelivered,
  markMessageRead,
  markMessageReplied,
  createConnectionRequest,
  createInitialOutreach,
  createFollowUp,
} from './outreach';
