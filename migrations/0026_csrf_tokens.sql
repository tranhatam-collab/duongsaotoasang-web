-- 0026_csrf_tokens.sql
-- DSTS CSRF Protection — Add csrf_token column to sessions table
-- Scope: Store per-session CSRF token for double-submit cookie pattern
-- Status: production-ready schema

-- Add CSRF token to sessions table (nullable for backward compat with existing sessions)
ALTER TABLE sessions ADD COLUMN csrf_token TEXT;

-- Index for fast CSRF token lookups
CREATE INDEX IF NOT EXISTS idx_sessions_csrf ON sessions(csrf_token) WHERE csrf_token IS NOT NULL;
