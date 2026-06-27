# SEO 架构指南

本文档详细说明 BrainVerse 项目（cowb.cc）的 SEO 架构，涵盖 SEO 架构概述、元数据规范、结构化数据、sitemap.xml、robots.txt、rss.xml、hreflang 实现、内链策略以及程序化 SEO 架构。

> **核心目标**：通过技术 SEO 架构支撑 300+ 程序化生成的着陆页，实现脑健康相关关键词的搜索引擎可见性最大化，同时保证三语（en/zh/ja）版本的完整覆盖。

---

## 1. SEO 架构概述

### 1.1 技术基础

BrainVerse 基于 Next.js 14 App Router 构建，利用其原生 SEO 能力：

| 能力 | 技术 | 说明 |
|---|---|---|
| **元数据管理** | Next.js Metadata API | 通过 `generateMetadata` 函数动态生成每页元数据 |
| **服务端渲染** | React Server Components | 内容在服务端渲染，搜索引擎可直接抓取 |
| **结构化数据** | JSON-LD（嵌入 `<script>`） | 通过 React 组件注入结构化数据 |
| **多语言 SEO** | hreflang alternate links | 通过 metadata.alternates 配置 |
| **站点地图** | 动态生成 sitemap.xml | 通过 Next.js `sitemap.ts` 文件 |
| **RSS 订阅** | 动态生成 rss.xml | 通过 Next.js `rss.ts` 或 route handler |
| **页面性能** | Core Web Vitals 优化 | 影响 SEO 排名，详见部署文档性能验证 |

### 1.2 SEO 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │ Metadata   │  │ JSON-LD    │  │ hreflang           │   │
│  │ API        │  │ Components │  │ Alternates         │   │
│  └────────────┘  └────────────┘  └────────────────────┘   │
│        │                │                │                  │
│        └────────────────┼────────────────┘                  │
│                         ▼                                    │
│              ┌───────────────────┐                          │
│              │   Server Rendered │  ← 搜索引擎可抓取         │
│              │     HTML Output   │                          │
│              └───────────────────┘                          │
│                         │                                    │
│        ┌────────────────┼────────────────┐                  │
│        ▼                ▼                ▼                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐         │
│  │ sitemap  │    │ robots   │    │ rss.xml      │         │
│  │ .xml     │    │ .txt     │    │ (articles)   │         │
│  └──────────┘    └──────────┘    └──────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 SEO 目标

- **搜索引擎收录**：Google、Bing、Baidu、Yahoo Japan 收录所有页面
- **关键词排名**：脑健康相关核心关键词进入前 10（如 "brain age test"、"脑力年龄"、"脳年齢テスト"）
- **长尾覆盖**：通过 300+ 程序化页面覆盖长尾关键词
- **多语言覆盖**：en/zh/ja 三语版本全部被对应语言搜索引擎收录
- **Core Web Vitals**：所有页面达到"良好"标准（LCP < 2.5s、INP < 200ms、CLS < 0.1）

---

## 2. 元数据规范

### 2.1 必需元数据清单

**每个页面必须包含以下元数据**，缺失任何一项视为 SEO 缺陷：

| 元数据 | 位置 | 用途 |
|---|---|---|
| `<title>` | `<head>` | 页面标题，搜索结果展示（≤ 60 字符） |
| `<meta name="description">` | `<head>` | 页面描述，搜索结果展示（≤ 160 字符） |
| `<link rel="canonical">` | `<head>` | 规范 URL，避免重复内容 |
| OpenGraph 标签 | `<head>` | 社交媒体分享展示 |
| Twitter Card 标签 | `<head>` | Twitter 分享展示 |
| hreflang alternate | `<head>` | 多语言版本互指 |
| `<html lang>` | `<html>` | 页面语言声明 |
| `<meta name="viewport">` | `<head>` | 移动端适配 |

### 2.2 Next.js Metadata API 实现

BrainVerse 使用 Next.js App Router 的 Metadata API 生成元数据。

#### 2.2.1 根布局默认元数据

```typescript
// apps/web/app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://cowb.cc'),
  title: {
    default: 'BrainVerse — Train Your Brain, Lower Your Brain Age',
    template: '%s | BrainVerse',
  },
  description:
    'BrainVerse is a science-based brain training platform. Test your brain age, play cognitive games, and improve memory, attention, focus, and relaxation.',
  keywords: [
    'brain age', 'brain training', 'cognitive games',
    'memory improvement', 'attention training', 'brain health',
    '脑力年龄', '脑力训练', '认知游戏',
    '脳年齢', '脳トレ', '認知ゲーム',
  ],
  authors: [{ name: 'BrainVerse' }],
  creator: 'BrainVerse',
  publisher: 'BrainVerse',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'zh': '/zh',
      'ja': '/ja',
      'x-default': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['zh_CN', 'ja_JP'],
    url: 'https://cowb.cc',
    siteName: 'BrainVerse',
    title: 'BrainVerse — Train Your Brain, Lower Your Brain Age',
    description: 'Science-based brain training platform. Test your brain age and play cognitive games.',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: 'BrainVerse — Brain Training Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrainVerse — Train Your Brain',
    description: 'Test your brain age and play cognitive games.',
    images: ['/og/default.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
}
```

#### 2.2.2 页面级动态元数据

每个页面通过 `generateMetadata` 函数生成页面特定元数据：

```typescript
// apps/web/app/[locale]/articles/[category]/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'
import { getArticle } from '@/lib/api'
import type { Locale } from '@brainverse/shared'

type Params = {
  params: { locale: Locale; category: string; slug: string }
}

export async function generateMetadata(
  { params: { locale, category, slug } }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const article = await getArticle(slug, locale)

  if (!article) {
    return {
      title: 'Article Not Found',
      robots: { index: false, follow: false },
    }
  }

  const url = `https://cowb.cc/${locale}/articles/${category}/${slug}`

  return {
    title: article.title,
    description: article.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        'en': `/en/articles/${category}/${slug}`,
        'zh': `/zh/articles/${category}/${slug}`,
        'ja': `/ja/articles/${category}/${slug}`,
        'x-default': `/en/articles/${category}/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      locale: localeToOgLocale(locale),
      url,
      title: article.title,
      description: article.metaDescription,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ['BrainVerse'],
      images: article.ogImage ? [{ url: article.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
      images: article.ogImage ? [article.ogImage] : undefined,
    },
  }
}

function localeToOgLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    en: 'en_US',
    zh: 'zh_CN',
    ja: 'ja_JP',
  }
  return map[locale]
}
```

### 2.3 元数据规范细则

#### 2.3.1 Title 标签

- **长度**：≤ 60 字符（英文）/ ≤ 30 字符（中文/日文，因字符宽度）
- **格式**：`[页面标题] | BrainVerse`（通过 `title.template` 自动拼接）
- **关键词**：包含目标关键词，靠前放置
- **唯一性**：每个页面 title 唯一

```typescript
// ✅ 正确
title: 'How to Test Your Brain Age: Science-Based Methods'
// 输出：<title>How to Test Your Brain Age: Science-Based Methods | BrainVerse</title>

// ❌ 避免
title: 'Home'  // 太短，无关键词
title: 'BrainVerse Brain Age Test Memory Games Attention Training...'  // 关键词堆砌
```

#### 2.3.2 Meta Description

- **长度**：≤ 160 字符（英文）/ ≤ 80 字符（中文/日文）
- **内容**：包含目标关键词 + 吸引点击的描述
- **唯一性**：每个页面 description 唯一
- **避免**：不要与 title 完全相同

#### 2.3.3 Canonical URL

- 每个页面必须有 canonical URL
- canonical 指向该语言的规范 URL
- 避免多个 URL 指向同一 canonical（除非有意合并）

#### 2.3.4 OpenGraph 标签

必需的 OG 标签：

| 标签 | 说明 |
|---|---|
| `og:type` | `website`（普通页）/ `article`（文章页） |
| `og:locale` | 页面语言（`en_US`、`zh_CN`、`ja_JP`） |
| `og:url` | 页面 canonical URL |
| `og:title` | 分享标题 |
| `og:description` | 分享描述 |
| `og:image` | 分享图片（1200×630 px） |
| `og:site_name` | `BrainVerse` |
| `og:locale:alternate` | 其他语言版本 |

#### 2.3.5 Twitter Card

| 标签 | 说明 |
|---|---|
| `twitter:card` | `summary` 或 `summary_large_image` |
| `twitter:title` | 分享标题 |
| `twitter:description` | 分享描述 |
| `twitter:image` | 分享图片 |

---

## 3. 结构化数据

BrainVerse 使用 JSON-LD（JavaScript Object Notation for Linked Data）格式向搜索引擎提供结构化数据，提升搜索结果展示效果（Rich Snippets）。

### 3.1 结构化数据类型清单

| Schema 类型 | 适用页面 | 说明 |
|---|---|---|
| **WebSite** | 全站（根布局） | 网站实体定义，支持 Sitelinks Search Box |
| **Article** | 文章详情页 | 文章元数据，提升文章搜索展示 |
| **FAQPage** | 文章页（含 FAQ 部分） | FAQ Rich Snippet |
| **BreadcrumbList** | 所有内容页 | 面包屑导航展示 |
| **WebApplication** | 游戏页 | 应用类型定义 |
| **Organization** | 关于页 / 根布局 | 组织信息 |

### 3.2 JSON-LD 实现方式

通过 React 组件将 JSON-LD 嵌入页面 `<script>` 标签：

```typescript
// apps/web/components/seo/json-ld.tsx
interface JsonLdProps {
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
```

### 3.3 WebSite Schema

在根布局中注入，定义网站实体：

```typescript
// apps/web/app/layout.tsx
import { JsonLd } from '@/components/seo/json-ld'

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BrainVerse',
  url: 'https://cowb.cc',
  description: 'Science-based brain training platform',
  inLanguage: ['en', 'zh', 'ja'],
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://cowb.cc/en/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'BrainVerse',
    url: 'https://cowb.cc',
    logo: {
      '@type': 'ImageObject',
      url: 'https://cowb.cc/logo.png',
      width: 512,
      height: 512,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <JsonLd data={websiteSchema} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 3.4 Article Schema

文章详情页注入 Article Schema：

```typescript
// apps/web/app/[locale]/articles/[category]/[slug]/page.tsx
import { JsonLd } from '@/components/seo/json-ld'

export default async function ArticlePage({ params }: Params) {
  const article = await getArticle(params.slug, params.locale)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: article.ogImage ?? 'https://cowb.cc/og/article-default.png',
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'BrainVerse',
      url: 'https://cowb.cc',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BrainVerse',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cowb.cc/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://cowb.cc/${params.locale}/articles/${params.category}/${params.slug}`,
    },
    about: {
      '@type': 'Thing',
      name: article.categoryName,
    },
    inLanguage: params.locale,
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      {/* 文章内容 */}
      <article>
        <h1>{article.title}</h1>
        {/* ... */}
      </article>
    </>
  )
}
```

### 3.5 FAQ Schema

文章页含 FAQ 部分时注入 FAQPage Schema：

```typescript
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: article.faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}
```

### 3.6 BreadcrumbList Schema

所有内容页注入面包屑结构化数据：

```typescript
// apps/web/components/seo/breadcrumb-ld.tsx
import { JsonLd } from './json-ld'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbLdProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbLd({ items }: BreadcrumbLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://cowb.cc${item.url}`,
    })),
  }

  return <JsonLd data={schema} />
}
```

使用示例：

```tsx
// 文章页
<BreadcrumbLd
  items={[
    { name: 'Home', url: '/en' },
    { name: 'Articles', url: '/en/articles' },
    { name: 'Brain Age', url: '/en/articles/brain-age' },
    { name: article.title, url: `/en/articles/brain-age/${slug}` },
  ]}
/>
```

### 3.7 结构化数据验证

部署后使用以下工具验证结构化数据：

1. [Google Rich Results Test](https://search.google.com/test/rich-results) — 验证单个页面
2. [Schema.org Validator](https://validator.schema.org/) — 验证 Schema 语法
3. Google Search Console → Enhancements — 监控结构化数据错误

---

## 4. sitemap.xml

### 4.1 实现方式

BrainVerse 使用 Next.js 的 `sitemap.ts` 文件动态生成 sitemap.xml，在构建时输出静态文件。

### 4.2 sitemap.ts 实现

```typescript
// apps/web/app/sitemap.ts
import type { MetadataRoute } from 'next'
import type { Locale } from '@brainverse/shared'
import { getPublishedArticles, getActiveGames } from '@/lib/api'

const BASE_URL = 'https://cowb.cc'
const LOCALES: Locale[] = ['en', 'zh', 'ja']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // 1. 静态页面（每个 locale 一组）
  const staticPaths = [
    '',                    // 首页
    '/games',             // 游戏中心
    '/dashboard',         // 仪表盘
    '/brain-age',         // Brain Age 评估
    '/articles',          // 文章列表
    '/about',             // 关于
    '/contact',           // 联系
  ]

  for (const locale of LOCALES) {
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${path}`,
            zh: `${BASE_URL}/zh${path}`,
            ja: `${BASE_URL}/ja${path}`,
          },
        },
      })
    }
  }

  // 2. 文章页面（动态生成）
  const articles = await getPublishedArticles()
  const articleCategories = ['brain-age', 'memory', 'attention', 'focus', 'relaxation']

  for (const locale of LOCALES) {
    for (const article of articles) {
      entries.push({
        url: `${BASE_URL}/${locale}/articles/${article.category}/${article.slug}`,
        lastModified: new Date(article.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/articles/${article.category}/${article.slug}`,
            zh: `${BASE_URL}/zh/articles/${article.category}/${article.slug}`,
            ja: `${BASE_URL}/ja/articles/${article.category}/${article.slug}`,
          },
        },
      })
    }
  }

  // 3. 游戏页面
  const games = await getActiveGames()
  for (const locale of LOCALES) {
    for (const game of games) {
      entries.push({
        url: `${BASE_URL}/${locale}/games/${game.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/games/${game.slug}`,
            zh: `${BASE_URL}/zh/games/${game.slug}`,
            ja: `${BASE_URL}/ja/games/${game.slug}`,
          },
        },
      })
    }
  }

  return entries
}
```

### 4.3 sitemap 规范

- **位置**：`https://cowb.cc/sitemap.xml`（Next.js 自动生成）
- **格式**：XML，遵循 [sitemaps.org 协议](https://www.sitemaps.org/protocol.html)
- **更新频率**：构建时生成，每次部署更新
- **大小限制**：单个 sitemap ≤ 50,000 URL / 50MB；超出需分割为 sitemap index
- **多语言**：通过 `alternates.languages` 声明各语言版本

### 4.4 Sitemap Index（如需分割）

当 URL 数量超过 50,000 时，使用 sitemap index：

```typescript
// apps/web/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  // 返回 sitemap index 格式
  return [
    {
      url: 'https://cowb.cc/sitemaps/articles-en.xml',
      lastModified: new Date(),
    },
    {
      url: 'https://cowb.cc/sitemaps/articles-zh.xml',
      lastModified: new Date(),
    },
    // ...
  ]
}
```

### 4.5 提交到搜索引擎

部署后，将 sitemap 提交到各搜索引擎：

| 搜索引擎 | 提交位置 |
|---|---|
| Google | [Google Search Console](https://search.google.com/search-console) → Sitemaps |
| Bing | [Bing Webmaster Tools](https://www.bing.com/webmasters) → Sitemaps |
| Baidu | [百度搜索资源平台](https://ziyuan.baidu.com) → 普通收录 → Sitemap |
| Yahoo Japan | 通过 Bing Webmaster Tools（Yahoo Japan 使用 Bing 索引） |

---

## 5. robots.txt

### 5.1 实现

BrainVerse 使用 Next.js 的 `robots.ts` 文件生成 robots.txt：

```typescript
// apps/web/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
        '/private/',
        '/*?session=',     // 带 session 参数的 URL
      ],
    },
    sitemap: 'https://cowb.cc/sitemap.xml',
    host: 'https://cowb.cc',
  }
}
```

### 5.2 robots.txt 规范

- **位置**：`https://cowb.cc/robots.txt`
- **允许所有爬虫**：`User-agent: *` + `Allow: /`
- **禁止爬取**：
  - `/admin/` — 管理后台
  - `/api/` — API 接口（无 SEO 价值）
  - `/_next/` — Next.js 内部资源
  - `/private/` — 私有页面
  - 带 session 参数的 URL（避免重复内容）
- **声明 sitemap**：`Sitemap: https://cowb.cc/sitemap.xml`
- **声明 host**：`Host: https://cowb.cc`

### 5.3 生成内容示例

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/
Disallow: /*?session=

Sitemap: https://cowb.cc/sitemap.xml
Host: https://cowb.cc
```

---

## 6. rss.xml

### 6.1 实现

BrainVerse 为文章提供 RSS 订阅源，方便用户通过 RSS 阅读器订阅更新。

```typescript
// apps/web/app/rss.xml/route.ts
import { getPublishedArticles } from '@/lib/api'
import type { Locale } from '@brainverse/shared'

const BASE_URL = 'https://cowb.cc'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const locale = (url.searchParams.get('locale') ?? 'en') as Locale

  const articles = await getPublishedArticles(locale, { limit: 50 })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BrainVerse Articles</title>
    <link>${BASE_URL}/${locale}/articles</link>
    <description>Science-based brain health articles</description>
    <language>${locale}</language>
    <atom:link href="${BASE_URL}/rss.xml?locale=${locale}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${articles
      .map(
        (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${BASE_URL}/${locale}/articles/${article.category}/${article.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/${locale}/articles/${article.category}/${article.slug}</guid>
      <description><![CDATA[${article.metaDescription}]]></description>
      <category>${article.category}</category>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // 1 小时缓存
    },
  })
}
```

### 6.2 RSS 规范

- **位置**：`https://cowb.cc/rss.xml`
- **参数**：支持 `?locale=en|zh|ja` 获取不同语言版本
- **更新频率**：1 小时缓存（通过 `Cache-Control`）
- **内容**：最近 50 篇已发布文章
- **格式**：RSS 2.0 + Atom namespace

### 6.3 RSS 发现

在 `<head>` 中添加 RSS 自动发现标签：

```typescript
// apps/web/app/[locale]/layout.tsx
export const metadata = {
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
}
```

---

## 7. hreflang 实现

### 7.1 hreflang 规范

BrainVerse 支持三种语言，每个页面必须声明所有语言版本的 alternate 链接：

| hreflang | 语言 | 说明 |
|---|---|---|
| `en` | 英语 | 默认语言 |
| `zh` | 简体中文 | 中文版本 |
| `ja` | 日语 | 日语版本 |
| `x-default` | 默认 | 当浏览器语言不匹配时，回退到英语 |

### 7.2 实现

通过 Next.js Metadata API 的 `alternates.languages` 配置 hreflang：

```typescript
// 任何页面的 generateMetadata
export async function generateMetadata({ params: { locale, slug } }) {
  return {
    alternates: {
      canonical: `/${locale}/articles/brain-age/${slug}`,
      languages: {
        'en': `/en/articles/brain-age/${slug}`,
        'zh': `/zh/articles/brain-age/${slug}`,
        'ja': `/ja/articles/brain-age/${slug}`,
        'x-default': `/en/articles/brain-age/${slug}`,
      },
    },
  }
}
```

Next.js 会自动在 `<head>` 中生成对应的 `<link>` 标签：

```html
<link rel="canonical" href="https://cowb.cc/en/articles/brain-age/what-is-brain-age" />
<link rel="alternate" hreflang="en" href="https://cowb.cc/en/articles/brain-age/what-is-brain-age" />
<link rel="alternate" hreflang="zh" href="https://cowb.cc/zh/articles/brain-age/what-is-brain-age" />
<link rel="alternate" hreflang="ja" href="https://cowb.cc/ja/articles/brain-age/what-is-brain-age" />
<link rel="alternate" hreflang="x-default" href="https://cowb.cc/en/articles/brain-age/what-is-brain-age" />
```

### 7.3 hreflang 规则

1. **双向互指**：如果 A 页面声明了 B 页面的 hreflang，B 页面也必须声明 A 页面的 hreflang
2. **完整覆盖**：每个页面声明所有语言版本（en/zh/ja）+ x-default
3. **canonical 与 hreflang 一致**：canonical 指向当前语言版本，hreflang 指向所有语言版本
4. **x-default 必须存在**：作为浏览器语言不匹配时的回退

### 7.4 hreflang 验证

使用以下工具验证 hreflang 配置：

1. [Aleyda Solis 的 hreflang 检查器](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)
2. Google Search Console → International Targeting → Language
3. Google Search Console → 检查 hreflang 错误报告

---

## 8. 内链策略

### 8.1 内链原则

内链是 SEO 的重要策略，BrainVerse 通过合理的内链结构：

- 帮助搜索引擎发现和抓取所有页面
- 传递页面权重（PageRank）
- 引导用户发现相关内容
- 建立内容主题聚类

### 8.2 内链结构

```
                    ┌─────────────┐
                    │   首页       │
                    │  /en        │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
      ┌──────────┐  ┌──────────┐  ┌──────────────┐
      │ 游戏中心  │  │ 文章列表  │  │ Brain Age    │
      │ /games   │  │/articles │  │ /brain-age   │
      └────┬─────┘  └────┬─────┘  └──────┬───────┘
           │             │                │
           ▼             ▼                ▼
      ┌──────────┐  ┌──────────┐   ┌──────────────┐
      │ 游戏详情  │◄─│ 文章详情  │──►│ Brain Age    │
      │ /games/  │  │/articles/│   │ Assessment   │
      │ [slug]   │  │[cat]/[s] │   │              │
      └──────────┘  └──────────┘   └──────────────┘
```

### 8.3 内链规则

#### 8.3.1 文章 → 游戏

每篇文章必须关联至少 1 款平台游戏，并在内容中包含游戏链接：

```tsx
// 文章内容中的"相关游戏"部分
<section>
  <h2>Related Game</h2>
  <p>
    Practice your memory with our{' '}
    <Link href={`/${locale}/games/digit-span`}>
      Digit Span game
    </Link>{' '}
    — a science-based working memory trainer.
  </p>
</section>
```

#### 8.3.2 游戏 → 相关文章

每个游戏页面推荐相关文章：

```tsx
// 游戏详情页
<section>
  <h2>Related Articles</h2>
  <ul>
    {relatedArticles.map(article => (
      <li key={article.slug}>
        <Link href={`/${locale}/articles/${article.category}/${article.slug}`}>
          {article.title}
        </Link>
      </li>
    ))}
  </ul>
</section>
```

#### 8.3.3 面包屑导航

所有内容页必须包含面包屑导航：

```tsx
// 面包屑组件
<nav aria-label="Breadcrumb">
  <ol>
    <li><Link href={`/${locale}`}>Home</Link></li>
    <li><Link href={`/${locale}/articles`}>Articles</Link></li>
    <li><Link href={`/${locale}/articles/${category}`}>{categoryName}</Link></li>
    <li aria-current="page">{article.title}</li>
  </ol>
</nav>
```

#### 8.3.4 文章间内链

每篇文章必须包含至少 3 条指向其他文章的内链：

```tsx
// 文章内容中的内链
<p>
  As we explored in our{' '}
  <Link href={`/${locale}/articles/memory/forgetting-curve-ebbinghaus`}>
    guide to the forgetting curve
  </Link>
  , spaced repetition is key to long-term retention.
</p>
```

### 8.4 内链锚文本规范

- **描述性锚文本**：避免"点击这里"、"了解更多"，使用描述性文字
- **关键词适度**：锚文本包含目标关键词，但避免过度优化
- **自然语言**：锚文本融入句子，读起来自然

```tsx
// ✅ 正确
<Link href="/en/games/digit-span">Digit Span working memory trainer</Link>

// ❌ 避免
<Link href="/en/games/digit-span">click here</Link>
<Link href="/en/games/digit-span">Digit Span | Memory Game | Brain Training</Link> // 关键词堆砌
```

---

## 9. 程序化 SEO 架构

### 9.1 程序化 SEO 概述

BrainVerse 通过程序化方式生成 300+ 着陆页，覆盖长尾关键词。每个页面：

- 有独特的内容（非模板重复）
- 针对特定长尾关键词
- 包含完整 SEO 元数据
- 支持三语版本

### 9.2 程序化页面架构

#### 9.2.1 文章着陆页

**URL 结构**：`/[locale]/articles/[category]/[slug]`

**示例**：
- `/en/articles/brain-age/what-is-brain-age`
- `/zh/articles/brain-age/what-is-brain-age`
- `/ja/articles/brain-age/what-is-brain-age`

**页面内容**（统一结构）：
1. 标题
2. 元描述
3. 引言（≥ 150 字）
4. 科学解释（≥ 600 字，含引用）
5. 实践建议（≥ 300 字，含 3 条可操作建议）
6. 相关游戏段落（关联至少 1 款游戏）
7. FAQ（≥ 4 条问答）
8. 内链（≥ 3 条指向其他文章）
9. JSON-LD 结构化数据（Article + FAQ + Breadcrumb）

#### 9.2.2 游戏着陆页

**URL 结构**：`/[locale]/games/[slug]`

**示例**：
- `/en/games/digit-span`
- `/zh/games/digit-span`
- `/ja/games/digit-span`

**页面内容**：
1. 游戏标题与描述（本地化）
2. 认知维度说明（关联科学概念）
3. 游戏玩法说明
4. 立即开始按钮
5. 相关文章推荐
6. JSON-LD 结构化数据（WebApplication + Breadcrumb）

#### 9.2.3 Brain Age 着陆页

**URL 结构**：`/[locale]/brain-age`

**示例**：
- `/en/brain-age`
- `/zh/brain-age`
- `/ja/brain-age`

**页面内容**：
1. Brain Age 概念介绍
2. 测试入口
3. 测试原理说明
4. 相关文章推荐（Brain Age 类别）
5. JSON-LD 结构化数据（WebApplication + Breadcrumb）

### 9.3 程序化页面路由实现

#### 9.3.1 文章路由

```typescript
// apps/web/app/[locale]/articles/[category]/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Locale, ArticleCategory } from '@brainverse/shared'
import { getArticle, getRelatedArticles } from '@/lib/api'
import { BreadcrumbLd } from '@/components/seo/breadcrumb-ld'
import { JsonLd } from '@/components/seo/json-ld'

// 预生成所有文章路径
export async function generateStaticParams() {
  const articles = await getAllPublishedArticles()
  return articles.flatMap(article =>
    LOCALES.map(locale => ({
      locale,
      category: article.category,
      slug: article.slug,
    }))
  )
}

export default async function ArticlePage({
  params: { locale, category, slug },
}: {
  params: { locale: Locale; category: ArticleCategory; slug: string }
}) {
  const article = await getArticle(slug, locale)
  if (!article) notFound()

  const relatedArticles = await getRelatedArticles(article.id, locale, 3)

  return (
    <>
      <BreadcrumbLd
        items={[
          { name: 'Home', url: `/${locale}` },
          { name: 'Articles', url: `/${locale}/articles` },
          { name: article.categoryName, url: `/${locale}/articles/${category}` },
          { name: article.title, url: `/${locale}/articles/${category}/${slug}` },
        ]}
      />
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />

      <article>
        {/* 内容渲染 */}
      </article>
    </>
  )
}
```

#### 9.3.2 游戏路由

```typescript
// apps/web/app/[locale]/games/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Locale } from '@brainverse/shared'
import { getGame, getRelatedArticles } from '@/lib/api'

export async function generateStaticParams() {
  const games = await getAllActiveGames()
  return games.flatMap(game =>
    LOCALES.map(locale => ({ locale, slug: game.slug }))
  )
}

export default async function GamePage({
  params: { locale, slug },
}: {
  params: { locale: Locale; slug: string }
}) {
  const game = await getGame(slug, locale)
  if (!game) notFound()

  // ... 渲染游戏页
}
```

### 9.4 程序化 SEO 内容质量

程序化生成的页面必须满足质量约束（详见 spec.md 的"100 篇 SEO 文章"质量约束规范）：

- **降 AI 痕迹**：禁止 AI 高频词，段落长度变化 > 30%
- **内容查重**：跨文章重复率 < 15%，同类 < 20%
- **科学引用**：每篇 ≥ 2 篇同行评审文献引用
- **原创性**：每篇 ≥ 1 个原创观点
- **实用性**：每篇 ≥ 3 条可操作建议
- **关联性**：每篇关联 ≥ 1 款平台游戏
- **结构一致性**：统一 8 段结构
- **多语言**：en/zh/ja 三语版本齐全，本地化非直译

### 9.5 程序化页面性能优化

由于程序化页面数量大（300+），需特别注意构建性能：

1. **静态生成（SSG）**：所有文章页使用 `generateStaticParams` 在构建时预渲染
2. **增量静态再生成（ISR）**：文章更新时按需再生成，而非全量重建
3. **分批构建**：如构建时间过长，按类别分批构建
4. **CDN 缓存**：静态页面通过 Cloudflare CDN 缓存

```typescript
// 启用 ISR
export const revalidate = 3600  // 1 小时后台再生成

export default async function ArticlePage({ params }) {
  // ...
}
```

---

## 10. SEO 监控与维护

### 10.1 Google Search Console 监控

定期检查以下指标：

| 指标 | 频率 | 关注点 |
|---|---|---|
| **收录情况** | 每周 | 已收录页面数、未收录页面 |
| **搜索表现** | 每周 | 展示次数、点击次数、CTR、平均排名 |
| **Core Web Vitals** | 每月 | LCP、INP、CLS 通过率 |
| **结构化数据错误** | 每周 | Article、FAQ、Breadcrumb 错误 |
| **hreflang 错误** | 每周 | 缺失或错误的 hreflang 配置 |
| **移动可用性** | 每月 | 移动端问题 |

### 10.2 SEO 审计清单（定期执行）

每月执行一次 SEO 审计：

- [ ] 所有页面 title、description 唯一且符合长度
- [ ] 所有页面有 canonical URL
- [ ] 所有页面有 hreflang alternate（en/zh/ja + x-default）
- [ ] 所有文章有 Article + FAQ + Breadcrumb JSON-LD
- [ ] sitemap.xml 可访问且包含所有页面
- [ ] robots.txt 配置正确
- [ ] 无 404 错误（检查 Search Console）
- [ ] 无重复内容问题
- [ ] 图片有 alt 属性
- [ ] 内链无断链
- [ ] Core Web Vitals 全部通过

---

## 11. 相关文档

- [development.md](./development.md) — 开发环境搭建
- [deployment.md](./deployment.md) — 部署指南（含 SEO 验证清单）
- [i18n.md](./i18n.md) — 国际化指南（与 hreflang 紧密相关）
- [testing.md](./testing.md) — 测试策略
- [Next.js Metadata 文档](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Sitemap 文档](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Schema.org 官方文档](https://schema.org/)
- [Google 搜索中心文档](https://developers.google.com/search/docs)
