import { Database } from '../database'
import type { User, UserCreate, UserUpdate } from '../types'

/**
 * Repository for the `users` table. Owns all SQL access for user records —
 * route handlers and services should never touch D1 directly.
 */
export class UserRepository {
  constructor(private readonly db: Database) {}

  /** Find a user by primary key. Returns `null` if not found. */
  async findById(id: string): Promise<User | null> {
    return this.db.queryOne<User>('SELECT * FROM users WHERE id = ?', id)
  }

  /** Find a user by email (case-sensitive). Returns `null` if not found. */
  async findByEmail(email: string): Promise<User | null> {
    return this.db.queryOne<User>('SELECT * FROM users WHERE email = ?', email)
  }

  /**
   * Insert a new user. `id`, `created_at` and `updated_at` are filled by the
   * repository. Returns the freshly created row.
   */
  async create(data: UserCreate): Promise<User> {
    const id = data.id ?? crypto.randomUUID()
    const now = new Date().toISOString()
    await this.db.execute(
      `INSERT INTO users (id, email, password_hash, nickname, locale, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      data.email,
      data.password_hash,
      data.nickname,
      data.locale ?? 'en',
      data.role ?? 'user',
      now,
      now
    )
    const user = await this.findById(id)
    if (!user) {
      throw new Error('Failed to create user: row not found after insert')
    }
    return user
  }

  /**
   * Patch a user. Only the fields present on `data` are written; `updated_at`
   * is always bumped. Returns the updated row, or `null` if the id does not
   * exist.
   */
  async update(id: string, data: UserUpdate): Promise<User | null> {
    const sets: string[] = []
    const values: (string | number)[] = []

    if (data.email !== undefined) {
      sets.push('email = ?')
      values.push(data.email)
    }
    if (data.password_hash !== undefined) {
      sets.push('password_hash = ?')
      values.push(data.password_hash)
    }
    if (data.nickname !== undefined) {
      sets.push('nickname = ?')
      values.push(data.nickname)
    }
    if (data.locale !== undefined) {
      sets.push('locale = ?')
      values.push(data.locale)
    }
    if (data.role !== undefined) {
      sets.push('role = ?')
      values.push(data.role)
    }

    if (sets.length === 0) {
      return this.findById(id)
    }

    sets.push('updated_at = ?')
    values.push(new Date().toISOString())
    values.push(id)

    await this.db.execute(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, ...values)
    return this.findById(id)
  }
}
