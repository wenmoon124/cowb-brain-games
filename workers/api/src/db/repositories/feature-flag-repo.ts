import { Database } from '../database'
import type { FeatureFlag } from '../types'

/**
 * Repository for the `feature_flags` table. Reads are typically served from
 * the CACHE KV namespace (1-minute TTL) — this repository is the source of
 * truth behind that cache and the write path for the admin panel.
 */
export class FeatureFlagRepository {
  constructor(private readonly db: Database) {}

  /** Return all feature flags, ordered by key for stable display. */
  async findAll(): Promise<FeatureFlag[]> {
    return this.db.query<FeatureFlag>('SELECT * FROM feature_flags ORDER BY key ASC')
  }

  /** Find a flag by its (unique) key. Returns `null` if not found. */
  async findByKey(key: string): Promise<FeatureFlag | null> {
    return this.db.queryOne<FeatureFlag>('SELECT * FROM feature_flags WHERE key = ?', key)
  }

  /**
   * Toggle a flag's `enabled` column (0 / 1) and bump `updated_at`.
   * Returns the updated row, or `null` if the key does not exist.
   */
  async updateEnabled(key: string, enabled: number): Promise<FeatureFlag | null> {
    const now = new Date().toISOString()
    await this.db.execute(
      `UPDATE feature_flags SET enabled = ?, updated_at = ? WHERE key = ?`,
      enabled,
      now,
      key
    )
    return this.findByKey(key)
  }
}
