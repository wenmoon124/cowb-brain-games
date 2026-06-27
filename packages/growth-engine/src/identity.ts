// @brainverse/growth-engine — identity tier system.
//
// Lightweight tier calculation for the growth subsystem. Mirrors the tier
// ladder in brain-engine but takes the already-computed Brain Score as input,
// so growth-engine does not depend on brain-engine (one-way dependency
// graph). The two implementations must stay in sync — when thresholds change,
// update both.

import type { Achievement, Streak } from '@brainverse/core';

/**
 * Identity tier definition. `id` is the stable tier identifier; `nameKey` /
 * `descriptionKey` are i18n keys; `minBrainScore` is the threshold to reach
 * this tier; `titleKey` is the localized honorific title shown on the profile.
 */
export interface IdentityTierDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  titleKey: string;
  minBrainScore: number;
}

/**
 * Ordered identity tiers, lowest to highest. Do NOT change ids once shipped.
 */
export const identityTiers: readonly IdentityTierDefinition[] = [
  {
    id: 'novice',
    nameKey: 'identity.novice.name',
    descriptionKey: 'identity.novice.description',
    titleKey: 'identity.novice.title',
    minBrainScore: 0,
  },
  {
    id: 'explorer',
    nameKey: 'identity.explorer.name',
    descriptionKey: 'identity.explorer.description',
    titleKey: 'identity.explorer.title',
    minBrainScore: 200,
  },
  {
    id: 'strategist',
    nameKey: 'identity.strategist.name',
    descriptionKey: 'identity.strategist.description',
    titleKey: 'identity.strategist.title',
    minBrainScore: 400,
  },
  {
    id: 'master',
    nameKey: 'identity.master.name',
    descriptionKey: 'identity.master.description',
    titleKey: 'identity.master.title',
    minBrainScore: 650,
  },
  {
    id: 'sage',
    nameKey: 'identity.sage.name',
    descriptionKey: 'identity.sage.description',
    titleKey: 'identity.sage.title',
    minBrainScore: 900,
  },
] as const;

/** Tier id type derived from {@link identityTiers}. */
export type IdentityTierId = (typeof identityTiers)[number]['id'];

/**
 * Resolve the tier a user belongs to based on their Brain Score. Achievements
 * and streaks are accepted so this signature can stay stable when the
 * formula grows to weight them; for now they are not used in the calculation.
 */
export function calculateTier(
  brainScore: number,
  achievements?: readonly Achievement[],
  streaks?: readonly Streak[],
): IdentityTierDefinition {
  // Reserved for future weighted formula.
  void achievements;
  void streaks;

  let result = identityTiers[0]!;
  for (const tier of identityTiers) {
    if (brainScore >= tier.minBrainScore) {
      result = tier;
    }
  }
  return result;
}

/**
 * Resolve the localized title key for a tier id. Returns the key for the
 * lowest tier if the id is unknown (defensive — should not happen for ids
 * sourced from {@link identityTiers}).
 */
export function getTitle(tier: IdentityTierId): string {
  const found = identityTiers.find((t) => t.id === tier);
  return (found ?? identityTiers[0]!).titleKey;
}
