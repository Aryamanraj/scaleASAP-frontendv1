# Frontend Migration Plan: Use backend-v1 APIs

## Overview

This document outlines the plan to migrate frontend-v1 from direct Supabase/Next.js API routes to use the backend-v1 NestJS APIs.

---

## Environment Setup

### .env.local
```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
API_URL=http://localhost:4000

# Keep Supabase for Auth (client-side) only
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## API Client Setup

### Create: `lib/api/client.ts`
- Axios or fetch wrapper
- Auto-attach Supabase JWT to all requests
- Handle response format: `{ success, message, data }`
- Error handling with toast notifications

---

## Migration Phases

### Phase 1: API Client Foundation ✅
Create the base API client and types.

**Files Created:**
| File | Purpose |
|------|---------|
| `lib/api/client.ts` | Base API client with auth |
| `lib/api/types.ts` | API response types |
| `lib/api/index.ts` | Central exports |
| `lib/api/workspaces.ts` | Workspace API |
| `lib/api/onboarding.ts` | Onboarding API |
| `lib/api/experiments.ts` | Experiment API |
| `lib/api/campaigns.ts` | Campaign API |
| `lib/api/leads.ts` | Lead API |
| `lib/api/discovery.ts` | Discovery chat API |
| `lib/api/ai.ts` | AI services API |
| `lib/api/outreach.ts` | Outreach message API |
| `.env.example` | Environment variables template |

---

### Phase 2: Workspaces ⬜
Migrate workspace operations.

**Current (Server Actions):**
- `app/actions/workspace.ts` → Direct Supabase

**New (API Calls):**
| Frontend Function | Backend Endpoint | Method |
|-------------------|------------------|--------|
| `getWorkspaces()` | `GET /workspaces` | GET |
| `createWorkspace()` | `POST /workspaces` | POST |
| `getWorkspaceById()` | `GET /workspaces/:id` | GET |
| `updateWorkspace()` | `PUT /workspaces/:id` | PUT |
| `deleteWorkspace()` | `DELETE /workspaces/:id` | DELETE |
| `getWorkspaceMembers()` | `GET /workspaces/:id/members` | GET |
| `addWorkspaceMember()` | `POST /workspaces/:id/members` | POST |
| `removeWorkspaceMember()` | `DELETE /workspaces/:id/members/:userId` | DELETE |

**Files to Create:**
| File | Purpose |
|------|---------|
| `lib/api/workspaces.ts` | Workspace API functions |

**Files to Update:**
| File | Changes |
|------|---------|
| `app/actions/workspace.ts` | Replace Supabase calls with API client |

---

### Phase 3: Onboarding ⬜
Migrate onboarding data operations.

**Backend Needed:** Add onboarding endpoints to workspace controller

**Current (Server Actions):**
- `app/actions/onboarding.ts` → Direct Supabase

**New (API Calls):**
| Frontend Function | Backend Endpoint | Method |
|-------------------|------------------|--------|
| `getOnboardingData()` | `GET /workspaces/:id/onboarding` | GET |
| `saveOnboardingData()` | `PUT /workspaces/:id/onboarding` | PUT |

**Backend to Add:**
```typescript
// workspace.controller.ts
@Get(':id/onboarding')
@Put(':id/onboarding')
```

**Files to Create:**
| File | Purpose |
|------|---------|
| `lib/api/onboarding.ts` | Onboarding API functions |

---

### Phase 4: Experiments ⬜
Migrate experiment operations.

**Current (Server Actions):**
- `app/actions/workspace.ts` (experiment functions) → Direct Supabase

**New (API Calls):**
| Frontend Function | Backend Endpoint | Method |
|-------------------|------------------|--------|
| `getExperiments()` | `GET /workspaces/:id/experiments` | GET |
| `createExperiments()` | `POST /workspaces/:id/experiments/batch` | POST |
| `updateExperiment()` | `PUT /experiments/:id` | PUT |
| `deleteExperiment()` | `DELETE /experiments/:id` | DELETE |

**Files to Create:**
| File | Purpose |
|------|---------|
| `lib/api/experiments.ts` | Experiment API functions |

---

### Phase 5: Campaigns ⬜
Migrate campaign operations.

**Current (Server Actions):**
- `app/actions/campaigns.ts` → Direct Supabase

**New (API Calls):**
| Frontend Function | Backend Endpoint | Method |
|-------------------|------------------|--------|
| `getCampaigns()` | `GET /workspaces/:id/campaigns` | GET |
| `createCampaign()` | `POST /workspaces/:id/campaigns` | POST |
| `getCampaignById()` | `GET /campaigns/:id` | GET |
| `updateCampaign()` | `PUT /campaigns/:id` | PUT |
| `deleteCampaign()` | `DELETE /campaigns/:id` | DELETE |
| `scaleCampaign()` | `POST /campaigns/:id/scale` | POST |
| `getCampaignActivities()` | `GET /campaigns/:id/activities` | GET |

**Files to Create:**
| File | Purpose |
|------|---------|
| `lib/api/campaigns.ts` | Campaign API functions |

---

### Phase 6: Leads ⬜
Migrate lead operations.

**Current (Server Actions):**
- `app/actions/leads.ts` → Direct Supabase

**New (API Calls):**
| Frontend Function | Backend Endpoint | Method |
|-------------------|------------------|--------|
| `getLeadsForCampaign()` | `GET /campaigns/:id/leads` | GET |
| `getLeadsForWorkspace()` | `GET /workspaces/:id/leads` | GET |
| `bulkAddLeads()` | `POST /campaigns/:id/leads/batch` | POST |
| `updateLead()` | `PUT /leads/:id` | PUT |
| `logOutcome()` | `POST /leads/:id/outcome` | POST |
| `getLeadSignals()` | `GET /leads/:id/signals` | GET |

**Files to Create:**
| File | Purpose |
|------|---------|
| `lib/api/leads.ts` | Lead API functions |

---

### Phase 7: Discovery Chat (AI) ⬜
Migrate discovery chat with streaming.

**Current (API Route):**
- `app/api/chat/discovery/route.ts` → OpenAI + Supabase

**Backend Needed:** Add discovery chat endpoint with SSE streaming

**New (API Calls):**
| Frontend Function | Backend Endpoint | Method |
|-------------------|------------------|--------|
| `startDiscoveryChat()` | `POST /workspaces/:id/discovery/chat` | POST (SSE) |
| `getDiscoverySessions()` | `GET /workspaces/:id/discovery/sessions` | GET |
| `saveDiscoveryFeedback()` | `POST /workspaces/:id/discovery/feedback` | POST |

**Backend to Add:**
```typescript
// discovery.controller.ts (NEW)
@Controller('workspaces/:workspaceId/discovery')
export class DiscoveryController {
  @Post('chat')  // SSE streaming
  @Get('sessions')
  @Get('sessions/:id')
  @Post('feedback')
}
```

**Files to Create:**
| File | Purpose |
|------|---------|
| `lib/api/discovery.ts` | Discovery chat API functions |

---

### Phase 8: AI Services ⬜
Migrate AI service calls.

**Current (API Routes + Server Actions):**
- `app/api/content/generate/route.ts` → OpenAI
- `app/api/filters/regenerate/route.ts` → OpenAI + Wiza
- `app/actions/website.ts` → Scraping + AI
- `app/actions/worldview.ts` → AI generation

**Backend Needed:** Add AI endpoints

**New (API Calls):**
| Frontend Function | Backend Endpoint | Method |
|-------------------|------------------|--------|
| `generateOutreachMessage()` | `POST /ai/outreach/generate` | POST |
| `regenerateFilters()` | `POST /experiments/:id/filters/regenerate` | POST |
| `scrapeWebsite()` | `POST /scraper/website` | POST |
| `generateWorldview()` | `POST /workspaces/:id/worldview/generate` | POST |

**Backend to Add:**
```typescript
// ai.controller.ts (NEW)
@Controller('ai')
export class AIController {
  @Post('outreach/generate')
  @Post('activity/analyze')
}

// Add to experiment.controller.ts
@Post('experiments/:id/filters/regenerate')
```

**Files to Create:**
| File | Purpose |
|------|---------|
| `lib/api/ai.ts` | AI service API functions |

---

### Phase 9: Outreach Messages ⬜
Migrate outreach message operations.

**Backend Needed:** Add outreach message endpoints

**New (API Calls):**
| Frontend Function | Backend Endpoint | Method |
|-------------------|------------------|--------|
| `getOutreachMessages()` | `GET /leads/:id/messages` | GET |
| `createOutreachMessage()` | `POST /leads/:id/messages` | POST |
| `updateOutreachMessage()` | `PUT /messages/:id` | PUT |

**Backend to Add:**
```typescript
// outreach-message.controller.ts (NEW)
@Controller()
export class OutreachMessageController {
  @Get('leads/:leadId/messages')
  @Post('leads/:leadId/messages')
  @Put('messages/:id')
}
```

**Files to Create:**
| File | Purpose |
|------|---------|
| `lib/api/outreach.ts` | Outreach message API functions |

---

## Backend Endpoints Summary

### Already Exists ✅
| Endpoint | Controller |
|----------|------------|
| `GET /workspaces` | WorkspaceController |
| `POST /workspaces` | WorkspaceController |
| `GET /workspaces/:id` | WorkspaceController |
| `PUT /workspaces/:id` | WorkspaceController |
| `DELETE /workspaces/:id` | WorkspaceController |
| `GET /workspaces/:id/members` | WorkspaceController |
| `POST /workspaces/:id/members` | WorkspaceController |
| `DELETE /workspaces/:id/members/:userId` | WorkspaceController |
| `GET /workspaces/:id/experiments` | ExperimentController |
| `POST /workspaces/:id/experiments` | ExperimentController |
| `POST /workspaces/:id/experiments/batch` | ExperimentController |
| `PUT /experiments/:id` | ExperimentController |
| `DELETE /experiments/:id` | ExperimentController |
| `GET /workspaces/:id/campaigns` | CampaignController |
| `POST /workspaces/:id/campaigns` | CampaignController |
| `GET /campaigns/:id` | CampaignController |
| `PUT /campaigns/:id` | CampaignController |
| `DELETE /campaigns/:id` | CampaignController |
| `POST /campaigns/:id/scale` | CampaignController |
| `GET /campaigns/:id/activities` | CampaignController |
| `GET /campaigns/:id/leads` | LeadController |
| `GET /workspaces/:id/leads` | LeadController |
| `POST /campaigns/:id/leads` | LeadController |
| `POST /campaigns/:id/leads/batch` | LeadController |
| `PUT /leads/:id` | LeadController |
| `POST /leads/:id/outcome` | LeadController |
| `GET /leads/:id/signals` | LeadController |
| `POST /scraper/website` | ScraperController |

### Needs to be Added ⬜
| Endpoint | Controller | Priority |
|----------|------------|----------|
| `GET /workspaces/:id/onboarding` | WorkspaceController | HIGH |
| `PUT /workspaces/:id/onboarding` | WorkspaceController | HIGH |
| `POST /workspaces/:id/discovery/chat` | DiscoveryController (NEW) | HIGH |
| `GET /workspaces/:id/discovery/sessions` | DiscoveryController (NEW) | MEDIUM |
| `POST /workspaces/:id/discovery/feedback` | DiscoveryController (NEW) | LOW |
| `POST /ai/outreach/generate` | AIController (NEW) | HIGH |
| `POST /experiments/:id/filters/regenerate` | ExperimentController | MEDIUM |
| `POST /workspaces/:id/worldview/generate` | WorkspaceController | MEDIUM |
| `GET /leads/:id/messages` | OutreachMessageController (NEW) | MEDIUM |
| `POST /leads/:id/messages` | OutreachMessageController (NEW) | MEDIUM |

---

## Implementation Order

### Step 1: Backend Additions (if needed)
1. Add onboarding endpoints to WorkspaceController
2. Create DiscoveryController with chat streaming (SSE)
3. Create AIController for outreach generation
4. Add filter regeneration to ExperimentController
5. Create OutreachMessageController

### Step 2: Frontend API Client
1. Create `lib/api/client.ts` with auth handling
2. Create `lib/api/types.ts` with response types

### Step 3: Migrate by Feature (Order)
1. **Workspaces** - Foundation for everything
2. **Onboarding** - Needed for discovery
3. **Experiments** - Core feature
4. **Campaigns** - Depends on experiments
5. **Leads** - Depends on campaigns
6. **Discovery Chat** - AI feature (SSE streaming)
7. **AI Services** - Outreach, worldview generation
8. **Outreach Messages** - Final feature

---

## File Structure After Migration

```
frontend-v1/
├── lib/
│   └── api/
│       ├── client.ts          # Base API client
│       ├── types.ts           # API response types
│       ├── index.ts           # Central exports
│       ├── workspaces.ts      # Workspace API
│       ├── onboarding.ts      # Onboarding API
│       ├── experiments.ts     # Experiment API
│       ├── campaigns.ts       # Campaign API
│       ├── leads.ts           # Lead API
│       ├── discovery.ts       # Discovery chat API
│       ├── ai.ts              # AI services API
│       └── outreach.ts        # Outreach message API
├── app/
│   └── actions/
│       └── auth.ts            # Keep for Supabase auth only
```

---

## Authentication Flow

### Current
1. Frontend authenticates directly with Supabase
2. Gets JWT token from Supabase session
3. Calls Next.js API routes (server-side Supabase client)

### After Migration
1. Frontend authenticates with Supabase (unchanged)
2. Gets JWT token from Supabase session
3. Attaches JWT to `Authorization: Bearer <token>` header
4. Calls backend-v1 NestJS APIs
5. Backend validates JWT via SupabaseAuthGuard

**Key**: Backend uses the same Supabase project, so JWT validation works.

---

## Risk Mitigation

### Gradual Migration
- Migrate one feature at a time
- Keep old server actions until new API is tested
- Use feature flags if needed

### Error Handling
- Backend returns: `{ success: boolean, message: string, data: T }`
- Frontend handles errors uniformly
- Show user-friendly error messages

### Performance
- Backend adds response caching where appropriate
- Frontend implements optimistic updates
- SSE for long-running operations (discovery chat)

---

## Next Steps

1. ⬜ Add missing backend endpoints (onboarding, discovery, AI)
2. ⬜ Create `lib/api/client.ts`
3. ⬜ Migrate workspaces
4. ⬜ Test end-to-end flow
5. ⬜ Continue with remaining features
