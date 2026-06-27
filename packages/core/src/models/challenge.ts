// @brainverse/core — Friend challenge model.

import type { GameId, UserId } from '@brainverse/shared';

/**
 * Lifecycle status of a challenge.
 *
 * - `pending`   : created, awaiting acceptance by the target.
 * - `accepted`  : target accepted, both sides can play.
 * - `completed` : both sides finished (or one side finished + grace expired).
 * - `expired`   : not accepted in time, or not completed within the window.
 */
export const ChallengeStatus = {
  Pending: 'pending',
  Accepted: 'accepted',
  Completed: 'completed',
  Expired: 'expired',
} as const;

export type ChallengeStatus =
  (typeof ChallengeStatus)[keyof typeof ChallengeStatus];

/**
 * Final result of a completed challenge. `winnerId` is `null` for a draw.
 * `creatorScore` / `targetScore` are the final scores each side achieved.
 */
export interface ChallengeResult {
  winnerId: UserId | null;
  creatorScore: number;
  targetScore: number;
  completedAt: string;
}

/**
 * A friend-vs-friend challenge record. Mirrors the `challenges` D1 table.
 *
 * `completedAt` and `result` are only present when `status === 'completed'`;
 * they are modeled as optional rather than part of a discriminated union to
 * keep the D1 row mapping flat. With `exactOptionalPropertyTypes`, callers
 * must omit these fields rather than set them to `undefined`.
 */
export interface Challenge {
  id: string;
  creatorId: UserId;
  targetId: UserId;
  gameId: GameId;
  targetScore: number;
  status: ChallengeStatus;
  createdAt: string;
  completedAt?: string;
  result?: ChallengeResult;
}
