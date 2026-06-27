// @brainverse/content-engine — JSON-LD structured data generators.
//
// Each function returns a plain Schema.org object ready to be serialized into
// a `<script type="application/ld+json">` tag. Objects are typed as
// `Record<string, unknown>` to stay forward-compatible with the evolving
// Schema.org vocabulary without forcing a runtime dependency on a JSON-LD
// typings package.

import type { FaqItem } from '@brainverse/core';
import type { Locale } from '@brainverse/shared';
import type { ArticleDocument } from './article-schema.js';
import { SITE_ORIGIN } from './seo-metadata.js';

/** A single breadcrumb trail item. */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate `Article` JSON-LD for an article in the given locale.
 */
export function generateArticleJsonLd(
  article: ArticleDocument,
  locale: Locale,
  options?: { coverImage?: string },
): Record<string, unknown> {
  const translation = article.translations[locale];
  const slug = article.article.slug;
  const url = `${SITE_ORIGIN}/${locale}/articles/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: translation.title,
    description: translation.metaDescription,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: options?.coverImage ?? `${SITE_ORIGIN}/og/default.png`,
    datePublished: article.article.createdAt,
    dateModified: article.article.updatedAt,
    inLanguage: locale,
    author: {
      '@type': 'Organization',
      name: 'BrainVerse',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BrainVerse',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/logo.png`,
      },
    },
  };
}

/**
 * Generate `FAQPage` JSON-LD from a list of Q&A pairs.
 */
export function generateFaqJsonLd(
  faqs: readonly FaqItem[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

/**
 * Generate `BreadcrumbList` JSON-LD from a list of breadcrumb items.
 */
export function generateBreadcrumbJsonLd(
  breadcrumbs: readonly BreadcrumbItem[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: b.name,
      item: b.url,
    })),
  };
}
