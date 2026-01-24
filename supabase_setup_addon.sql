-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Workspaces Table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- Link to auth.users, but we don't strictly enforce FK to auth.users if users are managed externally, but usually good practice.
    name TEXT NOT NULL DEFAULT 'Untitled Workspace',
    role TEXT DEFAULT 'Owner',
    website TEXT,
    favicon_url TEXT,
    onboarding_status TEXT DEFAULT 'incomplete',
    discovery_chat_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add columns if they don't exist (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspaces' AND column_name = 'favicon_url') THEN
        ALTER TABLE workspaces ADD COLUMN favicon_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspaces' AND column_name = 'discovery_chat_history') THEN
        ALTER TABLE workspaces ADD COLUMN discovery_chat_history JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;


-- 2. Onboarding Data Table
CREATE TABLE IF NOT EXISTS onboarding_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id)
);


-- 3. Experiments Table
CREATE TABLE IF NOT EXISTS experiments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    pattern TEXT,
    industries JSONB, -- Storing as JSONB for array flexibility
    pain TEXT,
    trigger TEXT,
    wiza_filters JSONB DEFAULT '{}'::jsonb,
    outreach_angle TEXT,
    status TEXT DEFAULT 'pending',
    leads_found INTEGER DEFAULT 0,
    leads_warming INTEGER DEFAULT 0,
    meetings_booked INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 4. Discovery Feedback Table
CREATE TABLE IF NOT EXISTS discovery_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    rating INTEGER,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 5. Leads Table Updates (Adding avatar_url)
-- campaigns and leads tables are created in the previous script, but we ensure columns exist.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'avatar_url') THEN
        ALTER TABLE leads ADD COLUMN avatar_url TEXT;
    END IF;
END $$;


-- 6. Shared Function for Updated At (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';


-- 7. Triggers
-- Workspaces Trigger
DROP TRIGGER IF EXISTS update_workspaces_updated_at ON workspaces;
CREATE TRIGGER update_workspaces_updated_at
    BEFORE UPDATE ON workspaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Onboarding Data Trigger
DROP TRIGGER IF EXISTS update_onboarding_data_updated_at ON onboarding_data;
CREATE TRIGGER update_onboarding_data_updated_at
    BEFORE UPDATE ON onboarding_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Experiments Trigger
DROP TRIGGER IF EXISTS update_experiments_updated_at ON experiments;
CREATE TRIGGER update_experiments_updated_at
    BEFORE UPDATE ON experiments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- 8. Row Level Security Policies

-- Workspaces RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own workspaces" ON workspaces;
CREATE POLICY "Users can view their own workspaces"
    ON workspaces FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own workspaces" ON workspaces;
CREATE POLICY "Users can insert their own workspaces"
    ON workspaces FOR INSERT
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own workspaces" ON workspaces;
CREATE POLICY "Users can update their own workspaces"
    ON workspaces FOR UPDATE
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own workspaces" ON workspaces;
CREATE POLICY "Users can delete their own workspaces"
    ON workspaces FOR DELETE
    USING (user_id = auth.uid());


-- Onboarding Data RLS (via workspace ownership)
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their workspaces onboarding data" ON onboarding_data;
CREATE POLICY "Users can view their workspaces onboarding data"
    ON onboarding_data FOR SELECT
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their workspaces onboarding data" ON onboarding_data;
CREATE POLICY "Users can insert their workspaces onboarding data"
    ON onboarding_data FOR INSERT
    WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their workspaces onboarding data" ON onboarding_data;
CREATE POLICY "Users can update their workspaces onboarding data"
    ON onboarding_data FOR UPDATE
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete their workspaces onboarding data" ON onboarding_data;
CREATE POLICY "Users can delete their workspaces onboarding data"
    ON onboarding_data FOR DELETE
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));


-- Experiments RLS
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their workspaces experiments" ON experiments;
CREATE POLICY "Users can view their workspaces experiments"
    ON experiments FOR SELECT
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can create experiments in their workspaces" ON experiments;
CREATE POLICY "Users can create experiments in their workspaces"
    ON experiments FOR INSERT
    WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update experiments in their workspaces" ON experiments;
CREATE POLICY "Users can update experiments in their workspaces"
    ON experiments FOR UPDATE
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete experiments in their workspaces" ON experiments;
CREATE POLICY "Users can delete experiments in their workspaces"
    ON experiments FOR DELETE
    USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));


-- Discovery Feedback RLS
ALTER TABLE discovery_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert feedback" ON discovery_feedback;
CREATE POLICY "Users can insert feedback"
    ON discovery_feedback FOR INSERT
    WITH CHECK (user_id = auth.uid());
    
-- Note: Usually users don't need to read back their own feedback for this app, but if they do:
DROP POLICY IF EXISTS "Users can view their own feedback" ON discovery_feedback;
CREATE POLICY "Users can view their own feedback"
    ON discovery_feedback FOR SELECT
    USING (user_id = auth.uid());
