// workers/api/content — seed article data types.
//
// These types describe the shape of the seed article data files that live
// in `workers/api/content/articles/`. They are the source-of-truth input
// for the seed script (`workers/api/scripts/seed-articles.ts`) which
// generates D1 INSERT statements for the `articles`, `article_translations`
// and `seo_metadata` tables.
//
// The shape is intentionally close to (but flatter than) the
// `ArticleDocument` type from `@brainverse/content-engine` so that the
// quality checker can consume `ArticleData` directly via structural
// typing.

/**
 * The five content categories. Matches `categories` from
 * `@brainverse/content-engine` and the `articles.category` D1 column.
 */
export type ArticleCategory =
  | 'brain-age'
  | 'memory'
  | 'attention'
  | 'focus'
  | 'relaxation';

/**
 * A complete seed article: locale-independent metadata plus the three
 * localized translations and the three localized SEO metadata payloads.
 */
export interface ArticleData {
  /** URL-safe kebab-case slug, unique across the batch. */
  slug: string;
  /** Content category id. */
  category: ArticleCategory;
  /** Display order within the category (ascending). */
  sortOrder: number;
  /** Whether the article is featured on the content hub. */
  featured: boolean;
  /** Localized translations for every supported locale. */
  translations: {
    en: ArticleTranslationData;
    zh: ArticleTranslationData;
    ja: ArticleTranslationData;
  };
  /** Localized SEO metadata for every supported locale. */
  seoMetadata: {
    en: SeoMetadataData;
    zh: SeoMetadataData;
    ja: SeoMetadataData;
  };
}

/**
 * Localized content for an article. `content` is markdown with the 8
 * required sections (Introduction, Scientific Explanation, Practical
 * Advice, Related Games, FAQ, Internal Links, Key Takeaways, References).
 */
export interface ArticleTranslationData {
  /** Article title in the locale's language. */
  title: string;
  /** Meta description for <meta name="description">, ≤ 150 characters. */
  metaDescription: string;
  /** Article body in markdown — must contain the 8 required sections. */
  content: string;
  /** FAQ Q&A pairs, ≥ 4 items. Also rendered as FAQPage JSON-LD. */
  faq: FaqItem[];
}

/**
 * A single FAQ Q&A pair. Mirrors `FaqItem` from `@brainverse/core`.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Per-locale SEO metadata stored in the `seo_metadata` D1 table.
 */
export interface SeoMetadataData {
  /** <title> tag content. */
  title: string;
  /** <meta name="description"> content. */
  description: string;
  /** Canonical URL for this locale. */
  canonicalUrl: string;
  /** JSON-LD structured data (Article + FAQPage), serialized as a string. */
  jsonLd: string;
}

/** All supported locales for article content. */
export const ARTICLE_LOCALES: readonly ('en' | 'zh' | 'ja')[] = [
  'en',
  'zh',
  'ja',
] as const;
