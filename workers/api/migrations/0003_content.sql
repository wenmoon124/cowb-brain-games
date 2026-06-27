-- migrations/0003_content.sql
-- Description: Content Engine — articles, article_translations, seo_metadata
-- Date: 2026-06-25

-- ============ Articles ============

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- ============ Article Translations ============

CREATE TABLE IF NOT EXISTS article_translations (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  content TEXT NOT NULL,
  faq TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_article_trans_article ON article_translations(article_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_article_trans_locale ON article_translations(article_id, locale);

-- ============ SEO Metadata ============

CREATE TABLE IF NOT EXISTS seo_metadata (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  title TEXT,
  description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  json_ld TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_seo_entity ON seo_metadata(entity_type, entity_id, locale);
