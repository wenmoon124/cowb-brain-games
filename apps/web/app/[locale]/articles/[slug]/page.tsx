import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { LOCALES, isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArticleJsonLd, BreadcrumbJsonLd, FaqPageJsonLd } from '@/components/seo/JsonLd'
import { CATEGORY_BADGE_CONFIG, formatDate } from '@/lib/article-utils'
import {
  ARTICLE_SLUGS,
  getArticleBySlug,
  getRelatedArticles,
} from '@/data/articles'
import { AdSlot } from '@/components/layout/ad-slot'

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

/**
 * 从文章内容中提取 FAQ 问答对。
 * 识别 `## Frequently Asked Questions` / `## 常见问题` / `## よくある質問` / `## FAQ` 标题，
 * 提取后续段落中的 `**Q: ...**` / `**问：...**` / `**Q：...**` 模式。
 */
function extractFaqs(content: string): Array<{ question: string; answer: string }> {
  const faqSectionPattern =
    /##\s+(?:Frequently Asked Questions|常见问题|よくある質問|FAQ)\s*\n([\s\S]*?)(?=\n##\s|$)/
  const match = content.match(faqSectionPattern)
  if (!match || !match[1]) return []

  const faqBody = match[1]
  const faqs: Array<{ question: string; answer: string }> = []
  // 匹配 **Q: question** 或 **问：question** 或 **Q：question** 后跟答案段落
  const qaPattern = /\*\*(?:Q[:：]|问[:：])\s*(.+?)\*\*\s*\n\n([\s\S]*?)(?=\n\n\*\*(?:Q[:：]|问[:：])\*\*|$)/g
  let qaMatch: RegExpExecArray | null
  while ((qaMatch = qaPattern.exec(faqBody)) !== null) {
    const question = qaMatch[1]?.trim()
    const answer = qaMatch[2]?.trim()
    if (question && answer) {
      faqs.push({ question, answer })
    }
  }
  return faqs
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
  const t = await getTranslations(locale as Locale)
  const article = getArticleBySlug(params.slug)

  if (!article) {
    return {
      title: t('articles.pageText.title'),
      description: t('articles.pageText.subtitle'),
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
      images: ['/og-image.svg'],
      publishedTime: article.date,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.excerpt,
      images: ['/og-image.svg'],
    },
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { locale: string; slug: string }
}) {
  const locale = isValidLocale(params.locale) ? (params.locale as Locale) : 'en'
  const t = await getTranslations(locale)
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const content = article[locale]
  const related = getRelatedArticles(article.slug, article.category, 3)
  const faqs = extractFaqs(content.content)

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-lg" asChild>
          <Link href={`/${locale}/articles`}>
            <ArrowLeft className="mr-xs h-4 w-4" />
            {t('articles.pageText.backToArticles')}
          </Link>
        </Button>

        {/* Article Header */}
        <header className="mb-2xl">
          <div className="mb-md flex flex-wrap items-center gap-sm">
            {article.tags.map((tag) => {
              const tagConfig = CATEGORY_BADGE_CONFIG[tag]
              const isPrimary = tag === article.category
              return (
                <Link
                  key={tag}
                  href={`/${locale}/articles?tags=${tag}`}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  <Badge
                    variant={tagConfig.variant}
                    className={`${tagConfig.className} cursor-pointer transition-all ${
                      isPrimary
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {t(`articles.categoryLabels.${tag}`)}
                  </Badge>
                </Link>
              )
            })}
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
              {article.readingTime} {t('articles.pageText.readingTime')}
            </span>
          </div>
        </header>

        {/* Article Body */}
        <article className="prose prose-lg max-w-none">
          {renderContent(content.content)}
        </article>

        {/* Ad Slot after Article */}
        <AdSlot size="rectangle" className="my-3xl" />

        {/* CTA */}
        <div className="mt-3xl text-center">
          <Button variant="primary" size="lg" asChild>
            <Link href={`/${locale}/games`}>
              {t('articles.pageText.tryGames')}
            </Link>
          </Button>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mt-3xl">
            <h2 className="text-xl font-semibold text-text-primary mb-lg">
              {t('articles.pageText.relatedArticles')}
            </h2>
            <div className="flex flex-col gap-md">
              {related.map((relatedArticle) => {
                const relatedContent = relatedArticle[locale]
                const relatedConfig = CATEGORY_BADGE_CONFIG[relatedArticle.category]
                return (
                  <Link
                    key={relatedArticle.slug}
                    href={`/${locale}/articles/${relatedArticle.slug}`}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg group"
                  >
                    <Card className="h-full border-l-4 border-l-primary border-border bg-gradient-to-r from-card to-card/50 transition-all duration-300 hover:shadow-lg hover:border-l-primary-hover hover:-translate-x-1">
                      <CardContent className="flex flex-col gap-sm p-lg">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={relatedConfig.variant}
                            className={relatedConfig.className}
                          >
                            {t(`articles.categoryLabels.${relatedArticle.category}`)}
                          </Badge>
                          <span className="flex items-center gap-xs text-xs text-text-muted">
                            <Clock className="h-3 w-3" />
                            {relatedArticle.readingTime} {t('articles.pageText.readingTime')}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedContent.title}
                        </h3>
                        <p className="text-sm text-text-secondary line-clamp-2">
                          {relatedContent.excerpt}
                        </p>
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
      <BreadcrumbJsonLd
        items={[
          { name: t('nav.home'), url: `https://cowb.cc/${locale}` },
          { name: t('articles.pageText.title'), url: `https://cowb.cc/${locale}/articles` },
          { name: content.title, url: `https://cowb.cc/${locale}/articles/${article.slug}` },
        ]}
      />
      {faqs.length > 0 && <FaqPageJsonLd faqs={faqs} />}
    </div>
  )
}
