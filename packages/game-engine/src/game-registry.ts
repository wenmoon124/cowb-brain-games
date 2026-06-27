// @brainverse/game-engine — game registry.
//
// Central map of game slug → GameConfig. Populated at app boot by the
// frontend (and by the Workers API for server-side validation). Using a Map
// keeps lookups O(1) and lets us iterate in insertion order for the game hub.

import type { GameConfig } from '@brainverse/core';

/**
 * In-memory game configuration registry. Singleton-friendly: typically one
 * instance per app, populated once at boot.
 */
export class GameRegistry {
  private readonly games: Map<string, GameConfig> = new Map();

  /** Register a game config. Overwrites existing entries with the same slug. */
  register(config: GameConfig): void {
    this.games.set(config.slug, config);
  }

  /** Look up a game config by slug. Returns `undefined` if not registered. */
  get(slug: string): GameConfig | undefined {
    return this.games.get(slug);
  }

  /** All registered game configs, in insertion order. */
  getAll(): GameConfig[] {
    return Array.from(this.games.values());
  }

  /** Number of registered games. */
  get size(): number {
    return this.games.size;
  }

  /** Whether a game with the given slug is registered. */
  has(slug: string): boolean {
    return this.games.has(slug);
  }
}

/**
 * Default shared registry instance. Import this from the frontend and Workers
 * API; call `register()` for each game at boot.
 */
export const gameRegistry = new GameRegistry();
