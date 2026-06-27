import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { LOCALES, isValidLocale, type Locale } from '@/i18n/config'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArticleJsonLd } from '@/components/seo/JsonLd'
import {
  ARTICLES,
  ARTICLE_SLUGS,
  getArticleBySlug,
  getRelatedArticles,
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

const CATEGORY_LABELS: Record<Locale, Record<ArticleCategory, string>> = {
  en: {
    memory: 'Memory',
    attention: 'Attention',
    reaction: 'Reaction',
    executive: 'Executive',
    relaxation: 'Relaxation',
    'brain-age': 'Brain Age',
    focus: 'Focus',
  },
  zh: {
    memory: '记忆',
    attention: '注意力',
    reaction: '反应',
    executive: '执行功能',
    relaxation: '放松',
    'brain-age': '大脑年龄',
    focus: '专注',
  },
  ja: {
    memory: '記憶',
    attention: '注意力',
    reaction: '反応',
    executive: '実行機能',
    relaxation: 'リラクゼーション',
    'brain-age': '脳年齢',
    focus: 'フォーカス',
  },
}

const PAGE_TEXT: Record<
  Locale,
  {
    backToArticles: string
    readingTime: string
    relatedArticles: string
    tryGames: string
  }
> = {
  en: {
    backToArticles: 'Back to Articles',
    readingTime: 'min read',
    relatedArticles: 'Related Articles',
    tryGames: 'Try Related Games',
  },
  zh: {
    backToArticles: '返回文章列表',
    readingTime: '分钟阅读',
    relatedArticles: '相关文章',
    tryGames: '尝试相关游戏',
  },
  ja: {
    backToArticles: '記事一覧に戻る',
    readingTime: '分で読了',
    relatedArticles: '関連記事',
    tryGames: '関連ゲームを試す',
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

function renderContent(content: string) {
  const sections = content.split('\n## ').filter(Boolean)
  return sections.map((section, i) => {
    const [title, ...paragraphs] = section.split('\n\n')
    return (
      <div key={i} className="mb-xl">
        {title && (
          <h2 className="text-xl md:text-2xl font-semibold text-text-primary mb-md mt-xl">
            {title.replace(/^## /, '')}
          </h2>
        )}
        {paragraphs.map((p, j) => (
          <p
            key={j}
            className="text-md text-text-secondary leading-relaxed mb-md"
          >
            {p}
          </p>
        ))}
      </div>
    )
  })
}

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of LOCALES) {
    for (const slug of ARTICLE_SLUGS) {
      params.push({ locale, slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const article = getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: 'Article',
      description: 'Brain training article',
    }
  }

  const content = article[locale as Locale]
  const pathPrefix = `/${locale}/articles/${params.slug}`

  return {
    title: content.title,
    description: content.excerpt,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: `/en/articles/${params.slug}`,
        zh: `/zh/articles/${params.slug}`,
        ja: `/ja/articles/${params.slug}`,
        'x-default': `/en/articles/${params.slug}`,
      },
    },
    openGraph: {
      title: content.title,
      description: content.excerpt,
      url: `https://cowb.cc${pathPrefix}`,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { locale: string; slug: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en' as Locale
  const text = PAGE_TEXT[locale]
  const categoryLabels = CATEGORY_LABELS[locale]
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const content = article[locale]
  const config = CATEGORY_BADGE_CONFIG[article.category]
  const related = getRelatedArticles(article.slug, article.category, 3)

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-lg" asChild>
          <Link href={`/${locale}/articles`}>
            <ArrowLeft className="mr-xs h-4 w-4" />
            {text.backToArticles}
          </Link>
        </Button>

        {/* Article Header */}
        <header className="mb-2xl">
          <div className="mb-md flex items-center gap-sm">
            <Badge variant={config.variant} className={config.className}>
              {categoryLabels[article.category]}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-md leading-tight">
            {content.title}
          </h1>
          <p className="text-md text-text-secondary mb-lg">
            {content.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-md text-sm text-text-secondary">
            <span>{article.author}</span>
            <span className="flex items-center gap-xs">
              <Calendar className="h-4 w-4" />
              {formatDate(article.date, locale)}
            </span>
            <span className="flex items-center gap-xs">
              <Clock className="h-4 w-4" />
              {article.readingTime} {text.readingTime}
            </span>
          </div>
        </header>

        {/* Article Body */}
        <article className="prose prose-lg max-w-none">
          {renderContent(content.content)}
        </article>

        {/* CTA */}
        <div className="mt-3xl text-center">
          <Button variant="primary" size="lg" asChild>
            <Link href={`/${locale}/games`}>
              {text.tryGames}
            </Link>
          </Button>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mt-3xl">
            <h2 className="text-xl font-semibold text-text-primary mb-lg">
              {text.relatedArticles}
            </h2>
            <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedArticle) => {
                const relatedContent = relatedArticle[locale]
                const relatedConfig = CATEGORY_BADGE_CONFIG[relatedArticle.category]
                return (
                  <Link
                    key={relatedArticle.slug}
                    href={`/${locale}/articles/${relatedArticle.slug}`}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                  >
                    <Card className="h-full border-primary-light transition-transform hover:-translate-y-1">
                      <CardContent className="flex flex-col gap-sm p-lg">
                        <Badge
                          variant={relatedConfig.variant}
                          className={relatedConfig.className}
                        >
                          {categoryLabels[relatedArticle.category]}
                        </Badge>
                        <h3 className="text-md font-semibold text-text-primary line-clamp-2">
                          {relatedContent.title}
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-2">
                          {relatedContent.excerpt}
                        </p>
                        <span className="mt-xs flex items-center gap-xs text-xs text-text-secondary">
                          <Clock className="h-3 w-3" />
                          {relatedArticle.readingTime} {text.readingTime}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>

      {/* JSON-LD */}
      <ArticleJsonLd
        article={{
          title: content.title,
          description: content.excerpt,
          url: `https://cowb.cc/${locale}/articles/${article.slug}`,
          datePublished: article.date,
          author: article.author,
        }}
      />
    </div>
  )
}
