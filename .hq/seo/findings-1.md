# SEO findings 1 — 2026-11-18

Audit: `node D:\Workspace\scripts\seo-audit.mjs https://salesmayn-code.github.io/EnvSentry/ --rendered` → 5 FAIL, 3 WARN. Lighthouse not run (needs the user's yes to download).

Site: https://salesmayn-code.github.io/EnvSentry/ (one page, GitHub Pages project site under /EnvSentry/).

| # | Page | Key | Now | Fix | Check | Worker |
|---|---|---|---|---|---|---|
| 1 | / | canonical | missing | `<link rel="canonical" href="https://salesmayn-code.github.io/EnvSentry/" />` in `index.html` | `canonical` PASS on live | agy |
| 2 | / | og:url | missing | `<meta property="og:url" content="https://salesmayn-code.github.io/EnvSentry/" />` | `og:url` PASS | agy |
| 3 | / | og:image | missing | copy `media/social-card.png` (1200x630) to `public/og-image.png`; `og:image` = `https://salesmayn-code.github.io/EnvSentry/og-image.png`, plus `og:image:width` 1200, `og:image:height` 630, `og:image:alt` | `og:image` + `og:image url` PASS | agy |
| 4 | / | twitter:card | summary (WARN) | `summary_large_image`, plus `twitter:title`, `twitter:description`, `twitter:image` | `twitter:card` PASS | agy |
| 5 | / | jsonld | none | `WebApplication` JSON-LD in `index.html` `<head>` (values in the brief) | `jsonld` PASS: WebApplication | opencode |
| 6 | site | sitemap | 404 | `public/sitemap.xml` with the one absolute URL | `sitemap` PASS, lists the home URL | opencode |

## Not fixable in this repo

- `robots.txt` at the host root (`salesmayn-code.github.io/robots.txt`) belongs to the user's `salesmayn-code.github.io` repo, which does not exist. Crawlers ignore `/EnvSentry/robots.txt`. Missing root robots.txt means "crawl everything", so this is harmless. Submit the sitemap in Search Console instead.

## Advice (user decides)

- Search Console: add a URL-prefix property `https://salesmayn-code.github.io/EnvSentry/`, verify (HTML tag is easiest: paste the tag here and it becomes a fix), submit `https://salesmayn-code.github.io/EnvSentry/sitemap.xml`, request indexing.
- Title (45 ch) could carry the search phrase people use: e.g. "EnvSentry — Compare .env Files Across Environments" (50 ch). Not changed without your say.
- A one-page app has little text for search. A short "How it works / privacy" section below the tool would give the page words to rank on.
