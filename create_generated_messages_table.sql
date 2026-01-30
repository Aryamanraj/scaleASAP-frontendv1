-- Create generated_messages table
CREATE TABLE IF NOT EXISTS generated_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'email')),
    message_type TEXT NOT NULL,
    content TEXT NOT NULL,
    context TEXT,
    thinking TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lead message lookups
CREATE INDEX IF NOT EXISTS idx_generated_messages_lead_id ON generated_messages(lead_id);

-- Add RLS policies
ALTER TABLE generated_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generated messages"
    ON generated_messages FOR SELECT
    USING (
        lead_id IN (
            SELECT id FROM leads WHERE workspace_id IN (
                SELECT id FROM workspaces WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can insert their own generated messages"
    ON generated_messages FOR INSERT
    WITH CHECK (
        lead_id IN (
            SELECT id FROM leads WHERE workspace_id IN (
                SELECT id FROM workspaces WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete their own generated messages"
    ON generated_messages FOR DELETE
    USING (
        lead_id IN (
            SELECT id FROM leads WHERE workspace_id IN (
                SELECT id FROM workspaces WHERE user_id = auth.uid()
            )
        )
    );
