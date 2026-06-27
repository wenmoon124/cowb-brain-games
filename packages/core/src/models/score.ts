// @brainverse/core — Score persistence models.

import type {
  Difficulty,
  GameId,
  ScoreId,
  UserId,
} from '@brainverse/shared';

/**
 * A persisted score row. Mirrors the `scores` D1 table. `playedAt` is the
 * ISO 8601 timestamp the game was completed (set client-side) — distinct from
 * any DB `insertedAt` which is set server-side.
 */
export interface Score {
  id: ScoreId;
  userId: UserId;
  gameId: GameId;
  score: number;
  difficulty: Difficulty;
  correctCount: number;
  wrongCount: number;
  avgReactionMs: number;
  roundsPlayed: number;
  playedAt: string;
}

/**
 * Input payload for `POST /api/scores`. The server derives `id`, `userId`
 * (from session) and persists `playedAt` from the request body — the client
 * stamps completion time.
 */
export interface ScoreInput {
  gameId: GameId;
  score: number;
  difficulty: Difficulty;
  correctCount: number;
  wrongCount: number;
  avgReactionMs: number;
  roundsPlayed: number;
  playedAt: string;
}
