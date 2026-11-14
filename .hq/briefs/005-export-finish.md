# Task 005: export buttons and finishing touches

## Your role: Frontend Worker

- Read the brief fully before touching files. Do only what it asks.
- Inspect the project first and reuse the existing components and design tokens in `src/index.css`. Do not restyle anything not mentioned here.
- Every view must work at 375px wide with no page-level horizontal scroll.
- Semantic HTML, labels on controls, visible focus states, accessible names on icon-only buttons.
- Do not add any npm dependency.
- Stay inside the files listed below. Never run `git push`, never deploy, never switch branches.
- Do not ask questions; nobody can answer. If something is unclear, take the most conservative option and note it in your report.

---

## Project

- Stack: Vite 8, React 19, TypeScript (strict), Tailwind CSS 4. npm. Dependencies are installed.
- Build: `npm run build`  Lint: `npm run lint`
- Branch: you are on `task/005-export-finish`. Do not switch branches.

## Context

`src/lib/report.ts` (tested, do not change) exports:

- `toMarkdownReport(result: AuditResult): string`
- `toJsonReport(result: AuditResult): string`
- `reportFileName(result: AuditResult, ext: 'md' | 'json'): string`

The "Export report" button in `SummaryStrip` is currently disabled.

**Privacy rule:** no network requests, no browser storage, no logging of file contents.

## Do

1. **Export:** replace the disabled "Export report" button with an export control that offers two choices, "Markdown (.md)" and "JSON (.json)". Use a small menu that opens below the button (closes on choice, on Escape, and on outside click; keyboard reachable), or two side-by-side secondary buttons on narrow screens if simpler. Each choice downloads the report for the current audit result: build the text with the functions above, create a `Blob` (`text/markdown;charset=utf-8` or `application/json;charset=utf-8`), download it through a temporary `<a download>` with an object URL, then revoke the URL. Name the file with `reportFileName`. Disabled when no audit result exists.
2. **Privacy note:** under the export control or in the summary strip, a muted 12px line: "Reports include variable names and line numbers only, never values."
3. **Footer:** a slim footer at the bottom of the page, muted 12px text: "EnvSentry runs entirely in your browser. Files are never uploaded or stored." Same max width as the main content.
4. **Favicon:** replace `public/favicon.svg` with a simple original mark: a 32×32 rounded square in `#12151a` with a `#2dd4a3` check mark or shield outline. No text.
5. **Head tags in `index.html`:** keep the existing title and description. Add `<meta name="theme-color" content="#0b0d10">`, Open Graph tags (`og:title`, `og:description`, `og:type` = `website`), and `<meta name="twitter:card" content="summary">`. Do not add any external URL.
6. **`public/robots.txt`:** allow all (`User-agent: *` and `Allow: /`).

## Files

- Create or change: `src/components/*`, `src/App.tsx`, `index.html`, `public/favicon.svg`, `public/robots.txt`
- Do not touch: `src/lib/*`, `src/sample/*`, config files, `package.json`, `docs/`.

## Check

All must pass before you report `done`:

- `npm run build`
- `npm run lint`

## Report

Write your report to `.hq/reports/005-export-finish.md`, under 25 lines:

```
STATUS: done | partial | failed
CHANGED: <files>
CHECKS: <command> -> pass|fail (one line each)
ASSUMPTIONS: <anything you decided without being told>
NOT DONE: <anything from the brief left out, and why>
```
