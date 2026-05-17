CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'website',
  subscribed INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);
