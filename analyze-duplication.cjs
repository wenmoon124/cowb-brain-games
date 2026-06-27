// Analyze duplication: find most similar article pairs and shared concepts
const fs = require('fs');
const path = require('path');

// Replicate STOP_WORDS from quality-checker
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

function extractConcepts(content) {
  const words = content.toLowerCase().match(/[a-z]{4,}/g) || [];
  return new Set(words.filter((w) => !STOP_WORDS.has(w)));
}

function jaccardSimilarity(a, b) {
  let intersection = 0;
  for (const x of a) if (b.has(x)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// Load article index
const articlesDir = path.join(__dirname, 'workers', 'api', 'content', 'articles');
const indexFile = path.join(articlesDir, 'index.ts');
const indexContent = fs.readFileSync(indexFile, 'utf-8');

// Extract all article file references (format: ./article-001-slug)
const articleFiles = [...indexContent.matchAll(/from\s+['"]\.\/(article-\d+-[^'"]+)['"]/g)]
  .map((m) => m[1])
  .sort((a, b) => {
    const na = parseInt(a.match(/\d+/)[0]);
    const nb = parseInt(b.match(/\d+/)[0]);
    return na - nb;
  });

console.log('Found', articleFiles.length, 'article files\n');

// Load all articles and extract concepts
const articles = [];
for (const fname of articleFiles) {
  const file = path.join(articlesDir, fname + '.ts');
  const content = fs.readFileSync(file, 'utf-8');
  // Extract the English content string - pattern: const enContent = `...`;
  const match = content.match(/const\s+enContent\s*=\s*`([\s\S]*?)`;/);
  if (!match) {
    console.error('Could not extract content from ' + fname);
    continue;
  }
  const enContent = match[1];
  const concepts = extractConcepts(enContent);
  const num = fname.match(/\d+/)[0];
  articles.push({ num, concepts, contentLength: enContent.length, conceptCount: concepts.size });
}

console.log('=== Article Concept Stats ===');
console.log('Avg concept count:', Math.round(articles.reduce((s, a) => s + a.conceptCount, 0) / articles.length));
console.log('Min:', Math.min(...articles.map(a => a.conceptCount)), 'Max:', Math.max(...articles.map(a => a.conceptCount)));
console.log('');

// Find the most similar pairs
console.log('=== Top 20 Most Similar Article Pairs ===');
const pairs = [];
for (let i = 0; i < articles.length; i++) {
  for (let j = i + 1; j < articles.length; j++) {
    const sim = jaccardSimilarity(articles[i].concepts, articles[j].concepts);
    pairs.push({ a: articles[i].num, b: articles[j].num, sim });
  }
}
pairs.sort((x, y) => y.sim - x.sim);
pairs.slice(0, 20).forEach((p) => {
  console.log(`Article #${p.a} <-> #${p.b}: ${(p.sim * 100).toFixed(1)}%`);
});

// For Article #1, show what it shares with its most similar article
console.log('\n=== Article #001 Analysis ===');
const art1 = articles.find(a => a.num === '001');
console.log('Concept count:', art1.conceptCount);
const similarities = articles
  .filter(a => a.num !== '001')
  .map(a => ({ num: a.num, sim: jaccardSimilarity(art1.concepts, a.concepts), shared: [...art1.concepts].filter(x => a.concepts.has(x)) }))
  .sort((a, b) => b.sim - a.sim);

console.log('\nMost similar to Article #1:');
similarities.slice(0, 5).forEach(s => {
  console.log(`  #${s.num}: ${(s.sim * 100).toFixed(1)}% — shared: ${s.shared.slice(0, 20).join(', ')}`);
});

// Find most common shared words across all articles (the "boilerplate" vocabulary)
console.log('\n=== Most Common Words Across All Articles (likely boilerplate) ===');
const wordFreq = new Map();
for (const a of articles) {
  for (const w of a.concepts) {
    wordFreq.set(w, (wordFreq.get(w) || 0) + 1);
  }
}
const topWords = [...wordFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40);
topWords.forEach(([word, count]) => {
  console.log(`  ${word}: appears in ${count}/100 articles (${(count)}%)`);
});
