/**
 * JSON-LD 结构化数据组件
 * 用于向搜索引擎提供结构化数据，提升 SEO 效果
 */

export interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Organization schema — 用于首页 */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'BrainVerse',
        url: 'https://cowb.cc',
        logo: 'https://cowb.cc/og-image.svg',
        description:
          'Science-based brain training to sharpen memory, focus, and cognition.',
        sameAs: ['https://github.com/wenmoon124/cowb-brain-games'],
      }}
    />
  )
}

/** WebSite schema — 用于首页 */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'BrainVerse',
        url: 'https://cowb.cc',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://cowb.cc/en/games?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  )
}

/** BreadcrumbList schema — 用于所有页面 */
export interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  )
}

/** VideoGame schema — 用于游戏详情页 */
export interface VideoGameData {
  name: string
  description: string
  genre: string
  url: string
  dimension: string
}

export function VideoGameJsonLd({ game }: { game: VideoGameData }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: game.name,
        description: game.description,
        genre: game.genre,
        url: game.url,
        gamePlatform: 'Web Browser',
        applicationCategory: 'Game',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }}
    />
  )
}

/** Article schema — 用于文章详情页 */
export interface ArticleData {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  author: string
}

export function ArticleJsonLd({ article }: { article: ArticleData }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        url: article.url,
        image: ['https://cowb.cc/og-image.svg'],
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': article.url,
        },
        datePublished: article.datePublished,
        dateModified: article.dateModified ?? article.datePublished,
        author: {
          '@type': article.author.includes('Team') ? 'Organization' : 'Person',
          name: article.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'BrainVerse',
          logo: {
            '@type': 'ImageObject',
            url: 'https://cowb.cc/og-image.svg',
          },
        },
      }}
    />
  )
}

/** FAQPage schema — 用于文章详情页的 FAQ 部分 */
export interface FaqPageJsonLdProps {
  faqs: ReadonlyArray<{ question: string; answer: string }>
}

export function FaqPageJsonLd({ faqs }: FaqPageJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }}
    />
  )
}
