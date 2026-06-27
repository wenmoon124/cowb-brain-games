// PROTECTED SYSTEM — Do not modify without explicit approval
//
// @brainverse/brain-engine — Brain Identity Formula.
//
// Maps a user's Brain Score, unlocked achievements and streak history to a
// discrete identity tier. Tiers drive the user's displayed title and badge.

import type { Achievement } from '@brainverse/core';
import type { Streak } from '@brainverse/core';

/**
 * Ordered identity tiers, lowest to highest. The string value is the stable
 * tier id persisted on the user profile; do NOT rename without a migration.
 */
export const IDENTITY_TIERS = [
  'novice',
  'explorer',
  'strategist',
  'master',
  'sage',
] as const;

export type IdentityTier = (typeof IDENTITY_TIERS)[number];

/**
 * Result of an identity-tier calculation. `tier` is the headline value;
 * `tierIndex` is the position in {@link IDENTITY_TIERS} (0-based) for progress-
 * bar math; `nextTierThreshold` is the Brain Score needed to advance, or
 * `null` if the user is already at the top tier.
 */
export interface IdentityTierResult {
  tier: IdentityTier;
  tierIndex: number;
  nextTierThreshold: number | null;
}

const TIER_THRESHOLDS: readonly number[] = [0, 200, 400, 650, 900] as const;

/**
 * Calculate the user's identity tier from Brain Score, achievement count and
 * streak length.
 *
 * TODO(brain-engine): Replace placeholder with the production formula (the
 * real one weights achievements and streaks as multipliers, not just the Brain
 * Score thresholds). The signature MUST NOT change without Lead Architect
 * sign-off.
 */
export function calculateIdentityTier(
  brainScore: number,
  achievements: readonly Achievement[],
  streaks: readonly Streak[],
): IdentityTierResult {
  // TODO: incorporate achievements.length and streak length as bonus weights.
  void achievements;
  void streaks;

  let tierIndex = 0;
  for (let i = 0; i < TIER_THRESHOLDS.length; i += 1) {
    if (brainScore >= TIER_THRESHOLDS[i]!) {
      tierIndex = i;
    }
  }

  const tier = IDENTITY_TIERS[tierIndex]!;
  const nextThreshold =
    tierIndex < TIER_THRESHOLDS.length - 1
      ? (TIER_THRESHOLDS[tierIndex + 1] ?? null)
      : null;

  return {
    tier,
    tierIndex,
    nextTierThreshold: nextThreshold,
  };
}
