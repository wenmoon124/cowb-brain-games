// PROTECTED SYSTEM — Do not modify without explicit approval
//
// @brainverse/brain-engine — Growth Rate Formula.
//
// Quantifies how quickly a user is improving over time. Combines training
// consistency (how regularly they play) with score growth (how much their
// per-game scores are trending up). Used by the dashboard "growth" widget and
// by the Brain Pet XP engine.

/**
 * Inputs to the growth-rate calculation.
 *
 * - `trainingConsistency`: 0–1, fraction of expected sessions completed in the
 *   window (e.g. 7 sessions / 7 days = 1.0).
 * - `scoreGrowth`: signed delta of average score vs. the previous window
 *   (positive = improving).
 */
export interface GrowthRateInput {
  trainingConsistency: number;
  scoreGrowth: number;
}

/**
 * Result of a growth-rate calculation. `rate` is a signed percentage (positive
 * = improving, negative = declining); `consistency` and `scoreGrowth` are
 * echoed back for transparent UI breakdowns.
 */
export interface GrowthRateResult {
  rate: number;
  consistency: number;
  scoreGrowth: number;
}

/**
 * Calculate the user's growth rate from training consistency and score growth.
 *
 * TODO(brain-engine): Replace placeholder linear blend with the calibrated
 * formula. The signature MUST NOT change without Lead Architect sign-off.
 */
export function calculateGrowthRate(
  trainingConsistency: number,
  scoreGrowth: number,
): GrowthRateResult {
  // TODO: implement the calibrated non-linear formula.
  const clampedConsistency = Math.max(0, Math.min(1, trainingConsistency));
  const consistencyPct = clampedConsistency * 100;
  // Placeholder: growth rate is a 70/30 blend of consistency and score growth.
  const rate = Math.round(consistencyPct * 0.7 + scoreGrowth * 0.3);

  return {
    rate,
    consistency: clampedConsistency,
    scoreGrowth,
  };
}
