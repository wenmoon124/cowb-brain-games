// @brainverse/core — Game catalog + per-session result models.

import type {
  Difficulty,
  GameDimension,
  GameId,
} from '@brainverse/shared';

/**
 * A game entry in the catalog. `nameKey` / `descriptionKey` are i18n message
 * keys resolved by the frontend (e.g. `games.visual_search.name`) so the same
 * record serves all three locales. `icon` is a lucide-react icon name.
 */
export interface Game {
  id: GameId;
  slug: string;
  dimension: GameDimension;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  isActive: boolean;
}

/**
 * Result of a single completed game session, produced locally by the
 * game-engine and POSTed to /api/scores. Contains everything needed to score,
 * rank and update Brain Age / Growth subsystems.
 */
export interface GameResult {
  gameId: GameId;
  score: number;
  difficulty: Difficulty;
  correctCount: number;
  wrongCount: number;
  avgReactionMs: number;
  roundsPlayed: number;
}

/**
 * Static configuration for a game, used by the game-engine registry and the
 * adaptive difficulty controller. `minDifficulty` / `maxDifficulty` define the
 * allowed difficulty range the adaptive system can move within.
 */
export interface GameConfig {
  slug: string;
  dimension: GameDimension;
  nameKey: string;
  minDifficulty: Difficulty;
  maxDifficulty: Difficulty;
}
