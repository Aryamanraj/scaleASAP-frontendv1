-- URGENT: Drop the insecure user_credentials table
-- This table stores passwords in plain text which is a critical security vulnerability
-- Supabase Auth already securely handles password hashing and storage

DROP TABLE IF EXISTS user_credentials;

-- Note: All authentication is handled by Supabase Auth (auth.users table)
-- which properly hashes passwords using bcrypt
-- You should NEVER store passwords in plain text in your own tables
