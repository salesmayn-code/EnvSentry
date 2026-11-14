# Task 003: connect real files to the audit screen

## Your role: Frontend Worker

- Read the brief fully before touching files. Do only what it asks.
- Inspect the project first and reuse the existing components and design tokens in `src/index.css`. Do not restyle anything that is not mentioned here.
- Every view must work at 375px wide with no page-level horizontal scroll.
- Semantic HTML, labels on controls, visible focus states, accessible names on icon-only buttons.
- Do not add any npm dependency.
- Stay inside the files listed below. Never run `git push`, never deploy, never switch branches.
- Do not ask questions; nobody can answer. If something is unclear, take the most conservative option and note it in your report.

---

## Project

- Stack: Vite 8, React 19, TypeScript (strict), Tailwind CSS 4 (tokens in `src/index.css` via `@theme`). npm. Dependencies are installed.
- Build: `npm run build`  Lint: `npm run lint`
- Branch: you are on `task/003-wire-up`. Do not switch branches.

## Context

The audit screen currently renders static data from `src/sample/sampleAudit.ts`. Real logic exists and is tested:

- `src/lib/audit.ts`: `audit(files: EnvFile[], referenceId: string, now?: Date): AuditResult`. Throws if `referenceId` is not among the files.
- `src/lib/types.ts`: the data contract. Do not change it, `audit.ts` or `parse.ts`.

**Privacy rule:** file contents stay in React state in memory only. No `localStorage`, `sessionStorage`, IndexedDB, network requests, or `console.log` of file contents.

## Outcome

Users can add their own `.env` files (drop, choose, or paste), pick the reference, remove files, and see the live audit. The sample data becomes an optional "Try sample files" demo.

## Do

1. **App state** in `src/App.tsx`: `files: EnvFile[]` (ids from `crypto.randomUUID()`), `referenceId: string | null`, and `runAt: Date`. Compute the result with `audit(files, referenceId, runAt)` in a `useMemo`, only when there are at least 2 files and a valid reference.
2. **Reference selection:** when the first files are added and no reference is set, choose the file named exactly `.env.example` if present, otherwise the first file. If the reference file is removed, apply the same rule to the remaining files. The radio in the files list changes the reference.
3. **Adding files** (in `FilesPanel`):
   - Drop zone accepts dropped files and highlights (accent border) while a file is dragged over it.
   - "Choose files" opens a hidden `<input type="file" multiple>`. Do not set `accept`, since names like `.env.production` have no normal extension.
   - Read each file with `file.text()`. Reject files over 1 MB with a message naming the file.
   - If a file with the same name already exists, replace its text and keep its id (so it stays the reference if it was).
4. **Paste:** "Paste instead" opens an inline form below the drop zone with a file-name input (default `.env.pasted`) and a monospace textarea (8 rows), plus "Add file" (primary) and "Cancel" (secondary). Same-name replacement rule applies.
5. **Remove:** the × button removes that file.
6. **Re-run audit:** sets `runAt` to now so the audit recomputes. Disabled when no audit can run. Say in its `title`: "Re-run with the current files. Drop an updated file with the same name to replace it."
7. **Export report** button: leave it visible but `disabled`, with `title="Export arrives in the next update"`. Do not implement export.
8. **Empty states** in the main area:
   - 0 files: a short explanation ("Add two or more .env files. EnvSentry compares variable names against a reference file and never shows or stores values.") and a secondary button "Try sample files".
   - 1 file: "Add at least one more file to compare."
   - The summary strip, filter bar and matrix appear only when an audit result exists.
9. **Sample files:** create `src/sample/sampleFiles.ts` exporting `sampleFiles: { name: string; text: string }[]`, raw `.env` text for the same five files as the current sample (reference `.env.example`), written so that `audit()` produces exactly: critical 3 (`SENTRY_DSN` missing in `.env.testing`, `SMTP_HOST` empty in `.env.staging`, `REDIS_URL` missing in `.env.production`), info 4 (`LOG_LEVEL` declared twice in `.env.development`, `DEBUG` extra in `.env.development` and `.env.staging`, `LEGACY_API_KEY` extra in `.env.production`). Use obviously fake values such as `postgres://user:pass@localhost:5432/app`. "Try sample files" loads these. Delete `src/sample/sampleAudit.ts` and every import of it.
10. **Unreadable lines:** in each files-list item, when `invalidLines` is not empty, show a muted line such as "2 unreadable lines (3, 9)".
11. **Reference empties:** in `CellMark`, a cell that belongs to the reference file and is `empty` must use the muted color (not amber) with `title` and `aria-label` "Empty in reference (not flagged)". All other marks stay as they are.

## Files

- Create or change: `src/App.tsx`, `src/components/*`, `src/sample/sampleFiles.ts`; delete `src/sample/sampleAudit.ts`.
- Do not touch: `src/lib/*`, `src/index.css` (unless a new token is truly needed), config files, `package.json`, `docs/`.

## Check

All must pass before you report `done`:

- `npm run build`
- `npm run lint`

## Report

Write your report to `.hq/reports/003-wire-up.md`, under 25 lines:

```
STATUS: done | partial | failed
CHANGED: <files>
CHECKS: <command> -> pass|fail (one line each)
ASSUMPTIONS: <anything you decided without being told>
NOT DONE: <anything from the brief left out, and why>
```
