CREATE TABLE IF NOT EXISTS contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'post',

  title TEXT,
  title_vi TEXT,
  title_en TEXT,

  excerpt TEXT,
  excerpt_vi TEXT,
  excerpt_en TEXT,

  content TEXT,
  content_vi TEXT,
  content_en TEXT,

  cover TEXT,
  cover_url TEXT,

  tags TEXT,

  published INTEGER NOT NULL DEFAULT 1,

  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),

  CHECK (published IN (0,1))
);
