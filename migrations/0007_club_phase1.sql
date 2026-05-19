-- 0007_club_phase1.sql
-- DSTS Club Phase 1 foundation migration
-- Scope: creators, creator_profiles, club_posts, club_talkshows, reward_catalog, club_waitlist
-- Status: write-only spec until backend lead approves staging run

CREATE TABLE IF NOT EXISTS creators (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  headline TEXT,
  creator_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  is_featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS creator_profiles (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL,
  bio_short TEXT,
  bio_long TEXT,
  hero_image_url TEXT,
  avatar_url TEXT,
  public_story_html TEXT,
  social_links_json TEXT,
  country_code TEXT,
  language_code TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES creators(id)
);

CREATE TABLE IF NOT EXISTS club_posts (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  body_html TEXT,
  cover_image_url TEXT,
  visibility_tier TEXT NOT NULL,
  content_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES creators(id)
);

CREATE TABLE IF NOT EXISTS club_talkshows (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  host_name TEXT,
  talkshow_type TEXT NOT NULL,
  access_tier TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  timezone TEXT NOT NULL,
  replay_rule TEXT NOT NULL DEFAULT 'none',
  status TEXT NOT NULL DEFAULT 'scheduled',
  ticket_price_vnd INTEGER,
  points_price INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES creators(id)
);

CREATE TABLE IF NOT EXISTS reward_catalog (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  reward_type TEXT NOT NULL,
  tier_required TEXT,
  points_cost INTEGER NOT NULL,
  inventory_mode TEXT NOT NULL DEFAULT 'static',
  status TEXT NOT NULL DEFAULT 'coming_soon',
  description_html TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS club_waitlist (
  id TEXT PRIMARY KEY,
  email TEXT,
  phone TEXT,
  full_name TEXT,
  interest_type TEXT NOT NULL,
  creator_slug TEXT,
  notes TEXT,
  source_route TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_creators_slug ON creators(slug);
CREATE INDEX IF NOT EXISTS idx_club_posts_creator_id ON club_posts(creator_id);
CREATE INDEX IF NOT EXISTS idx_club_posts_visibility_tier ON club_posts(visibility_tier);
CREATE INDEX IF NOT EXISTS idx_club_talkshows_creator_id ON club_talkshows(creator_id);
CREATE INDEX IF NOT EXISTS idx_club_talkshows_starts_at ON club_talkshows(starts_at);
CREATE INDEX IF NOT EXISTS idx_reward_catalog_slug ON reward_catalog(slug);
CREATE INDEX IF NOT EXISTS idx_club_waitlist_interest_type ON club_waitlist(interest_type);
