-- 0027_email_verification.sql
-- DSTS Email Verification — Require email verification before account activation
-- Scope: Add email_verification_tokens table, add email_verified_at column to users
-- Status: production-ready schema

-- Add email verification status to users table
ALTER TABLE users ADD COLUMN email_verified_at TEXT;
ALTER TABLE users ADD COLUMN email_verification_token TEXT;

-- Email verification tokens table (separate from password reset tokens for clarity)
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_email_verif_user ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verif_token ON email_verification_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_email_verif_expires ON email_verification_tokens(expires_at);
