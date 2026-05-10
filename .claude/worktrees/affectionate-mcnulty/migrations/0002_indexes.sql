CREATE INDEX IF NOT EXISTS idx_contents_type
ON contents(type);

CREATE INDEX IF NOT EXISTS idx_contents_slug
ON contents(slug);

CREATE INDEX IF NOT EXISTS idx_contents_published
ON contents(published);

CREATE INDEX IF NOT EXISTS idx_contents_created
ON contents(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contents_type_published_created
ON contents(type, published, created_at DESC);
