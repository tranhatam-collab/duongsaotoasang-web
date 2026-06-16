-- 0025_totp_2fa.sql
-- TOTP 2-Factor Authentication + OAuth + Password Reset support

-- ============================================================
-- 1. TOTP columns on users table
-- ============================================================
ALTER TABLE users ADD COLUMN totp_secret TEXT;
ALTER TABLE users ADD COLUMN totp_enabled INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN totp_verified_at TEXT;
ALTER TABLE users ADD COLUMN totp_backup_codes TEXT; -- JSON array of 10 hashed codes

-- ============================================================
-- 2. OAuth provider tracking (for Google, Apple, etc.)
-- ============================================================
ALTER TABLE users ADD COLUMN oauth_provider TEXT; -- 'google', 'apple', etc.
ALTER TABLE users ADD COLUMN oauth_subject TEXT; -- sub/id from provider
ALTER TABLE users ADD COLUMN oauth_data TEXT; -- JSON: avatar, locale, etc.

-- Composite unique constraint for OAuth users
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_subject);

-- ============================================================
-- 3. User security settings
-- ============================================================
CREATE TABLE IF NOT EXISTS user_security_settings (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  require_2fa_for_payment INTEGER DEFAULT 0,
  require_2fa_for_trust INTEGER DEFAULT 0,
  require_2fa_for_login INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. 2FA verification log (audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS totp_verification_log (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'setup', 'verify', 'payment_gate', 'trust_gate', 'backup_used'
  success INTEGER NOT NULL DEFAULT 0,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_totp_log_user ON totp_verification_log(user_id, created_at DESC);
