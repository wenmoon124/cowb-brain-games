-- migrations/0004_admin.sql
-- Description: Admin — feature_flags, admin_users
-- Date: 2026-06-25

-- ============ Feature Flags ============

CREATE TABLE IF NOT EXISTS feature_flags (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  enabled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- ============ Admin Users ============

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
