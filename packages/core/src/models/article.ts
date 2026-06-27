// @brainverse/core — Content (article) catalog + translation models.

import type { Locale } from '@brainverse/shared';

/**
 * An article in the content catalog. The article row itself is locale-
 * independent; localized fields (title, content, faq, …) live in
 * {@link ArticleTranslation}. Mirrors the `articles` D1 table.
 */
export interface Article {
  id: string;
  slug: string;
  category: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * A single Q&A pair embedded in an article's FAQ section. Rendered both in the
 * page body and as JSON-LD `FAQPage` structured data.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Localized content for an {@link Article}, for a given {@link Locale}.
 * `content` is the article body in a serializable rich-text or markdown form.
 * Mirrors the `article_translations` D1 table.
 */
export interface ArticleTranslation {
  id: string;
  articleId: string;
  locale: Locale;
  title: string;
  metaDescription: string;
  content: string;
  faq: FaqItem[];
  createdAt: string;
  updatedAt: string;
}
