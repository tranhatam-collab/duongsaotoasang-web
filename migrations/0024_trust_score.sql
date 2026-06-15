-- 0024_trust_score.sql
-- DSTS Trust Score — Trust score calculation and history
-- Scope: Add trust level column to verified_entities, add columns to existing trust_score_history, add helper columns
-- Status: production-ready schema
-- Note: trust_score_history table already exists in migration 0013 with old_score/new_score columns

-- Add trust level column (trust_score already exists)
ALTER TABLE verified_entities ADD COLUMN trust_level TEXT DEFAULT 'unverified';
ALTER TABLE verified_entities ADD COLUMN trust_score_updated_at TEXT;

-- Add columns to existing trust_score_history table (from migration 0013)
-- Add new columns for 5-dimension trust score calculation
ALTER TABLE trust_score_history ADD COLUMN level TEXT DEFAULT 'unverified';
ALTER TABLE trust_score_history ADD COLUMN breakdown TEXT; -- JSON string of dimension breakdown

-- Add helper columns for trust score calculation (optional, can be computed on-the-fly)
ALTER TABLE verified_entities ADD COLUMN verification_tier TEXT DEFAULT 'tier1';
ALTER TABLE verified_entities ADD COLUMN profile_completeness INTEGER DEFAULT 0;
ALTER TABLE verified_entities ADD COLUMN consistency_ratio REAL DEFAULT 0;
ALTER TABLE verified_entities ADD COLUMN has_violations INTEGER DEFAULT 0;
ALTER TABLE verified_entities ADD COLUMN response_rate REAL DEFAULT 0;
ALTER TABLE verified_entities ADD COLUMN avg_rating REAL DEFAULT 0;
ALTER TABLE verified_entities ADD COLUMN positive_reviews INTEGER DEFAULT 0;
ALTER TABLE verified_entities ADD COLUMN endorsements INTEGER DEFAULT 0;
ALTER TABLE verified_entities ADD COLUMN has_negative_flags INTEGER DEFAULT 0;
ALTER TABLE verified_entities ADD COLUMN days_since_verification INTEGER DEFAULT 0;
ALTER TABLE verified_entities ADD COLUMN days_since_join INTEGER DEFAULT 0;
ALTER TABLE verified_entities ADD COLUMN days_since_last_activity INTEGER DEFAULT 0;
ALTER TABLE verified_entities ADD COLUMN activity_count INTEGER DEFAULT 0;
