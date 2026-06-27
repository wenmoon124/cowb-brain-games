// @brainverse/content-engine — SEO metadata generation.
//
// Produces the per-locale SEO metadata object the Next.js SSR layer injects
// into <head>. All values are derived from a single ArticleDocument + the
// requested locale.

import type { Locale } from '@brainverse/shared';
import type { ArticleDocument } from './article-schema.js';

/** Production origin used to build absolute canonical / og URLs. */
export const SITE_ORIGIN = 'https://cowb.cc';

/** Default OG image used when an article has no explicit cover. */
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og/default.png`;

/**
 * SEO metadata payload. Mirrors the subset of Next.js `Metadata` that we
 * control from the content layer.
 */
export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
}

/**
 * Generate SEO metadata for an article in a specific locale.
 *
 * - `title` comes from the translation's `title`.
 * - `description` comes from the translation's `metaDescription`.
 * - `canonicalUrl` is `${SITE_ORIGIN}/${locale}/articles/${slug}`.
 * - `ogImage` falls back to {@link DEFAULT_OG_IMAGE} when no cover is set.
 */
export function generateSeoMetadata(
  article: ArticleDocument,
  locale: Locale,
  options?: { coverImage?: string },
): SeoMetadata {
  const translation = article.translations[locale];
  const slug = article.article.slug;
  return {
    title: translation.title,
    description: translation.metaDescription,
    canonicalUrl: `${SITE_ORIGIN}/${locale}/articles/${slug}`,
    ogImage: options?.coverImage ?? DEFAULT_OG_IMAGE,
  };
}
