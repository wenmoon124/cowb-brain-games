const fs = require('fs');
const path = require('path');

const root = 'c:\\Users\\wenmo\\Desktop\\project';

const checks = [
  // Phase A
  ['PROJECT.md', 10000],
  ['AGENTS.md', 10000],
  ['context/00-project.md', 5000],
  ['context/01-product.md', 10000],
  ['context/02-architecture.md', 10000],
  ['decisions/0001-initial-architecture.md', 5000],
  ['docs/development.md', 5000],
  ['docs/deployment.md', 5000],
  ['docs/database.md', 5000],
  ['docs/testing.md', 5000],
  ['docs/seo.md', 5000],
  ['docs/i18n.md', 5000],
  // Phase B
  ['package.json', 100],
  ['pnpm-workspace.yaml', 50],
  ['tsconfig.json', 100],
  ['.gitignore', 50],
  ['.eslintrc.cjs', 100],
  ['.prettierrc', 30],
  ['README.md', 100],
  // Phase C
  ['apps/web/package.json', 100],
  ['apps/web/tsconfig.json', 100],
  ['apps/web/tailwind.config.ts', 500],
  ['apps/web/postcss.config.js', 50],
  ['apps/web/next.config.js', 100],
  ['apps/web/app/globals.css', 500],
  ['apps/web/app/layout.tsx', 500],
  ['apps/web/app/[locale]/layout.tsx', 200],
  ['apps/web/app/[locale]/page.tsx', 100],
  ['apps/web/i18n/en.json', 100],
  ['apps/web/i18n/zh.json', 100],
  ['apps/web/i18n/ja.json', 100],
  ['apps/web/lib/utils.ts', 50],
  // Phase D
  ['workers/api/package.json', 100],
  ['workers/api/tsconfig.json', 100],
  ['workers/api/wrangler.toml', 200],
  ['workers/api/src/index.ts', 500],
  ['workers/api/src/middleware/auth.ts', 200],
  ['workers/api/src/middleware/rate-limit.ts', 200],
  // Phase F
  ['workers/api/migrations/0001_init.sql', 500],
  ['workers/api/migrations/0002_growth.sql', 300],
  ['workers/api/migrations/0003_content.sql', 300],
  ['workers/api/migrations/0004_admin.sql', 200],
  ['workers/api/src/db/types.ts', 1000],
  ['workers/api/src/db/database.ts', 200],
];

const results = { pass: [], fail: [], missing: [] };

for (const [rel, minSize] of checks) {
  const p = path.join(root, rel);
  try {
    const stat = fs.statSync(p);
    if (stat.size >= minSize) {
      results.pass.push(`${rel} | ${stat.size} bytes`);
    } else {
      results.fail.push(`${rel} | TOO_SMALL ${stat.size} < ${minSize}`);
    }
  } catch (e) {
    results.missing.push(`${rel} | MISSING`);
  }
}

console.log('=== PASS ===');
results.pass.forEach(s => console.log(s));
console.log(`\nTotal PASS: ${results.pass.length}`);

console.log('\n=== FAIL (too small) ===');
results.fail.forEach(s => console.log(s));
console.log(`\nTotal FAIL: ${results.fail.length}`);

console.log('\n=== MISSING ===');
results.missing.forEach(s => console.log(s));
console.log(`\nTotal MISSING: ${results.missing.length}`);

console.log(`\n=== SUMMARY ===`);
console.log(`Total: ${checks.length}, Pass: ${results.pass.length}, Fail: ${results.fail.length}, Missing: ${results.missing.length}`);
