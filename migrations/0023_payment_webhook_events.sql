-- 0023_payment_webhook_events.sql
-- DSTS Payment Webhook Events — Replay guard for payment webhooks
-- Scope: Add table to track processed webhook events (event_id dedup)
-- Status: production-ready schema

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  payment_id TEXT NOT NULL,
  processed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_event_id ON payment_webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_payment_id ON payment_webhook_events(payment_id);
