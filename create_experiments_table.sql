-- Create experiments table to store ICP experiments
CREATE TABLE IF NOT EXISTS experiments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('bullseye', 'variable_a', 'variable_b', 'contrarian', 'long_shot')),
    pattern TEXT NOT NULL,
    industries JSONB DEFAULT '[]'::jsonb,
    pain TEXT NOT NULL,
    trigger TEXT NOT NULL,
    wiza_filters JSONB NOT NULL,
    outreach_angle TEXT NOT NULL,
    status TEXT DEFAULT 'creating_hypotheses' CHECK (status IN ('pending', 'creating_hypotheses', 'finding_leads', 'prioritizing_leads', 'warmup_initiated', 'complete', 'completed', 'failed', 'suggested')),
    leads_found INTEGER DEFAULT 0,
    leads_warming INTEGER DEFAULT 0,
    meetings_booked INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster workspace queries
CREATE INDEX IF NOT EXISTS idx_experiments_workspace_id ON experiments(workspace_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see experiments for their own workspaces
CREATE POLICY "Users can view their own experiments"
    ON experiments
    FOR SELECT
    USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE user_id = auth.uid()
        )
    );

-- Policy: Users can insert experiments for their own workspaces
CREATE POLICY "Users can create experiments"
    ON experiments
    FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT id FROM workspaces WHERE user_id = auth.uid()
        )
    );

-- Policy: Users can update their own experiments
CREATE POLICY "Users can update their own experiments"
    ON experiments
    FOR UPDATE
    USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE user_id = auth.uid()
        )
    );

-- Policy: Users can delete their own experiments
CREATE POLICY "Users can delete their own experiments"
    ON experiments
    FOR DELETE
    USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE user_id = auth.uid()
        )
    );

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_experiments_updated_at
    BEFORE UPDATE ON experiments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE experiments IS 'Stores ICP experiments for each workspace';
COMMENT ON COLUMN experiments.workspace_id IS 'Reference to the workspace this experiment belongs to';
COMMENT ON COLUMN experiments.type IS 'Type of ICP experiment (bullseye, variable_a, variable_b, contrarian, long_shot)';
COMMENT ON COLUMN experiments.status IS 'Current status of the experiment (creating_hypotheses, finding_leads, prioritizing_leads, warmup_initiated, complete, failed)';
COMMENT ON COLUMN experiments.wiza_filters IS 'JSON object containing job_titles, keywords, seniority, headcount, and revenue filters';
