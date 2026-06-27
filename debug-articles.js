// Debug script for articles #002-#006
// Tests practicality check (which tips pass/fail) and duplication check (which pairs overlap)

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, 'workers', 'api', 'content', 'articles');

// ============ Quality checker constants (copied from quality-checker.ts) ============

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

const TIME_FREQUENCY_PATTERN =
  /\b(\d+\s*(minute|hour|second|min|sec|day|week|month)|daily|weekly|monthly|every\s+day|each\s+(morning|evening|night|day)|per\s+week|per\s+day|per\s+month|times?\s+per|twice|once|three\s+times|four\s+times|regularly|morning|evening|night)\b/i;

const ACTION_VERB_PATTERN =
  /\b(try|practice|practise|use|start|begin|exercise|train|play|spend|walk|read|write|take|do|repeat|schedule|aim|set|build|incorporate|adopt|avoid|limit|ensure|protect|maintain)\b/i;

// ============ Helpers ============

function extractConcepts(content) {
  const words = content
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
  return new Set(words);
}

function jaccardSimilarity(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const word of a) {
    if (b.has(word)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// Extract enContent from a .ts file using string matching
function extractEnContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const marker = 'const enContent = `';
  const startIdx = content.indexOf(marker);
  if (startIdx === -1) return null;
  const contentStart = startIdx + marker.length;
  const endIdx = content.indexOf('`;', contentStart);
  if (endIdx === -1) return null;
  return content.substring(contentStart, endIdx);
}

// Extract slug and category
function extractMeta(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const slugMatch = content.match(/slug:\s*'([^']+)'/);
  const catMatch = content.match(/category:\s*'([^']+)'/);
  const sortMatch = content.match(/sortOrder:\s*(\d+)/);
  return {
    slug: slugMatch ? slugMatch[1] : path.basename(filePath),
    category: catMatch ? catMatch[1] : 'unknown',
    sortOrder: sortMatch ? parseInt(sortMatch[1], 10) : 0,
  };
}

// ============ Practicality debug ============

function debugPracticality(enContent, label) {
  console.log(`\n=== Practicality debug: ${label} ===`);
  const bulletItems = enContent.match(/^[-*]\s+.+$/gm) || [];
  const numberedItems = enContent.match(/^\d+\.\s+.+$/gm) || [];
  const items = [...bulletItems, ...numberedItems];

  console.log(`Total list items: ${items.length} (bullets: ${bulletItems.length}, numbered: ${numberedItems.length})`);

  let tipCount = 0;
  items.forEach((item, idx) => {
    const timeMatch = TIME_FREQUENCY_PATTERN.test(item);
    const actionMatch = ACTION_VERB_PATTERN.test(item);
    const passes = timeMatch && actionMatch;
    if (passes) tipCount++;

    // Find first 60 chars for display
    const preview = item.substring(0, 80).replace(/\n/g, ' ');
    console.log(`  [${passes ? 'PASS' : 'FAIL'}] #${idx + 1}: ${preview}...`);
    console.log(`         time=${timeMatch}, action=${actionMatch}`);

    if (!timeMatch) {
      // Show what time/frequency words are in the item
      const words = item.toLowerCase().split(/\W+/);
      const timeWords = words.filter(w =>
        /\d+/.test(w) ||
        ['daily','weekly','monthly','morning','evening','night','twice','once','regularly'].includes(w) ||
        ['minute','hour','second','day','week','month','min','sec'].includes(w)
      );
      console.log(`         potential time words: ${JSON.stringify(timeWords.slice(0, 10))}`);
    }
    if (!actionMatch) {
      const words = item.toLowerCase().split(/\W+/);
      const actionWords = words.filter(w =>
        ['try','practice','practise','use','start','begin','exercise','train','play','spend','walk','read','write','take','do','repeat','schedule','aim','set','build','incorporate','adopt','avoid','limit','ensure','protect','maintain'].includes(w)
      );
      console.log(`         action verbs found: ${JSON.stringify(actionWords)}`);
    }
  });

  console.log(`\nResult: ${tipCount}/3 tips pass (need >= 3)`);
  return tipCount >= 3;
}

// ============ Duplication debug ============

function debugDuplication(targetArticle, allArticles) {
  console.log(`\n=== Duplication debug: ${targetArticle.meta.slug} (sort=${targetArticle.meta.sortOrder}) ===`);
  const concepts = extractConcepts(targetArticle.enContent);
  console.log(`Concept count: ${concepts.size}`);

  const overlaps = [];
  for (const other of allArticles) {
    if (other.meta.slug === targetArticle.meta.slug) continue;
    const otherConcepts = extractConcepts(other.enContent);
    const sim = jaccardSimilarity(concepts, otherConcepts);
    const sameCategory = other.meta.category === targetArticle.meta.category;
    const threshold = sameCategory ? 0.20 : 0.15;
    if (sim >= threshold - 0.005) { // Show near-threshold too
      overlaps.push({
        slug: other.meta.slug,
        sortOrder: other.meta.sortOrder,
        category: other.meta.category,
        similarity: sim,
        threshold,
        sameCategory,
        fails: sim >= threshold,
        sharedWords: [...concepts].filter(w => otherConcepts.has(w)),
      });
    }
  }

  overlaps.sort((a, b) => b.similarity - a.similarity);
  console.log(`\nOverlaps at or near threshold (showing top 20):`);
  overlaps.slice(0, 20).forEach(o => {
    const status = o.fails ? 'FAIL' : 'near';
    console.log(`  [${status}] ${o.similarity.toFixed(4)} vs ${o.threshold} | ${o.slug} (sort=${o.sortOrder}, cat=${o.category})`);
    if (o.fails) {
      console.log(`         shared words (${o.sharedWords.length}): ${o.sharedWords.slice(0, 40).join(', ')}`);
    }
  });

  return overlaps.filter(o => o.fails);
}

// ============ Main ============

function main() {
  // Load all articles
  const files = fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.startsWith('article-') && f.endsWith('.ts'))
    .sort();

  const allArticles = files.map(f => {
    const fullPath = path.join(ARTICLES_DIR, f);
    return {
      file: f,
      meta: extractMeta(fullPath),
      enContent: extractEnContent(fullPath),
    };
  }).filter(a => a.enContent);

  console.log(`Loaded ${allArticles.length} articles`);

  // Target articles #002-#006
  const targetSortOrders = [2, 3, 4, 5, 6];
  const targets = targetSortOrders.map(so => allArticles.find(a => a.meta.sortOrder === so)).filter(Boolean);

  // 1. Debug practicality for each target
  console.log('\n\n########## PRACTICALITY DEBUG ##########');
  for (const t of targets) {
    debugPracticality(t.enContent, `Article #${t.meta.sortOrder} (${t.meta.slug})`);
  }

  // 2. Debug duplication for each target
  console.log('\n\n########## DUPLICATION DEBUG ##########');
  const allFailures = {};
  for (const t of targets) {
    const fails = debugDuplication(t, allArticles);
    allFailures[t.meta.sortOrder] = fails;
  }

  // 3. Summary
  console.log('\n\n########## SUMMARY ##########');
  for (const t of targets) {
    const fails = allFailures[t.meta.sortOrder] || [];
    console.log(`Article #${t.meta.sortOrder} (${t.meta.slug}): ${fails.length} duplication failures`);
    fails.forEach(f => {
      console.log(`  - ${f.similarity.toFixed(4)} vs ${f.slug} (sort=${f.sortOrder}, ${f.sameCategory ? 'same cat' : 'diff cat'})`);
    });
  }
}

main();
