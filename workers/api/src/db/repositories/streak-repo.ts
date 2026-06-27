import { Database } from '../database'
import type { Streak, StreakUpsert } from '../types'

/**
 * Repository for the `streaks` table. There is at most one row per user
 * (enforced by the `user_id` UNIQUE constraint); use {@link upsert} to
 * create-or-update it atomically.
 */
export class StreakRepository {
  constructor(private readonly db: Database) {}

  /** Return a user's streak row, or `null` if none exists yet. */
  async findByUser(userId: string): Promise<Streak | null> {
    return this.db.queryOne<Streak>('SELECT * FROM streaks WHERE user_id = ?', userId)
  }

  /**
   * Insert-or-update a user's streak. Only the fields present on `data` are
   * written on update; `updated_at` is always bumped. On insert, a new row
   * with `id` and default streak counters is created.
   *
   * Returns the resulting row.
   */
  async upsert(userId: string, data: StreakUpsert): Promise<Streak> {
    const now = new Date().toISOString()
    const existing = await this.findByUser(userId)

    if (!existing) {
      const id = crypto.randomUUID()
      await this.db.execute(
        `INSERT INTO streaks
           (id, user_id, current_streak, longest_streak, last_active_date, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        id,
        userId,
        data.current_streak ?? 0,
        data.longest_streak ?? 0,
        data.last_active_date ?? null,
        now
      )
    } else {
      const sets: string[] = []
      const values: (string | number | null)[] = []

      if (data.current_streak !== undefined) {
        sets.push('current_streak = ?')
        values.push(data.current_streak)
      }
      if (data.longest_streak !== undefined) {
        sets.push('longest_streak = ?')
        values.push(data.longest_streak)
      }
      if (data.last_active_date !== undefined) {
        sets.push('last_active_date = ?')
        values.push(data.last_active_date)
      }

      // Nothing to update except the timestamp — still bump it.
      sets.push('updated_at = ?')
      values.push(now)
      values.push(userId)

      await this.db.execute(
        `UPDATE streaks SET ${sets.join(', ')} WHERE user_id = ?`,
        ...values
      )
    }

    const result = await this.findByUser(userId)
    if (!result) {
      throw new Error('Failed to upsert streak: row not found after write')
    }
    return result
  }
}
