/**
 * Database row types for BrainVerse D1 tables.
 *
 * Each interface mirrors a row returned by D1 exactly — field names use
 * snake_case to match the SQL column names so `SELECT *` results are
 * truthfully typed. INTEGER columns (including 0/1 booleans) map to `number`;
 * nullable TEXT columns map to `string | null`; JSON-stored TEXT columns
 * (e.g. `dimension_scores`, `permissions`, `faq`) stay as `string` and the
 * Repository layer is responsible for (de)serialization.
 *
 * Schema source of truth: workers/api/migrations/0001-0004.
 */

// ============ Shared scalar types ============

export type Locale = 'en' | 'zh' | 'ja'

export type GameDimension = 'memory' | 'attention' | 'reaction' | 'executive' | 'relaxation'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type UserRole = 'user' | 'admin'

export type PetStage = 'egg' | 'baby' | 'child' | 'adult'

export type ChallengeStatus = 'pending' | 'accepted' | 'completed' | 'expired'

// ============ users ============

/** Mirrors the `users` table (migration 0001). */
export interface User {
  id: string
  email: string
  password_hash: string
  nickname: string
  locale: Locale
  role: UserRole
  created_at: string
  updated_at: string
}

/** Input for creating a user. `id` and timestamps are filled by the repository. */
export interface UserCreate {
  id?: string
  email: string
  password_hash: string
  nickname: string
  locale?: Locale
  role?: UserRole
}

/** Partial input for updating a user. Only provided fields are written. */
export interface UserUpdate {
  email?: string
  password_hash?: string
  nickname?: string
  locale?: Locale
  role?: UserRole
}

// ============ sessions ============

/** Mirrors the `sessions` table (migration 0001). */
export interface Session {
  id: string
  user_id: string
  token: string
  expires_at: string
  created_at: string
}

/** Input for creating a session. `id` and `created_at` are filled by the repository. */
export interface SessionCreate {
  id?: string
  user_id: string
  token: string
  expires_at: string
}

// ============ games ============

/** Mirrors the `games` table (migration 0001). `is_active` is 0/1. */
export interface Game {
  id: string
  slug: string
  dimension: GameDimension
  name_key: string
  description_key: string
  icon: string | null
  is_active: number
  created_at: string
}

/** Input for creating a game. `id` and `created_at` are filled by the repository. */
export interface GameCreate {
  id?: string
  slug: string
  dimension: GameDimension
  name_key: string
  description_key: string
  icon?: string | null
  is_active?: number
}

// ============ scores ============

/** Mirrors the `scores` table (migration 0001). */
export interface Score {
  id: string
  user_id: string
  game_id: string
  score: number
  difficulty: Difficulty
  correct_count: number
  wrong_count: number
  avg_reaction_ms: number | null
  rounds_played: number
  played_at: string
}

/** Input for creating a score. `id` is filled by the repository. */
export interface ScoreCreate {
  id?: string
  user_id: string
  game_id: string
  score: number
  difficulty?: Difficulty
  correct_count?: number
  wrong_count?: number
  avg_reaction_ms?: number | null
  rounds_played?: number
  played_at: string
}

/** Leaderboard row — a score joined with the user's nickname. */
export interface LeaderboardEntry {
  id: string
  user_id: string
  game_id: string
  score: number
  difficulty: Difficulty
  correct_count: number
  wrong_count: number
  avg_reaction_ms: number | null
  rounds_played: number
  played_at: string
  nickname: string
}

// ============ brain_age_results ============

/** Mirrors the `brain_age_results` table (migration 0001).
 * `dimension_scores` is a JSON-encoded string. */
export interface BrainAgeResult {
  id: string
  user_id: string
  brain_age: number
  dimension_scores: string
  test_date: string
  created_at: string
}

/** Input for creating a brain age result. `id` and `created_at` are filled by the repository. */
export interface BrainAgeResultCreate {
  id?: string
  user_id: string
  brain_age: number
  dimension_scores: string
  test_date: string
}

// ============ achievements ============

/** Mirrors the `achievements` table (migration 0002). */
export interface Achievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
}

/** Input for creating an achievement. `id` and `unlocked_at` are filled by the repository. */
export interface AchievementCreate {
  id?: string
  user_id: string
  achievement_id: string
  unlocked_at?: string
}

// ============ streaks ============

/** Mirrors the `streaks` table (migration 0002). */
export interface Streak {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_active_date: string | null
  updated_at: string
}

/** Input for upserting a streak. `id` and `updated_at` are filled by the repository. */
export interface StreakUpsert {
  current_streak?: number
  longest_streak?: number
  last_active_date?: string | null
}

// ============ brain_pets ============

/** Mirrors the `brain_pets` table (migration 0002). */
export interface BrainPet {
  id: string
  user_id: string
  pet_type: string
  pet_name: string | null
  stage: PetStage
  xp: number
  level: number
  created_at: string
  updated_at: string
}

/** Input for upserting a brain pet. `id` and timestamps are filled by the repository. */
export interface BrainPetUpsert {
  pet_type?: string
  pet_name?: string | null
  stage?: PetStage
  xp?: number
  level?: number
}

// ============ challenges ============

/** Mirrors the `challenges` table (migration 0002). */
export interface Challenge {
  id: string
  creator_id: string
  target_id: string | null
  game_id: string
  target_score: number | null
  status: ChallengeStatus
  created_at: string
  completed_at: string | null
  result: string | null
}

/** Input for creating a challenge. `id` and `created_at` are filled by the repository. */
export interface ChallengeCreate {
  id?: string
  creator_id: string
  target_id?: string | null
  game_id: string
  target_score?: number | null
  status?: ChallengeStatus
}

// ============ articles ============

/** Mirrors the `articles` table (migration 0003). `published`/`featured` are 0/1. */
export interface Article {
  id: string
  slug: string
  category: string
  published: number
  featured: number
  sort_order: number
  created_at: string
  updated_at: string
}

/** Input for creating an article. `id` and timestamps are filled by the repository. */
export interface ArticleCreate {
  id?: string
  slug: string
  category: string
  published?: number
  featured?: number
  sort_order?: number
}

/** Input for updating an article. Only provided fields are written. */
export interface ArticleUpdate {
  slug?: string
  category?: string
  published?: number
  featured?: number
  sort_order?: number
}

// ============ article_translations ============

/** Mirrors the `article_translations` table (migration 0003). `faq` is a JSON-encoded string. */
export interface ArticleTranslation {
  id: string
  article_id: string
  locale: Locale
  title: string
  meta_description: string | null
  content: string
  faq: string | null
  created_at: string
  updated_at: string
}

/** Input for creating an article translation. `id` and timestamps are filled by the repository. */
export interface ArticleTranslationCreate {
  id?: string
  article_id: string
  locale: Locale
  title: string
  meta_description?: string | null
  content: string
  faq?: string | null
}

/** Article row joined with its translation for a specific locale. */
export interface ArticleWithTranslation extends Article {
  title: string
  meta_description: string | null
  content: string
  faq: string | null
}

// ============ seo_metadata ============

/** Mirrors the `seo_metadata` table (migration 0003). `json_ld` is a JSON-encoded string. */
export interface SeoMetadata {
  id: string
  entity_type: string
  entity_id: string
  locale: Locale
  title: string | null
  description: string | null
  og_image: string | null
  canonical_url: string | null
  json_ld: string | null
  created_at: string
}

/** Input for creating SEO metadata. `id` and `created_at` are filled by the repository. */
export interface SeoMetadataCreate {
  id?: string
  entity_type: string
  entity_id: string
  locale: Locale
  title?: string | null
  description?: string | null
  og_image?: string | null
  canonical_url?: string | null
  json_ld?: string | null
}

// ============ feature_flags ============

/** Mirrors the `feature_flags` table (migration 0004). `enabled` is 0/1. */
export interface FeatureFlag {
  id: string
  key: string
  label: string
  description: string | null
  enabled: number
  created_at: string
  updated_at: string
}

/** Input for creating a feature flag. `id` and timestamps are filled by the repository. */
export interface FeatureFlagCreate {
  id?: string
  key: string
  label: string
  description?: string | null
  enabled?: number
}

// ============ admin_users ============

/** Mirrors the `admin_users` table (migration 0004). `permissions` is a JSON-encoded string. */
export interface AdminUser {
  id: string
  user_id: string
  role: UserRole
  permissions: string
  created_at: string
}

/** Input for creating an admin user. `id` and `created_at` are filled by the repository. */
export interface AdminUserCreate {
  id?: string
  user_id: string
  role?: UserRole
  permissions?: string
}
