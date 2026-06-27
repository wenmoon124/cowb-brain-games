import { Database } from '../database'
import type {
  Article,
  ArticleWithTranslation,
  ArticleTranslation,
  ArticleCreate,
  ArticleTranslationCreate,
  Locale,
} from '../types'

/**
 * Repository for the `articles` + `article_translations` tables.
 *
 * The article row is locale-independent; localized fields (title, content, …)
 * live in `article_translations` and are joined in for the read paths that
 * the frontend needs.
 */
export class ArticleRepository {
  constructor(private readonly db: Database) {}

  /**
   * List articles. When `published` is provided, filter to that flag
   * (`1` = published, `0` = draft). When `limit` is provided, cap the result.
   * Ordered by `sort_order` ascending then `created_at` descending.
   */
  async findAll(published?: number, limit?: number): Promise<Article[]> {
    const conditions: string[] = []
    const params: (string | number)[] = []

    if (published !== undefined) {
      conditions.push('published = ?')
      params.push(published)
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const limitClause = limit !== undefined ? 'LIMIT ?' : ''
    if (limit !== undefined) params.push(limit)

    const sql = `SELECT * FROM articles ${whereClause}
                 ORDER BY sort_order ASC, created_at DESC ${limitClause}`.trim()
    return this.db.query<Article>(sql, ...params)
  }

  /**
   * Fetch a single article by slug joined with its translation for `locale`.
   * Returns `null` when the article or the translation is missing.
   */
  async findBySlug(slug: string, locale: Locale): Promise<ArticleWithTranslation | null> {
    return this.db.queryOne<ArticleWithTranslation>(
      `SELECT a.*, t.title, t.meta_description, t.content, t.faq
       FROM articles a
       JOIN article_translations t ON t.article_id = a.id
       WHERE a.slug = ? AND t.locale = ?`,
      slug,
      locale
    )
  }

  /**
   * List articles in a category, joined with the translation for `locale`.
   * Only published articles are returned, ordered by `sort_order`.
   */
  async findByCategory(category: string, locale: Locale): Promise<ArticleWithTranslation[]> {
    return this.db.query<ArticleWithTranslation>(
      `SELECT a.*, t.title, t.meta_description, t.content, t.faq
       FROM articles a
       JOIN article_translations t ON t.article_id = a.id
       WHERE a.category = ? AND a.published = 1 AND t.locale = ?
       ORDER BY a.sort_order ASC, a.created_at DESC`,
      category,
      locale
    )
  }

  // ---- write paths (used by the future seed script / admin tooling) ----

  /** Insert an article row. `id` and timestamps are filled by the repository. */
  async create(data: ArticleCreate): Promise<Article> {
    const id = data.id ?? crypto.randomUUID()
    const now = new Date().toISOString()
    await this.db.execute(
      `INSERT INTO articles
         (id, slug, category, published, featured, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      data.slug,
      data.category,
      data.published ?? 0,
      data.featured ?? 0,
      data.sort_order ?? 0,
      now,
      now
    )
    const article = await this.db.queryOne<Article>('SELECT * FROM articles WHERE id = ?', id)
    if (!article) {
      throw new Error('Failed to create article: row not found after insert')
    }
    return article
  }

  /**
   * Insert a translation row for an article. `id` and timestamps are filled
   * by the repository.
   */
  async createTranslation(data: ArticleTranslationCreate): Promise<ArticleTranslation> {
    const id = data.id ?? crypto.randomUUID()
    const now = new Date().toISOString()
    await this.db.execute(
      `INSERT INTO article_translations
         (id, article_id, locale, title, meta_description, content, faq,
          created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      data.article_id,
      data.locale,
      data.title,
      data.meta_description ?? null,
      data.content,
      data.faq ?? null,
      now,
      now
    )
    const translation = await this.db.queryOne<ArticleTranslation>(
      'SELECT * FROM article_translations WHERE id = ?',
      id
    )
    if (!translation) {
      throw new Error('Failed to create article translation: row not found after insert')
    }
    return translation
  }
}
