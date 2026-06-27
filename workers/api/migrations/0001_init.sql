-- migrations/0001_init.sql
-- Description: Initial schema — users, sessions, games, scores, brain_age_results
-- Date: 2026-06-25

-- ============ Users ============

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nickname TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============ Sessions ============

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- ============ Games ============

CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  dimension TEXT NOT NULL,
  name_key TEXT NOT NULL,
  description_key TEXT NOT NULL,
  icon TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);

-- ============ Scores ============

CREATE TABLE IF NOT EXISTS scores (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  game_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  correct_count INTEGER NOT NULL DEFAULT 0,
  wrong_count INTEGER NOT NULL DEFAULT 0,
  avg_reaction_ms INTEGER,
  rounds_played INTEGER NOT NULL DEFAULT 1,
  played_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_scores_user ON scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_game ON scores(game_id);
CREATE INDEX IF NOT EXISTS idx_scores_played ON scores(played_at DESC);

-- ============ Brain Age Results ============

CREATE TABLE IF NOT EXISTS brain_age_results (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  brain_age INTEGER NOT NULL,
  dimension_scores TEXT NOT NULL,
  test_date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_brain_age_user ON brain_age_results(user_id);
