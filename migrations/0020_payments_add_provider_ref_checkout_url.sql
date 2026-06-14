-- Migration 0020 — 2026-06-14
-- Fix: payments table missing provider_ref + checkout_url columns
-- create-intent.js line 145 updates these but schema 0019 omitted them.

ALTER TABLE payments ADD COLUMN provider_ref TEXT;
ALTER TABLE payments ADD COLUMN checkout_url TEXT;

-- Backfill: copy provider_transaction_id -> provider_ref for existing rows
-- where provider_ref is NULL but provider_transaction_id exists.
UPDATE payments SET provider_ref = provider_transaction_id
WHERE provider_ref IS NULL AND provider_transaction_id IS NOT NULL;
