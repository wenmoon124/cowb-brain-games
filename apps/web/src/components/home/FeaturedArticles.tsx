'use client'

import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Locale } from '@/i18n/config'
import { type Article } from '@/data/articles'
import { useTranslation } from '@/i18n/client'

interface FeaturedArticlesProps {
  locale: Locale
  articles: readonly Article[]
}

export function FeaturedArticles({ locale, articles }: FeaturedArticlesProps) {
  const { t } = useTranslation(locale)
  // 取前6篇文章作为精选
  const featuredArticles = articles.slice(0, 6)

  return (
    <section className="px-md py-3xl">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-lg">
          <div className="flex items-center gap-sm">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              {t('home.featuredArticles.title')}
            </h2>
          </div>
          <Button variant="ghost" asChild>
            <Link href={`/${locale}/articles`}>
              {t('home.featuredArticles.viewAll')}
              <ArrowRight className="ml-xs h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {featuredArticles.map((article) => {
            const content = article[locale]
            if (!content) return null

            return (
              <Link
                key={article.slug}
                href={`/${locale}/articles/${article.slug}`}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center gap-sm mb-sm">
                      <Badge variant={article.category}>
                        {t(`articles.categories.${article.category}`)}
                      </Badge>
                      <span className="text-xs text-text-muted">
                        {article.readingTime} {t('articles.readingTime')}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {content.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-secondary line-clamp-3">
                      {content.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
