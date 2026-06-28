# Changelog

All notable changes to BrainVerse are documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- `[locale]/not-found.tsx` converted to client component (usePathname + useTranslation) to fix build failure caused by accessing undefined `params.locale` on all 137 pages
- `GamesExplorer.tsx` refactored to use `useTranslation` hook instead of receiving server-side `t` function prop (fixes server-client boundary violation on /games pages)
- Root `not-found.tsx` localized with DEFAULT_LOCALE + getTranslations
- ArticleJsonLd enhanced with `image` and `mainEntityOfPage` fields
- FaqPageJsonLd integrated with `extractFaqs()` for FAQ sections in articles
- openGraph `images` field added to article detail pages
- `_redirects` dynamic deep link rules added (`/games/:slug`, `/articles/:slug`)
- `_headers` HSTS header added (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`)

### Added
- `verify-articles.mjs` extended to 10 dimensions (encoding, JSON-LD, FAQ, rendering, link integrity) — 255 checks, all passing
- CI quality gate in `deploy.yml` (typecheck + lint + verify-articles before build)
- `extractFaqs()` function to parse FAQ sections from article content for FaqPageJsonLd

## [0.1.0] - 2026-06-27

### Added
- 21 brain training games across 5 cognitive dimensions (Memory, Attention, Reaction, Executive, Relaxation)
- Trilingual i18n (en/zh/ja) with full key structure alignment (214 keys each)
- 10 long-form articles on cognitive science with trilingual content
- Brain Age assessment page explaining the 5-dimension model
- SEO metadata: title, description, canonical, hreflang, OpenGraph, Twitter Card, JSON-LD
- Sitemap (132 URLs) and robots.txt with cowb.cc host
- AdSense integration (ads.txt + script tag + meta verification)
- Cloudflare Pages deployment (cowb-brain-games.pages.dev)
- GitHub repository (github.com/wenmoon124/cowb-brain-games)
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Cookie consent banner with trilingual support
- Post-build script to fix `<html lang>` attribute per locale

### Fixed
- i18n "18+ games" copy drift corrected to "21 games" in en/zh/ja
- Deploy script `--project-name cowb-brain-games` flag added
- `.gitignore` ads.txt exception added (defensive measure)
- games.ts Reaction section comment corrected (3 → 2)
- Articles page hardcoded CJK text migrated to i18n JSON
- Cloudflare Analytics beacon with placeholder token removed (TODO added)
- signin/signup pages now have `generateMetadata` via sub-layout
- `API_BASE` URL extracted to shared `lib/config.ts` constant
- ESLint config `prettier` extends removed (package not installed)
