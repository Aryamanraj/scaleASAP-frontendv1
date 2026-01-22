-- Add discovery_chat_history column to workspaces table
ALTER TABLE workspaces 
ADD COLUMN IF NOT EXISTS discovery_chat_history JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN workspaces.discovery_chat_history IS 'Stores the chat history for the ICP discovery process';
