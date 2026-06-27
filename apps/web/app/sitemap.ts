import type { MetadataRoute } from 'next'
import { GAMES } from '@/lib/games'
import { ARTICLES } from '@/data/articles'

const BASE_URL = 'https://cowb.cc'
const LOCALES = ['en', 'zh', 'ja'] as const
const LAST_MODIFIED = new Date('2026-06-27T00:00:00.000Z')

/** 静态路由路径（不含 locale 前缀） */
const STATIC_PATHS = [
  '',
  '/games',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/signin',
  '/signup',
  '/dashboard',
  '/profile',
  '/achievements',
  '/brain-age',
  '/articles',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    // 静态路由
    for (const path of STATIC_PATHS) {
      const url = `${BASE_URL}/${locale}${path}`
      const alternates: Record<string, string> = {}
      for (const altLocale of LOCALES) {
        alternates[altLocale] = `${BASE_URL}/${altLocale}${path}`
      }
      entries.push({
        url,
        lastModified: LAST_MODIFIED,
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : path === '/games' ? 0.9 : 0.7,
        alternates: {
          languages: alternates,
        },
      })
    }

    // 动态游戏路由
    for (const game of GAMES) {
      const path = `/games/${game.slug}`
      const url = `${BASE_URL}/${locale}${path}`
      const alternates: Record<string, string> = {}
      for (const altLocale of LOCALES) {
        alternates[altLocale] = `${BASE_URL}/${altLocale}${path}`
      }
      entries.push({
        url,
        lastModified: LAST_MODIFIED,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: alternates,
        },
      })
    }

    // 动态文章详情路由
    for (const article of ARTICLES) {
      const path = `/articles/${article.slug}`
      const url = `${BASE_URL}/${locale}${path}`
      const alternates: Record<string, string> = {}
      for (const altLocale of LOCALES) {
        alternates[altLocale] = `${BASE_URL}/${altLocale}${path}`
      }
      entries.push({
        url,
        lastModified: LAST_MODIFIED,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: alternates,
        },
      })
    }
  }

  return entries
}
