// Quick script to compute Jaccard similarity between Article #001 and others
import { allArticles } from '../content/articles';

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
  'any', 'both', 'few', 'so', 'than', 'too', 'very', 'even', 'still',
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

const article001 = allArticles.find((a) => a.slug === 'what-is-brain-age');
if (!article001) {
  console.error('Article #001 not found');
  process.exit(1);
}

const concepts001 = extractConcepts(article001.translations.en.content);
console.log(`Article #001 concept set size: ${concepts001.size}`);
console.log('');

const similarities: Array<{ slug: string; sortOrder: number; similarity: number; intersection: number; union: number; sameCategory: boolean }> = [];

for (const other of allArticles) {
  if (other.slug === article001.slug) continue;
  const otherConcepts = extractConcepts(other.translations.en.content);
  const similarity = jaccardSimilarity(concepts001, otherConcepts);

  let intersection = 0;
  for (const word of concepts001) {
    if (otherConcepts.has(word)) intersection += 1;
  }
  const union = concepts001.size + otherConcepts.size - intersection;

  similarities.push({
    slug: other.slug,
    sortOrder: other.sortOrder,
    similarity,
    intersection,
    union,
    sameCategory: other.category === article001.category,
  });
}

similarities.sort((a, b) => b.similarity - a.similarity);

console.log('Top 15 most similar articles to #001:');
console.log('Rank | # | Slug | Sim% | Intersect | Union | Same Cat | Threshold');
console.log('-'.repeat(100));
for (let i = 0; i < Math.min(15, similarities.length); i++) {
  const s = similarities[i]!;
  const threshold = s.sameCategory ? 0.20 : 0.15;
  const status = s.similarity >= threshold ? 'FAIL' : 'pass';
  console.log(
    `${(i + 1).toString().padStart(4)} | #${s.sortOrder.toString().padStart(3)} | ${s.slug.padEnd(40)} | ${(s.similarity * 100).toFixed(1)}% | ${s.intersection.toString().padStart(9)} | ${s.union.toString().padStart(5)} | ${s.sameCategory ? 'Y' : 'N'} | ${(threshold * 100).toFixed(0)}% | ${status}`,
  );
}

console.log('');
const failing = similarities.filter((s) => {
  const threshold = s.sameCategory ? 0.20 : 0.15;
  return s.similarity >= threshold;
});
console.log(`Articles failing duplication check: ${failing.length}`);
for (const f of failing) {
  console.log(`  #${f.sortOrder} ${f.slug}: ${(f.similarity * 100).toFixed(1)}% (intersection ${f.intersection}, threshold ${f.sameCategory ? '20%' : '15%'})`);
}

// Show shared words with top 3 failing articles
console.log('\n--- Shared words with top failing articles ---');
const topFailing = failing.slice(0, 3);
for (const f of topFailing) {
  const other = allArticles.find((a) => a.slug === f.slug);
  if (!other) continue;
  const otherConcepts = extractConcepts(other.translations.en.content);
  const shared: string[] = [];
  for (const word of concepts001) {
    if (otherConcepts.has(word)) shared.push(word);
  }
  shared.sort();
  console.log(`\n#${f.sortOrder} ${f.slug} (${f.intersection} shared words):`);
  console.log(shared.join(', '));
}
