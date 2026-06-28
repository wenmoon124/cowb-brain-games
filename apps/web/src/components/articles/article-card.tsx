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
      <Card className="h-full card-lift border-2 border-primary-light flex flex-col bg-white/90 backdrop-blur-sm hover:shadow-glow-primary">
        <CardHeader className="pb-md">
          {/* 标题 - 第一位 */}
          <CardTitle className="text-lg font-bold text-text-primary line-clamp-2 mb-md group-hover:text-primary transition-colors">
            {content.title}
          </CardTitle>
          {/* 标签和阅读时间 - 第二行 */}
          <div className="flex items-center gap-sm flex-wrap">
            <Badge variant={config.variant} className={config.className}>
              {t(`articles.categoryLabels.${article.category}`)}
            </Badge>
            <span className="flex items-center gap-xs text-xs text-text-muted ml-auto">
              <Clock className="h-3 w-3" />
              {article.readingTime} {t('articles.pageText.readingTime')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 pt-0">
          <p className="text-sm text-text-secondary line-clamp-3 mb-md flex-1 leading-relaxed">
            {content.excerpt}
          </p>
          <div className="flex items-center gap-xs text-xs text-text-muted pt-md border-t border-border-light">
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
