# Project State: EnvSentry

Path: `D:\Workspace\projects\EnvSentry`
Started: 2026-11-13
Workflow: web-app-build
Size: small (run straight through)

## Kickoff decisions

| Topic | Decision | Why |
|---|---|---|
| Stack | Vite + React + TypeScript + Tailwind, fully client-side | One interactive screen; files are parsed in the browser and never uploaded, which keeps the PRD's privacy promise |
| Free stack | Not needed | Static output; any free static host works. Decide at deploy time |
| Hosting | GitHub Pages via Actions (deploy.yml), base /EnvSentry/ | No new account; free; 100 GB/month soft limit |
| Planner model | Claude Opus 5.5, medium or high effort | User's choice; not Fable 5.2 |
| Frontend worker model | `agy`, `gemini-4-hydrogen-high` | Confirmed by user |
| Backend worker model | `opencode`, `opencode-go/deepseek-v4.1-flash`, effort `max` | Confirmed by user; used for the parsing and comparison logic |
| Design source | User's reference screenshot (dark cross-environment secrets dashboard) plus planner brief | See Design brief |

## Goal

A browser tool that compares several `.env` files against a chosen reference file and reports missing, extra, empty and duplicate variables, without ever displaying or storing values. Full requirements: `docs/PRD.md`.

## Design brief

Direction: the user's reference screenshot (dark cross-environment secrets matrix). Used as a direction only; no copying of that product's branding or screens.

- **Audience and goal:** developers before a deploy. One action: drop files, see what is wrong, fix, re-run, export.
- **Tone:** precise, calm, technical.
- **Color (dark only):** background `#0b0d10`, surface `#12151a`, raised surface `#181c22`, border `#252a33`, text `#e6e8eb`, muted text `#8b93a1`, accent `#2dd4a3` (actions, reference marker, focus ring). Critical `#f05252` with row tint `rgba(240,82,82,0.08)`. Info `#f5a524` with row tint `rgba(245,165,36,0.07)`. Present `#3fb950`.
- **Type:** UI in the system sans stack, variable names and line numbers in the system monospace stack (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`). No web fonts, so the app makes no third-party requests. Sizes: page title 20px/600, section title 15px/600, body 14px, table 13px, small 12px.
- **Spacing:** 4, 8, 12, 16, 24, 32, 48.
- **Layout:** full width up to 1440px. Top bar; then left panel 300px (files) and main area (summary, filters, matrix). Under 900px the files panel stacks above the main area and the matrix scrolls sideways inside its own container (the page never scrolls sideways).
- **Components:** buttons 32px high, 6px radius; primary is accent text on a 12% accent background with an accent border; secondary is text on raised surface with a border. Focus ring 2px accent. Table rows 36px, header row uppercase 11px muted.
- **Status marks per cell:** present = green check; missing = red cross; empty = amber hollow circle with "empty" on hover; duplicate = amber "×2" badge; extra = amber plus; not applicable (extra key, file that does not declare it) = muted dash. Each mark has an accessible label.
- **Values are never shown,** only whether one is present.

### Severity rules (planner decision, tell the user)

- Critical: a reference key missing from a file; a key declared with an empty value in a non-reference file.
- Info: a key not in the reference (extra); a key declared more than once in one file (duplicate).
- Empty values in the reference file are not flagged, since `.env.example` files are often blank on purpose.

Sample page approved: yes (2026-11-14)

## Plan

1. **001 sample screen** (Antigravity): the full audit screen with static sample data, for design approval.
2. **002 parser and audit logic** (OpenCode): `src/lib/parse.ts`, `src/lib/audit.ts` against `src/lib/types.ts`.
3. **003 wire up** (Antigravity): real file input (drop, pick, paste), reference selection, re-run, live results.
4. **004 export** (OpenCode): sanitized Markdown and JSON report builders; (Antigravity) export buttons.
5. **005 finish:** SEO basics, empty and error states, final check.

Scaffold (Vite 8, React 19, TypeScript, Tailwind 4, Oxlint) done by the planner on main.

MVP complete 2026-11-14: all 8 PRD requirements met. Clean-install build, lint and npm audit pass.

## Tasks

| ID | Task | Worker | Branch | Status | Attempts | Notes |
|---|---|---|---|---|---|---|
| 001 | Sample audit screen from static data | agy, gemini-4-hydrogen-high | merged | done | 1 | 3.6 min. Checked in browser at desktop and 375px. Follow-up for 003: reference-file empty values show an amber mark; make it muted since they are not flagged |
| 002 | Parser and audit logic | opencode, deepseek-v4.1-flash max | merged | done | 1 | 3.4 min. Planner checks passed: brief case, PRD scenario, edge cases, no values in output |
| 003 | Real file input, paste, reference, re-run | agy, gemini-4-hydrogen-high | merged | done | 1 | 3.5 min. Browser-checked: sample files, paste replace, remove reference, drop, 1 MB limit |
| 004 | Sanitized Markdown and JSON report builders | opencode, deepseek-v4.1-flash max | merged | done | 1 | 3.3 min. Checked: all sections, pipe escaping, no values or ids |
| 005 | Export menu, footer, favicon, head tags, robots.txt | agy, gemini-4-hydrogen-high | merged | done | 1 | 2.2 min. Checked: both downloads, no values, 375px, Escape closes menu |
| R01 | Code review of frontend files | opencode, deepseek-v4.1-flash max | main | done | 1 | 16 min (hit the limit after writing its report). 10 findings |
| 006 | Fix review findings 1-5 and 7-10 | agy, gemini-4-hydrogen-high | merged | done | 1 | 5.1 min. Worker self-checked with agent-browser. Planner checked each fix in a headless browser, plus desktop and phone screenshots |

## Parked (waiting on the user)

- none for GitHub: pushed 2026-11-14 to https://github.com/salesmayn-code/EnvSentry (public).
- none for deploy.

## Review findings

R01 (2026-11-14): OpenCode reviewed `src/App.tsx` and `src/components/*`. Report: `.hq/reports/R01-review-frontend.md`. User approved fixing on 2026-11-14. Task 006 fixed all except #6.

| # | Finding | Planner check | Verdict |
|---|---|---|---|
| 1 | `handleAddFiles` merges from a stale state snapshot; overlapping adds can drop files | Confirmed in code | Fixed in 006, verified in browser |
| 2 | Dropping a file outside the drop zone makes the browser open it and lose all loaded files | Confirmed: no window-level drop handler | Fixed in 006, verified in browser |
| 3 | Paste form loses keyboard focus on open and close | Not yet confirmed | Fixed in 006, verified in browser |
| 4 | Export menu loses focus on Tab | Not yet confirmed | Fixed in 006, verified in browser |
| 5 | Two same-named files in one drop collapse silently | Follows from the code in #1 | Fixed in 006, verified in browser |
| 6 | Very large files (hundreds of thousands of rows) can freeze the tab | Plausible, not tested | Parked: needs a product decision on a row cap; unlikely with real .env files |
| 7 | Per-file counts are bare colored numbers with low-contrast zeros | Not yet confirmed | Fixed in 006, verified in browser |
| 8 | Row detail says "present with a value in all files" when the reference value is empty | Not yet confirmed | Fixed in 006, verified in browser |
| 9 | Report time is stale after removing a file or switching reference | Confirmed in code | Fixed in 006, verified in browser |
| 10 | Empty result says "No variables match this filter" when no filter is active | Not yet confirmed | Fixed in 006, verified in browser |

## Model changes and escalations

- none

## Deploy record

- 2026-11-14: https://salesmayn-code.github.io/EnvSentry/ on GitHub Pages. Every push to main redeploys. Rollback: revert the commit on main and push, or re-run an earlier successful run of the Deploy to GitHub Pages workflow.
