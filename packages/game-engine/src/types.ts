// @brainverse/game-engine — session, round and stats types.

import type {
  Difficulty,
  GameId,
  UserId,
} from '@brainverse/shared';

/**
 * A single round within a game session. `stimulus` is the input the game
 * presented to the user (e.g. a color word, a digit sequence); `response` is
 * what the user answered. Both are kept as strings so any game can store its
 * own representation without coupling the engine to a specific game schema.
 *
 * `correct` is the engine-evaluated correctness flag; `reactionMs` is the
 * user's response latency in milliseconds (`null` if no response / timeout).
 */
export interface GameRound {
  roundNumber: number;
  stimulus: string;
  response: string;
  correct: boolean;
  reactionMs: number | null;
}

/**
 * State of a game session. `startTime` / `endTime` are epoch milliseconds;
 * `endTime` is `null` while the session is in progress. `rounds` is the
 * ordered list of completed rounds.
 */
export interface GameSession {
  id: string;
  gameId: GameId;
  userId: UserId;
  difficulty: Difficulty;
  startTime: number;
  endTime: number | null;
  rounds: GameRound[];
}

/**
 * Aggregate statistics derived from a session's rounds. `accuracy` is a 0–1
 * fraction; `avgReactionMs` averages only rounds that had a response.
 */
export interface GameStats {
  totalRounds: number;
  correctCount: number;
  wrongCount: number;
  avgReactionMs: number;
  accuracy: number;
  score: number;
}
