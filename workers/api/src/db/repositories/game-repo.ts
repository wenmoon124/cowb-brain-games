import { Database } from '../database'
import type { Game } from '../types'

/**
 * Repository for the `games` table (the game catalog). Read-heavy — the
 * catalog is effectively static at runtime and changes only via migrations
 * or admin tooling.
 */
export class GameRepository {
  constructor(private readonly db: Database) {}

  /** Return all games, active first then by slug for stable ordering. */
  async findAll(): Promise<Game[]> {
    return this.db.query<Game>(
      `SELECT * FROM games
       ORDER BY is_active DESC, slug ASC`
    )
  }

  /** Find a game by its (unique) slug. Returns `null` if not found. */
  async findBySlug(slug: string): Promise<Game | null> {
    return this.db.queryOne<Game>('SELECT * FROM games WHERE slug = ?', slug)
  }
}
