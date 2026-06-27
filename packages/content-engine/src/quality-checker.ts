// @brainverse/content-engine — article quality checker.
//
// Validates articles against the 10 quality constraints defined in the
// BrainVerse content spec (see docs/seo.md §9.4 and PROJECT.md §12):
//   1. No AI banned words
//   2. Paragraph length variation > 30%
//   3. No consecutive paragraphs starting with the same word
//   4. Core concept overlap < 15% global / < 20% same category
//   5. At least 2 scientific citations in "Author (Year) Journal" format
//   6. At least 1 original insight (heuristic: opinion phrases)
//   7. At least 3 actionable tips with time/frequency/method
//   8. At least 1 platform game mentioned
//   9. 8 required content sections present
//  10. en / zh / ja versions exist with same structure

import type { FaqItem } from '@brainverse/core';

// ============ Types ============

/**
 * Result of running all quality checks on a single article.
 */
export interface QualityCheckResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  checks: {
    aiTrace: boolean;
    paragraphVariation: boolean;
    sentenceStartDiversity: boolean;
    duplication: boolean;
    citations: boolean;
    originality: boolean;
    practicality: boolean;
    gameRelation: boolean;
    structure: boolean;
    multilingual: boolean;
  };
}

/**
 * Minimal article shape required by the quality checker.
 *
 * Structurally compatible with `ArticleData` from `workers/api/content/types`
 * — the checker only needs `slug`, `category`, and the three localized
 * translations. Extra fields (sortOrder, featured, seoMetadata, …) are
 * ignored, so `ArticleData` can be passed directly.
 */
export interface Article {
  slug: string;
  category: string;
  translations: {
    en: ArticleTranslation;
    zh: ArticleTranslation;
    ja: ArticleTranslation;
  };
}

export interface ArticleTranslation {
  title: string;
  metaDescription: string;
  content: string;
  faq: FaqItem[];
}

// ============ Constants ============

/**
 * Phrases that signal AI-generated text. Any occurrence in article content
 * fails the AI-trace check.
 */
const AI_BANNED_WORDS: readonly string[] = [
  'delve into',
  "it's worth noting",
  'in conclusion',
  'unleash',
  'harness',
  'realm',
  'navigate the complexities',
  'in the realm of',
  'it is important to note',
  'it should be noted',
  'a testament to',
  'plays a crucial role',
  'stands as a testament',
  'in the ever-evolving',
  'in the world of',
  'when it comes to',
  'it is worth noting',
  'plays a vital role',
  'plays a pivotal role',
  'in today\'s fast-paced',
  'a game-changer',
  'the cornerstone of',
  'pave the way',
  'shed light on',
  'bridge the gap',
];

/**
 * Common English stop words excluded from concept-overlap comparison so that
 * the Jaccard similarity reflects meaningful vocabulary rather than grammar
 * glue.
 */
const STOP_WORDS: ReadonlySet<string> = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'than', 'too', 'very',
  'can', 'will', 'just', 'should', 'now', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
  'did', 'doing', 'this', 'that', 'these', 'those', 'your', 'you',
  'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'if',
  'because', 'as', 'until', 'while', 'against', 'out', 'off', 'over',
  'also', 'may', 'might', 'must', 'could', 'would', 'many', 'much',
  'any', 'both', 'few', 'so', 'than', 'too', 'very', 'even', 'still',
]);

/**
 * Phrases that signal an original opinion or insight. At least one match
 * passes the originality check.
 */
const OPINION_PHRASES: readonly string[] = [
  'in my experience',
  'i believe',
  'we recommend',
  'our analysis',
  'the evidence suggests',
  'what we see',
  'our observation',
  'the data points to',
  'this means',
  'the implication is',
  'what this means',
  'our finding',
  'we observe',
  'we find that',
  'here is an observation',
  'rarely appears',
  'rarely mentioned',
  'my observation',
  'the trend over',
  'worth mentioning',
  'the key insight',
  'what sets this apart',
  'our perspective',
  'the practical takeaway',
];

/**
 * Regex matching a time or frequency indicator inside a tip line.
 * Examples: "10 minutes", "each morning", "twice a month", "three times a week".
 */
const TIME_FREQUENCY_PATTERN =
  /\b(\d+\s*(minute|hour|second|min|sec|day|week|month)|daily|weekly|monthly|every\s+day|each\s+(morning|evening|night|day)|per\s+week|per\s+day|per\s+month|times?\s+per|twice|once|three\s+times|four\s+times|regularly|morning|evening|night)\b/i;

/**
 * Regex matching an action verb that signals an actionable tip.
 */
const ACTION_VERB_PATTERN =
  /\b(try|practice|practise|use|start|begin|exercise|train|play|spend|walk|read|write|take|do|repeat|schedule|aim|set|build|incorporate|adopt|avoid|limit|ensure|protect|maintain)\b/i;

/**
 * BrainVerse game names (English). A localized article may keep the English
 * game name or use the localized label — the checker looks for both.
 */
const GAME_NAMES: readonly string[] = [
  'brain age assessment',
  'brain age test',
  'brain age',
  'memory matrix',
  'backward digit span',
  'spatial sequence',
  'pattern match',
  'attention span',
  'eagle eye',
  'distraction filter',
  'split focus',
  'rapid response',
  'color match stroop',
  'click horizon',
  'tower of logic',
  'change flex',
  'path finder',
  'matrix reasoning',
  'breath synchronizer',
  'audio alpha diver',
  'stress sandbox',
  'visual search',
  'stroop challenge',
  'spatial memory',
  'digit span',
  'reaction training',
  'breathing flow',
];

/**
 * Section heading patterns (English). Each entry is a regex tested against
 * the concatenation of all markdown headings in the English content.
 */
const REQUIRED_SECTIONS_EN: readonly RegExp[] = [
  /introduction/i,
  /science|scientific|explanation|research/i,
  /practical|advice|tips|practice|actionable/i,
  /\bgame\b|games/i,
  /faq|frequently asked|questions/i,
  /internal links|related articles|further reading|related posts/i,
  /takeaways?|summary|key points|key takeaways/i,
  /references|sources|citations|bibliography/i,
];

/** Locales that must be present on every published article. */
const REQUIRED_LOCALES: readonly ('en' | 'zh' | 'ja')[] = [
  'en',
  'zh',
  'ja',
] as const;

// ============ Check functions ============

/**
 * Check 1 — AI trace. Scans the content for any banned AI phrase.
 * Returns `false` if at least one banned phrase is found.
 */
export function checkAiTrace(content: string): boolean {
  const lower = content.toLowerCase();
  return !AI_BANNED_WORDS.some((word) => lower.includes(word));
}

/**
 * Check 2 — Paragraph length variation. Computes the coefficient of
 * variation (stddev / mean) of paragraph lengths and returns `true` when
 * it exceeds 0.30, signalling healthy short/medium/long alternation.
 */
export function checkParagraphVariation(content: string): boolean {
  const paragraphs = splitParagraphs(content);
  if (paragraphs.length < 3) return false;

  const lengths = paragraphs.map((p) => p.trim().length);
  const mean = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
  if (mean === 0) return false;

  const variance =
    lengths.reduce((sum, len) => sum + (len - mean) ** 2, 0) / lengths.length;
  const stddev = Math.sqrt(variance);
  const coefficientOfVariation = stddev / mean;

  return coefficientOfVariation > 0.3;
}

/**
 * Check 3 — Sentence-start diversity. Returns `false` when two consecutive
 * paragraphs start with the same first word (after stripping markdown
 * markers such as `#`, `-`, `*`, or `1.`).
 */
export function checkSentenceStartDiversity(content: string): boolean {
  const paragraphs = splitParagraphs(content);
  if (paragraphs.length < 2) return true;

  const firstWords = paragraphs.map((p) => firstWordOf(p));

  for (let i = 1; i < firstWords.length; i += 1) {
    const prev = firstWords[i - 1]!;
    const curr = firstWords[i]!;
    if (prev && curr && prev === curr) return false;
  }
  return true;
}

/**
 * Check 4 — Duplication. Compares the article's English concept set
 * (significant words, stop words removed) against every other article in
 * the batch using Jaccard similarity. Fails when overlap ≥ 15% globally or
 * ≥ 20% within the same category.
 */
export function checkDuplication(article: Article, allArticles: Article[]): boolean {
  const concepts = extractConcepts(article.translations.en.content);

  for (const other of allArticles) {
    if (other.slug === article.slug) continue;

    const otherConcepts = extractConcepts(other.translations.en.content);
    const similarity = jaccardSimilarity(concepts, otherConcepts);

    const sameCategory = other.category === article.category;
    const threshold = sameCategory ? 0.2 : 0.15;

    if (similarity >= threshold) return false;
  }
  return true;
}

/**
 * Check 5 — Citations. Looks for at least two occurrences of the
 * "Author (Year)" pattern (capitalized surname followed by a 4-digit year
 * in parentheses). The optional trailing journal/source name is not
 * required by the regex but is encouraged in the content style guide.
 */
export function checkCitations(content: string): boolean {
  const citationPattern = /[A-Z][a-zA-Z]{2,}\s+\(\d{4}\)/g;
  const matches = content.match(citationPattern);
  return matches !== null && matches.length >= 2;
}

/**
 * Check 6 — Originality. Heuristic that scans for opinion / insight
 * phrases. Returns `true` when at least one is present.
 */
export function checkOriginality(content: string): boolean {
  const lower = content.toLowerCase();
  return OPINION_PHRASES.some((phrase) => lower.includes(phrase));
}

/**
 * Check 7 — Practicality. Counts actionable tips — list items (bullet or
 * numbered) that contain both a time/frequency indicator and an action
 * verb. Returns `true` when at least 3 such tips are found.
 */
export function checkPracticality(content: string): boolean {
  const bulletItems = content.match(/^[-*]\s+.+$/gm) ?? [];
  const numberedItems = content.match(/^\d+\.\s+.+$/gm) ?? [];
  const items = [...bulletItems, ...numberedItems];

  let tipCount = 0;
  for (const item of items) {
    if (TIME_FREQUENCY_PATTERN.test(item) && ACTION_VERB_PATTERN.test(item)) {
      tipCount += 1;
    }
  }
  return tipCount >= 3;
}

/**
 * Check 8 — Game relation. Returns `true` when at least one BrainVerse
 * game name appears in the content.
 */
export function checkGameRelation(content: string): boolean {
  const lower = content.toLowerCase();
  return GAME_NAMES.some((name) => lower.includes(name));
}

/**
 * Check 9 — Structure. Verifies that the English content contains all 8
 * required section headings (Introduction, Scientific Explanation,
 * Practical Advice, Related Games, FAQ, Internal Links, Key Takeaways,
 * References).
 */
export function checkStructure(article: Article): boolean {
  const content = article.translations.en.content;
  const headings = content.match(/^#{1,6}\s+.+$/gm) ?? [];
  if (headings.length < 8) return false;

  const headingText = headings.join(' ');
  return REQUIRED_SECTIONS_EN.every((pattern) => pattern.test(headingText));
}

/**
 * Check 10 — Multilingual. Verifies that en / zh / ja translations all
 * exist, each with non-empty title and content, and each with at least 8
 * markdown headings (matching the English structure).
 */
export function checkMultilingual(article: Article): boolean {
  for (const locale of REQUIRED_LOCALES) {
    const t = article.translations[locale];
    if (!t) return false;
    if (!t.title || t.title.trim().length === 0) return false;
    if (!t.metaDescription || t.metaDescription.trim().length === 0) return false;
    if (!t.content || t.content.trim().length === 0) return false;
    if (!t.faq || t.faq.length < 4) return false;

    const headings = t.content.match(/^#{1,6}\s+.+$/gm) ?? [];
    if (headings.length < 8) return false;
  }
  return true;
}

// ============ Aggregate functions ============

/**
 * Run all 10 quality checks on a single article and return a
 * {@link QualityCheckResult}.
 */
export function checkArticleQuality(
  article: Article,
  allArticles: Article[],
): QualityCheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const enContent = article.translations.en.content;

  const checks = {
    aiTrace: checkAiTrace(enContent),
    paragraphVariation: checkParagraphVariation(enContent),
    sentenceStartDiversity: checkSentenceStartDiversity(enContent),
    duplication: checkDuplication(article, allArticles),
    citations: checkCitations(enContent),
    originality: checkOriginality(enContent),
    practicality: checkPracticality(enContent),
    gameRelation: checkGameRelation(enContent),
    structure: checkStructure(article),
    multilingual: checkMultilingual(article),
  };

  if (!checks.aiTrace) {
    errors.push('AI trace detected: content contains banned AI phrases');
  }
  if (!checks.paragraphVariation) {
    errors.push('Paragraph length variation must exceed 30%');
  }
  if (!checks.sentenceStartDiversity) {
    errors.push('Consecutive paragraphs must not start with the same word');
  }
  if (!checks.duplication) {
    errors.push(
      'Content duplication exceeds threshold (15% global, 20% same category)',
    );
  }
  if (!checks.citations) {
    errors.push('At least 2 scientific citations in "Author (Year)" format required');
  }
  if (!checks.originality) {
    errors.push('At least 1 original insight or opinion phrase required');
  }
  if (!checks.practicality) {
    errors.push('At least 3 actionable tips with time/frequency/method required');
  }
  if (!checks.gameRelation) {
    errors.push('At least 1 BrainVerse game must be mentioned in the content');
  }
  if (!checks.structure) {
    errors.push('All 8 required sections must be present (Introduction, Scientific Explanation, Practical Advice, Related Games, FAQ, Internal Links, Key Takeaways, References)');
  }
  if (!checks.multilingual) {
    errors.push('en / zh / ja translations must all exist with ≥4 FAQ items and ≥8 headings');
  }

  // Warnings (non-blocking)
  for (const locale of REQUIRED_LOCALES) {
    const t = article.translations[locale];
    if (t && t.metaDescription.length > 150) {
      warnings.push(
        `translations.${locale}.metaDescription exceeds 150 characters (${t.metaDescription.length})`,
      );
    }
    if (t && t.faq.length < 4) {
      warnings.push(
        `translations.${locale}.faq has fewer than 4 items (${t.faq.length})`,
      );
    }
  }

  if (enContent.split(/\s+/).length < 800) {
    warnings.push('English content is shorter than 800 words');
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    checks,
  };
}

/**
 * Run quality checks on a batch of articles.
 */
export function checkBatchQuality(
  articles: Article[],
  allArticles: Article[],
): QualityCheckResult[] {
  return articles.map((article) => checkArticleQuality(article, allArticles));
}

/**
 * Generate a human-readable quality report from a batch of results.
 */
export function generateQualityReport(results: QualityCheckResult[]): string {
  const total = results.length;
  if (total === 0) {
    return '=== Quality Check Report ===\nNo articles to check.\n';
  }

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = total - passedCount;

  const lines: string[] = [
    '=== Quality Check Report ===',
    `Total articles: ${total}`,
    `Passed: ${passedCount}`,
    `Failed: ${failedCount}`,
    '',
  ];

  if (failedCount > 0) {
    lines.push('--- Failed Articles ---');
    results.forEach((result, index) => {
      if (!result.passed) {
        lines.push(`Article #${index + 1}:`);
        result.errors.forEach((err) => lines.push(`  ✗ ${err}`));
        if (result.warnings.length > 0) {
          result.warnings.forEach((w) => lines.push(`  ⚠ ${w}`));
        }
      }
    });
    lines.push('');
  } else {
    lines.push('✓ All articles passed quality checks!');
    lines.push('');
  }

  lines.push('--- Check Summary ---');
  const checkKeys = Object.keys(results[0]!.checks) as (keyof QualityCheckResult['checks'])[];
  for (const key of checkKeys) {
    const passedForKey = results.filter((r) => r.checks[key]).length;
    const status = passedForKey === total ? '✓' : passedForKey === 0 ? '✗' : '⚠';
    lines.push(`  ${status} ${key}: ${passedForKey}/${total}`);
  }

  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  if (totalWarnings > 0) {
    lines.push('', `Total warnings: ${totalWarnings}`);
  }

  return lines.join('\n');
}

// ============ Internal helpers ============

/** Split markdown content into paragraphs (blocks separated by blank lines). */
function splitParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Extract the first "word" of a paragraph, stripping markdown heading
 * markers (`#`), list markers (`-`, `*`, `1.`), and bold/italic markers
 * (`**`, `*`, `__`).
 */
function firstWordOf(paragraph: string): string {
  const cleaned = paragraph
    .replace(/^#{1,6}\s+/, '')
    .replace(/^[-*]\s+/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/^\*\*?/, '')
    .replace(/^__?/, '')
    .trim();
  const match = cleaned.match(/^([\p{L}\p{N}]+)/u);
  return match ? match[1]!.toLowerCase() : '';
}

/**
 * Extract the set of significant words from content for duplication
 * comparison. Lowercased, punctuation stripped, stop words and words
 * shorter than 4 characters removed.
 */
function extractConcepts(content: string): Set<string> {
  const words = content
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
  return new Set(words);
}

/** Compute Jaccard similarity between two sets: |A ∩ B| / |A ∪ B|. */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;

  let intersection = 0;
  for (const word of a) {
    if (b.has(word)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
