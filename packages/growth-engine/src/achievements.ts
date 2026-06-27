// @brainverse/growth-engine — achievement definitions and unlock evaluation.

import type {
  Achievement,
  AchievementDefinition,
} from '@brainverse/core';

/**
 * Aggregate user stats keyed by metric name. The values are the numeric
 * totals (e.g. `totalGamesPlayed`, `currentStreak`, `uniqueGamesPlayed`)
 * compared against achievement conditions.
 */
export type UserStats = Record<string, number>;

/**
 * The canonical achievement definition catalog. Each entry maps to an i18n
 * key pair (`nameKey` / `descriptionKey`) and a single numeric condition.
 *
 * Extend this array as new achievements are designed; do NOT change existing
 * ids once shipped (they are persisted on user records).
 */
export const achievementDefinitions: readonly AchievementDefinition[] = [
  {
    id: 'first-game',
    nameKey: 'achievements.first-game.name',
    descriptionKey: 'achievements.first-game.description',
    category: 'gameplay',
    condition: { metric: 'totalGamesPlayed', operator: '>=', threshold: 1 },
  },
  {
    id: 'ten-games',
    nameKey: 'achievements.ten-games.name',
    descriptionKey: 'achievements.ten-games.description',
    category: 'gameplay',
    condition: { metric: 'totalGamesPlayed', operator: '>=', threshold: 10 },
  },
  {
    id: 'fifty-games',
    nameKey: 'achievements.fifty-games.name',
    descriptionKey: 'achievements.fifty-games.description',
    category: 'gameplay',
    condition: { metric: 'totalGamesPlayed', operator: '>=', threshold: 50 },
  },
  {
    id: 'streak-3',
    nameKey: 'achievements.streak-3.name',
    descriptionKey: 'achievements.streak-3.description',
    category: 'consistency',
    condition: { metric: 'currentStreak', operator: '>=', threshold: 3 },
  },
  {
    id: 'streak-7',
    nameKey: 'achievements.streak-7.name',
    descriptionKey: 'achievements.streak-7.description',
    category: 'consistency',
    condition: { metric: 'currentStreak', operator: '>=', threshold: 7 },
  },
  {
    id: 'streak-30',
    nameKey: 'achievements.streak-30.name',
    descriptionKey: 'achievements.streak-30.description',
    category: 'consistency',
    condition: { metric: 'currentStreak', operator: '>=', threshold: 30 },
  },
  {
    id: 'explorer',
    nameKey: 'achievements.explorer.name',
    descriptionKey: 'achievements.explorer.description',
    category: 'milestone',
    condition: {
      metric: 'uniqueGamesPlayed',
      operator: '>=',
      threshold: 5,
    },
  },
  {
    id: 'social-butterfly',
    nameKey: 'achievements.social-butterfly.name',
    descriptionKey: 'achievements.social-butterfly.description',
    category: 'social',
    condition: {
      metric: 'challengesCompleted',
      operator: '>=',
      threshold: 5,
    },
  },
] as const;

/**
 * Evaluate a single condition against the user's stats. Returns `true` when
 * the user's value for the condition's metric satisfies the operator +
 * threshold.
 */
function evaluateCondition(
  condition: AchievementDefinition['condition'],
  stats: UserStats,
): boolean {
  const value = stats[condition.metric] ?? 0;
  switch (condition.operator) {
    case '>=':
      return value >= condition.threshold;
    case '>':
      return value > condition.threshold;
    case '==':
      return value === condition.threshold;
    case '<=':
      return value <= condition.threshold;
    case '<':
      return value < condition.threshold;
    default: {
      // Exhaustiveness check: if a new operator is added without a branch,
      // this never silently returns true.
      const _exhaustive: never = condition.operator;
      void _exhaustive;
      return false;
    }
  }
}

/**
 * Return all achievement definitions whose conditions are satisfied by the
 * supplied stats. Callers subtract the user's already-unlocked achievements
 * to determine newly-unlocked ones.
 */
export function checkUnlock(
  userStats: UserStats,
): AchievementDefinition[] {
  return achievementDefinitions.filter((def) =>
    evaluateCondition(def.condition, userStats),
  );
}

/**
 * Helper: subtract already-unlocked achievements from a list of qualifying
 * definitions, returning only the newly-unlocked ones. Useful for the
 * post-game unlock flow.
 */
export function findNewlyUnlocked(
  qualifying: readonly AchievementDefinition[],
  unlocked: readonly Achievement[],
): AchievementDefinition[] {
  const unlockedIds = new Set(unlocked.map((a) => a.achievementId));
  return qualifying.filter((def) => !unlockedIds.has(def.id));
}
