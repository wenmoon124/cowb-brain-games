// @brainverse/game-engine — abstract base class for all BrainVerse games.
//
// Concrete games (Visual Search, Digit Span, Reaction Training, Stroop,
// Spatial Memory, Breathing Flow) extend this class and implement the
// lifecycle hooks. The base class owns the session state, the rolling stats
// and the ScoreEngine used to compute the final result.

import type {
  Difficulty,
  GameId,
  UserId,
} from '@brainverse/shared';
import type { GameResult } from '@brainverse/core';
import type { GameRound, GameSession, GameStats } from './types.js';
import { ScoreEngine } from './score-engine.js';

/**
 * Session lifecycle status.
 *
 * - `idle`     : constructed but `start()` not yet called.
 * - `running`  : rounds are being played.
 * - `paused`   : temporarily suspended via `pause()`.
 * - `finished` : `finish()` called; results are final.
 */
export type GameSessionStatus = 'idle' | 'running' | 'paused' | 'finished';

/**
 * Abstract base for every BrainVerse game.
 *
 * Subclasses are responsible for presenting stimuli, collecting responses and
 * pushing each completed round via {@link pushRound}. The base class handles
 * session bookkeeping, score computation and result emission.
 */
export abstract class BaseGame {
  /** Active session state. `null` until `start()` is called. */
  protected session: GameSession | null = null;
  /** Rolling stats; refreshed whenever a round is pushed. */
  protected stats: GameStats | null = null;
  /** Current lifecycle status. */
  protected status: GameSessionStatus = 'idle';
  /** Score engine used to compute {@link stats}. */
  protected readonly scoreEngine: ScoreEngine;

  constructor(scoreEngine?: ScoreEngine) {
    this.scoreEngine = scoreEngine ?? new ScoreEngine();
  }

  /** Begin a new session. Subclasses must call `beginSession()` to init state. */
  abstract start(): void;
  /** Temporarily halt the session (e.g. user navigated away). */
  abstract pause(): void;
  /** Resume from a paused state. */
  abstract resume(): void;
  /** End the session and finalize stats. Returns the final {@link GameStats}. */
  abstract finish(): GameStats;
  /** Return the final {@link GameResult} for POSTing to /api/scores. */
  abstract getResults(): GameResult;

  /** Initialize the session record. Called by `start()` implementations. */
  protected beginSession(
    gameId: GameId,
    userId: UserId,
    difficulty: Difficulty,
  ): void {
    this.session = {
      id: crypto.randomUUID(),
      gameId,
      userId,
      difficulty,
      startTime: Date.now(),
      endTime: null,
      rounds: [],
    };
    this.status = 'running';
    this.stats = {
      totalRounds: 0,
      correctCount: 0,
      wrongCount: 0,
      avgReactionMs: 0,
      accuracy: 0,
      score: 0,
    };
  }

  /**
   * Push a completed round into the session and refresh rolling stats.
   * Subclasses call this after evaluating the user's response.
   */
  protected pushRound(round: GameRound): void {
    if (this.session === null) {
      throw new Error('BaseGame.pushRound: session not started');
    }
    this.session.rounds.push(round);
    this.stats = this.scoreEngine.computeStats(
      this.session.rounds,
      this.session.difficulty,
    );
  }

  /** Mark the session as ended and freeze `endTime`. */
  protected endSession(): void {
    if (this.session === null) {
      throw new Error('BaseGame.endSession: session not started');
    }
    this.session.endTime = Date.now();
    this.status = 'finished';
  }

  /** Build a {@link GameResult} from the current session + stats. */
  protected buildResult(): GameResult {
    if (this.session === null || this.stats === null) {
      throw new Error('BaseGame.buildResult: session not started');
    }
    return {
      gameId: this.session.gameId,
      score: this.stats.score,
      difficulty: this.session.difficulty,
      correctCount: this.stats.correctCount,
      wrongCount: this.stats.wrongCount,
      avgReactionMs: this.stats.avgReactionMs,
      roundsPlayed: this.stats.totalRounds,
    };
  }

  /** Current session, if any. */
  getSession(): GameSession | null {
    return this.session;
  }

  /** Current rolling stats, if any. */
  getStats(): GameStats | null {
    return this.stats;
  }
}
