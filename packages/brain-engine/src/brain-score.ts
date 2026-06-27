// PROTECTED SYSTEM — Do not modify without explicit approval
//
// @brainverse/brain-engine — Brain Score Formula.
//
// Aggregates recent game results into a single normalized 0–1000 Brain Score
// used for leaderboard ranking and identity-tier assignment.

import type { GameResult } from '@brainverse/core';

/**
 * Aggregated Brain Score output. `score` is the headline 0–1000 number;
 * `gamesConsidered` is how many of the input results factored into the
 * calculation (after dedup / windowing); `trend` is the delta vs. the previous
 * calculation, used for the dashboard sparkline.
 */
export interface BrainScoreResult {
  score: number;
  gamesConsidered: number;
  trend: number;
}

/**
 * Calculate the Brain Score from a window of recent game results.
 *
 * TODO(brain-engine): Replace placeholder with the production formula
 * (difficulty weighting + recency decay + per-dimension normalization). The
 * signature MUST NOT change without Lead Architect sign-off.
 */
export function calculateBrainScore(
  gameScores: readonly GameResult[],
): BrainScoreResult {
  // TODO: implement weighted recency-decay aggregation.
  if (gameScores.length === 0) {
    return { score: 0, gamesConsidered: 0, trend: 0 };
  }

  let sum = 0;
  for (const g of gameScores) {
    sum += g.score;
  }
  const avg = sum / gameScores.length;
  // Normalize a per-game score (typically 0–100) into the 0–1000 Brain Score
  // scale as an interim placeholder.
  const score = Math.round(avg * 10);

  return {
    score,
    gamesConsidered: gameScores.length,
    trend: 0,
  };
}
