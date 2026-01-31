# Merge Plan: staging → feat/migration

## Overview
The `staging` branch has new features that need to be integrated into `feat/migration` while **preserving our backend API architecture** (not reverting to direct Supabase calls).

---

## Phase 1: New Files to Copy Directly ✅ COMPLETED

These files are net-new and can be copied from staging without conflict:

### UI Components
- [x] `components/dashboard/LeadProfileUI.tsx` - New lead profile view
- [x] `components/dashboard/profile/contact-item.tsx`
- [x] `components/dashboard/profile/flickering-grid.tsx`
- [x] `components/dashboard/profile/social-action-card.tsx`
- [x] `components/dashboard/profile/social-icons.tsx`
- [x] `components/dashboard/profile/tabs.tsx`

### Hooks & Utilities
- [x] `hooks/use-devtools-detector.ts` - DevTools detection for privacy blur
- [x] `lib/privacy.ts` - Base64 decode utility
- [x] `lib/utils/lead-status.ts` - Lead status constants

### Assets
- [ ] `public/profile.jpg` - TODO: Copy if needed

### Database Migrations
- [x] `create_generated_messages_table.sql` - Created in backend as `migrations/010_add_generated_messages_table.sql`

---

## Phase 2: New Backend Endpoints Required ✅ COMPLETED

### 2.1 Generated Messages API

**New entity created in backend-v1:** `GeneratedMessage`
- Entity: `src/repo/entities/generated-message.entity.ts`
- Repo: `src/repo/generated-message-repo.service.ts`
- Migration: `migrations/010_add_generated_messages_table.sql`

**Endpoints created:**
- [x] `GET /leads/:leadId/messages` - Get all generated messages for a lead
- [x] `POST /leads/:leadId/messages` - Save a generated message
- [x] `DELETE /messages/:id` - Delete a generated message
- [x] `POST /leads/:leadId/generate-outreach` - Generate AI outreach for a lead

**Frontend API layer created:**
- [x] Added to `lib/api/server-leads.ts` (types and functions)

**Action file created:**
- [x] `app/actions/messages.ts` (using backend API, not Supabase)

---

## Phase 3: Modify Existing Files ✅ PARTIALLY COMPLETED

### 3.1 `app/actions/leads.ts` ✅

**New function added:** `generateCustomOutreach(lead, config)` - uses backend API

```typescript
// Uses backend AI service to keep prompts server-side
export async function generateCustomOutreach(
  lead: Lead, 
  config: { platform: 'linkedin' | 'email', type: string, context?: string }
)
```

> **❓ DECISION REQUIRED:** Should outreach generation happen:
> - A) In the frontend (current staging approach using `ContentEngineService`)
> - B) In the backend via a new endpoint like `POST /leads/:id/generate-outreach`
> 
> **Recommendation:** Keep in frontend for now since it's AI-heavy and doesn't need persistence logic. The saving of the result goes to backend via messages API. - it should be in backend, we dont want any prompts going public on frontend

### 3.2 `components/dashboard/LeadDetailCurtain.tsx`

Staging significantly refactored this to use `LeadProfileUI`. Need to integrate while keeping our API calls.

**Changes:**
- Import and use `LeadProfileUI` component
- Keep backend API calls for lead data

### 3.3 `components/dashboard/CampaignDetailCurtain.tsx`

Staging reduced this from 923 lines. Review changes and integrate.

### 3.4 `components/dashboard/ExperimentDetailCurtain.tsx`

Minor changes - review and integrate.

### 3.5 `app/dashboard/[workspaceId]/page.tsx`

~162 lines changed. Review for:
- Privacy blur integration
- Empty state changes
- Any new props being passed

### 3.6 `app/globals.css` ✅

+49 lines - shimmer/skeleton animations for LeadProfileUI. **DONE**

### 3.7 `components/dashboard/Sidebar.tsx`

-20 lines - logout button removed from dashboard. **TODO: Merge from staging**

> ✅ ANSWERED: Yes, logout removal is intentional - keep staging's version

### 3.8 `components/dashboard/OverviewEmptyState.tsx`

+26 lines - "suggest experiment" in empty state. **TODO: Merge from staging**

### 3.9 `lib/content-engine/service.ts`

+78 lines - New methods for custom outreach generation. **NOT NEEDED - moved to backend AI service**

---

## Phase 4: Files to NOT Merge (Keep feat/migration version)

These files should **NOT** be overwritten - staging reverted our backend migration:

- ❌ `app/actions/workspaces.ts` - Keep our backend API version
- ❌ `app/actions/campaigns.ts` - Keep our backend API version  
- ❌ `app/actions/leads.ts` - Keep our version (added `generateCustomOutreach` using backend)
- ❌ `app/actions/onboarding.ts` - Keep our backend API version
- ❌ `lib/api/*` - Keep ALL our API layer files

---

## Phase 5: Database Schema ✅ COMPLETED

### New Table: `GeneratedMessages`

Created in backend at `migrations/010_add_generated_messages_table.sql`:

```sql
CREATE TABLE "GeneratedMessages" (
    "GeneratedMessageID" BIGSERIAL PRIMARY KEY,
    "LeadID" BIGINT NOT NULL REFERENCES "Leads"("LeadID") ON DELETE CASCADE,
    "Platform" message_platform NOT NULL,
    "MessageType" message_type NOT NULL,
    "Content" TEXT NOT NULL,
    "Context" TEXT,
    "Thinking" JSONB,
    "Timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

> ✅ ANSWERED: Table lives in backend PostgreSQL (not Supabase)

---

## Execution Order ✅ STATUS

1. **Backend-v1 changes first:** ✅ COMPLETED
   - [x] Create `GeneratedMessage` entity
   - [x] Create migration for `generated_messages` table
   - [x] Create `GeneratedMessageRepoService`
   - [x] Create message endpoints in `LeadController`
   - [x] Add `generateCustomOutreach` method to `OutreachAIService`
   - [x] Build and test backend

2. **Frontend API layer:** ✅ COMPLETED
   - [x] Added to `lib/api/server-leads.ts`
   - [x] Create `app/actions/messages.ts` using backend API
   - [x] Add `generateCustomOutreach` to `app/actions/leads.ts`

3. **Copy new UI files from staging:** ✅ COMPLETED
   - [x] All profile components
   - [x] Hooks and utilities
   - [x] CSS changes

4. **Carefully merge modified files:** 🔄 IN PROGRESS
   - [ ] LeadDetailCurtain.tsx
   - [ ] CampaignDetailCurtain.tsx
   - [ ] Dashboard page
   - [ ] Sidebar changes

5. **Test everything:**
   - [ ] Lead profile view
   - [ ] Message generation and saving
   - [ ] Privacy blur with DevTools
   - [ ] All existing functionality

---

## Questions Summary

| # | Question | Options | Impact |
|---|----------|---------|--------|
| 1 | Where should outreach generation happen? | Frontend / Backend | Architecture |
| 2 | Where should `generated_messages` table live? | Supabase / Backend PG | Data architecture |
| 3 | Is logout removal from Sidebar intentional? | Yes / No | UX |
| 4 | Should we keep the DevTools privacy blur feature? | Yes / No | Security/UX |

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Merge conflicts in action files | High | Manual merge, keep our API layer |
| Missing backend endpoints | Medium | Create them before frontend work |
| Type mismatches | Medium | Run `tsc --noEmit` after each phase |
| Broken lead functionality | Medium | Test thoroughly before merging to main |

---

## Estimated Effort

| Phase | Time |
|-------|------|
| Backend changes | 2-3 hours |
| Frontend API layer | 1 hour |
| Copy new files | 30 min |
| Merge modified files | 2-3 hours |
| Testing | 1-2 hours |
| **Total** | **6-9 hours** |
