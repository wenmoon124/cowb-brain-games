import { Database } from '../database'
import type { Session, SessionCreate } from '../types'

/**
 * Repository for the `sessions` table. Note that the API also stores sessions
 * in the SESSIONS KV namespace for fast lookups; this table is the durable
 * fallback / audit trail.
 */
export class SessionRepository {
  constructor(private readonly db: Database) {}

  /** Insert a session row. `id` and `created_at` are filled by the repository. */
  async create(data: SessionCreate): Promise<Session> {
    const id = data.id ?? crypto.randomUUID()
    const now = new Date().toISOString()
    await this.db.execute(
      `INSERT INTO sessions (id, user_id, token, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      id,
      data.user_id,
      data.token,
      data.expires_at,
      now
    )
    const session = await this.findByToken(data.token)
    if (!session) {
      throw new Error('Failed to create session: row not found after insert')
    }
    return session
  }

  /** Look up a session by its (unique) token. Returns `null` if not found. */
  async findByToken(token: string): Promise<Session | null> {
    return this.db.queryOne<Session>('SELECT * FROM sessions WHERE token = ?', token)
  }

  /** Delete a session by token. Returns whether a row was deleted. */
  async delete(token: string): Promise<boolean> {
    const result = await this.db.execute('DELETE FROM sessions WHERE token = ?', token)
    return (result.meta.changes ?? 0) > 0
  }

  /**
   * Delete all sessions whose `expires_at` is in the past. Returns the number
   * of deleted rows. Intended to be called by a scheduled cleanup job.
   */
  async deleteExpired(): Promise<number> {
    const now = new Date().toISOString()
    const result = await this.db.execute('DELETE FROM sessions WHERE expires_at < ?', now)
    return result.meta.changes ?? 0
  }
}
