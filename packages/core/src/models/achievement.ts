// @brainverse/core — Achievement definitions and unlocked instances.

import type { UserId } from '@brainverse/shared';

/**
 * High-level grouping for the achievements page UI and for filtering which
 * definitions apply to a given subsystem (gameplay vs. consistency vs.
 * social).
 */
export type AchievementCategory =
  | 'gameplay'
  | 'consistency'
  | 'social'
  | 'milestone';

/**
 * Comparison operator used by an achievement condition. Kept as a small union
 * so the growth-engine evaluator can branch exhaustively.
 */
export type AchievementConditionOperator =
  | '>='
  | '>'
  | '=='
  | '<='
  | '<';

/**
 * A single numeric threshold condition, e.g.
 * `{ metric: 'totalGamesPlayed', operator: '>=', threshold: 50 }`.
 *
 * More complex multi-condition rules can be represented by registering
 * multiple definitions with the same `id` suffix, or by extending this type
 * later — keeping it simple for MVP.
 */
export interface AchievementCondition {
  metric: string;
  operator: AchievementConditionOperator;
  threshold: number;
}

/**
 * Static definition of an achievement, registered in the growth-engine.
 * `nameKey` / `descriptionKey` are i18n message keys.
 */
export interface AchievementDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  category: AchievementCategory;
  condition: AchievementCondition;
}

/**
 * An unlocked achievement instance for a specific user. Mirrors the
 * `achievements` D1 table.
 */
export interface Achievement {
  id: string;
  userId: UserId;
  achievementId: string;
  unlockedAt: string;
}
