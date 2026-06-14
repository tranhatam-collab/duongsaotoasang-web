-- DSTS Payment System
-- Migration 0018 — 2026-06-14

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'VND',
  description TEXT NOT NULL,
  type TEXT DEFAULT 'donation' CHECK(type IN ('donation','membership','sponsorship','tip')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','completed','failed','refunded')),
  provider TEXT,
  provider_transaction_id TEXT,
  receipt_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_user ON payments(user_id);
CREATE INDEX idx_payment_status ON payments(status);

-- Ensure users table exists for auth
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK(role IN ('member','creator','mentor','sponsor','admin')),
  status TEXT DEFAULT 'active' CHECK(status IN ('active','suspended','deleted')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
