-- 0022_auth_sessions.sql
-- DSTS Auth Sessions — Secure password hashing and opaque session tokens
-- Scope: Add password salt/iterations metadata, sessions table, auth attempt logging
-- Status: production-ready schema

-- ============================================================
-- 1. Add password hashing metadata to users table
-- ============================================================

-- Note: These columns assume users table already exists from 0001_schema.sql
-- If columns already exist, ALTER TABLE will fail — this is intentional safety check

ALTER TABLE users ADD COLUMN password_salt TEXT;
ALTER TABLE users ADD COLUMN password_iterations INTEGER DEFAULT 310000;
ALTER TABLE users ADD COLUMN password_algorithm TEXT DEFAULT 'PBKDF2-SHA-256';
ALTER TABLE users ADD COLUMN password_updated_at TEXT;

-- ============================================================
-- 2. Sessions table (opaque server-side sessions)
-- ============================================================

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token_hash TEXT NOT NULL UNIQUE,
  user_agent TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  last_accessed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_revoked ON sessions(revoked_at) WHERE revoked_at IS NOT NULL;

-- ============================================================
-- 3. Auth attempts (rate limiting and generic errors)
-- ============================================================

CREATE TABLE IF NOT EXISTS auth_attempts (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL, -- email or IP
  attempt_type TEXT NOT NULL CHECK(attempt_type IN ('register', 'login', 'password_reset')),
  success INTEGER NOT NULL DEFAULT 0, -- 1 = success, 0 = failure
  ip_address TEXT,
  user_agent TEXT,
  attempted_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_auth_attempts_identifier ON auth_attempts(identifier, attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_ip ON auth_attempts(ip_address, attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_type ON auth_attempts(attempt_type, attempted_at DESC);

-- ============================================================
-- 4. Password reset tokens (optional, for future)
-- ============================================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_expires ON password_reset_tokens(expires_at);
