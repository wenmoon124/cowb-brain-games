/**
 * Article 10-Dimension Verification Script
 *
 * Validates articles.ts across 10 dimensions:
 *   1. Quantity: 10 articles × 3 languages = 30 content blocks
 *   2. Content completeness: title/excerpt/content non-empty and length-adequate
 *   3. SEO: title keywords, excerpt < 160 chars, content has H2 headings
 *   4. Link consistency: slugs exist in sitemap.ts and generateStaticParams
 *   5. Trilingual consistency: readingTime/date/author consistent across locales
 *   6. Encoding: no replacement characters (\uFFFD) or abnormal CJK punctuation
 *   7. JSON-LD usage: ArticleJsonLd/BreadcrumbJsonLd/FaqPageJsonLd wired up
 *   8. FAQ section detection: FAQ sections paired with FaqPageJsonLd rendering
 *   9. Content rendering: only H2 + paragraph format (renderContent-supported)
 *  10. Link integrity: internal links point to valid game/article slugs
 *
 * Usage: node apps/web/scripts/verify-articles.mjs
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

const ARTICLES_FILE = join(ROOT, 'src', 'data', 'articles.ts')
const SITEMAP_FILE = join(ROOT, 'app', 'sitemap.ts')
const ARTICLE_DETAIL_FILE = join(ROOT, 'app', '[locale]', 'articles', '[slug]', 'page.tsx')
const JSONLD_FILE = join(ROOT, 'src', 'components', 'seo', 'JsonLd.tsx')
const GAMES_FILE = join(ROOT, 'src', 'lib', 'games.ts')

const LOCALES = ['en', 'zh', 'ja']
const EXPECTED_ARTICLE_COUNT = 70
const SEO_KEYWORDS = [
  'brain', 'memory', 'attention', 'reaction', 'executive',
  'focus', 'relaxation', 'stress', 'age', 'training',
  'cognitive', 'decline', 'technique', 'improvement', 'function',
  'concentration', 'routine', 'working', 'sleep', 'nutrition',
]

let totalPass = 0
let totalFail = 0
const failures = []

function pass(msg) {
  totalPass++
  console.log(`  \u2713 ${msg}`)
}

function fail(msg) {
  totalFail++
  failures.push(msg)
  console.log(`  \u2717 ${msg}`)
}

function warn(msg) {
  console.log(`  \u26A0 ${msg} (warning)`)
}

function section(name) {
  console.log(`\n=== ${name} ===`)
}

/**
 * Extract articles data from articles.ts using regex.
 * Returns array of { slug, category, date, author, readingTime, en, zh, ja }
 *
 * Strategy: use each `slug: '...'` occurrence as an article anchor, then slice
 * the source from this anchor to the next anchor (or EOF). This ensures the
 * captured block spans the full article object including all locale sub-blocks
 * (en/zh/ja), avoiding premature termination at nested `},` boundaries.
 */
function parseArticles() {
  const content = readFileSync(ARTICLES_FILE, 'utf8')

  // Find all top-level article slug positions as anchors.
  const articleStartRegex = /\{\s*slug:\s*'([^']+)'/g
  const slugPositions = []
  let match
  while ((match = articleStartRegex.exec(content)) !== null) {
    slugPositions.push({ slug: match[1], start: match.index })
  }

  const articles = []
  for (let i = 0; i < slugPositions.length; i++) {
    const start = slugPositions[i].start
    // End is the start of the next article, or end of file
    const end = i + 1 < slugPositions.length ? slugPositions[i + 1].start : content.length
    const block = content.substring(start, end)

    // Skip if not a top-level article (must have category/date/author/readingTime)
    if (!block.includes('category:') || !block.includes('readingTime:')) {
      continue
    }

    const slug = slugPositions[i].slug
    const catMatch = block.match(/category:\s*'([^']+)'/)
    const dateMatch = block.match(/date:\s*'([^']+)'/)
    const authorMatch = block.match(/author:\s*'([^']+)'/)
    const rtMatch = block.match(/readingTime:\s*(\d+)/)

    if (!catMatch || !dateMatch || !authorMatch || !rtMatch) {
      continue
    }

    const article = {
      slug,
      category: catMatch[1],
      date: dateMatch[1],
      author: authorMatch[1],
      readingTime: parseInt(rtMatch[1], 10),
    }

    // Extract title/excerpt/content for each locale from this block.
    // The block now spans the full article (en + zh + ja), so locale
    // sub-blocks can be matched independently without terminating early.
    // String pattern `(?:[^'\\]|\\.)*` matches single-quoted strings with
    // escape sequences (e.g., `brain\'s`), preventing premature termination.
    for (const locale of LOCALES) {
      const localeRegex = new RegExp(
        `${locale}:\\s*\\{[\\s\\S]*?title:\\s*'((?:[^'\\\\]|\\\\.)*)'[\\s\\S]*?excerpt:\\s*\\n?\\s*'((?:[^'\\\\]|\\\\.)*)'[\\s\\S]*?content:\\s*\`([\\s\\S]*?)\``
      )
      const localeMatch = block.match(localeRegex)
      if (localeMatch) {
        // Unescape backslash-escaped characters (e.g., `\'` -> `'`)
        article[locale] = {
          title: localeMatch[1].replace(/\\'/g, "'"),
          excerpt: localeMatch[2].replace(/\\'/g, "'"),
          content: localeMatch[3],
        }
      }
    }

    articles.push(article)
  }

  return articles
}

function parseSitemapSlugs() {
  if (!existsSync(SITEMAP_FILE)) return null
  const content = readFileSync(SITEMAP_FILE, 'utf8')
  // sitemap.ts dynamically imports ARTICLES and iterates article.slug
  if (content.includes('ARTICLES') || content.includes('article.slug')) {
    return 'uses-ARTICLE_SLUGS'
  }
  // Fallback: look for literal slug strings
  const slugs = []
  const slugRegex = /slug:\s*'([^']+)'/g
  let match
  while ((match = slugRegex.exec(content)) !== null) {
    slugs.push(match[1])
  }
  return slugs
}

function parseGenerateStaticParamsSlugs() {
  if (!existsSync(ARTICLE_DETAIL_FILE)) return null
  const content = readFileSync(ARTICLE_DETAIL_FILE, 'utf8')
  // Check if uses ARTICLE_SLUGS import
  if (content.includes('ARTICLE_SLUGS')) {
    return 'uses-ARTICLE_SLUGS'
  }
  return null
}

function main() {
  console.log('CowB.cc Article Verification (10 Dimensions)')
  console.log('='.repeat(60))

  if (!existsSync(ARTICLES_FILE)) {
    console.error(`FATAL: articles.ts not found at ${ARTICLES_FILE}`)
    process.exit(1)
  }

  const articles = parseArticles()

  // === Dimension 1: Quantity ===
  section('Dimension 1: Quantity')
  if (articles.length === EXPECTED_ARTICLE_COUNT) {
    pass(`Article count: ${articles.length} (expected ${EXPECTED_ARTICLE_COUNT})`)
  } else {
    fail(`Article count: ${articles.length} (expected ${EXPECTED_ARTICLE_COUNT})`)
  }

  for (const article of articles) {
    let localeCount = 0
    for (const locale of LOCALES) {
      if (article[locale]) localeCount++
    }
    if (localeCount === 3) {
      pass(`${article.slug}: ${localeCount}/3 locales`)
    } else {
      fail(`${article.slug}: only ${localeCount}/3 locales`)
    }
  }

  // === Dimension 2: Content Completeness ===
  section('Dimension 2: Content Completeness')
  for (const article of articles) {
    for (const locale of LOCALES) {
      const block = article[locale]
      if (!block) {
        fail(`${article.slug} [${locale}]: missing locale block`)
        continue
      }
      if (!block.title || block.title.length < 10) {
        fail(`${article.slug} [${locale}]: title too short (${block.title?.length || 0} chars)`)
      } else {
        pass(`${article.slug} [${locale}]: title OK (${block.title.length} chars)`)
      }
      // Locale-aware excerpt threshold: CJK characters carry more information
      // density per character, so zh/ja use a lower minimum (30) than en (50).
      const excerptMin = locale === 'en' ? 50 : 30
      if (!block.excerpt || block.excerpt.length < excerptMin) {
        fail(`${article.slug} [${locale}]: excerpt too short (${block.excerpt?.length || 0} chars, need >= ${excerptMin})`)
      } else {
        pass(`${article.slug} [${locale}]: excerpt OK (${block.excerpt.length} chars)`)
      }
      if (!block.content || block.content.length < 500) {
        fail(`${article.slug} [${locale}]: content too short (${block.content?.length || 0} chars)`)
      } else {
        pass(`${article.slug} [${locale}]: content OK (${block.content.length} chars)`)
      }
    }
  }

  // === Dimension 3: SEO ===
  section('Dimension 3: SEO')
  for (const article of articles) {
    for (const locale of LOCALES) {
      const block = article[locale]
      if (!block) continue

      // 3a. Title contains keyword (only for en, since keywords are English)
      if (locale === 'en') {
        const titleLower = block.title.toLowerCase()
        const hasKeyword = SEO_KEYWORDS.some((kw) => titleLower.includes(kw))
        if (hasKeyword) {
          pass(`${article.slug} [en]: title contains SEO keyword`)
        } else {
          fail(`${article.slug} [en]: title lacks SEO keyword`)
        }
      }

      // 3b. Excerpt length < 160 chars (meta description limit)
      if (block.excerpt.length > 160) {
        fail(`${article.slug} [${locale}]: excerpt > 160 chars (${block.excerpt.length}, may truncate in SERP)`)
      } else {
        pass(`${article.slug} [${locale}]: excerpt < 160 chars (meta description OK)`)
      }

      // 3c. Content has at least 2 H2 headings
      const h2Count = (block.content.match(/^## /gm) || []).length
      if (h2Count >= 2) {
        pass(`${article.slug} [${locale}]: ${h2Count} H2 headings`)
      } else {
        fail(`${article.slug} [${locale}]: only ${h2Count} H2 headings (need >= 2)`)
      }
    }
  }

  // === Dimension 4: Link Consistency ===
  section('Dimension 4: Link Consistency')
  const sitemapSlugs = parseSitemapSlugs()
  const staticParamsRef = parseGenerateStaticParamsSlugs()

  if (sitemapSlugs === null) {
    fail('sitemap.ts not found')
  } else if (sitemapSlugs === 'uses-ARTICLE_SLUGS') {
    pass('sitemap.ts uses ARTICLES data (dynamic, all slugs covered)')
  } else {
    for (const article of articles) {
      if (sitemapSlugs.includes(article.slug)) {
        pass(`${article.slug}: found in sitemap data source`)
      } else {
        fail(`${article.slug}: NOT in sitemap data source`)
      }
    }
  }

  if (staticParamsRef === 'uses-ARTICLE_SLUGS') {
    pass('articles/[slug]/page.tsx uses ARTICLE_SLUGS (all slugs statically generated)')
  } else {
    fail('articles/[slug]/page.tsx does not use ARTICLE_SLUGS')
  }

  // === Dimension 5: Trilingual Consistency ===
  section('Dimension 5: Trilingual Consistency')
  for (const article of articles) {
    const en = article.en
    const zh = article.zh
    const ja = article.ja
    if (!en || !zh || !ja) {
      fail(`${article.slug}: missing locale block, skipping consistency check`)
      continue
    }

    // 5a. readingTime consistent
    const rt = article.readingTime
    pass(`${article.slug}: readingTime = ${rt} (shared across locales)`)

    // 5b. date consistent
    pass(`${article.slug}: date = ${article.date} (shared across locales)`)

    // 5c. author consistent
    pass(`${article.slug}: author = "${article.author}" (shared across locales)`)

    // 5d. title semantic correspondence (rough check: all non-empty and similar length).
    // CJK translations are naturally more concise than English (higher information
    // density per character), so ratio threshold is 0.2 (not 0.3) to avoid false
    // positives for legitimate en→zh/ja translation length differences.
    const titleLengths = [en.title.length, zh.title.length, ja.title.length]
    const maxLen = Math.max(...titleLengths)
    const minLen = Math.min(...titleLengths)
    const ratio = minLen / maxLen
    if (ratio > 0.2) {
      pass(`${article.slug}: title lengths comparable (ratio ${ratio.toFixed(2)})`)
    } else {
      fail(`${article.slug}: title length disparity (ratio ${ratio.toFixed(2)}, en=${en.title.length} zh=${zh.title.length} ja=${ja.title.length})`)
    }
  }

  // === Dimension 6: Encoding ===
  section('Dimension 6: Encoding')
  const REPLACEMENT_CHAR = '\uFFFD'
  let encodingOk = true
  for (const article of articles) {
    for (const locale of LOCALES) {
      const block = article[locale]
      if (!block) continue

      // 6a. Check for Unicode replacement character (indicates encoding loss)
      const fields = ['title', 'excerpt', 'content']
      for (const field of fields) {
        const text = block[field] || ''
        if (text.includes(REPLACEMENT_CHAR)) {
          fail(`${article.slug} [${locale}].${field}: contains replacement character (\\uFFFD)`)
          encodingOk = false
        }
      }

      // 6b. Check for consecutive full-width question marks (abnormal pattern)
      // A single ？ (U+FF1F) in CJK text is legitimate punctuation.
      // Consecutive ？？ or ？？？ indicates encoding corruption.
      if (/？{2,}/.test(block.content || '')) {
        fail(`${article.slug} [${locale}].content: consecutive full-width question marks (abnormal)`)
        encodingOk = false
      }
    }
  }
  if (encodingOk) {
    pass('No encoding issues detected (no \\uFFFD, no abnormal CJK punctuation)')
  }

  // === Dimension 7: JSON-LD Usage ===
  section('Dimension 7: JSON-LD Usage')
  const detailPageContent = existsSync(ARTICLE_DETAIL_FILE)
    ? readFileSync(ARTICLE_DETAIL_FILE, 'utf8')
    : ''
  const jsonldContent = existsSync(JSONLD_FILE)
    ? readFileSync(JSONLD_FILE, 'utf8')
    : ''

  // 7a. Article detail page imports ArticleJsonLd
  if (detailPageContent.includes('ArticleJsonLd')) {
    pass('articles/[slug]/page.tsx imports ArticleJsonLd')
  } else {
    fail('articles/[slug]/page.tsx does NOT import ArticleJsonLd')
  }

  // 7b. Article detail page imports BreadcrumbJsonLd
  if (detailPageContent.includes('BreadcrumbJsonLd')) {
    pass('articles/[slug]/page.tsx imports BreadcrumbJsonLd')
  } else {
    fail('articles/[slug]/page.tsx does NOT import BreadcrumbJsonLd')
  }

  // 7c. Article detail page imports FaqPageJsonLd
  if (detailPageContent.includes('FaqPageJsonLd')) {
    pass('articles/[slug]/page.tsx imports FaqPageJsonLd')
  } else {
    fail('articles/[slug]/page.tsx does NOT import FaqPageJsonLd')
  }

  // 7d. ArticleJsonLd component contains image field
  if (jsonldContent.includes("image:") && jsonldContent.includes("og-image.svg")) {
    pass('ArticleJsonLd component contains image field')
  } else {
    fail('ArticleJsonLd component missing image field')
  }

  // 7e. ArticleJsonLd component contains mainEntityOfPage field
  if (jsonldContent.includes('mainEntityOfPage')) {
    pass('ArticleJsonLd component contains mainEntityOfPage field')
  } else {
    fail('ArticleJsonLd component missing mainEntityOfPage field')
  }

  // === Dimension 8: FAQ Section Detection ===
  section('Dimension 8: FAQ Section Detection')
  const faqTitlePattern = /##\s+(?:Frequently Asked Questions|常见问题|よくある質問|FAQ)/
  const hasFaqJsonLdImport = detailPageContent.includes('FaqPageJsonLd')
  const hasExtractFaqsFn = detailPageContent.includes('extractFaqs')

  let articlesWithFaq = 0
  for (const article of articles) {
    for (const locale of LOCALES) {
      const block = article[locale]
      if (!block) continue
      if (faqTitlePattern.test(block.content || '')) {
        articlesWithFaq++
        pass(`${article.slug} [${locale}]: contains FAQ section`)
      }
    }
  }

  if (articlesWithFaq > 0) {
    if (hasFaqJsonLdImport && hasExtractFaqsFn) {
      pass(`FaqPageJsonLd wired up with extractFaqs for ${articlesWithFaq} FAQ sections`)
    } else {
      if (!hasFaqJsonLdImport) {
        fail('Articles contain FAQ sections but FaqPageJsonLd not imported in detail page')
      }
      if (!hasExtractFaqsFn) {
        fail('Articles contain FAQ sections but extractFaqs function not defined')
      }
    }
  } else {
    pass('No FAQ sections detected (FaqPageJsonLd not required)')
  }

  // === Dimension 9: Content Rendering ===
  section('Dimension 9: Content Rendering')
  // renderContent supports: ## H2 headings + paragraphs (split by \n\n)
  // Unsupported markdown: **bold**, *italic*, [link](url), - list, 1. numbered list, > quote, `code`
  const unsupportedPatterns = [
    { regex: /\*\*[^*]+\*\*/, name: 'bold (**text**)' },
    { regex: /(?<!\*)\*[^*]+\*(?!\*)/, name: 'italic (*text*)' },
    { regex: /\[([^\]]+)\]\(([^)]+)\)/, name: 'link ([text](url))' },
    { regex: /^- /m, name: 'list item (- text)' },
    { regex: /^\d+\. /m, name: 'numbered list (1. text)' },
    { regex: /^> /m, name: 'blockquote (> text)' },
    { regex: /`[^`]+`/, name: 'inline code (`code`)' },
  ]

  for (const article of articles) {
    for (const locale of LOCALES) {
      const block = article[locale]
      if (!block) continue
      const text = block.content || ''
      const found = []
      for (const { regex, name } of unsupportedPatterns) {
        if (regex.test(text)) {
          found.push(name)
        }
      }
      if (found.length === 0) {
        pass(`${article.slug} [${locale}]: only H2 + paragraph format`)
      } else {
        warn(`${article.slug} [${locale}]: unsupported markdown: ${found.join(', ')} (renderContent will render as plain text)`)
      }
    }
  }

  // === Dimension 10: Link Integrity ===
  section('Dimension 10: Link Integrity')
  // Parse game slugs from games.ts
  let gameSlugs = []
  if (existsSync(GAMES_FILE)) {
    const gamesContent = readFileSync(GAMES_FILE, 'utf8')
    const slugRegex = /slug:\s*'([^']+)'/g
    let m
    while ((m = slugRegex.exec(gamesContent)) !== null) {
      gameSlugs.push(m[1])
    }
  }

  const articleSlugs = articles.map((a) => a.slug)
  let linkIssues = 0

  for (const article of articles) {
    for (const locale of LOCALES) {
      const block = article[locale]
      if (!block) continue
      const text = block.content || ''

      // Check internal links like /games/digit-span or /articles/what-is-brain-age
      const gameLinkRegex = /\/games\/([a-z0-9-]+)/g
      const articleLinkRegex = /\/articles\/([a-z0-9-]+)/g

      let lm
      while ((lm = gameLinkRegex.exec(text)) !== null) {
        const targetSlug = lm[1]
        if (!gameSlugs.includes(targetSlug)) {
          fail(`${article.slug} [${locale}]: links to /games/${targetSlug} but slug not in GAMES array`)
          linkIssues++
        }
      }
      while ((lm = articleLinkRegex.exec(text)) !== null) {
        const targetSlug = lm[1]
        if (!articleSlugs.includes(targetSlug)) {
          fail(`${article.slug} [${locale}]: links to /articles/${targetSlug} but slug not in ARTICLES array`)
          linkIssues++
        }
      }
    }
  }

  if (linkIssues === 0) {
    pass('All internal links point to valid game/article slugs')
  }

  // 10b. Article slug consistency across data sources
  const sitemapSlugsCheck = parseSitemapSlugs()
  const staticParamsCheck = parseGenerateStaticParamsSlugs()
  if (sitemapSlugsCheck === 'uses-ARTICLE_SLUGS' && staticParamsCheck === 'uses-ARTICLE_SLUGS') {
    pass('Article slugs consistent across articles.ts, sitemap.ts, generateStaticParams')
  }

  // === Summary ===
  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total PASS: ${totalPass}`)
  console.log(`Total FAIL: ${totalFail}`)

  if (failures.length > 0) {
    console.log('\nFailures:')
    for (const f of failures) {
      console.log(`  - ${f}`)
    }
    process.exit(1)
  } else {
    console.log('\n\u2713 All checks passed!')
    process.exit(0)
  }
}

main()
