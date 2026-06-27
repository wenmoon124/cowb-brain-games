// @brainverse/growth-engine — friend challenge lifecycle.
//
// Pure helpers for creating, completing and expiring challenges. The Workers
// API calls these from the /api/challenges routes; nothing here touches D1
// directly.

import type { Challenge, ChallengeResult } from '@brainverse/core';
import { ChallengeStatus } from '@brainverse/core';
import type { GameId, UserId } from '@brainverse/shared';

/** Challenges auto-expire if not accepted within this many milliseconds. */
const DEFAULT_ACCEPT_WINDOW_MS = 24 * 60 * 60 * 1000;
/** Accepted challenges auto-expire if not completed within this many ms. */
const DEFAULT_COMPLETE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Create a new challenge in the `pending` status. The caller persists the
 * returned record.
 */
export function createChallenge(
  creatorId: UserId,
  targetId: UserId,
  gameId: GameId,
  targetScore: number,
): Challenge {
  return {
    id: crypto.randomUUID(),
    creatorId,
    targetId,
    gameId,
    targetScore,
    status: ChallengeStatus.Pending,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Mark a challenge as completed and attach its result. Returns a new
 * immutable challenge record; does not mutate the input.
 */
export function completeChallenge(
  challenge: Challenge,
  result: ChallengeResult,
): Challenge {
  return {
    ...challenge,
    status: ChallengeStatus.Completed,
    completedAt: result.completedAt,
    result,
  };
}

/**
 * Whether a challenge has expired based on its current status and the
 * configured windows.
 *
 * - `pending`  : expired if not accepted within the accept window.
 * - `accepted` : expired if not completed within the complete window.
 * - `completed`/`expired`: never expire further (terminal states).
 */
export function isExpired(
  challenge: Challenge,
  now: number = Date.now(),
  options?: { acceptWindowMs?: number; completeWindowMs?: number },
): boolean {
  if (
    challenge.status === ChallengeStatus.Completed ||
    challenge.status === ChallengeStatus.Expired
  ) {
    return false;
  }

  const acceptWindow = options?.acceptWindowMs ?? DEFAULT_ACCEPT_WINDOW_MS;
  const completeWindow =
    options?.completeWindowMs ?? DEFAULT_COMPLETE_WINDOW_MS;
  const createdAtMs = Date.parse(challenge.createdAt);

  if (Number.isNaN(createdAtMs)) {
    return false;
  }

  if (challenge.status === ChallengeStatus.Pending) {
    return now - createdAtMs > acceptWindow;
  }

  // Accepted: window starts from createdAt for simplicity (could be from
  // acceptance timestamp if we persisted one).
  return now - createdAtMs > completeWindow;
}
