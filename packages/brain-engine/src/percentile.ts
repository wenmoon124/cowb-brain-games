// PROTECTED SYSTEM — Do not modify without explicit approval
//
// @brainverse/brain-engine — Percentile Formula.
//
// Computes where a user's score sits within a reference population
// distribution. Used by Brain Age result page, leaderboards, and identity-tier
// evaluation.

/**
 * Statistical description of the reference population. Either provide
 * `mean` + `stdDev` (assumes normal distribution) or a raw `sample` of scores
 * from which the engine computes the empirical percentile.
 */
export interface PopulationDistribution {
  mean?: number;
  stdDev?: number;
  sample?: readonly number[];
}

/**
 * Result of a percentile calculation. `percentile` is the 0–100 rank (e.g.
 * 87 means the user scored higher than 87% of the population); `zScore` is the
 * standard-normal z when a parametric distribution was supplied (NaN
 * otherwise).
 */
export interface PercentileResult {
  percentile: number;
  zScore: number;
}

/**
 * Calculate the percentile of `userScore` within `populationDistribution`.
 *
 * TODO(brain-engine): Replace placeholder with the production algorithm
 * (parametric for normal inputs, empirical rank for sample inputs). The
 * signature MUST NOT change without Lead Architect sign-off.
 */
export function calculatePercentile(
  userScore: number,
  populationDistribution: PopulationDistribution,
): PercentileResult {
  // TODO: implement parametric (mean/stdDev) and empirical (sample) branches.
  if (
    populationDistribution.mean !== undefined &&
    populationDistribution.stdDev !== undefined &&
    populationDistribution.stdDev > 0
  ) {
    const z =
      (userScore - populationDistribution.mean) / populationDistribution.stdDev;
    // Placeholder normal-CDF approximation (not the calibrated formula).
    const percentile = Math.round(clampedNormalCdf(z) * 100);
    return { percentile, zScore: z };
  }

  if (populationDistribution.sample && populationDistribution.sample.length > 0) {
    const sample = populationDistribution.sample;
    let below = 0;
    for (const s of sample) {
      if (s < userScore) {
        below += 1;
      }
    }
    const percentile = Math.round((below / sample.length) * 100);
    return { percentile, zScore: Number.NaN };
  }

  return { percentile: 50, zScore: 0 };
}

/**
 * Placeholder standard-normal CDF via the Abramowitz–Stegun approximation.
 * TODO(brain-engine): replace with the calibrated lookup table.
 */
function clampedNormalCdf(z: number): number {
  const clamped = Math.max(-10, Math.min(10, z));
  const t = 1 / (1 + 0.2316419 * Math.abs(clamped));
  const d = 0.3989423 * Math.exp((-clamped * clamped) / 2);
  const prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  const cdf = clamped > 0 ? 1 - prob : prob;
  return Math.max(0, Math.min(1, cdf));
}
