const fs = require('fs');
const path = require('path');

const TF = /\b(\d+\s*(minute|hour|second|min|sec|day|week|month)|daily|weekly|monthly|every\s+day|each\s+(morning|evening|night|day)|per\s+week|per\s+day|per\s+month|times?\s+per|twice|once|three\s+times|four\s+times|regularly|morning|evening|night)\b/i;
const AV = /\b(try|practice|practise|use|start|begin|exercise|train|play|spend|walk|read|write|take|do|repeat|schedule|aim|set|build|incorporate|adopt|avoid|limit|ensure|protect|maintain)\b/i;

const f = path.join(__dirname, 'workers', 'api', 'content', 'articles', 'article-005-factors-affecting-brain-age.ts');
let c = fs.readFileSync(f, 'utf-8');
const m = c.match(/const enContent = `([\s\S]+?)`;/);
const content = m[1];
const bullets = content.match(/^[-*]\s+.+$/gm) || [];
const numbered = content.match(/^\d+\.\s+.+$/gm) || [];
const items = [...bullets, ...numbered];

console.log('=== Article #5 practicality ===');
console.log(`Total items: ${items.length} (bullets: ${bullets.length}, numbered: ${numbered.length})`);
items.forEach((item, i) => {
  const t = TF.test(item);
  const a = AV.test(item);
  console.log(`#${i + 1} [${t && a ? 'PASS' : 'FAIL'}] time=${t} action=${a}`);
  console.log('  ' + item.substring(0, 150).replace(/\n/g, ' '));
  if (!t) {
    const words = item.toLowerCase().split(/\W+/);
    const tw = words.filter(w => /\d+/.test(w) || ['daily','weekly','monthly','morning','evening','night','twice','once','regularly','minute','hour','second','day','week','month','min','sec'].includes(w));
    console.log('  potential time: ' + JSON.stringify(tw.slice(0, 10)));
  }
  if (!a) {
    const words = item.toLowerCase().split(/\W+/);
    const aw = words.filter(w => ['try','practice','practise','use','start','begin','exercise','train','play','spend','walk','read','write','take','do','repeat','schedule','aim','set','build','incorporate','adopt','avoid','limit','ensure','protect','maintain'].includes(w));
    console.log('  action verbs: ' + JSON.stringify(aw));
  }
});
