const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');

const STOP = new Set([
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

function extract(content) {
  const words = content
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
  return new Set(words);
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let n = 0;
  for (const w of a) {
    if (b.has(w)) n++;
  }
  return n / (a.size + b.size - n);
}

const dir = 'c:\\Users\\wenmo\\Desktop\\project\\workers\\api\\content\\articles';
const files = readdirSync(dir).filter((f) => f.endsWith('.ts'));

const arts = [];
for (const f of files) {
  const c = readFileSync(join(dir, f), 'utf-8');
  const idx1 = c.indexOf('const enContent = `');
  if (idx1 === -1) continue;
  const start = idx1 + 'const enContent = `'.length;
  const end = c.indexOf('`;', start);
  if (end === -1) continue;
  const enContent = c.substring(start, end);

  // Extract category
  const catMatch = c.match(/category:\s*['"]([^'"]+)['"]/);
  const category = catMatch ? catMatch[1] : 'unknown';

  arts.push({ f, concepts: extract(enContent), category });
}

console.log('Total articles found:', arts.length);
console.log('');

// Find the target articles (#002-#006)
const targets = arts.filter((a) => {
  const num = a.f.replace('article-', '').replace('-' + a.f.split('-').slice(2).join('-').replace('.ts', ''), '');
  return a.f.match(/^article-00[2-6]-/);
});

console.log('Target articles:', targets.map((t) => t.f.replace('.ts', '')).join(', '));
console.log('');

// For each target, find which articles exceed the threshold
for (const t of targets) {
  const tName = t.f.replace('article-', '').replace('.ts', '');
  console.log('=== ' + tName + ' (category: ' + t.category + ', concepts: ' + t.concepts.size + ') ===');

  for (const other of arts) {
    if (other.f === t.f) continue;
    const sim = jaccard(t.concepts, other.concepts);
    const sameCat = other.category === t.category;
    const threshold = sameCat ? 0.2 : 0.15;
    if (sim >= threshold) {
      const oName = other.f.replace('article-', '').replace('.ts', '');
      console.log('  ' + oName + ' (cat: ' + other.category + '): ' + (sim * 100).toFixed(1) + '% [threshold: ' + (threshold * 100) + '%]');

      // Show shared words
      const sw = [];
      for (const w of t.concepts) {
        if (other.concepts.has(w)) sw.push(w);
      }
      console.log('    Shared(' + sw.length + '): ' + sw.sort().join(', '));
    }
  }
  console.log('');
}
