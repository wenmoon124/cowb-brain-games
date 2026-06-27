// @brainverse/game-engine — score calculation engine.
//
// Pure, stateless helpers that turn raw round data into the numeric score and
// accuracy figures reported by `BaseGame.getResults()` and POSTed to
// /api/scores. Extracted from BaseGame so they can be unit-tested in isolation
// and reused by the server-side re-validation path.

import type { Difficulty } from '@brainverse/shared';
import type { GameStats, GameRound } from './types.js';

/**
 * Difficulty multipliers applied to the raw per-round score. Harder
 * difficulties yield more points per correct answer.
 */
const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  easy: 1,
  medium: 1.5,
  hard: 2,
};

/** Maximum reaction time (ms) that still earns a speed bonus. */
const SPEED_BONUS_WINDOW_MS = 1500;
/** Maximum speed bonus added on top of the base per-round score. */
const MAX_SPEED_BONUS = 50;

/**
 * Score engine. Stateless — every method is a pure function over its inputs.
 * Kept as a class so it can be injected into a `BaseGame` instance and
 * mocked in tests.
 */
export class ScoreEngine {
  /**
   * Score a single round.
   *
   * - Wrong answer → 0 points.
   * - Correct answer → `BASE_POINTS * difficultyMultiplier` plus a linearly
   *   decaying speed bonus for reactions faster than
   *   {@link SPEED_BONUS_WINDOW_MS}.
   */
  calculateScore(
    correct: boolean,
    reactionMs: number | null,
    difficulty: Difficulty,
  ): number {
    if (!correct) {
      return 0;
    }
    const base = 100 * DIFFICULTY_MULTIPLIERS[difficulty];
    if (reactionMs === null || reactionMs <= 0) {
      return Math.round(base);
    }
    if (reactionMs >= SPEED_BONUS_WINDOW_MS) {
      return Math.round(base);
    }
    const speedBonus =
      MAX_SPEED_BONUS * (1 - reactionMs / SPEED_BONUS_WINDOW_MS);
    return Math.round(base + speedBonus);
  }

  /** Accuracy as a 0–1 fraction. Returns 0 when `total` is 0. */
  calculateAccuracy(correct: number, total: number): number {
    if (total <= 0) {
      return 0;
    }
    return correct / total;
  }

  /**
   * Average reaction time across the supplied reactions. `null` / non-positive
   * entries are skipped. Returns 0 if no valid reactions are present.
   */
  calculateAvgReaction(reactions: readonly (number | null)[]): number {
    let sum = 0;
    let count = 0;
    for (const r of reactions) {
      if (r !== null && r > 0) {
        sum += r;
        count += 1;
      }
    }
    if (count === 0) {
      return 0;
    }
    return Math.round(sum / count);
  }

  /**
   * Convenience: compute a full {@link GameStats} snapshot for a list of
   * rounds at a given difficulty. Used by `BaseGame.getResults()`.
   */
  computeStats(
    rounds: readonly GameRound[],
    difficulty: Difficulty,
  ): GameStats {
    let correctCount = 0;
    let wrongCount = 0;
    let score = 0;
    const reactions: (number | null)[] = [];
    for (const r of rounds) {
      if (r.correct) {
        correctCount += 1;
      } else {
        wrongCount += 1;
      }
      score += this.calculateScore(r.correct, r.reactionMs, difficulty);
      reactions.push(r.reactionMs);
    }
    return {
      totalRounds: rounds.length,
      correctCount,
      wrongCount,
      avgReactionMs: this.calculateAvgReaction(reactions),
      accuracy: this.calculateAccuracy(correctCount, rounds.length),
      score,
    };
  }
}
