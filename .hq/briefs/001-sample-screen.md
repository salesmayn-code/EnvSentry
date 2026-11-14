# Task 001: sample audit screen

## Your role: Frontend Worker

You build user interfaces for one task at a time, from a written brief.

- Read the brief fully before touching files. Do only what it asks.
- Inspect the project first. Reuse what is there.
- Follow the design values below exactly. Do not invent a different style.
- Build mobile-first. Every view must work at 375px wide with no page-level horizontal scroll.
- Semantic HTML, one `h1`, labels on controls, visible focus states, accessible names on icon-only marks.
- Keep components small. Do not add any npm dependency.
- Stay inside the files listed below. Never run `git push`, never deploy, never switch branches.
- Do not ask questions; nobody can answer. If something is unclear, take the most conservative option and note it in your report.

---

## Project

- Stack: Vite 8, React 19, TypeScript (strict), Tailwind CSS 4 via `@tailwindcss/vite` (CSS-first config: use `@theme` in `src/index.css`, there is no `tailwind.config.js`). Package manager: npm. Dependencies are installed.
- Build: `npm run build`  Lint: `npm run lint`  Dev: `npm run dev`
- Branch: you are on `task/001-sample-screen`. Do not switch branches.

## Product

EnvSentry compares several `.env` files against one reference file and reports missing, extra, empty and duplicate variable names. It runs only in the browser and **never displays variable values**, only whether a value is present. Full requirements: `docs/PRD.md`.

## Outcome

The complete audit screen, rendered from static sample data, so the owner can approve the design before real logic is connected.

## Data contract

`src/lib/types.ts` defines `AuditResult`, `AuditRow`, `Cell`, `Finding`, `FileSummary`. Read it. The UI must render from an `AuditResult` object only, so real data can replace the sample later. Do not change `types.ts`.

## Do

1. **`src/sample/sampleAudit.ts`**: export `sampleAudit: AuditResult`, hand-written, consistent with the rules in `types.ts`, from these five files (reference is `.env.example`):
   - `.env.example` (reference): `DATABASE_URL`, `REDIS_URL`, `SMTP_HOST`, `SMTP_PORT`, `JWT_SECRET`, `API_BASE_URL`, `SENTRY_DSN`, `LOG_LEVEL`. `SENTRY_DSN` is empty (not flagged: reference empties are fine).
   - `.env.development`: all reference keys; `LOG_LEVEL` declared twice (lines 8 and 14, duplicate/info); extra `DEBUG` (extra/info).
   - `.env.testing`: all reference keys except `SENTRY_DSN` (missing/critical).
   - `.env.staging`: all reference keys; `SMTP_HOST` empty on line 3 (empty/critical); extra `DEBUG` (extra/info).
   - `.env.production`: all reference keys except `REDIS_URL` (missing/critical); extra `LEGACY_API_KEY` (extra/info).
   - Rows: reference keys in the order above, then extra keys A–Z. Make totals, per-file counts and `byType` add up correctly.
2. **Components** in `src/components/` (split sensibly, one component per file):
   - **Top bar:** "EnvSentry" wordmark (text, monospace, accent dot before it) and a muted badge "Runs locally — values never leave your browser".
   - **Files panel** (left, 300px; stacks on top under 900px): a drop zone styled for drag-and-drop with the text "Drop .env files here" and a secondary "Choose files" button (no behavior needed yet); below it a list of the five files, each with name (monospace), key count, critical and info counts as small colored numbers, a radio to mark it as reference (the reference row shows an accent "Reference" tag), and a remove icon button. Show a "Paste instead" text button under the drop zone (no behavior).
   - **Summary strip:** four stat tiles: Critical (red number), Info (amber number), Variables, Files. Plus a primary "Re-run audit" button and a secondary "Export report" button (no behavior yet).
   - **Filter bar:** segmented control All / Critical / Info / Consistent, and a search field "Filter variables". Make these work on the sample data (React state only).
   - **Matrix:** table with a sticky first column "Variable" (monospace key, with a small muted line-number hint) and one column per file (header = file name, reference column marked with the accent tag). Cells show the status marks defined below. Row background tinted by `row.status`: critical red tint, info amber tint, ok none. Clicking a row (or its chevron button) expands a detail panel listing each finding in plain words, for example "Missing in .env.production", "Empty in .env.staging (line 3)", "Declared twice in .env.development (lines 8, 14)", "Not in reference — found in .env.development, .env.staging". The table scrolls sideways inside its own container on small screens.
   - **Empty filter result:** a muted message "No variables match this filter."
3. **`src/App.tsx`**: compose the screen from `sampleAudit`.
4. **`src/index.css`**: keep `@import "tailwindcss";` and add the design tokens below with `@theme`, plus base styles (body background and text color, focus-visible ring).

## Design values (exact)

- Dark only. Background `#0b0d10`, surface `#12151a`, raised `#181c22`, border `#252a33`, text `#e6e8eb`, muted `#8b93a1`, accent `#2dd4a3`.
- Critical `#f05252`, row tint `rgba(240,82,82,0.08)`. Info `#f5a524`, row tint `rgba(245,165,36,0.07)`. Present `#3fb950`.
- Fonts: system sans for UI; `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` for variable names, file names and line numbers. No web fonts, no external requests of any kind.
- Sizes: page title 20px/600, section title 15px/600, body 14px, table 13px, small 12px. Spacing scale 4, 8, 12, 16, 24, 32, 48.
- Max width 1440px. Buttons 32px high, 6px radius. Primary button: accent text, accent background at 12% opacity, accent border. Secondary: text on raised surface with border. Focus ring 2px accent.
- Table: rows 36px, header 11px uppercase muted, thin borders.
- Cell marks, each an inline SVG or text glyph with an `aria-label`: present = green check; missing = red cross; empty = amber hollow circle (title "Empty value"); duplicate = amber "×2" badge (use the real count); extra = amber plus; not declared in a file for an extra key = muted dash.
- Avoid: gradients, glows, emoji, decorative illustrations, repeated card grids.

## Files

- Create or change: `src/sample/sampleAudit.ts`, `src/components/*`, `src/App.tsx`, `src/index.css`
- Do not touch: `src/lib/types.ts`, `package.json`, `package-lock.json`, config files, `docs/`, anything else.

## Check

All must pass before you report `done`:

- `npm run build`
- `npm run lint`

## Report

Write your report to `.hq/reports/001-sample-screen.md`, under 25 lines:

```
STATUS: done | partial | failed
CHANGED: <files>
CHECKS: <command> -> pass|fail (one line each)
ASSUMPTIONS: <anything you decided without being told>
NOT DONE: <anything from the brief left out, and why>
```
