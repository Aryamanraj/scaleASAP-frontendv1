-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS user_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (though if you want to see all credentials you might need to adjust this)
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;

-- Simple policy for demonstration (allows insert from service role/anon for testing)
CREATE POLICY "Allow authenticated inserts" ON user_credentials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select for admin" ON user_credentials FOR SELECT USING (true);
