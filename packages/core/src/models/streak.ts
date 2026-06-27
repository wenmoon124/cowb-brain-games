// @brainverse/core — Daily streak tracking model.

import type { UserId } from '@brainverse/shared';

/**
 * A user's streak state. `lastActiveDate` is an ISO 8601 calendar date
 * (`YYYY-MM-DD`) in the user's locale timezone — not a full timestamp — so
 * streak math is unaffected by intra-day visit time.
 *
 * Mirrors the `streaks` D1 table.
 */
export interface Streak {
  id: string;
  userId: UserId;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  updatedAt: string;
}
