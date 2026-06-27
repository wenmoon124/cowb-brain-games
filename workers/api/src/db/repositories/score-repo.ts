import { Database } from '../database'
import type { Score, ScoreCreate, LeaderboardEntry } from '../types'

/**
 * Repository for the `scores` table. Owns score insertion and the per-user
 * history + leaderboard read paths.
 */
export class ScoreRepository {
  constructor(private readonly db: Database) {}

  /**
   * Insert a score. `id` is filled by the repository; the remaining fields
   * default to their SQL defaults when omitted. Returns the created row.
   */
  async create(data: ScoreCreate): Promise<Score> {
    const id = data.id ?? crypto.randomUUID()
    await this.db.execute(
      `INSERT INTO scores
         (id, user_id, game_id, score, difficulty, correct_count, wrong_count,
          avg_reaction_ms, rounds_played, played_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      data.user_id,
      data.game_id,
      data.score,
      data.difficulty ?? 'medium',
      data.correct_count ?? 0,
      data.wrong_count ?? 0,
      data.avg_reaction_ms ?? null,
      data.rounds_played ?? 1,
      data.played_at
    )
    const score = await this.db.queryOne<Score>('SELECT * FROM scores WHERE id = ?', id)
    if (!score) {
      throw new Error('Failed to create score: row not found after insert')
    }
    return score
  }

  /**
   * Page through a user's scores, newest first. `limit` is clamped to a
   * sensible max and `offset` is derived from page number.
   */
  async findByUser(userId: string, limit: number, offset: number): Promise<Score[]> {
    const safeLimit = Math.max(1, Math.min(100, limit))
    const safeOffset = Math.max(0, offset)
    return this.db.query<Score>(
      `SELECT * FROM scores
       WHERE user_id = ?
       ORDER BY played_at DESC
       LIMIT ? OFFSET ?`,
      userId,
      safeLimit,
      safeOffset
    )
  }

  /**
   * Top scores for a game, joined with the user's nickname for display.
   * Ordered by score descending.
   */
  async findLeaderboard(gameId: string, limit: number): Promise<LeaderboardEntry[]> {
    const safeLimit = Math.max(1, Math.min(100, limit))
    return this.db.query<LeaderboardEntry>(
      `SELECT s.id, s.user_id, s.game_id, s.score, s.difficulty,
              s.correct_count, s.wrong_count, s.avg_reaction_ms,
              s.rounds_played, s.played_at, u.nickname
       FROM scores s
       JOIN users u ON s.user_id = u.id
       WHERE s.game_id = ?
       ORDER BY s.score DESC
       LIMIT ?`,
      gameId,
      safeLimit
    )
  }
}
