import { Database } from '../database'
import type { Achievement, AchievementCreate } from '../types'

/**
 * Repository for the `achievements` table. Each row records that a user
 * unlocked a specific achievement (identified by the growth-engine's
 * `achievement_id` string, e.g. `'first-game'`).
 */
export class AchievementRepository {
  constructor(private readonly db: Database) {}

  /** Return all achievements a user has unlocked, newest first. */
  async findByUser(userId: string): Promise<Achievement[]> {
    return this.db.query<Achievement>(
      `SELECT * FROM achievements
       WHERE user_id = ?
       ORDER BY unlocked_at DESC`
    )
  }

  /**
   * Insert an achievement-unlock row. `id` defaults to a fresh UUID and
   * `unlocked_at` defaults to now. Returns the created row.
   *
   * The unique index `(user_id, achievement_id)` guards against duplicate
   * unlocks — a duplicate insert will throw.
   */
  async create(data: AchievementCreate): Promise<Achievement> {
    const id = data.id ?? crypto.randomUUID()
    const unlockedAt = data.unlocked_at ?? new Date().toISOString()
    await this.db.execute(
      `INSERT INTO achievements (id, user_id, achievement_id, unlocked_at)
       VALUES (?, ?, ?, ?)`,
      id,
      data.user_id,
      data.achievement_id,
      unlockedAt
    )
    const achievement = await this.findByUserAndId(data.user_id, data.achievement_id)
    if (!achievement) {
      throw new Error('Failed to create achievement: row not found after insert')
    }
    return achievement
  }

  /**
   * Find a specific achievement for a user. Returns `null` if the user has
   * not unlocked it (or does not exist).
   */
  async findByUserAndId(
    userId: string,
    achievementId: string
  ): Promise<Achievement | null> {
    return this.db.queryOne<Achievement>(
      `SELECT * FROM achievements
       WHERE user_id = ? AND achievement_id = ?`,
      userId,
      achievementId
    )
  }
}
