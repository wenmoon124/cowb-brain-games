import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Calendar } from 'lucide-react'
import { LOCALES, isValidLocale, type Locale } from '@/i18n/config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ARTICLES,
  ARTICLE_CATEGORIES,
  type ArticleCategory,
} from '@/data/articles'

interface CategoryBadgeConfig {
  variant: 'memory' | 'attention' | 'reaction' | 'executive' | 'relaxation' | 'info'
  className?: string
}

const CATEGORY_BADGE_CONFIG: Record<ArticleCategory, CategoryBadgeConfig> = {
  memory: { variant: 'memory' },
  attention: { variant: 'attention' },
  reaction: { variant: 'reaction' },
  executive: { variant: 'executive' },
  relaxation: { variant: 'relaxation' },
  'brain-age': { variant: 'info' },
  focus: { variant: 'info', className: 'bg-accent-light text-accent' },
}

const CATEGORY_LABELS: Record<Locale, Record<ArticleCategory | 'all', string>> = {
  en: {
    all: 'All',
    memory: 'Memory',
    attention: 'Attention',
    reaction: 'Reaction',
    executive: 'Executive',
    relaxation: 'Relaxation',
    'brain-age': 'Brain Age',
    focus: 'Focus',
  },
  zh: {
    all: '全部',
    memory: '记忆',
    attention: '注意力',
    reaction: '反应',
    executive: '执行功能',
    relaxation: '放松',
    'brain-age': '大脑年龄',
    focus: '专注',
  },
  ja: {
    all: 'すべて',
    memory: '記憶',
    attention: '注意力',
    reaction: '反応',
    executive: '実行機能',
    relaxation: 'リラクゼーション',
    'brain-age': '脳年齢',
    focus: 'フォーカス',
  },
}

const PAGE_TEXT: Record<Locale, { title: string; subtitle: string; readingTime: string }> = {
  en: {
    title: 'Articles',
    subtitle: 'Science-based insights on brain training',
    readingTime: 'min read',
  },
  zh: {
    title: '文章',
    subtitle: '基于科学的脑训练见解',
    readingTime: '分钟阅读',
  },
  ja: {
    title: '記事',
    subtitle: '科学的な脳トレーニングの洞察',
    readingTime: '分で読了',
  },
}

function formatDate(isoDate: string, locale: Locale): string {
  const date = new Date(isoDate)
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP',
  }
  return date.toLocaleDateString(localeMap[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const text = PAGE_TEXT[locale as Locale]
  const pathPrefix = `/${locale}/articles`

  return {
    title: text.title,
    description: text.subtitle,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/articles',
        zh: '/zh/articles',
        ja: '/ja/articles',
        'x-default': '/en/articles',
      },
    },
    openGraph: {
      title: text.title,
      description: text.subtitle,
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function ArticlesPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en' as Locale
  const text = PAGE_TEXT[locale]
  const categoryLabels = CATEGORY_LABELS[locale]

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-md">
            {text.title}
          </h1>
          <p className="text-md md:text-lg text-text-secondary max-w-2xl mx-auto">
            {text.subtitle}
          </p>
        </header>

        {/* Category Filter Bar */}
        <div className="mb-2xl flex flex-wrap items-center justify-center gap-sm">
          <Badge
            variant="info"
            className="border-primary bg-primary text-white"
          >
            {categoryLabels.all}
          </Badge>
          {ARTICLE_CATEGORIES.map((category) => {
            const config = CATEGORY_BADGE_CONFIG[category]
            return (
              <Badge
                key={category}
                variant={config.variant}
                className={config.className}
              >
                {categoryLabels[category]}
              </Badge>
            )
          })}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => {
            const content = article[locale]
            const config = CATEGORY_BADGE_CONFIG[article.category]
            return (
              <Link
                key={article.slug}
                href={`/${locale}/articles/${article.slug}`}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
              >
                <Card className="h-full border-primary-light transition-transform hover:-translate-y-1 hover:shadow-md">
                  <CardHeader>
                    <div className="mb-sm flex items-center gap-xs">
                      <Badge
                        variant={config.variant}
                        className={config.className}
                      >
                        {categoryLabels[article.category]}
                      </Badge>
                    </div>
                    <CardTitle className="text-text-primary line-clamp-2">
                      {content.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-md">
                      {content.excerpt}
                    </p>
                    <div className="flex items-center gap-md text-xs text-text-secondary">
                      <span className="flex items-center gap-xs">
                        <Clock className="h-3 w-3" />
                        {article.readingTime} {text.readingTime}
                      </span>
                      <span className="flex items-center gap-xs">
                        <Calendar className="h-3 w-3" />
                        {formatDate(article.date, locale)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
