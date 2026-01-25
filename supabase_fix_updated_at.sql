-- Fix for: record "new" has no field "updated_at"
-- This adds the missing 'updated_at' column to the workspaces table if it doesn't exist.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspaces' AND column_name = 'updated_at') THEN
        ALTER TABLE workspaces ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;
