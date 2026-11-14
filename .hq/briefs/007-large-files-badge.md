# Task 007: fast rendering for large audits, and badge alignment

## Your role: Frontend Worker

- Read the brief fully before touching files. Do only what it asks.
- Inspect the code first and reuse the existing components and design tokens. Do not restyle anything not mentioned here.
- Every view must work at 375px wide with no page-level horizontal scroll.
- Semantic HTML, labels on controls, visible focus states.
- Do not add any npm dependency (no virtualization library).
- Stay inside the files listed below. Never run `git push`, never deploy, never switch branches.
- Do not ask questions; nobody can answer. If something is unclear, take the most conservative option and note it in your report.

---

## Project

- Stack: Vite 8, React 19, TypeScript (strict), Tailwind CSS 4. npm. Dependencies are installed.
- Build: `npm run build`  Lint: `npm run lint`
- Branch: you are on `task/007-large-files-badge`. Do not switch branches.
- A dev server is **already running** at `http://localhost:5173`. Do not start or stop any server.

## Problem

Files up to 1 MB are accepted. An audit of 40,000 variables currently freezes the page for about 28 seconds, because the matrix renders every row and builds every row's detail text on each render.

## Do

1. **Show rows in pages** (`src/components/AuditMatrix.tsx`, and `src/App.tsx` where `filteredRows` is passed in):
   - Render at most 300 rows at first. Below the table, when more rows exist, show a muted line `Showing 300 of 40,000 variables` (real numbers, formatted with `toLocaleString()`) and a secondary button `Show 300 more`. Each click adds 300. When all are shown, hide the button and the line.
   - Reset to 300 whenever the status filter, the search text, or the audit result changes.
   - Filtering and search still run over all rows; only the rendering is limited. The summary counts and the export already cover everything; do not change them.
   - Rows keep their current order: critical problems are not reordered to the top.
2. **Build detail text only for expanded rows** (`AuditMatrix.tsx`): the detail lines are currently computed for every row. Compute them only when a row is expanded.
3. **Avoid needless recomputation** (`App.tsx`): `filteredRows` should be computed with `useMemo` on the audit result, filter and search.
4. **Badge alignment** (`src/components/CellMark.tsx`, the duplicate badge that renders `×{count}`): it sits slightly below the vertical center of its table cell, while the other marks are centered. Center it vertically with the other marks, for example with `inline-flex items-center` and a line height that matches. Do not change its colors or size.

## Files

- Change: `src/App.tsx`, `src/components/AuditMatrix.tsx`, `src/components/CellMark.tsx`
- Do not touch anything else.

## Check

All must pass before you report `done`:

- `npm run build`
- `npm run lint`
- With `agent-browser --session hq-envsentry-007` against `http://localhost:5173`: click "Try sample files", confirm with `snapshot -i` that all 10 rows show and no "Show more" button appears; check `errors`; take a screenshot to `.hq/logs/007-sample.png`; then `close`. If `agent-browser` fails to run, skip this step and say so under NOT DONE.

## Report

Write your report to `.hq/reports/007-large-files-badge.md`, under 25 lines:

```
STATUS: done | partial | failed
CHANGED: <files>
CHECKS: <command> -> pass|fail (one line each)
ASSUMPTIONS: <anything you decided without being told>
NOT DONE: <anything from the brief left out, and why>
```
