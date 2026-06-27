import { Database } from '../database'
import type { BrainAgeResult, BrainAgeResultCreate } from '../types'

/**
 * Repository for the `brain_age_results` table. Each row is one completed
 * Brain Age assessment; `dimension_scores` is a JSON string the caller is
 * responsible for serializing before insert.
 */
export class BrainAgeRepository {
  constructor(private readonly db: Database) {}

  /**
   * Persist a brain age result. `id` and `created_at` are filled by the
   * repository. Returns the created row.
   */
  async create(data: BrainAgeResultCreate): Promise<BrainAgeResult> {
    const id = data.id ?? crypto.randomUUID()
    const now = new Date().toISOString()
    await this.db.execute(
      `INSERT INTO brain_age_results
         (id, user_id, brain_age, dimension_scores, test_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      id,
      data.user_id,
      data.brain_age,
      data.dimension_scores,
      data.test_date,
      now
    )
    const result = await this.db.queryOne<BrainAgeResult>(
      'SELECT * FROM brain_age_results WHERE id = ?',
      id
    )
    if (!result) {
      throw new Error('Failed to create brain age result: row not found after insert')
    }
    return result
  }

  /** Return all brain age results for a user, newest first. */
  async findByUser(userId: string): Promise<BrainAgeResult[]> {
    return this.db.query<BrainAgeResult>(
      `SELECT * FROM brain_age_results
       WHERE user_id = ?
       ORDER BY test_date DESC`
    )
  }
}
