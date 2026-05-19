-- 0009_points.sql
-- Phase 2: Points ledger + packages + reward redemptions
-- Block by: pay.iai.one Club contract + Legal Counsel sign-off
-- Idempotent: CREATE TABLE IF NOT EXISTS

CREATE TABLE IF NOT EXISTS point_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  points INTEGER NOT NULL,
  price_vnd INTEGER NOT NULL,
  bonus_points INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS point_ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  subscription_id TEXT,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'earned_subscription', 'purchased', 'redeemed', 'expired',
    'adjusted_admin', 'referral_reward', 'retention_bonus', 'clawed_back'
  )),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  description TEXT,
  idempotency_key TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reward_redemptions (
  id TEXT PRIMARY KEY,
  reward_id TEXT NOT NULL,
  user_id TEXT,
  points_cost INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'canceled', 'refunded')),
  fulfilled_at TEXT,
  idempotency_key TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (reward_id) REFERENCES reward_catalog(id)
);

CREATE INDEX IF NOT EXISTS idx_pledger_user_id ON point_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_pledger_type ON point_ledger(transaction_type);
CREATE INDEX IF NOT EXISTS idx_pledger_idem ON point_ledger(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_rr_reward_id ON reward_redemptions(reward_id);
CREATE INDEX IF NOT EXISTS idx_rr_user_id ON reward_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_rr_idem ON reward_redemptions(idempotency_key);

INSERT OR IGNORE INTO point_packages (id, name, points, price_vnd, bonus_points) VALUES
('pkg_100', 'Gói 100 Star Points', 100, 100000, 0),
('pkg_500', 'Gói 500 Star Points', 500, 500000, 25),
('pkg_1000', 'Gói 1.000 Star Points', 1000, 1000000, 75),
('pkg_2500', 'Gói 2.500 Star Points', 2500, 2500000, 250),
('pkg_5000', 'Gói 5.000 Star Points', 5000, 5000000, 750);
