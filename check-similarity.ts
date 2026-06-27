// Quick script to check Jaccard similarity between brain-age articles
import { allArticles } from './workers/api/content/articles';

const STOP_WORDS = new Set([
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
  'any', 'both', 'so', 'even', 'still',
]);

function extractConcepts(content: string): Set<string> {
  const words = content
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
  return new Set(words);
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const word of a) {
    if (b.has(word)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// Get articles 1-6 (brain-age category) for the matrix
const brainAgeArticles = allArticles.filter(
  (a) => a.category === 'brain-age' && a.sortOrder <= 6,
);

// Get ALL articles for full duplication check
const allArticlesList = allArticles;

console.log('=== Jaccard Similarity Matrix (Articles #1-#6) ===\n');
console.log('Article concepts sizes:');
brainAgeArticles.forEach((a) => {
  const concepts = extractConcepts(a.translations.en.content);
  console.log(`  #${a.sortOrder} ${a.slug}: ${concepts.size} concepts`);
});

console.log('\nSimilarity matrix:');
const header = '     ' + brainAgeArticles.map((a) => `    #${a.sortOrder}`).join('');
console.log(header);
brainAgeArticles.forEach((a) => {
  const conceptsA = extractConcepts(a.translations.en.content);
  const row = `  #${a.sortOrder} ` + brainAgeArticles.map((b) => {
    if (a.slug === b.slug) return '  ----';
    const conceptsB = extractConcepts(b.translations.en.content);
    const sim = jaccardSimilarity(conceptsA, conceptsB);
    return `  ${(sim * 100).toFixed(1)}%`;
  }).join('');
  console.log(row);
});

// For each failing article, find which articles it overlaps with most (against ALL articles)
console.log('\n=== Full duplication check (against ALL 100 articles) ===');
brainAgeArticles.forEach((a) => {
  if (a.sortOrder < 2 || a.sortOrder > 6) return;
  const conceptsA = extractConcepts(a.translations.en.content);
  console.log(`\nArticle #${a.sortOrder} (${a.slug}):`);
  // Check against all articles, show only those that fail or are close
  const overlaps: { sort: number; slug: string; sim: number; status: string; cat: string }[] = [];
  allArticlesList.forEach((b) => {
    if (a.slug === b.slug) return;
    const conceptsB = extractConcepts(b.translations.en.content);
    const sim = jaccardSimilarity(conceptsA, conceptsB);
    const sameCat = b.category === a.category;
    const threshold = sameCat ? 0.20 : 0.15;
    const status = sim >= threshold ? 'FAIL' : (sim >= threshold * 0.85 ? 'close' : 'ok');
    if (status !== 'ok') {
      overlaps.push({ sort: b.sortOrder, slug: b.slug, sim, status, cat: b.category });
    }
  });
  overlaps.sort((x, y) => y.sim - x.sim);
  overlaps.forEach((o) => {
    console.log(`  vs #${o.sort} (${o.slug}) [${o.cat}]: ${(o.sim * 100).toFixed(1)}% [${o.status}]`);
  });
  if (overlaps.length === 0) {
    console.log('  No failing or close overlaps!');
  }
});
