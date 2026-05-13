-- 0005_donations.sql
-- Donation payment tracking for duongsaotoasang.com
-- Applied via: wrangler d1 migrations apply cf-d1-dsts-content-prod --remote

CREATE TABLE IF NOT EXISTS donations (
  id              TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL,
  amount_vnd      INTEGER NOT NULL,
  donor_email     TEXT,
  donor_name      TEXT,
  message         TEXT,
  provider        TEXT NOT NULL DEFAULT 'payos',
  provider_ref    TEXT,
  checkout_url    TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  completed_at    TEXT,
  expires_at      TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_donations_idem ON donations(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(donor_email) WHERE donor_email IS NOT NULL;

CREATE TABLE IF NOT EXISTS donation_webhook_log (
  id          TEXT PRIMARY KEY,
  event_id    TEXT NOT NULL,
  event_type  TEXT NOT NULL,
  donation_id TEXT REFERENCES donations(id),
  payload     TEXT NOT NULL,
  processed   INTEGER NOT NULL DEFAULT 0,
  received_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_dwh_event_id ON donation_webhook_log(event_id);
