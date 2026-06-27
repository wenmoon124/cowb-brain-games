/**
 * Thin wrapper around the Cloudflare D1 binding.
 *
 * Centralises prepared-statement usage so repositories never reach for the
 * raw `D1Database` API and SQL injection via string interpolation is harder
 * to introduce. All methods accept a SQL string with `?` placeholders plus
 * the bind values positionally.
 *
 * Usage:
 *   const db = new Database(env.DB)
 *   const users = await db.query<User>('SELECT * FROM users WHERE locale = ?', 'en')
 *   const user  = await db.queryOne<User>('SELECT * FROM users WHERE id = ?', id)
 *   await db.execute('UPDATE users SET nickname = ? WHERE id = ?', nick, id)
 */

/**
 * D1 bind value. Mirrors the union accepted by `D1PreparedStatement.bind()`.
 * Aliased here so repository signatures can reference a stable name instead
 * of repeating the inline union.
 */
export type D1Value = null | number | string | boolean | ArrayBuffer

export class Database {
  constructor(private readonly d1: D1Database) {}

  /**
   * Run a SELECT (or any statement returning rows) and return all matched
   * rows typed as `T[]`. Returns `[]` when no rows match.
   *
   * @example
   *   const users = await db.query<User>('SELECT * FROM users WHERE role = ?', 'admin')
   */
  async query<T>(sql: string, ...params: D1Value[]): Promise<T[]> {
    const stmt = params.length > 0 ? this.d1.prepare(sql).bind(...params) : this.d1.prepare(sql)
    const result = await stmt.all<T>()
    return result.results
  }

  /**
   * Run a SELECT and return the first matched row, or `null` when no rows
   * match. Convenient for primary-key / unique-column lookups.
   *
   * @example
   *   const user = await db.queryOne<User>('SELECT * FROM users WHERE id = ?', id)
   */
  async queryOne<T>(sql: string, ...params: D1Value[]): Promise<T | null> {
    const stmt = params.length > 0 ? this.d1.prepare(sql).bind(...params) : this.d1.prepare(sql)
    const row = await stmt.first<T>()
    return row ?? null
  }

  /**
   * Run an INSERT / UPDATE / DELETE and return the D1 result metadata
   * (meta.changes, meta.last_row_id, etc.).
   *
   * @example
   *   await db.execute('DELETE FROM sessions WHERE expires_at < ?', now)
   */
  async execute(sql: string, ...params: D1Value[]): Promise<D1Result> {
    const stmt = params.length > 0 ? this.d1.prepare(sql).bind(...params) : this.d1.prepare(sql)
    return stmt.run()
  }

  /**
   * Execute multiple prepared statements in a single D1 batch (one
   * transaction). Use {@link prepare} to build the statements.
   *
   * @example
   *   const stmts = [db.prepare('INSERT INTO t (a) VALUES (?)').bind(1),
   *                  db.prepare('INSERT INTO t (a) VALUES (?)').bind(2)]
   *   await db.batch(stmts)
   */
  async batch(statements: D1PreparedStatement[]): Promise<D1Result[]> {
    return this.d1.batch(statements)
  }

  /**
   * Create a prepared statement without binding. Useful when the same
   * statement needs to be executed multiple times with different values
   * (e.g. inside a {@link batch} call).
   */
  prepare(sql: string): D1PreparedStatement {
    return this.d1.prepare(sql)
  }
}
