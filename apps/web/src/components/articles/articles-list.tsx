'use client'

import { useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { type Locale } from '@/i18n/config'
import { type Article, type ArticleCategory } from '@/data/articles'
import { ArticleCard } from './article-card'
import { Pagination } from '@/components/ui/pagination'
import { AdSlot } from '@/components/layout/ad-slot'

interface ArticlesListProps {
  articles: readonly Article[]
  locale: Locale
  itemsPerPage?: number
  filterTags?: string[]
}

export function ArticlesList({
  articles,
  locale,
  itemsPerPage = 12,
  filterTags = [],
}: ArticlesListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentPage = Number(searchParams.get('page')) || 1

  // Filter articles by tags
  const filteredArticles = useMemo(() => {
    if (filterTags.length === 0) return articles
    return articles.filter((article) =>
      filterTags.some((tag) => article.tags.includes(tag as ArticleCategory))
    )
  }, [articles, filterTags])

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredArticles.slice(start, end)
  }, [filteredArticles, currentPage, itemsPerPage])

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  // 每6篇文章后插入广告位
  const articlesWithAds = useMemo(() => {
    const result: Array<{ type: 'article'; article: Article } | { type: 'ad' }> = []
    paginatedArticles.forEach((article, index) => {
      result.push({ type: 'article', article })
      // 每6篇文章后插入广告（索引5, 11, 17...）
      if ((index + 1) % 6 === 0 && index < paginatedArticles.length - 1) {
        result.push({ type: 'ad' })
      }
    })
    return result
  }, [paginatedArticles])

  return (
    <>
      <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
        {articlesWithAds.map((item, index) => {
          if (item.type === 'ad') {
            return (
              <div key={`ad-${index}`} className="col-span-full">
                <AdSlot size="rectangle" />
              </div>
            )
          }
          return (
            <ArticleCard
              key={item.article.slug}
              article={item.article}
              locale={locale}
            />
          )
        })}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-3xl"
        />
      )}
    </>
  )
}
