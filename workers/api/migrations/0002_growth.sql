-- migrations/0002_growth.sql
-- Description: Growth Engine — achievements, streaks, brain_pets, challenges
-- Date: 2026-06-25

-- ============ Achievements ============

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_achievements_unique ON achievements(user_id, achievement_id);

-- ============ Streaks ============

CREATE TABLE IF NOT EXISTS streaks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============ Brain Pets ============

CREATE TABLE IF NOT EXISTS brain_pets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  pet_type TEXT NOT NULL,
  pet_name TEXT,
  stage TEXT NOT NULL DEFAULT 'egg',
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============ Challenges ============

CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL,
  target_id TEXT,
  game_id TEXT NOT NULL,
  target_score INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  completed_at TEXT,
  result TEXT,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_challenges_creator ON challenges(creator_id);
CREATE INDEX IF NOT EXISTS idx_challenges_target ON challenges(target_id, status);
