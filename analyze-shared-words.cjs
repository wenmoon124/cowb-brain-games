// Analyze shared words between Article #1 and its most similar articles
const fs = require('fs');
const path = require('path');

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

const articlesDir = path.join(__dirname, 'workers', 'api', 'content', 'articles');

function loadArticle(num) {
  const files = fs.readdirSync(articlesDir);
  const file = files.find(f => f.startsWith(`article-${num.padStart(3, '0')}-`));
  if (!file) return null;
  const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8');
  const match = content.match(/const\s+enContent\s*=\s*`([\s\S]*?)`;/);
  if (!match) return null;
  return { num, content: match[1], concepts: extractConcepts(match[1]) };
}

const art1 = loadArticle('1');
console.log('Article #1 concept count:', art1.concepts.size);

// Find shared words with top 5 most similar articles
const targetNums = ['011', '003', '018', '005', '041'];
console.log('\n=== Shared words with most similar articles ===\n');

for (const num of targetNums) {
  const other = loadArticle(num);
  if (!other) continue;
  const sim = jaccardSimilarity(art1.concepts, other.concepts);
  const shared = [...art1.concepts].filter(x => other.concepts.has(x));
  const onlyInOther = [...other.concepts].filter(x => !art1.concepts.has(x));

  console.log(`Article #${num}: ${(sim * 100).toFixed(1)}% similarity`);
  console.log(`  Shared words (${shared.length}): ${shared.join(', ')}`);
  console.log('');
}

// Categorize shared words
console.log('\n=== Word Categories ===\n');
const allShared = new Set();
for (const num of targetNums) {
  const other = loadArticle(num);
  if (!other) continue;
  const shared = [...art1.concepts].filter(x => other.concepts.has(x));
  shared.forEach(w => allShared.add(w));
}

// Section heading words (from REQUIRED_SECTIONS_EN regex)
const sectionWords = new Set([
  'introduction', 'scientific', 'explanation', 'practical', 'advice',
  'related', 'internal', 'links', 'articles', 'takeaways', 'references',
  'games', 'science', 'research', 'tips', 'practice', 'actionable',
  'frequently', 'asked', 'questions', 'further', 'reading', 'posts',
  'summary', 'points', 'sources', 'citations', 'bibliography'
]);

// Domain core words
const domainWords = new Set([
  'brain', 'cognitive', 'memory', 'attention', 'processing', 'speed',
  'executive', 'function', 'relaxation', 'control', 'training', 'exercise',
  'sleep', 'stress', 'performance', 'age', 'aging', 'decline', 'assessment',
  'test', 'score', 'task', 'working', 'reaction', 'focus', 'health',
  'lifestyle', 'practice', 'weekly', 'daily', 'monthly', 'minutes', 'hours',
  'measurable', 'dimensions', 'function', 'mental', 'neural'
]);

const sectionShared = [...allShared].filter(w => sectionWords.has(w));
const domainShared = [...allShared].filter(w => domainWords.has(w));
const otherShared = [...allShared].filter(w => !sectionWords.has(w) && !domainWords.has(w));

console.log(`Section heading words (unavoidable): ${sectionShared.length}`);
console.log(sectionShared.join(', '));
console.log(`\nDomain core words (hard to avoid): ${domainShared.length}`);
console.log(domainShared.join(', '));
console.log(`\nOther shared words (replaceable): ${otherShared.length}`);
console.log(otherShared.join(', '));

// Calculate: if we remove section words from concept extraction, what's the new similarity?
console.log('\n=== Simulated similarity without section words ===\n');
const art1NoSection = new Set([...art1.concepts].filter(w => !sectionWords.has(w)));
for (const num of targetNums) {
  const other = loadArticle(num);
  if (!other) continue;
  const otherNoSection = new Set([...other.concepts].filter(w => !sectionWords.has(w)));
  const newSim = jaccardSimilarity(art1NoSection, otherNoSection);
  const oldSim = jaccardSimilarity(art1.concepts, other.concepts);
  console.log(`Article #${num}: ${(oldSim * 100).toFixed(1)}% -> ${(newSim * 100).toFixed(1)}% (without section words)`);
}

// Calculate: if we remove section + domain words
console.log('\n=== Simulated similarity without section + domain words ===\n');
const art1NoDomain = new Set([...art1NoSection].filter(w => !domainWords.has(w)));
for (const num of targetNums) {
  const other = loadArticle(num);
  if (!other) continue;
  const otherNoDomain = new Set([...otherNoSection].filter(w => !domainWords.has(w)));
  const newSim = jaccardSimilarity(art1NoDomain, otherNoDomain);
  const oldSim = jaccardSimilarity(art1.concepts, other.concepts);
  console.log(`Article #${num}: ${(oldSim * 100).toFixed(1)}% -> ${(newSim * 100).toFixed(1)}% (without section+domain words)`);
}
