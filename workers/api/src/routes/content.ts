import { Hono } from 'hono'
import type { AppEnv, Locale } from '../types'
import { optionalAuth } from '../middleware/auth'

const app = new Hono<AppEnv>()

/** Supported locales for article translations */
const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'zh', 'ja'] as const

// ============ Routes ============

// GET /articles — List published articles
app.get('/articles', optionalAuth, async (c) => {
  const category = c.req.query('category')
  const locale = c.req.query('locale')

  const pageStr = c.req.query('page')
  const page = pageStr ? Math.max(1, parseInt(pageStr, 10) || 1) : 1
  const limitStr = c.req.query('limit')
  const limit = limitStr ? Math.min(50, Math.max(1, parseInt(limitStr, 10) || 20)) : 20

  // TODO(Phase F): Fetch articles from D1 via ArticleRepository.findAll
  // TODO(Phase F): Filter by category if provided
  // TODO(Phase F): Join article_translations for the requested locale
  // TODO(Phase F): Cache result in KV (key: articles:list:{category}:{locale})

  return c.json({
    data: [],
    pagination: { page, limit, total: 0, totalPages: 0 },
  })
})

// GET /articles/:slug — Get article by slug with translation
app.get('/articles/:slug', optionalAuth, async (c) => {
  const slug = c.req.param('slug')
  const localeParam = c.req.query('locale')
  const locale: Locale = SUPPORTED_LOCALES.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : 'en'

  // TODO(Phase F): Fetch article from D1 via ArticleRepository.findBySlug
  // TODO(Phase F): Fetch translation via ArticleRepository.findTranslation(articleId, locale)
  // TODO(Phase F): Fetch SEO metadata via SeoMetadataRepository
  // TODO(Phase F): Cache result in KV (key: article:{slug}:{locale})

  return c.json(
    {
      error: {
        code: 'NOT_FOUND' as const,
        message: `Article '${slug}' not found`,
        requestId: c.get('requestId') ?? '',
      },
    },
    404
  )
})

export default app
