# API Requirements: Campaigns Page

## Overview
Single unified endpoint to serve all data required for the Campaigns page and Campaign Detail view.

---

## Endpoint

**GET** `/api/v1/campaigns`

**Purpose:** Fetch all campaigns for a workspace with embedded related data (experiments, leads, activity metrics)

---

## Authentication
- **Required:** Yes
- **Method:** Bearer token / Session cookie
- **User Context:** Must be authenticated user with access to the specified workspace

---

## Request Parameters

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspace_id` | UUID | Yes | The workspace ID to fetch campaigns for |
| `campaign_id` | UUID | No | If provided, returns detailed view for single campaign |
| `include_leads` | boolean | No | Whether to include full leads list (default: false for list view, true for detail view) |
| `include_activity` | boolean | No | Whether to include activity metrics (default: true) |

### Example Requests
```
# List all campaigns
GET /api/v1/campaigns?workspace_id=abc-123

# Get single campaign with full details
GET /api/v1/campaigns?workspace_id=abc-123&campaign_id=cam-001&include_leads=true
```

---

## Response Data Structure

### Campaign List View (when no campaign_id provided)

#### Workspace Summary
- Total campaigns count
- Active campaigns count
- Paused campaigns count
- Overall conversion rate/performance metric

#### Campaigns Array
For each campaign:
- **Basic Info:**
  - Campaign ID (for routing)
  - Campaign name
  - Status (active/paused/completed)
  - Created date
  - Updated date

- **Linked Experiment:**
  - Experiment ID
  - Experiment name/type
  - Strategy description/pattern
  - Target criteria summary

- **Metrics (High-level):**
  - Total leads count
  - Leads by status breakdown (found/enriched/drafted/sent/responded)
  - Outcome counts (meetings_booked, interested, rejected, no_response)

---

### Campaign Detail View (when campaign_id provided)

#### Campaign Information
- All fields from list view
- Full experiment details:
  - Complete pattern description
  - Industries targeted
  - Pain points
  - Triggers
  - Wiza filters (for reference)
  - Outreach angle

#### Activity Metrics (Real-time Status)
**Discovery Engine Status:**
- Current activity step (searching/found/enriching/prioritizing/drafting)
- Progress percentage
- Last activity timestamp
- Auto-pilot enabled status

**Lead Statistics:**
- Total leads found
- Leads enriched count & percentage
- Leads with outreach drafted
- Leads contacted
- Response rate

**Outcome Breakdown:**
- Meeting booked: count
- Interested: count
- Rejected: count
- No response: count
- Meeting completed: count
- Deal closed: count

#### Campaign Activity Timeline
Array of activity events:
- Timestamp
- Event type (lead_found, lead_enriched, outreach_generated, lead_contacted, outcome_logged)
- Event title
- Event description
- Status indicator (completed/current/pending)

#### Leads Array (if include_leads=true)
For each lead:
- **Profile:**
  - Lead ID
  - Full name
  - Job title
  - Company name
  - LinkedIn URL
  - Email (if available)
  - Avatar URL
  - Location

- **Status & Tracking:**
  - Status (found/enriched/drafted/sent/responded)
  - Outcome (meeting_booked/interested/rejected/no_response)
  - Outcome reason (if applicable)
  - Created date
  - Last updated date

- **Enrichment Data:**
  - Summary (AI-generated bio)
  - Signals array:
    - Signal headline
    - Signal description
    - Citations (source name, URL, logo)
  - Experience array:
    - Company name
    - Job title
    - Time period (from/to)
    - Company logo URL

- **Outreach:**
  - Generated message (if exists)
  - Message format (linkedin/email)
  - Is follow-up flag

- **Relevance:**
  - Relevance score (0-100)
  - Warm behavior indicators
  - Priority tier

---

## Data Requirements by UI Component

### Campaigns Table (List View)
**Needs:**
- Campaign ID, Name, Status
- Experiment strategy name/description
- Lead count
- Created date
- Quick status indicator

### Campaign Stats Cards (Detail View)
**Needs:**
- Total leads found
- Enrichment percentage
- Response rate
- Conversion metrics

### Activity Feed (Detail View)
**Needs:**
- Activity timeline events
- Current step in workflow
- Progress indicators
- Timestamps

### Leads List (Detail View)
**Needs:**
- Complete lead array with enrichment
- Sortable by: relevance, name, recent activity
- Filterable by: status, outcome

### Lead Detail Modal
**Needs:**
- Full lead profile
- All enrichment signals
- Experience timeline
- Outreach message
- Strategic reasoning

---

## Business Logic Requirements

### Lead Discovery Status
Backend must track and return:
- Is discovery engine currently running for this campaign?
- When did it last run?
- Next scheduled discovery run
- Rate limiting info (e.g., "30 leads per day")

### Enrichment Pipeline
- Which leads are currently being enriched?
- Enrichment queue status
- Estimated completion time

### Real-time Updates
- Campaign activity should reflect actual backend processes
- No hardcoded "124 leads" or "82% enriched"
- Actual timestamps and progress

---

## Error Handling

### Error Response Format
Should include:
- Error code
- Error message
- Field-specific errors (if applicable)
- Suggested action

### Common Error Cases
- `401`: Unauthorized - user not authenticated
- `403`: Forbidden - user doesn't have access to workspace
- `404`: Campaign not found
- `422`: Invalid workspace_id or campaign_id format
- `500`: Server error with activity engine
- `503`: Discovery service temporarily unavailable

---

## Performance Considerations

### Pagination (Future)
- Default limit: 50 campaigns
- Leads within campaign: Return all (typically < 500 per campaign)
- Activity timeline: Last 100 events

### Caching Strategy
- Campaign list: Cache for 30 seconds
- Campaign detail: Cache for 10 seconds (more dynamic)
- Real-time activity: No cache or 5 second cache

### Response Size
- List view: Keep lightweight (exclude leads and detailed enrichment)
- Detail view: Full data (acceptable larger payload for single campaign)

---

## Migration from Current Implementation

### Current Supabase Calls to Replace
1. `getCampaigns(workspaceId)` → Part of unified response
2. `getLeads(campaignId)` → Embedded in campaign detail
3. `getExperiments(workspaceId)` → Joined data in campaigns
4. Activity metrics (currently hardcoded) → Real backend data
5. Enrichment data (currently mock) → Real backend data

### Backward Compatibility
- Frontend should gracefully handle missing fields
- Mock data fallbacks only in development mode
- Clear logging when API returns incomplete data

---

## Future Enhancements (Not Required Initially)

### Filtering & Search
- Filter campaigns by status, date range, experiment type
- Search campaigns by name or experiment pattern
- Filter leads by outcome, status, company, etc.

### Bulk Operations
- Pause/Resume multiple campaigns
- Export leads to CSV
- Batch update lead outcomes

### Webhooks/Real-time
- WebSocket connection for live activity updates
- Push notifications for important events (meeting booked, high-value lead found)

---

## Testing Requirements

### Test Cases Needed
1. **List View:**
   - Empty workspace (0 campaigns)
   - Single campaign
   - Multiple campaigns (10+)
   - Mix of active/paused campaigns

2. **Detail View:**
   - Campaign with 0 leads
   - Campaign with mock leads
   - Campaign with fully enriched leads
   - Campaign in different activity states

3. **Error Cases:**
   - Invalid workspace_id
   - Campaign doesn't belong to user's workspace
   - Unauthorized access

4. **Performance:**
   - Response time < 500ms for list view
   - Response time < 1s for detail view with 100 leads
   - Handle concurrent requests

---

## Implementation Priority

### Phase 1 (MVP - Immediate)
1. Campaign list endpoint with basic metrics
2. Campaign detail with activity status
3. Leads array with basic profile data
4. Authentication & authorization

### Phase 2 (Next Sprint)
1. Real-time activity tracking
2. Complete enrichment data
3. Lead relevance scoring
4. Outcome tracking

### Phase 3 (Future)
1. Filtering & search
2. Real-time WebSocket updates
3. Advanced analytics
4. Export functionality

---

## Developer Notes

### Frontend Integration
- Update `app/actions/campaigns.ts` to call new unified endpoint
- Remove individual Supabase queries
- Handle loading states during API calls
- Implement error boundaries for API failures

### Data Transformation
- Backend should return camelCase (frontend convention)
- Dates in ISO 8601 format
- Enums as strings (not numeric codes)
- Null values for optional fields (not undefined)

### Security
- Validate workspace ownership on every request
- Rate limit per user (100 requests/minute)
- Log all campaign access for audit trail
- Sanitize user-generated content in responses
