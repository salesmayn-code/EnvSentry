# Task d01: design tokens page

## Your role: Frontend Worker

- Read the brief fully before touching files. Do only what it asks.
- Inspect the code first and reuse the existing design tokens and class patterns. Do not restyle the app.
- The page must work at 375px wide with no page-level horizontal scroll.
- Semantic HTML, visible focus states.
- Do not add any npm dependency.
- Stay inside the files listed below. Never run `git push`, never deploy, never switch branches.
- Do not ask questions; nobody can answer. If something is unclear, take the most conservative option and note it in your report.

## Project

- Stack: Vite 8, React 19, TypeScript (strict), Tailwind CSS 4 with tokens in `src/index.css` (`@theme`). npm. Dependencies are installed.
- Build: `npm run build`  Lint: `npm run lint`
- Branch: you are on `task/d01-tokens-page`.
- A dev server is **already running** at `http://localhost:5173`. Do not start or stop any server.

## Outcome

A second, unlinked page `tokens.html` that shows EnvSentry's design system: the project's living style sheet.

## Do

1. `tokens.html` (project root, next to `index.html`): copy `index.html`'s head basics (charset, viewport, title `EnvSentry — Design tokens`), add `<meta name="robots" content="noindex">`, no SEO/JSON-LD tags, and load `/src/tokens/main.tsx`.
2. `vite.config.ts`: add both pages as build inputs (`build.rollupOptions.input` with `index.html` and `tokens.html`, resolved with `fileURLToPath(new URL(..., import.meta.url))`). Keep everything else as is.
3. `src/tokens/main.tsx`: imports `../index.css` and renders `TokensPage`.
4. `src/tokens/TokensPage.tsx`, sections in this order, each with an h2:
   - **Colors:** one swatch per `--color-*` token in `src/index.css` (bg, surface, raised, border, text, muted, accent, critical, info, present). Each shows the token name, the hex, and its contrast ratio against `bg` (`#0b0d10`), computed in code from the hex with the WCAG relative-luminance formula, shown as e.g. `12.3:1` plus `AA` (≥4.5), `AA large` (≥3) or `fail`. Keep the hex list in one array in this file.
   - **Type:** samples of page title 20px/600, section title 15px/600, body 14px, table 13px, small 12px, table header 11px uppercase muted, and a monospace sample (`DATABASE_URL`, line `42`). Label each with its size and weight.
   - **Spacing:** bars for 4, 8, 12, 16, 24, 32, 48 px, each labelled.
   - **Components:** the primary button (copy the exact class string from `src/components/SummaryStrip.tsx`, the Export button) in default, and disabled state; a secondary button (text on raised surface with border, 32px high, 6px radius); the accent badge from `src/components/FilesPanel.tsx` (the `reference` style badge); a text input styled with the tokens; a note telling the reader to Tab through for focus rings.
   - **Status marks:** render the real `CellMark` component from `src/components/CellMark.tsx` once for each status it supports, each with its name. Read its props first; do not change it.
5. Page layout: `bg` background, max width 1120px, centered, 24px padding (16px under 640px), top line "EnvSentry design tokens" with a link back to `./` labelled "Back to app".

## Files

- Create: `tokens.html`, `src/tokens/main.tsx`, `src/tokens/TokensPage.tsx`
- Change: `vite.config.ts`
- Do not touch anything else.

## Check

All must pass before you report `done`:

- `npm run build` (and `dist/tokens.html` exists)
- `npm run lint`
- With `agent-browser --session hq-envsentry-d01` on `http://localhost:5173/tokens.html`: `errors` shows none; screenshot to `.hq/logs/d01-desktop.png --full`; `set viewport 375 812`; screenshot to `.hq/logs/d01-phone.png --full`; `close`. If `agent-browser` fails, say so under NOT DONE.

## Report

Write `.hq/reports/d01-tokens-page.md`, under 25 lines:

```
STATUS: done | partial | failed
CHANGED: <files>
CHECKS: <command> -> pass|fail (one line each)
ASSUMPTIONS: <anything you decided without being told>
NOT DONE: <anything left out, and why>
```
