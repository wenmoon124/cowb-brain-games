import { Database } from '../database'
import type { BrainPet, BrainPetUpsert } from '../types'

/**
 * Repository for the `brain_pets` table. There is at most one pet per user
 * (enforced by the `user_id` UNIQUE constraint); use {@link upsert} to
 * create-or-update it atomically.
 */
export class BrainPetRepository {
  constructor(private readonly db: Database) {}

  /** Return a user's brain pet, or `null` if they have not adopted one yet. */
  async findByUser(userId: string): Promise<BrainPet | null> {
    return this.db.queryOne<BrainPet>('SELECT * FROM brain_pets WHERE user_id = ?', userId)
  }

  /**
   * Insert-or-update a user's brain pet. On insert, `pet_type` is required
   * (defaults to `'fox'` if omitted on first creation is rejected — caller
   * must supply it). On update, only the fields present on `data` are
   * written; `updated_at` is always bumped.
   *
   * Returns the resulting row.
   */
  async upsert(userId: string, data: BrainPetUpsert): Promise<BrainPet> {
    const now = new Date().toISOString()
    const existing = await this.findByUser(userId)

    if (!existing) {
      if (!data.pet_type) {
        throw new Error('Cannot create brain pet: pet_type is required on first creation')
      }
      const id = crypto.randomUUID()
      await this.db.execute(
        `INSERT INTO brain_pets
           (id, user_id, pet_type, pet_name, stage, xp, level, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        userId,
        data.pet_type,
        data.pet_name ?? null,
        data.stage ?? 'egg',
        data.xp ?? 0,
        data.level ?? 1,
        now,
        now
      )
    } else {
      const sets: string[] = []
      const values: (string | number | null)[] = []

      if (data.pet_type !== undefined) {
        sets.push('pet_type = ?')
        values.push(data.pet_type)
      }
      if (data.pet_name !== undefined) {
        sets.push('pet_name = ?')
        values.push(data.pet_name)
      }
      if (data.stage !== undefined) {
        sets.push('stage = ?')
        values.push(data.stage)
      }
      if (data.xp !== undefined) {
        sets.push('xp = ?')
        values.push(data.xp)
      }
      if (data.level !== undefined) {
        sets.push('level = ?')
        values.push(data.level)
      }

      sets.push('updated_at = ?')
      values.push(now)
      values.push(userId)

      await this.db.execute(
        `UPDATE brain_pets SET ${sets.join(', ')} WHERE user_id = ?`,
        ...values
      )
    }

    const result = await this.findByUser(userId)
    if (!result) {
      throw new Error('Failed to upsert brain pet: row not found after write')
    }
    return result
  }
}
