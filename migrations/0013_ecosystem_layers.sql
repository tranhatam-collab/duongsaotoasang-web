-- 0013_ecosystem_layers.sql
-- DSTS Ecosystem Foundation: 6 Priority Layers
-- Scope: Verified Identity, Story Preservation, Creator Economy, Sponsor Ecosystem, Trust Layer, Global Vietnamese Map
-- Status: production-ready schema

-- ============================================================
-- 1. VERIFIED IDENTITY LAYER
-- ============================================================

CREATE TABLE IF NOT EXISTS verified_entities (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('creator', 'mentor', 'success_story', 'sponsor', 'contributor')),
  entity_id TEXT NOT NULL,
  entity_slug TEXT,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'verified', 'rejected', 'revoked')),
  trust_score INTEGER NOT NULL DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  badge_type TEXT NOT NULL DEFAULT 'none' CHECK (badge_type IN ('none', 'bronze', 'silver', 'gold', 'platinum', 'diamond')),
  evidence_pack_json TEXT,
  verified_by TEXT,
  verified_at TEXT,
  expires_at TEXT,
  review_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS verification_evidence (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL REFERENCES verified_entities(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('identity_document', 'professional_certificate', 'media_interview', 'social_proof', 'third_party_attestation', 'on_chain_record', 'legal_filing', 'financial_audit')),
  evidence_url TEXT,
  description TEXT,
  verified_by TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'confirmed', 'disputed', 'expired')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS verification_audit_log (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL REFERENCES verified_entities(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('submitted', 'review_started', 'evidence_requested', 'approved', 'rejected', 'revoked', 'renewed', 'badge_upgraded', 'badge_downgraded')),
  performed_by TEXT,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_verified_entities_type ON verified_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_verified_entities_status ON verified_entities(status);
CREATE INDEX IF NOT EXISTS idx_verified_entities_score ON verified_entities(trust_score);
CREATE INDEX IF NOT EXISTS idx_verified_entities_slug ON verified_entities(entity_slug);
CREATE INDEX IF NOT EXISTS idx_verification_evidence_entity ON verification_evidence(entity_id);
CREATE INDEX IF NOT EXISTS idx_verification_audit_entity ON verification_audit_log(entity_id);

-- ============================================================
-- 2. STORY PRESERVATION ENGINE (Digital Legacy System)
-- ============================================================

CREATE TABLE IF NOT EXISTS legacy_stories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  creator_id TEXT,
  subject_name TEXT NOT NULL,
  subject_birth_year INTEGER,
  subject_origin TEXT,
  title TEXT NOT NULL,
  summary TEXT,
  story_type TEXT NOT NULL DEFAULT 'biography' CHECK (story_type IN ('biography', 'interview', 'oral_history', 'family_legacy', 'community_archive', 'achievement_record')),
  video_url TEXT,
  audio_url TEXT,
  document_urls_json TEXT,
  photo_urls_json TEXT,
  timeline_json TEXT,
  family_tree_json TEXT,
  archive_status TEXT NOT NULL DEFAULT 'active' CHECK (archive_status IN ('active', 'preserved', 'restricted', 'withdrawn')),
  preservation_level TEXT NOT NULL DEFAULT 'standard' CHECK (preservation_level IN ('standard', 'permanent', 'immutable')),
  verified_entity_id TEXT REFERENCES verified_entities(id),
  view_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS legacy_media (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL REFERENCES legacy_stories(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'audio', 'document', 'photo', 'transcript', 'timeline_entry', 'family_tree_node')),
  url TEXT,
  storage_key TEXT,
  caption TEXT,
  transcript TEXT,
  file_size_bytes INTEGER,
  mime_type TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS legacy_timeline_events (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL REFERENCES legacy_stories(id) ON DELETE CASCADE,
  event_date TEXT,
  event_year INTEGER,
  event_title TEXT NOT NULL,
  event_description TEXT,
  media_urls_json TEXT,
  importance INTEGER NOT NULL DEFAULT 3 CHECK (importance >= 1 AND importance <= 5),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_legacy_stories_slug ON legacy_stories(slug);
CREATE INDEX IF NOT EXISTS idx_legacy_stories_creator ON legacy_stories(creator_id);
CREATE INDEX IF NOT EXISTS idx_legacy_stories_type ON legacy_stories(story_type);
CREATE INDEX IF NOT EXISTS idx_legacy_stories_archive ON legacy_stories(archive_status);
CREATE INDEX IF NOT EXISTS idx_legacy_media_story ON legacy_media(story_id);
CREATE INDEX IF NOT EXISTS idx_legacy_timeline_story ON legacy_timeline_events(story_id);

-- ============================================================
-- 3. CREATOR ECONOMY DASHBOARD
-- ============================================================

CREATE TABLE IF NOT EXISTS creator_metrics (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  revenue_vnd INTEGER NOT NULL DEFAULT 0,
  follower_count INTEGER NOT NULL DEFAULT 0,
  follower_delta INTEGER NOT NULL DEFAULT 0,
  retention_rate REAL,
  conversion_rate REAL,
  referral_count INTEGER NOT NULL DEFAULT 0,
  talkshow_performance_json TEXT,
  content_views INTEGER NOT NULL DEFAULT 0,
  engagement_rate REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS creator_revenue_streams (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  stream_type TEXT NOT NULL CHECK (stream_type IN ('subscription', 'donation', 'ticket_sales', 'merchandise', 'sponsorship', 'affiliate', 'licensing')),
  amount_vnd INTEGER NOT NULL DEFAULT 0,
  platform_fee_vnd INTEGER NOT NULL DEFAULT 0,
  net_vnd INTEGER NOT NULL DEFAULT 0,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  source_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS creator_payouts (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  amount_vnd INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'disputed')),
  payout_method TEXT,
  payout_reference TEXT,
  requested_at TEXT NOT NULL DEFAULT (datetime('now')),
  processed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_creator_metrics_creator ON creator_metrics(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_metrics_period ON creator_metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_creator_revenue_creator ON creator_revenue_streams(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_revenue_type ON creator_revenue_streams(stream_type);
CREATE INDEX IF NOT EXISTS idx_creator_payouts_creator ON creator_payouts(creator_id);

-- ============================================================
-- 4. SPONSOR ECOSYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS sponsors (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('community', 'bronze', 'silver', 'gold', 'platinum', 'strategic')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('prospect', 'negotiating', 'active', 'paused', 'ended')),
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  industry TEXT,
  country TEXT,
  mission_alignment TEXT,
  total_contributed_vnd INTEGER NOT NULL DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sponsor_campaigns (
  id TEXT PRIMARY KEY,
  sponsor_id TEXT NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('brand_awareness', 'mentorship_support', 'event_sponsorship', 'content_series', 'scholarship', 'infrastructure', 'matching_grant')),
  description TEXT,
  target_audience TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  budget_vnd INTEGER NOT NULL,
  spent_vnd INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  impact_goals_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sponsor_impact_reports (
  id TEXT PRIMARY KEY,
  sponsor_id TEXT NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  campaign_id TEXT REFERENCES sponsor_campaigns(id) ON DELETE SET NULL,
  report_period_start TEXT NOT NULL,
  report_period_end TEXT NOT NULL,
  reach_count INTEGER NOT NULL DEFAULT 0,
  engagement_count INTEGER NOT NULL DEFAULT 0,
  story_count INTEGER NOT NULL DEFAULT 0,
  mentor_hours REAL NOT NULL DEFAULT 0,
  youth_served INTEGER NOT NULL DEFAULT 0,
  financial_summary_json TEXT,
  narrative_report TEXT,
  generated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sponsor_portal_users (
  id TEXT PRIMARY KEY,
  sponsor_id TEXT NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin')),
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sponsors_slug ON sponsors(slug);
CREATE INDEX IF NOT EXISTS idx_sponsors_status ON sponsors(status);
CREATE INDEX IF NOT EXISTS idx_sponsor_campaigns_sponsor ON sponsor_campaigns(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_campaigns_status ON sponsor_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_sponsor_impact_sponsor ON sponsor_impact_reports(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_portal_sponsor ON sponsor_portal_users(sponsor_id);

-- ============================================================
-- 5. TRUST LAYER
-- ============================================================

CREATE TABLE IF NOT EXISTS trust_verifications (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('mentor', 'story', 'creator', 'achievement', 'sponsor', 'contributor')),
  entity_id TEXT NOT NULL,
  entity_slug TEXT,
  trust_provider TEXT NOT NULL DEFAULT 'trust.iai.one' CHECK (trust_provider IN ('trust.iai.one', 'manual', 'third_party')),
  verification_type TEXT NOT NULL CHECK (verification_type IN ('identity', 'professional_history', 'financial_integrity', 'background_check', 'community_endorsement', 'media_verification', 'on_chain_attestation')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'verified', 'failed', 'expired')),
  trust_score INTEGER NOT NULL DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  metadata_json TEXT,
  certificate_url TEXT,
  verified_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS trust_audit_log (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('verification_initiated', 'evidence_submitted', 'check_passed', 'check_failed', 'score_updated', 'certificate_issued', 'verification_revoked', 'expiration_warning')),
  performed_by TEXT,
  details_json TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS trust_score_history (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_score INTEGER NOT NULL,
  new_score INTEGER NOT NULL,
  reason TEXT,
  changed_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_trust_verifications_entity ON trust_verifications(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_trust_verifications_status ON trust_verifications(status);
CREATE INDEX IF NOT EXISTS idx_trust_verifications_provider ON trust_verifications(trust_provider);
CREATE INDEX IF NOT EXISTS idx_trust_audit_entity ON trust_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_trust_score_history ON trust_score_history(entity_type, entity_id);

-- ============================================================
-- 6. GLOBAL VIETNAMESE MAP
-- ============================================================

CREATE TABLE IF NOT EXISTS global_vietnamese (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('success_story', 'mentor', 'creator', 'entrepreneur', 'scientist', 'philanthropist', 'artist', 'athlete', 'educator', 'community_leader')),
  headline TEXT,
  bio TEXT,
  country TEXT,
  city TEXT,
  latitude REAL,
  longitude REAL,
  avatar_url TEXT,
  cover_url TEXT,
  verified_entity_id TEXT REFERENCES verified_entities(id),
  social_links_json TEXT,
  achievements_json TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS global_vietnamese_connections (
  id TEXT PRIMARY KEY,
  from_id TEXT NOT NULL REFERENCES global_vietnamese(id) ON DELETE CASCADE,
  to_id TEXT NOT NULL REFERENCES global_vietnamese(id) ON DELETE CASCADE,
  connection_type TEXT NOT NULL CHECK (connection_type IN ('mentored', 'collaborated', 'inspired', 'family', 'colleague', 'sponsored')),
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(from_id, to_id, connection_type)
);

CREATE TABLE IF NOT EXISTS global_vietnamese_map_clusters (
  id TEXT PRIMARY KEY,
  cluster_name TEXT NOT NULL,
  country TEXT,
  city TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  member_count INTEGER NOT NULL DEFAULT 0,
  featured_member_ids_json TEXT,
  category_breakdown_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_global_vietnamese_category ON global_vietnamese(category);
CREATE INDEX IF NOT EXISTS idx_global_vietnamese_country ON global_vietnamese(country);
CREATE INDEX IF NOT EXISTS idx_global_vietnamese_status ON global_vietnamese(status);
CREATE INDEX IF NOT EXISTS idx_global_vietnamese_featured ON global_vietnamese(is_featured);
CREATE INDEX IF NOT EXISTS idx_global_vn_connections_from ON global_vietnamese_connections(from_id);
CREATE INDEX IF NOT EXISTS idx_global_vn_connections_to ON global_vietnamese_connections(to_id);
CREATE INDEX IF NOT EXISTS idx_global_vn_map_clusters_loc ON global_vietnamese_map_clusters(latitude, longitude);

-- ============================================================
-- VIEWS FOR CONVENIENCE
-- ============================================================

CREATE VIEW IF NOT EXISTS v_verified_creators AS
SELECT
  ve.*,
  c.display_name as creator_name,
  c.creator_type,
  c.status as creator_status
FROM verified_entities ve
LEFT JOIN creators c ON ve.entity_id = c.id
WHERE ve.entity_type = 'creator';

CREATE VIEW IF NOT EXISTS v_verified_mentors AS
SELECT
  ve.*,
  c.display_name as mentor_name,
  c.creator_type,
  c.status as mentor_status
FROM verified_entities ve
LEFT JOIN creators c ON ve.entity_id = c.id
WHERE ve.entity_type = 'mentor';

CREATE VIEW IF NOT EXISTS v_global_vietnamese_enriched AS
SELECT
  gv.*,
  ve.trust_score,
  ve.badge_type as verification_badge,
  ve.status as verification_status
FROM global_vietnamese gv
LEFT JOIN verified_entities ve ON gv.verified_entity_id = ve.id
WHERE gv.status = 'active';
