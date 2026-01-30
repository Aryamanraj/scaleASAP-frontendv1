# ScaleASAP Backend & Database Architecture

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [Backend Services Architecture](#backend-services-architecture)
4. [API Design](#api-design)
5. [Data Flows](#data-flows)
6. [AI Pipeline Architecture](#ai-pipeline-architecture)
7. [Security & Authentication](#security--authentication)
8. [Infrastructure](#infrastructure)

---

## System Overview

ScaleASAP is an AI-powered outbound sales platform that automates lead discovery, enrichment, and personalized outreach generation.

### Core Modules
1. **User & Workspace Management** - Multi-tenant workspaces with team collaboration
2. **Discovery Engine** - AI-driven ICP analysis and experiment generation
3. **Lead Engine** - Lead finding, enrichment, and prioritization
4. **Outreach Engine** - Personalized message generation
5. **Campaign Management** - Orchestration and tracking
6. **Analytics & Reporting** - Performance metrics and insights

---

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ WORKSPACES : owns
    USERS ||--o{ WORKSPACE_MEMBERS : belongs_to
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : has
    WORKSPACES ||--o{ ONBOARDING_DATA : has_one
    WORKSPACES ||--o{ EXPERIMENTS : contains
    WORKSPACES ||--o{ CAMPAIGNS : contains
    WORKSPACES ||--o{ LEADS : contains
    WORKSPACES ||--o{ DISCOVERY_SESSIONS : has
    WORKSPACES ||--o{ DISCOVERY_FEEDBACK : receives
    
    EXPERIMENTS ||--o{ CAMPAIGNS : spawns
    CAMPAIGNS ||--o{ LEADS : targets
    CAMPAIGNS ||--o{ CAMPAIGN_ACTIVITIES : logs
    
    LEADS ||--o{ LEAD_SIGNALS : has
    LEADS ||--o{ LEAD_EXPERIENCE : has
    LEADS ||--o{ OUTREACH_MESSAGES : receives
    LEADS ||--o{ LEAD_OUTCOMES : tracks
    
    USERS {
        uuid id PK
        string email UK
        string encrypted_password
        string full_name
        string avatar_url
        timestamp email_confirmed_at
        timestamp last_sign_in_at
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }
    
    WORKSPACES {
        uuid id PK
        uuid owner_id FK
        string name
        string website
        string favicon_url
        enum onboarding_status
        jsonb discovery_chat_history
        jsonb settings
        timestamp created_at
        timestamp updated_at
    }
    
    WORKSPACE_MEMBERS {
        uuid id PK
        uuid workspace_id FK
        uuid user_id FK
        enum role
        timestamp invited_at
        timestamp joined_at
        timestamp created_at
    }
    
    ONBOARDING_DATA {
        uuid id PK
        uuid workspace_id FK "unique"
        text trigger_moment
        text founder_role
        text team_size
        text stage
        text[] funding_type
        text funding_amount
        text runway
        text company_name
        text website
        text linkedin
        text twitter
        enum company_type
        text one_liner
        text[] product_categories
        text industry_vertical
        text primary_use_case
        text[] key_features
        text[] integrations
        text pricing_model
        text price_range
        text[] customer_segments
        text[] top_personas
        text[] pain_points
        text[] icp_titles
        text[] icp_industries
        text[] icp_company_sizes
        text[] deal_breakers
        text sales_motion
        text[] lead_sources
        text[] outbound_channels
        text booking_cta
        text calendar_link
        timestamp created_at
        timestamp updated_at
    }
    
    EXPERIMENTS {
        uuid id PK
        uuid workspace_id FK
        string name
        enum type
        text pattern
        jsonb industries
        text pain
        text trigger
        jsonb wiza_filters
        text outreach_angle
        enum status
        int leads_found
        int leads_warming
        int meetings_booked
        timestamp created_at
        timestamp updated_at
    }
    
    CAMPAIGNS {
        uuid id PK
        uuid workspace_id FK
        uuid experiment_id FK
        string name
        enum status
        jsonb settings
        int daily_lead_limit
        boolean autopilot_enabled
        timestamp last_discovery_run
        timestamp next_discovery_run
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    CAMPAIGN_ACTIVITIES {
        uuid id PK
        uuid campaign_id FK
        enum activity_type
        string title
        text description
        jsonb metadata
        enum status
        timestamp created_at
    }
    
    LEADS {
        uuid id PK
        uuid campaign_id FK
        uuid workspace_id FK
        string full_name
        string job_title
        string company
        string linkedin_url
        string email
        string phone
        string location
        string avatar_url
        text ai_summary
        int relevance_score
        enum status
        enum outcome
        text outcome_reason
        jsonb raw_data
        timestamp contacted_at
        timestamp responded_at
        timestamp created_at
        timestamp updated_at
    }
    
    LEAD_SIGNALS {
        uuid id PK
        uuid lead_id FK
        string headline
        text description
        enum signal_type
        int strength_score
        jsonb citations
        timestamp detected_at
        timestamp created_at
    }
    
    LEAD_EXPERIENCE {
        uuid id PK
        uuid lead_id FK
        string company_name
        string company_logo_url
        string title
        text description
        string time_from
        string time_to
        boolean is_current
        int sort_order
        timestamp created_at
    }
    
    OUTREACH_MESSAGES {
        uuid id PK
        uuid lead_id FK
        uuid campaign_id FK
        enum format
        boolean is_followup
        int sequence_number
        text content
        text subject
        enum status
        timestamp scheduled_at
        timestamp sent_at
        timestamp opened_at
        timestamp replied_at
        timestamp created_at
        timestamp updated_at
    }
    
    LEAD_OUTCOMES {
        uuid id PK
        uuid lead_id FK
        uuid logged_by FK
        enum outcome
        text reason
        text notes
        jsonb metadata
        timestamp created_at
    }
    
    DISCOVERY_SESSIONS {
        uuid id PK
        uuid workspace_id FK
        jsonb messages
        jsonb generated_icps
        enum status
        timestamp created_at
        timestamp updated_at
    }
    
    DISCOVERY_FEEDBACK {
        uuid id PK
        uuid workspace_id FK
        uuid user_id FK
        int rating
        text feedback
        jsonb experiment_context
        timestamp created_at
    }
```

### Enum Definitions

```mermaid
classDiagram
    class OnboardingStatus {
        incomplete
        complete
    }
    
    class WorkspaceMemberRole {
        owner
        admin
        member
        viewer
    }
    
    class ExperimentType {
        bullseye
        variable_a
        variable_b
        contrarian
        long_shot
    }
    
    class ExperimentStatus {
        pending
        creating_hypotheses
        finding_leads
        prioritizing_leads
        warmup_initiated
        complete
        failed
    }
    
    class CampaignStatus {
        active
        paused
        completed
        archived
    }
    
    class LeadStatus {
        found
        enriching
        enriched
        drafted
        queued
        sent
        responded
    }
    
    class LeadOutcome {
        no_response
        interested
        meeting_booked
        meeting_done
        closed_won
        closed_lost
        rejected
        unqualified
    }
    
    class SignalType {
        funding
        hiring
        expansion
        product_launch
        partnership
        leadership_change
        news_mention
        social_activity
    }
    
    class OutreachFormat {
        linkedin_connection
        linkedin_message
        linkedin_inmail
        email_cold
        email_warm
    }
    
    class OutreachStatus {
        draft
        scheduled
        sent
        delivered
        opened
        clicked
        replied
        bounced
        failed
    }
    
    class ActivityType {
        campaign_created
        discovery_started
        discovery_completed
        leads_found
        leads_enriched
        outreach_generated
        lead_contacted
        lead_responded
        meeting_booked
        campaign_paused
        campaign_resumed
        error_occurred
    }
```

---

## Backend Services Architecture

### Microservices Overview

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        WEB[Next.js Frontend]
        MOBILE[Mobile App - Future]
    end
    
    subgraph Gateway["API Gateway"]
        KONG[API Gateway / Load Balancer]
        AUTH[Auth Service]
    end
    
    subgraph Core["Core Services"]
        USER_SVC[User Service]
        WORKSPACE_SVC[Workspace Service]
        CAMPAIGN_SVC[Campaign Service]
        LEAD_SVC[Lead Service]
    end
    
    subgraph AI["AI Services"]
        DISCOVERY_AI[Discovery AI Service]
        ENRICHMENT_AI[Enrichment AI Service]
        OUTREACH_AI[Outreach AI Service]
        SCORING_AI[Lead Scoring Service]
    end
    
    subgraph External["External Integrations"]
        WIZA[Wiza API]
        LINKEDIN[LinkedIn API]
        CLEARBIT[Clearbit/Apollo]
        NEWS[News APIs]
        EMAIL[Email Provider]
    end
    
    subgraph Data["Data Layer"]
        POSTGRES[(PostgreSQL)]
        REDIS[(Redis Cache)]
        S3[(S3 / Object Storage)]
        VECTOR[(Vector DB - Pinecone)]
    end
    
    subgraph Queue["Message Queue"]
        RABBITMQ[RabbitMQ / SQS]
    end
    
    WEB --> KONG
    MOBILE --> KONG
    
    KONG --> AUTH
    AUTH --> USER_SVC
    
    KONG --> WORKSPACE_SVC
    KONG --> CAMPAIGN_SVC
    KONG --> LEAD_SVC
    
    CAMPAIGN_SVC --> RABBITMQ
    RABBITMQ --> DISCOVERY_AI
    RABBITMQ --> ENRICHMENT_AI
    RABBITMQ --> OUTREACH_AI
    RABBITMQ --> SCORING_AI
    
    DISCOVERY_AI --> WIZA
    ENRICHMENT_AI --> CLEARBIT
    ENRICHMENT_AI --> NEWS
    ENRICHMENT_AI --> LINKEDIN
    OUTREACH_AI --> EMAIL
    
    USER_SVC --> POSTGRES
    WORKSPACE_SVC --> POSTGRES
    CAMPAIGN_SVC --> POSTGRES
    LEAD_SVC --> POSTGRES
    
    DISCOVERY_AI --> VECTOR
    ENRICHMENT_AI --> REDIS
    LEAD_SVC --> REDIS
    CAMPAIGN_SVC --> REDIS
```

### Service Responsibilities

```mermaid
flowchart LR
    subgraph UserService["User Service"]
        U1[Authentication]
        U2[User CRUD]
        U3[Session Management]
        U4[Password Reset]
        U5[OAuth Providers]
    end
    
    subgraph WorkspaceService["Workspace Service"]
        W1[Workspace CRUD]
        W2[Member Management]
        W3[Onboarding Flow]
        W4[Settings]
        W5[Permissions]
    end
    
    subgraph CampaignService["Campaign Service"]
        C1[Campaign CRUD]
        C2[Experiment Management]
        C3[Activity Logging]
        C4[Status Tracking]
        C5[Scheduling]
    end
    
    subgraph LeadService["Lead Service"]
        L1[Lead CRUD]
        L2[Enrichment Trigger]
        L3[Outcome Tracking]
        L4[Relevance Scoring]
        L5[Deduplication]
    end
```

---

## API Design

### Unified API Endpoints

```mermaid
flowchart TD
    subgraph AuthAPI["Authentication API"]
        POST_LOGIN[POST /auth/login]
        POST_SIGNUP[POST /auth/signup]
        POST_LOGOUT[POST /auth/logout]
        POST_REFRESH[POST /auth/refresh]
        POST_GOOGLE[POST /auth/google]
        POST_RESET[POST /auth/reset-password]
    end
    
    subgraph WorkspaceAPI["Workspace API"]
        GET_WS[GET /workspaces]
        POST_WS[POST /workspaces]
        GET_WS_ID[GET /workspaces/:id]
        PUT_WS_ID[PUT /workspaces/:id]
        DEL_WS_ID[DELETE /workspaces/:id]
        GET_OB[GET /workspaces/:id/onboarding]
        PUT_OB[PUT /workspaces/:id/onboarding]
    end
    
    subgraph CampaignAPI["Campaign API - Unified"]
        GET_CAMP[GET /campaigns]
        POST_CAMP[POST /campaigns]
        GET_CAMP_ID[GET /campaigns/:id]
        PUT_CAMP_ID[PUT /campaigns/:id]
        DEL_CAMP_ID[DELETE /campaigns/:id]
        POST_SCALE[POST /campaigns/:id/scale]
        GET_ACTIVITY[GET /campaigns/:id/activity]
    end
    
    subgraph LeadAPI["Lead API"]
        GET_LEADS[GET /leads]
        POST_LEADS[POST /leads]
        GET_LEAD_ID[GET /leads/:id]
        PUT_LEAD_ID[PUT /leads/:id]
        POST_OUTCOME[POST /leads/:id/outcome]
        POST_OUTREACH[POST /leads/:id/generate-outreach]
    end
    
    subgraph DiscoveryAPI["Discovery API"]
        POST_CHAT[POST /discovery/chat]
        POST_EXPERIMENTS[POST /discovery/experiments]
        GET_HISTORY[GET /discovery/history]
    end
```

### Campaign API Response Structure

```mermaid
classDiagram
    class CampaignListResponse {
        +WorkspaceSummary summary
        +Campaign[] campaigns
        +Pagination pagination
    }
    
    class WorkspaceSummary {
        +int totalCampaigns
        +int activeCampaigns
        +int pausedCampaigns
        +float conversionRate
        +int totalLeads
        +int totalMeetings
    }
    
    class Campaign {
        +string id
        +string name
        +string status
        +Experiment experiment
        +CampaignMetrics metrics
        +CampaignActivity[] activities
        +Lead[] leads
        +datetime createdAt
        +datetime updatedAt
    }
    
    class Experiment {
        +string id
        +string name
        +string type
        +string pattern
        +string[] industries
        +string pain
        +string trigger
        +object wizaFilters
        +string outreachAngle
    }
    
    class CampaignMetrics {
        +int totalLeads
        +int leadsEnriched
        +int leadsContacted
        +int responses
        +int meetingsBooked
        +float enrichmentRate
        +float responseRate
        +float conversionRate
        +DiscoveryStatus discoveryStatus
    }
    
    class DiscoveryStatus {
        +string currentStep
        +int progressPercent
        +boolean isRunning
        +datetime lastRunAt
        +datetime nextRunAt
        +boolean autopilotEnabled
    }
    
    class Lead {
        +string id
        +string fullName
        +string jobTitle
        +string company
        +string linkedinUrl
        +string email
        +string avatarUrl
        +string location
        +string status
        +string outcome
        +int relevanceScore
        +LeadEnrichment enrichment
        +OutreachMessage[] outreach
    }
    
    class LeadEnrichment {
        +string summary
        +Signal[] signals
        +Experience[] experience
    }
    
    CampaignListResponse --> WorkspaceSummary
    CampaignListResponse --> Campaign
    Campaign --> Experiment
    Campaign --> CampaignMetrics
    Campaign --> Lead
    CampaignMetrics --> DiscoveryStatus
    Lead --> LeadEnrichment
```

---

## Data Flows

### Campaign Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as API Gateway
    participant CS as Campaign Service
    participant ES as Experiment Service
    participant Q as Message Queue
    participant DA as Discovery AI
    participant DB as Database
    
    U->>FE: Click "Create Campaign"
    FE->>API: POST /campaigns
    API->>CS: Create Campaign
    CS->>DB: Insert Campaign Record
    CS->>Q: Queue Discovery Job
    CS-->>API: Return Campaign ID
    API-->>FE: Campaign Created
    FE->>U: Show Campaign Detail
    
    Q->>DA: Start Lead Discovery
    DA->>DA: Apply Wiza Filters
    DA->>DB: Insert Found Leads
    DA->>Q: Queue Enrichment Jobs
    DA->>CS: Update Activity Log
    CS->>DB: Log Activity Event
```

### Lead Enrichment Flow

```mermaid
sequenceDiagram
    participant Q as Message Queue
    participant EA as Enrichment AI
    participant WIZA as Wiza API
    participant CLEAR as Clearbit
    participant NEWS as News APIs
    participant LLM as LLM (GPT/Gemini)
    participant VDB as Vector DB
    participant DB as Database
    
    Q->>EA: Lead to Enrich
    
    par Parallel Data Collection
        EA->>WIZA: Get LinkedIn Data
        WIZA-->>EA: Profile Data
    and
        EA->>CLEAR: Get Company Data
        CLEAR-->>EA: Company Info
    and
        EA->>NEWS: Search Recent News
        NEWS-->>EA: News Articles
    end
    
    EA->>LLM: Generate Summary & Signals
    LLM-->>EA: Enrichment Data
    
    EA->>VDB: Store Embeddings
    EA->>DB: Update Lead Record
    EA->>DB: Insert Signals
    EA->>DB: Insert Experience
    EA->>Q: Queue Scoring Job
```

### Outreach Generation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as API Gateway
    participant OA as Outreach AI
    participant DB as Database
    participant LLM as LLM
    
    U->>FE: Click "Generate Outreach"
    FE->>API: POST /leads/:id/generate-outreach
    API->>OA: Generate Request
    
    OA->>DB: Get Lead Data
    OA->>DB: Get Campaign/Experiment Data
    OA->>DB: Get Workspace Onboarding Data
    
    OA->>LLM: Generate Personalized Message
    Note over OA,LLM: Context: Lead signals, pain points, outreach angle, company info
    LLM-->>OA: Generated Message
    
    OA->>DB: Store Outreach Message
    OA-->>API: Return Message
    API-->>FE: Display Draft
    FE->>U: Show Editable Message
```

### Real-time Activity Updates

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant WS as WebSocket Server
    participant Q as Message Queue
    participant Services as Backend Services
    participant DB as Database
    
    FE->>WS: Connect (campaign_id)
    WS->>WS: Subscribe to Channel
    
    loop Background Processing
        Services->>DB: Update Data
        Services->>Q: Publish Event
        Q->>WS: Event Notification
        WS->>FE: Push Update
        FE->>FE: Update UI
    end
    
    Note over FE,DB: Events: lead_found, lead_enriched, outreach_generated, etc.
```

---

## AI Pipeline Architecture

### Discovery AI Pipeline

```mermaid
flowchart TD
    subgraph Input["User Input"]
        CHAT[Discovery Chat Messages]
        OB[Onboarding Data]
    end
    
    subgraph Processing["AI Processing"]
        PARSE[Parse User Intent]
        EXTRACT[Extract ICP Criteria]
        GEN[Generate Experiments]
        FILTER[Build Wiza Filters]
        ANGLE[Create Outreach Angles]
    end
    
    subgraph Output["Generated Output"]
        EXP1[Bullseye Experiment]
        EXP2[Variable A Experiment]
        EXP3[Variable B Experiment]
        EXP4[Contrarian Experiment]
        EXP5[Long Shot Experiment]
    end
    
    CHAT --> PARSE
    OB --> PARSE
    PARSE --> EXTRACT
    EXTRACT --> GEN
    GEN --> FILTER
    GEN --> ANGLE
    FILTER --> EXP1
    FILTER --> EXP2
    FILTER --> EXP3
    FILTER --> EXP4
    FILTER --> EXP5
    ANGLE --> EXP1
    ANGLE --> EXP2
    ANGLE --> EXP3
    ANGLE --> EXP4
    ANGLE --> EXP5
```

### Lead Scoring Pipeline

```mermaid
flowchart LR
    subgraph Inputs["Scoring Inputs"]
        PROFILE[Profile Match]
        SIGNALS[Signal Strength]
        RECENCY[Activity Recency]
        COMPANY[Company Fit]
        ENGAGE[Engagement Potential]
    end
    
    subgraph Weights["Weighted Scoring"]
        W1[Title Match: 25%]
        W2[Company Size: 15%]
        W3[Industry: 15%]
        W4[Signals: 20%]
        W5[Recency: 15%]
        W6[Seniority: 10%]
    end
    
    subgraph Output["Final Score"]
        SCORE[Relevance Score 0-100]
        TIER[Priority Tier 1-3]
    end
    
    PROFILE --> W1
    PROFILE --> W2
    PROFILE --> W3
    SIGNALS --> W4
    RECENCY --> W5
    PROFILE --> W6
    
    W1 --> SCORE
    W2 --> SCORE
    W3 --> SCORE
    W4 --> SCORE
    W5 --> SCORE
    W6 --> SCORE
    
    SCORE --> TIER
```

---

## Security & Authentication

### Auth Flow

```mermaid
flowchart TD
    subgraph Login["Login Methods"]
        EMAIL[Email/Password]
        GOOGLE[Google OAuth]
        MAGIC[Magic Link - Future]
    end
    
    subgraph Auth["Authentication"]
        VALIDATE[Validate Credentials]
        GENERATE[Generate JWT]
        REFRESH[Refresh Token]
        SESSION[Session Cookie]
    end
    
    subgraph Access["Access Control"]
        RBAC[Role-Based Access]
        WORKSPACE[Workspace Isolation]
        RLS[Row Level Security]
    end
    
    EMAIL --> VALIDATE
    GOOGLE --> VALIDATE
    MAGIC --> VALIDATE
    
    VALIDATE --> GENERATE
    GENERATE --> SESSION
    GENERATE --> REFRESH
    
    SESSION --> RBAC
    RBAC --> WORKSPACE
    WORKSPACE --> RLS
```

### Permission Matrix

```mermaid
flowchart TD
    subgraph Roles["User Roles"]
        OWNER[Owner]
        ADMIN[Admin]
        MEMBER[Member]
        VIEWER[Viewer]
    end
    
    subgraph Permissions["Permissions"]
        subgraph Workspace["Workspace"]
            WS_EDIT[Edit Settings]
            WS_DELETE[Delete]
            WS_INVITE[Invite Members]
        end
        
        subgraph Campaign["Campaigns"]
            CAMP_CREATE[Create]
            CAMP_EDIT[Edit]
            CAMP_DELETE[Delete]
            CAMP_VIEW[View]
        end
        
        subgraph Lead["Leads"]
            LEAD_VIEW[View]
            LEAD_EDIT[Edit]
            LEAD_CONTACT[Contact]
            LEAD_EXPORT[Export]
        end
    end
    
    OWNER --> WS_EDIT
    OWNER --> WS_DELETE
    OWNER --> WS_INVITE
    OWNER --> CAMP_CREATE
    OWNER --> CAMP_EDIT
    OWNER --> CAMP_DELETE
    OWNER --> LEAD_EDIT
    OWNER --> LEAD_CONTACT
    OWNER --> LEAD_EXPORT
    
    ADMIN --> WS_EDIT
    ADMIN --> WS_INVITE
    ADMIN --> CAMP_CREATE
    ADMIN --> CAMP_EDIT
    ADMIN --> LEAD_EDIT
    ADMIN --> LEAD_CONTACT
    
    MEMBER --> CAMP_CREATE
    MEMBER --> CAMP_EDIT
    MEMBER --> LEAD_VIEW
    MEMBER --> LEAD_CONTACT
    
    VIEWER --> CAMP_VIEW
    VIEWER --> LEAD_VIEW
```

---

## Infrastructure

### Deployment Architecture

```mermaid
flowchart TB
    subgraph CDN["CDN Layer"]
        CF[Cloudflare / Vercel Edge]
    end
    
    subgraph Compute["Compute Layer"]
        subgraph K8S["Kubernetes Cluster"]
            API_PODS[API Pods x3]
            WORKER_PODS[Worker Pods x2]
            AI_PODS[AI Service Pods x2]
        end
    end
    
    subgraph Data["Data Layer"]
        subgraph Primary["Primary Region"]
            PG_PRIMARY[(PostgreSQL Primary)]
            REDIS_PRIMARY[(Redis Primary)]
        end
        
        subgraph Replica["Read Replicas"]
            PG_REPLICA[(PostgreSQL Replica)]
            REDIS_REPLICA[(Redis Replica)]
        end
    end
    
    subgraph Storage["Storage"]
        S3_ASSETS[S3 - Assets]
        S3_EXPORTS[S3 - Exports]
    end
    
    subgraph External["External Services"]
        OPENAI[OpenAI API]
        WIZA[Wiza API]
        SENDGRID[SendGrid]
        SENTRY[Sentry]
    end
    
    CF --> K8S
    API_PODS --> PG_PRIMARY
    API_PODS --> REDIS_PRIMARY
    API_PODS --> PG_REPLICA
    WORKER_PODS --> PG_PRIMARY
    WORKER_PODS --> REDIS_PRIMARY
    AI_PODS --> OPENAI
    AI_PODS --> WIZA
```

### Monitoring & Observability

```mermaid
flowchart LR
    subgraph Apps["Applications"]
        API[API Service]
        WORKERS[Workers]
        AI[AI Services]
    end
    
    subgraph Collect["Collection"]
        PROM[Prometheus]
        LOKI[Loki]
        JAEGER[Jaeger]
    end
    
    subgraph Visualize["Visualization"]
        GRAFANA[Grafana]
        ALERTS[Alert Manager]
    end
    
    subgraph Notify["Notifications"]
        SLACK[Slack]
        PAGER[PagerDuty]
        EMAIL[Email]
    end
    
    API --> PROM
    API --> LOKI
    API --> JAEGER
    WORKERS --> PROM
    WORKERS --> LOKI
    AI --> PROM
    AI --> LOKI
    
    PROM --> GRAFANA
    LOKI --> GRAFANA
    JAEGER --> GRAFANA
    
    GRAFANA --> ALERTS
    ALERTS --> SLACK
    ALERTS --> PAGER
    ALERTS --> EMAIL
```

---

## Implementation Phases

### Phase 1: Core MVP
```mermaid
gantt
    title Phase 1 - Core MVP (4 weeks)
    dateFormat  YYYY-MM-DD
    section Auth
    User Auth & OAuth     :a1, 2026-01-27, 5d
    Workspace CRUD        :a2, after a1, 3d
    section Campaigns
    Campaign CRUD         :b1, after a2, 4d
    Campaign List API     :b2, after b1, 3d
    Campaign Detail API   :b3, after b2, 3d
    section Leads
    Lead CRUD             :c1, after b3, 4d
    Lead List/Detail      :c2, after c1, 3d
```

### Phase 2: AI Integration
```mermaid
gantt
    title Phase 2 - AI Integration (4 weeks)
    dateFormat  YYYY-MM-DD
    section Discovery
    Discovery Chat API    :d1, 2026-02-24, 5d
    Experiment Generation :d2, after d1, 5d
    section Enrichment
    Lead Enrichment       :e1, after d2, 5d
    Signal Detection      :e2, after e1, 4d
    section Outreach
    Outreach Generation   :f1, after e2, 5d
    Message Templates     :f2, after f1, 3d
```

### Phase 3: Advanced Features
```mermaid
gantt
    title Phase 3 - Advanced Features (4 weeks)
    dateFormat  YYYY-MM-DD
    section Real-time
    WebSocket Updates     :g1, 2026-03-24, 5d
    Activity Stream       :g2, after g1, 3d
    section Analytics
    Dashboard Metrics     :h1, after g2, 5d
    Reporting             :h2, after h1, 4d
    section Integrations
    Email Integration     :i1, after h2, 5d
    LinkedIn Integration  :i2, after i1, 5d
```

---

## Technology Stack Recommendations

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **API Framework** | FastAPI (Python) or NestJS (Node) | Async support, OpenAPI docs, type safety |
| **Database** | PostgreSQL 15+ | JSONB support, RLS, full-text search |
| **Cache** | Redis 7+ | Session storage, rate limiting, pub/sub |
| **Queue** | RabbitMQ or AWS SQS | Reliable message delivery, dead letter queues |
| **AI/LLM** | OpenAI GPT-4 + Gemini | Quality, speed, fallback options |
| **Vector DB** | Pinecone or pgvector | Semantic search, similarity matching |
| **Object Storage** | AWS S3 or R2 | Exports, attachments, assets |
| **Auth** | Supabase Auth or Auth0 | OAuth providers, JWT, session management |
| **Monitoring** | Prometheus + Grafana | Metrics, alerting, dashboards |
| **Logging** | Loki or ELK Stack | Centralized logging, search |
| **Error Tracking** | Sentry | Exception tracking, performance |
| **CI/CD** | GitHub Actions | Automated testing, deployment |
| **Hosting** | AWS ECS or Kubernetes | Container orchestration, scaling |

---

## Summary

This architecture supports:
- ✅ Multi-tenant workspaces with proper isolation
- ✅ Unified API endpoints for frontend efficiency
- ✅ Scalable AI pipelines for lead discovery & enrichment
- ✅ Real-time updates via WebSocket
- ✅ Proper security with RBAC and RLS
- ✅ Observable and monitorable services
- ✅ Phased implementation approach
