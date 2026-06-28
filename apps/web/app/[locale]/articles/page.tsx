import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Calendar } from 'lucide-react'
import { LOCALES, isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { CATEGORY_BADGE_CONFIG, formatDate } from '@/lib/article-utils'
import {
  ARTICLES,
  ARTICLE_CATEGORIES,
} from '@/data/articles'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const title = t('articles.pageText.title')
  const description = t('articles.pageText.subtitle')
  const pathPrefix = `/${locale}/articles`

  return {
    title,
    description,
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
      title,
      description,
      url: `https://cowb.cc${pathPrefix}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.svg'],
    },
  }
}

export default async function ArticlesPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? (params.locale as Locale) : 'en'
  const t = await getTranslations(locale)

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <BreadcrumbJsonLd
        items={[
          { name: t('nav.home'), url: `https://cowb.cc/${locale}` },
          { name: t('articles.pageText.title'), url: `https://cowb.cc/${locale}/articles` },
        ]}
      />
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-md">
            {t('articles.pageText.title')}
          </h1>
          <p className="text-md md:text-lg text-text-secondary max-w-2xl mx-auto">
            {t('articles.pageText.subtitle')}
          </p>
        </header>

        {/* Category Filter Bar */}
        <div className="mb-2xl flex flex-wrap items-center justify-center gap-sm">
          <Badge
            variant="info"
            className="border-primary bg-primary text-white"
          >
            {t('articles.pageText.allCategories')}
          </Badge>
          {ARTICLE_CATEGORIES.map((category) => {
            const config = CATEGORY_BADGE_CONFIG[category]
            return (
              <Badge
                key={category}
                variant={config.variant}
                className={config.className}
              >
                {t(`articles.categoryLabels.${category}`)}
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
                        {t(`articles.categoryLabels.${article.category}`)}
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
                        {article.readingTime} {t('articles.pageText.readingTime')}
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
