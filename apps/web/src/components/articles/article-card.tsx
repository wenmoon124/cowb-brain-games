'use client'

import Link from 'next/link'
import { Clock, Calendar } from 'lucide-react'
import { type Locale } from '@/i18n/config'
import { useTranslation } from '@/i18n/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CATEGORY_BADGE_CONFIG, formatDate } from '@/lib/article-utils'
import type { Article } from '@/data/articles'

interface ArticleCardProps {
  article: Article
  locale: Locale
}

export function ArticleCard({ article, locale }: ArticleCardProps) {
  const { t } = useTranslation(locale)
  const content = article[locale]
  const config = CATEGORY_BADGE_CONFIG[article.category]

  return (
    <Link
      href={`/${locale}/articles/${article.slug}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
    >
      <Card className="h-full card-lift border-border">
        <CardHeader>
          <div className="mb-sm flex items-center gap-xs">
            <Badge variant={config.variant} className={config.className}>
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
          <div className="flex items-center gap-md text-xs text-text-muted">
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
}
