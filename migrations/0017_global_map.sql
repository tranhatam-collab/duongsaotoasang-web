-- 0017_global_map.sql
-- DSTS Global Vietnamese Map — Location columns for verified entities
-- Scope: Add location columns to verified_entities table for map clustering
-- Status: production-ready schema

-- Add location columns to verified_entities
ALTER TABLE verified_entities ADD COLUMN country TEXT;
ALTER TABLE verified_entities ADD COLUMN city TEXT;
ALTER TABLE verified_entities ADD COLUMN latitude REAL;
ALTER TABLE verified_entities ADD COLUMN longitude REAL;
ALTER TABLE verified_entities ADD COLUMN location_verified INTEGER DEFAULT 0;

-- Create indexes for map queries
CREATE INDEX IF NOT EXISTS idx_verified_entities_country ON verified_entities(country);
CREATE INDEX IF NOT EXISTS idx_verified_entities_city ON verified_entities(city);
CREATE INDEX IF NOT EXISTS idx_verified_entities_location ON verified_entities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_verified_entities_location_verified ON verified_entities(location_verified);
