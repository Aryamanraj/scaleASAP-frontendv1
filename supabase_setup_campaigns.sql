-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    job_title TEXT,
    company TEXT,
    linkedin_url TEXT,
    email TEXT,
    enrichment_data JSONB DEFAULT '{}'::jsonb,
    outbound_message TEXT,
    outcome TEXT CHECK (outcome IN ('meeting_booked', 'meeting_done', 'closed', 'rejected', 'interested', 'no_response')),
    outcome_reason TEXT,
    status TEXT DEFAULT 'found' CHECK (status IN ('found', 'enriched', 'drafted', 'sent', 'responded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_workspace_id ON campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_workspace_id ON leads(workspace_id);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Campaigns Policies
CREATE POLICY "Users can view their own campaigns"
    ON campaigns FOR SELECT
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own campaigns"
    ON campaigns FOR INSERT
    WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own campaigns"
    ON campaigns FOR UPDATE
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own campaigns"
    ON campaigns FOR DELETE
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

-- Leads Policies
CREATE POLICY "Users can view their own leads"
    ON leads FOR SELECT
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own leads"
    ON leads FOR INSERT
    WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own leads"
    ON leads FOR UPDATE
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own leads"
    ON leads FOR DELETE
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

-- Updated At Triggers
CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
