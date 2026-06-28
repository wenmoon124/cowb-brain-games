'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { CATEGORY_BADGE_CONFIG } from '@/lib/article-utils'
import { ArticlesList } from '@/components/articles/articles-list'
import { ARTICLE_CATEGORIES, type Article } from '@/data/articles'
import { type Locale } from '@/i18n/config'
import { useTranslation } from '@/i18n/client'

interface ArticlesFilterClientProps {
  articles: readonly Article[]
  locale: Locale
}

export function ArticlesFilterClient({ articles, locale }: ArticlesFilterClientProps) {
  const searchParams = useSearchParams()
  const { t } = useTranslation(locale)

  // Parse filter tags from search params
  const filterTagsParam = searchParams?.get('tags')
  const filterTags = filterTagsParam ? filterTagsParam.split(',') : []

  return (
    <>
      {/* Category Filter Bar */}
      <div className="mb-2xl flex flex-wrap items-center justify-center gap-sm">
        <Link href={`/${locale}/articles`}>
          <Badge
            variant="info"
            className={`cursor-pointer transition-all ${
              filterTags.length === 0
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-card text-text-secondary hover:bg-primary-light'
            }`}
          >
            {t('articles.pageText.allCategories')}
          </Badge>
        </Link>
        {ARTICLE_CATEGORIES.map((category) => {
          const config = CATEGORY_BADGE_CONFIG[category]
          const isActive = filterTags.includes(category)
          return (
            <Link
              key={category}
              href={
                isActive
                  ? `/${locale}/articles`
                  : `/${locale}/articles?tags=${category}`
              }
            >
              <Badge
                variant={config.variant}
                className={`${config.className} cursor-pointer transition-all ${
                  isActive
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {t(`articles.categoryLabels.${category}`)}
              </Badge>
            </Link>
          )
        })}
      </div>

      {/* Articles Grid */}
      <ArticlesList
        articles={articles}
        locale={locale}
        itemsPerPage={12}
        filterTags={filterTags}
      />
    </>
  )
}
