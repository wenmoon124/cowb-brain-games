/**
 * Post-build script: fix <html lang="en"> to per-locale lang attribute.
 * Next.js static export hardcodes lang="en" in all HTML files.
 * This script walks out/{locale}/ directories and sets the correct lang.
 */
const fs = require('fs')
const path = require('path')

const OUT_DIR = path.resolve(__dirname, '..', 'out')
const LOCALE_MAP = { en: 'en', zh: 'zh-CN', ja: 'ja' }

function walkHtml(dir, htmlLang) {
  if (!fs.existsSync(dir)) return 0
  let touched = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      touched += walkHtml(fullPath, htmlLang)
    } else if (entry.name.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8')
      const fixed = content.replace(/<html\s+lang="en"/g, `<html lang="${htmlLang}"`)
      if (fixed !== content) {
        fs.writeFileSync(fullPath, fixed)
        touched++
      }
    }
  }
  return touched
}

let total = 0
for (const [locale, htmlLang] of Object.entries(LOCALE_MAP)) {
  const count = walkHtml(path.join(OUT_DIR, locale), htmlLang)
  total += count
  console.log(`[fix-html-lang] ${locale} -> lang="${htmlLang}" (${count} files)`)
}
console.log(`[fix-html-lang] Done. ${total} files updated.`)
