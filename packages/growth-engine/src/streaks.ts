// @brainverse/growth-engine — daily streak logic.
//
// Streak math operates on calendar dates (YYYY-MM-DD) in the user's local
// timezone, not on timestamps, so a session at 23:59 and another at 00:01
// count as two consecutive days.

import type { Streak } from '@brainverse/core';

/** Number of milliseconds in one UTC day. Used for date arithmetic. */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Result of a streak calculation.
 *
 * - `currentStreak`: the new streak count after incorporating `today`.
 * - `isNewDay`: whether `today` advanced the streak (vs. being the same day).
 * - `isReset`: whether the streak was reset to 1 because the gap exceeded the
 *   grace period.
 */
export interface StreakCalculation {
  currentStreak: number;
  isNewDay: boolean;
  isReset: boolean;
}

/**
 * Parse a `YYYY-MM-DD` string into a UTC midnight timestamp. Returns `NaN` if
 * the input is not a valid ISO calendar date.
 */
function parseDate(d: string): number {
  // Date.UTC accepts (year, monthIndex, day). Splitting manually avoids
  // locale-dependent parsing of the input string.
  const parts = d.split('-');
  if (parts.length !== 3) {
    return Number.NaN;
  }
  const year = Number.parseInt(parts[0]!, 10);
  const month = Number.parseInt(parts[1]!, 10);
  const day = Number.parseInt(parts[2]!, 10);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return Number.NaN;
  }
  const ts = Date.UTC(year, month - 1, day);
  return ts;
}

/**
 * Whole-day difference between two `YYYY-MM-DD` dates. Positive when `b` is
 * later than `a`. Returns `NaN` if either input is invalid.
 */
function dayDiff(a: string, b: string): number {
  const ta = parseDate(a);
  const tb = parseDate(b);
  if (Number.isNaN(ta) || Number.isNaN(tb)) {
    return Number.NaN;
  }
  return Math.round((tb - ta) / MS_PER_DAY);
}

/**
 * Calculate the user's streak after a session on `today`.
 *
 * - Same calendar day as the last active date → streak unchanged.
 * - Exactly 1 day later → streak +1.
 * - Within the grace period (>1 day but <= gracePeriod) → streak +1 (grace
 *   day does not break the streak but does not count as a session either).
 * - Beyond the grace period → streak resets to 1 (today is the first day of a
 *   new streak).
 *
 * `gracePeriod` defaults to 1 (i.e. one missed day is forgiven).
 */
export function calculateStreak(
  lastActiveDate: string,
  today: string,
  gracePeriod = 1,
): StreakCalculation {
  const diff = dayDiff(lastActiveDate, today);
  if (Number.isNaN(diff)) {
    return { currentStreak: 1, isNewDay: true, isReset: true };
  }

  if (diff <= 0) {
    // Same day or clock-skew earlier: streak unchanged.
    return { currentStreak: 0, isNewDay: false, isReset: false };
  }

  if (diff === 1) {
    return { currentStreak: 1, isNewDay: true, isReset: false };
  }

  if (diff - 1 <= gracePeriod) {
    // Skipped day(s) within the grace window: continue the streak without
    // counting the gap as new days.
    return { currentStreak: 1, isNewDay: true, isReset: false };
  }

  return { currentStreak: 1, isNewDay: true, isReset: true };
}

/**
 * Whether a streak is considered broken given the current date.
 *
 * A streak is broken when the gap between `lastActiveDate` and `today` exceeds
 * `gracePeriod + 1` days (the +1 accounts for "today still counts").
 */
export function isBroken(
  streak: Pick<Streak, 'lastActiveDate'>,
  today: string,
  gracePeriod = 1,
): boolean {
  const diff = dayDiff(streak.lastActiveDate, today);
  if (Number.isNaN(diff)) {
    return true;
  }
  return diff > gracePeriod + 1;
}

/**
 * Token returned by {@link freezeStreak}. The Workers API persists this on
 * the streak row (`freezeCount -= 1`) when a user consumes a streak freeze.
 */
export interface StreakFreeze {
  usedAt: string;
  /** The calendar date the freeze was applied to (the missed day). */
  frozenDate: string;
}

/**
 * Consume a streak freeze for the supplied date. Pure function — does not
 * mutate any state; the caller persists the returned token and decrements the
 * user's freeze balance.
 */
export function freezeStreak(frozenDate: string): StreakFreeze {
  return {
    usedAt: new Date().toISOString(),
    frozenDate,
  };
}
