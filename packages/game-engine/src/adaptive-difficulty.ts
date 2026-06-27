// @brainverse/game-engine — adaptive difficulty controller.
//
// Sliding-window accuracy controller. After each round the host calls
// `adjustDifficulty(recentAccuracy)` with the user's accuracy over the last
// `windowSize` rounds; the controller nudges difficulty up or down within the
// configured bounds to keep the player in the challenge zone.

import type { Difficulty } from '@brainverse/shared';

/** Ordered difficulties, lowest to highest. */
const DIFFICULTY_ORDER: readonly Difficulty[] = ['easy', 'medium', 'hard'];

/**
 * Default size of the sliding window used to evaluate recent accuracy.
 * Exported as a constant so tests can assert against it.
 */
export const DEFAULT_WINDOW_SIZE = 10;

/** Increase difficulty when accuracy rises above this threshold. */
const PROMOTION_ACCURACY = 0.85;
/** Decrease difficulty when accuracy drops below this threshold. */
const DEMOTION_ACCURACY = 0.5;

/**
 * Adaptive difficulty controller.
 *
 * Maintains the current difficulty and a sliding window of recent round
 * outcomes. `adjustDifficulty` is called after each round with the user's
 * running accuracy over the window; it returns the (possibly changed)
 * difficulty for the next round.
 */
export class AdaptiveDifficulty {
  readonly windowSize: number;
  private current: Difficulty;
  private readonly min: Difficulty;
  private readonly max: Difficulty;
  private readonly recent: boolean[] = [];

  constructor(
    initial: Difficulty = 'easy',
    options?: {
      windowSize?: number;
      min?: Difficulty;
      max?: Difficulty;
    },
  ) {
    this.current = initial;
    this.windowSize = options?.windowSize ?? DEFAULT_WINDOW_SIZE;
    this.min = options?.min ?? 'easy';
    this.max = options?.max ?? 'hard';
  }

  /** Current difficulty tier. */
  get difficulty(): Difficulty {
    return this.current;
  }

  /**
   * Push a round outcome and re-evaluate difficulty. `correct` is whether the
   * user answered the round correctly. Returns the difficulty to use for the
   * next round.
   */
  adjustDifficulty(recentAccuracy: number): Difficulty {
    if (recentAccuracy >= PROMOTION_ACCURACY) {
      this.increaseDifficulty();
    } else if (recentAccuracy <= DEMOTION_ACCURACY) {
      this.decreaseDifficulty();
    }
    return this.current;
  }

  /** Push a single round outcome into the sliding window. */
  recordOutcome(correct: boolean): void {
    this.recent.push(correct);
    if (this.recent.length > this.windowSize) {
      this.recent.shift();
    }
  }

  /** Accuracy over the current window, as a 0–1 fraction. */
  windowAccuracy(): number {
    if (this.recent.length === 0) {
      return 0;
    }
    let correct = 0;
    for (const r of this.recent) {
      if (r) {
        correct += 1;
      }
    }
    return correct / this.recent.length;
  }

  /** Step difficulty up one tier, capped at {@link max}. */
  increaseDifficulty(): Difficulty {
    const idx = DIFFICULTY_ORDER.indexOf(this.current);
    const next = DIFFICULTY_ORDER[idx + 1];
    if (next !== undefined && DIFFICULTY_ORDER.indexOf(next) <= DIFFICULTY_ORDER.indexOf(this.max)) {
      this.current = next;
    }
    return this.current;
  }

  /** Step difficulty down one tier, floored at {@link min}. */
  decreaseDifficulty(): Difficulty {
    const idx = DIFFICULTY_ORDER.indexOf(this.current);
    const prev = DIFFICULTY_ORDER[idx - 1];
    if (prev !== undefined && DIFFICULTY_ORDER.indexOf(prev) >= DIFFICULTY_ORDER.indexOf(this.min)) {
      this.current = prev;
    }
    return this.current;
  }
}
