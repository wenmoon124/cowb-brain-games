// Diagnostic script to measure Jaccard similarity between brain-age articles
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

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

// Read all article files
const articlesDir = 'c:\\Users\\wenmo\\Desktop\\project\\workers\\api\\content\\articles';
const files = readdirSync(articlesDir).filter(f => f.startsWith('article-00') && f.endsWith('.ts'));

interface ArticleInfo {
  slug: string;
  concepts: Set<string>;
  sharedWords: Map<string, string[]>;
}

const articles: ArticleInfo[] = [];

for (const file of files) {
  const content = readFileSync(join(articlesDir, file), 'utf-8');
  // Extract enContent
  const match = content.match(/const enContent = `([\s\S]+?)`;/);
  if (!match) continue;
  const enContent = match[1];
  const slug = file.replace('article-00', '').replace('.ts', '').replace(/^\d+-/, '');
  articles.push({
    slug: file,
    concepts: extractConcepts(enContent),
    sharedWords: new Map(),
  });
}

// Compute pairwise similarities
console.log('=== Brain-Age Article Similarity Matrix ===\n');
console.log(`Articles: ${articles.map(a => a.slug.replace('article-', '').replace('.ts', '')).join(', ')}\n`);

for (let i = 0; i < articles.length; i++) {
  for (let j = i + 1; j < articles.length; j++) {
    const a = articles[i]!;
    const b = articles[j]!;
    const sim = jaccardSimilarity(a.concepts, b.concepts);
    const threshold = 0.2; // same category
    const status = sim >= threshold ? 'FAIL' : 'PASS';
    console.log(`${a.slug.replace('article-', '').replace('.ts', '')} vs ${b.slug.replace('article-', '').replace('.ts', '')}: ${(sim * 100).toFixed(1)}% [${status}]`);

    if (sim >= threshold) {
      // Find shared words
      const shared: string[] = [];
      for (const word of a.concepts) {
        if (b.concepts.has(word)) shared.push(word);
      }
      console.log(`  Shared words (${shared.length}): ${shared.sort().join(', ')}`);
      console.log('');
    }
  }
}

// Also check the size of each concept set
console.log('\n=== Concept Set Sizes ===');
for (const a of articles) {
  console.log(`${a.slug.replace('article-', '').replace('.ts', '')}: ${a.concepts.size} concepts`);
}
