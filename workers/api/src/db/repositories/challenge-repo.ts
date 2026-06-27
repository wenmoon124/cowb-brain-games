import { Database } from '../database'
import type { Challenge, ChallengeCreate, ChallengeStatus } from '../types'

/**
 * Repository for the `challenges` table — friend-vs-friend game challenges.
 * Status transitions (`pending` → `accepted` → `completed`/`expired`) are
 * driven by the growth-engine and applied via {@link updateStatus}.
 */
export class ChallengeRepository {
  constructor(private readonly db: Database) {}

  /**
   * Insert a new challenge. `id` and `created_at` are filled by the
   * repository; `status` defaults to `'pending'`. Returns the created row.
   */
  async create(data: ChallengeCreate): Promise<Challenge> {
    const id = data.id ?? crypto.randomUUID()
    const now = new Date().toISOString()
    await this.db.execute(
      `INSERT INTO challenges
         (id, creator_id, target_id, game_id, target_score, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      id,
      data.creator_id,
      data.target_id ?? null,
      data.game_id,
      data.target_score ?? null,
      data.status ?? 'pending',
      now
    )
    const challenge = await this.db.queryOne<Challenge>(
      'SELECT * FROM challenges WHERE id = ?',
      id
    )
    if (!challenge) {
      throw new Error('Failed to create challenge: row not found after insert')
    }
    return challenge
  }

  /** Return all challenges created by a user, newest first. */
  async findByCreator(creatorId: string): Promise<Challenge[]> {
    return this.db.query<Challenge>(
      `SELECT * FROM challenges
       WHERE creator_id = ?
       ORDER BY created_at DESC`
    )
  }

  /** Return all challenges targeting a user (pending + accepted + completed), newest first. */
  async findByTarget(targetId: string): Promise<Challenge[]> {
    return this.db.query<Challenge>(
      `SELECT * FROM challenges
       WHERE target_id = ?
       ORDER BY created_at DESC`
    )
  }

  /**
   * Update a challenge's status (e.g. `pending` → `accepted`). Optionally
   * write `completed_at` and `result` at the same time (common when resolving
   * a challenge). Returns the updated row, or `null` if the id does not exist.
   */
  async updateStatus(
    id: string,
    status: ChallengeStatus,
    extras?: { completed_at?: string; result?: string }
  ): Promise<Challenge | null> {
    const sets: string[] = ['status = ?']
    const values: (string | number)[] = [status]

    if (extras?.completed_at !== undefined) {
      sets.push('completed_at = ?')
      values.push(extras.completed_at)
    }
    if (extras?.result !== undefined) {
      sets.push('result = ?')
      values.push(extras.result)
    }

    values.push(id)
    await this.db.execute(
      `UPDATE challenges SET ${sets.join(', ')} WHERE id = ?`,
      ...values
    )
    return this.db.queryOne<Challenge>('SELECT * FROM challenges WHERE id = ?', id)
  }
}
