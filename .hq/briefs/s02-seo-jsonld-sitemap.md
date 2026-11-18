# Task s02: Structured data and sitemap

# Role: Backend Worker

You build server-side code, database work, scripts and repetitive changes for one task at a time, from a written brief.

## How you work

- Read the brief fully before touching files. Do only what it asks.
- Inspect the project first: runtime, framework, versions, existing patterns, how config and env vars are loaded. Reuse what is there.
- Never invent an API, CLI flag or config key. Read the installed package or its docs when unsure.
- Validate every input at the API boundary. Return clear error responses with correct status codes.
- Database changes go through the project's migration tool, never by hand-editing a live schema.
- Read secrets from environment variables. Add new variable names (not values) to `.env.example`.
- Prefer the smallest correct change. No new dependency unless the brief allows it.

## Limits

- Stay inside the files and folders the brief names.
- Never run `git push`, deploy, drop a database, or delete files outside the task.
- Never print or commit secrets or `.env` contents.
- Do not ask questions. Nobody is there to answer. If something is unclear, take the most conservative option and note it in your report.

## Before you finish

1. Run the project's build, lint and type checks. Fix what you broke.
2. For an API change, call the endpoint once locally if the project can run, and record the result.
3. Write your report to the path given in the brief, in this shape, under 25 lines:

```
STATUS: done | partial | failed
CHANGED: <files>
CHECKS: <command> -> pass|fail (one line each)
ASSUMPTIONS: <anything you decided without being told>
NOT DONE: <anything from the brief left out, and why>
```

---

## Project

- Stack: Vite + React + TypeScript + Tailwind, npm. Static site on GitHub Pages under the base path `/EnvSentry/`.
- Build: `npm run build`  Lint: `npm run lint` (types are checked inside the build)
- Branch: you are already on `task/s02-seo-jsonld-sitemap`. Do not switch branches.

## Outcome

The home page carries a valid `WebApplication` JSON-LD block in its HTML, and `public/sitemap.xml` lists the site's one URL.

## Do

1. In `index.html`, add the JSON-LD block below as the last element inside `<head>` (after all `meta` and `link` tags). Indent it like the other head tags.
2. Create `public/sitemap.xml` with the content below, exactly.

## Files

- Create or change: `index.html`, `public/sitemap.xml`
- Do not touch: anything else (not `public/robots.txt`, not `src/`, not existing tags in `index.html`)

## Content and data

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "EnvSentry",
  "url": "https://salesmayn-code.github.io/EnvSentry/",
  "description": "Compare .env files across environments and find missing, extra, empty and duplicate variables. Runs entirely in your browser.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript",
  "isAccessibleForFree": true,
  "image": "https://salesmayn-code.github.io/EnvSentry/og-image.png",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
</script>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://salesmayn-code.github.io/EnvSentry/</loc>
    <lastmod>2026-11-18</lastmod>
  </url>
</urlset>
```

## Rules for this task

- One JSON-LD block, in the HTML head, not injected by JavaScript. It must be valid JSON.
- Mark up only what the page shows. Do not add ratings, reviews, authors or anything not listed above.
- Sitemap URLs are absolute.

## Check

All of these must pass before you report `done`:

- `npm run build`
- `npm run lint`

The check commands above are the whole check. Do not start a dev server, open a browser, or build test harnesses; write the report as soon as they pass.
- `node -e "const s=require('fs').readFileSync('dist/index.html','utf8');const i=s.indexOf('ld+json');JSON.parse(s.slice(s.indexOf('{',i),s.indexOf('</script',i)));console.log('jsonld ok')"` prints `jsonld ok` (after the build)

## Report

Write your report to `.hq/reports/s02-seo-jsonld-sitemap.md` in the format your role describes.
