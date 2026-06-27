// @brainverse/content-engine — article schema and validation.
//
// Defines the canonical shape of a content article (the union of an
// {@link Article} row and its three {@link ArticleTranslation} rows) and a
// validation function used at CMS write time and at SSG build time.

import type {
  Article,
  ArticleTranslation,
  FaqItem,
} from '@brainverse/core';
import type { Locale } from '@brainverse/shared';

/**
 * A fully-assembled article: the locale-independent metadata plus a
 * translation for every supported locale. This is the shape the CMS writes
 * and the SSG pipeline consumes.
 */
export interface ArticleDocument {
  article: Article;
  translations: Record<Locale, ArticleTranslation>;
}

/**
 * Result of validating an {@link ArticleDocument}.
 */
export interface ArticleValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Locales that must be present on every published article. Mirrors
 * {@link LOCALES} from `@brainverse/shared` but typed as a tuple so
 * `translations` can be exhaustively checked.
 */
const REQUIRED_LOCALES: readonly Locale[] = ['en', 'zh', 'ja'] as const;

/**
 * Validate an {@link ArticleDocument}.
 *
 * Checks:
 * - `article.slug` is non-empty and matches the URL-safe slug pattern.
 * - `article.category` is one of the known category ids.
 * - Every locale in {@link REQUIRED_LOCALES} is present in `translations`.
 * - Each translation has non-empty `title`, `metaDescription` (<=160 chars)
 *   and `content`.
 * - Each FAQ item has non-empty `question` and `answer`.
 */
export function validateArticle(
  doc: ArticleDocument,
  options?: { allowedCategories?: readonly string[] },
): ArticleValidationResult {
  const errors: string[] = [];

  const slug = doc.article.slug.trim();
  if (slug.length === 0) {
    errors.push('article.slug must not be empty');
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) {
    errors.push(
      `article.slug "${slug}" must be a URL-safe kebab-case string`,
    );
  }

  if (options?.allowedCategories) {
    if (!options.allowedCategories.includes(doc.article.category)) {
      errors.push(
        `article.category "${doc.article.category}" is not in the allowed list`,
      );
    }
  }

  for (const locale of REQUIRED_LOCALES) {
    const t = doc.translations[locale];
    if (!t) {
      errors.push(`translations.${locale} is missing`);
      continue;
    }
    if (t.title.trim().length === 0) {
      errors.push(`translations.${locale}.title must not be empty`);
    }
    const meta = t.metaDescription.trim();
    if (meta.length === 0) {
      errors.push(
        `translations.${locale}.metaDescription must not be empty`,
      );
    } else if (meta.length > 160) {
      errors.push(
        `translations.${locale}.metaDescription must be <= 160 characters (got ${meta.length})`,
      );
    }
    if (t.content.trim().length === 0) {
      errors.push(`translations.${locale}.content must not be empty`);
    }
    for (let i = 0; i < t.faq.length; i += 1) {
      const item: FaqItem = t.faq[i]!;
      if (item.question.trim().length === 0) {
        errors.push(
          `translations.${locale}.faq[${i}].question must not be empty`,
        );
      }
      if (item.answer.trim().length === 0) {
        errors.push(
          `translations.${locale}.faq[${i}].answer must not be empty`,
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
