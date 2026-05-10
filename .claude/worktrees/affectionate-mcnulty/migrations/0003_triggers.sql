CREATE TRIGGER IF NOT EXISTS trg_contents_updated_at
AFTER UPDATE ON contents
FOR EACH ROW
BEGIN
  UPDATE contents
  SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
  WHERE id = OLD.id;
END;
