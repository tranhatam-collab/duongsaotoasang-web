-- 0006_donation_email_dispatches.sql
-- Track donation receipt email automation outcomes.

CREATE TABLE IF NOT EXISTS donation_email_dispatches (
  id                  TEXT PRIMARY KEY,
  donation_id         TEXT REFERENCES donations(id),
  event_id            TEXT NOT NULL,
  recipient_email     TEXT,
  provider            TEXT NOT NULL,
  provider_message_id TEXT,
  status              TEXT NOT NULL,
  response_json       TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ded_donation_id ON donation_email_dispatches(donation_id);
CREATE INDEX IF NOT EXISTS idx_ded_event_id ON donation_email_dispatches(event_id);
CREATE INDEX IF NOT EXISTS idx_ded_status ON donation_email_dispatches(status);
