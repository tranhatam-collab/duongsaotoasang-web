-- 0010_referrals.sql
-- Phase 2: Referral system
-- Block by: Legal Counsel sign-off
-- Idempotent: CREATE TABLE IF NOT EXISTS

CREATE TABLE IF NOT EXISTS referral_links (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  code TEXT NOT NULL UNIQUE,
  referral_type TEXT NOT NULL CHECK (referral_type IN ('member', 'circle', 'inner_circle', 'points_purchase')),
  reward_points INTEGER NOT NULL,
  max_uses INTEGER,
  use_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'expired')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT
);

CREATE TABLE IF NOT EXISTS referral_events (
  id TEXT PRIMARY KEY,
  referral_link_id TEXT NOT NULL,
  referred_user_id TEXT,
  referred_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'earned', 'clawed_back')),
  reward_points INTEGER NOT NULL DEFAULT 0,
  retention_bonus_points INTEGER NOT NULL DEFAULT 0,
  reference_type TEXT,
  reference_id TEXT,
  earned_at TEXT,
  clawed_back_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (referral_link_id) REFERENCES referral_links(id)
);

CREATE TABLE IF NOT EXISTS referral_clawback_log (
  id TEXT PRIMARY KEY,
  referral_event_id TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('refund', 'chargeback', 'fraud', 'policy_violation')),
  points_clawed_back INTEGER NOT NULL,
  reference_transaction_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (referral_event_id) REFERENCES referral_events(id)
);

CREATE INDEX IF NOT EXISTS idx_rl_code ON referral_links(code);
CREATE INDEX IF NOT EXISTS idx_rl_user_id ON referral_links(user_id);
CREATE INDEX IF NOT EXISTS idx_re_referral_link_id ON referral_events(referral_link_id);
CREATE INDEX IF NOT EXISTS idx_re_status ON referral_events(status);
CREATE INDEX IF NOT EXISTS idx_rcl_referral_event_id ON referral_clawback_log(referral_event_id);
