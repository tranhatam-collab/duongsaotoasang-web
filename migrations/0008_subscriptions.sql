-- 0008_subscriptions.sql
-- Phase 2: Subscription billing tables
-- Block by: pay.iai.one Club contract (dsts, duongsaotoasang-club, payos) + Legal Counsel sign-off
-- Idempotent: CREATE TABLE IF NOT EXISTS

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  creator_id TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('member', 'circle', 'inner_circle')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'past_due', 'canceled', 'expired')),
  current_period_start TEXT,
  current_period_end TEXT,
  canceled_at TEXT,
  provider TEXT NOT NULL DEFAULT 'payos',
  provider_subscription_id TEXT,
  amount_vnd INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'VND',
  idempotency_key TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (creator_id) REFERENCES creators(id)
);

CREATE TABLE IF NOT EXISTS subscription_events (
  id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'created', 'activated', 'renewed', 'past_due', 'canceled',
    'expired', 'payment_failed', 'payment_succeeded', 'refunded'
  )),
  provider_message_id TEXT,
  payload TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);

CREATE TABLE IF NOT EXISTS subscription_renewal_log (
  id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL,
  renewal_date TEXT NOT NULL,
  amount_vnd INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'skipped')),
  provider_message_id TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);

CREATE INDEX IF NOT EXISTS idx_subs_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subs_creator_id ON subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_subs_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subs_idempotency ON subscriptions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_sub_events_subscription_id ON subscription_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_renewal_subscription_id ON subscription_renewal_log(subscription_id);
