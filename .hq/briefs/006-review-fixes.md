# Task 006: fix code review findings

## Your role: Frontend Worker

- Read the brief fully before touching files. Do only what it asks.
- Inspect the code first and reuse the existing components and design tokens in `src/index.css`. Do not restyle anything not mentioned here.
- Every view must work at 375px wide with no page-level horizontal scroll.
- Semantic HTML, labels on controls, visible focus states, accessible names on icon-only buttons.
- Do not add any npm dependency.
- Stay inside the files listed below. Never run `git push`, never deploy, never switch branches.
- Do not ask questions; nobody can answer. If something is unclear, take the most conservative option and note it in your report.
- If a finding below turns out not to apply to the code, do not change code for it; say so in your report.

---

## Project

- Stack: Vite 8, React 19, TypeScript (strict), Tailwind CSS 4. npm. Dependencies are installed.
- Build: `npm run build`  Lint: `npm run lint`
- Branch: you are on `task/006-review-fixes`. Do not switch branches.
- A dev server is **already running** at `http://localhost:5173`. Do not start or stop any server. It reloads when you save files.

**Privacy rule:** file contents stay in React state only. No browser storage, no network requests, no logging of file contents.

## Outcome

Nine defects found in code review are fixed, with no change to the look of the app beyond what each fix needs.

## Fixes

1. **Stale state when adding files** (`src/App.tsx`, `handleAddFiles`, and the same pattern in `handleRemoveFile` and `handleSelectReference`). They build the next state from the render-time `files` and `referenceId`. Two adds that finish close together can drop files. Make the updates safe against that: keep files and reference in one state object (or a reducer) and use functional updates, so every change is computed from the latest state.
2. **Dropping a file outside the drop zone** (`src/components/FilesPanel.tsx` has the only drop handlers). A file released anywhere else makes the browser open it and leave the page, losing everything. Make the whole window a drop target: while files are dragged over the page, prevent the default and show the existing drop zone in its highlighted state; a drop anywhere adds the files through the same path as the drop zone (same 1 MB check and messages). Add and remove the window listeners in an effect with cleanup. Ignore drags that carry no files.
3. **Same-named files in one batch.** When one drop or selection contains two files with the same name, only the last survives and nothing says so. Keep the last one, and show a message in the existing error area naming the file: `Two files named ".env" were added together; only the last one was kept. Add them separately with different names.`
4. **Paste form focus** (`FilesPanel.tsx`). When the form opens, focus the file-name input. When it closes (Add file or Cancel), return focus to the "Paste instead" button.
5. **Export menu focus** (`src/components/SummaryStrip.tsx`). On open, focus the first menu item. Arrow Up and Arrow Down move between items. Escape closes and returns focus to the "Export report" button. Tab closes the menu and lets focus move on normally, without focus falling to the page body. After choosing an item, focus returns to the button.
6. **Per-file counts** (`FilesPanel.tsx`, around the `text-muted/60` spans). The critical and info counts are bare colored numbers. Keep the compact look, but: zero values use the full `text-muted` color (not `/60`), and each file row exposes real text for assistive technology, for example a visually hidden `<span className="sr-only">` reading `1 critical, 2 info`, with the bare numbers marked `aria-hidden`.
7. **Misleading "ok" detail** (`src/components/AuditMatrix.tsx`, the text `No issues — present with a value in all files.`). When the reference value is empty the row is still ok. Use `No issues — declared in every file.` and, when the reference cell is empty, add `The reference value is empty, which is not flagged.`
8. **Stale report time** (`App.tsx`). Removing a file or switching the reference recomputes the audit but keeps the old time. Refresh the run time on every change that recomputes the audit.
9. **Wrong empty message** (`AuditMatrix.tsx`, `No variables match this filter.`). When there are zero rows and no status filter or search is active, show `No variables found in these files.` Keep the current message when a filter or search is active.

## Files

- Change: `src/App.tsx`, `src/components/*.tsx`
- Do not touch: `src/lib/*`, `src/sample/*`, `src/index.css`, config files, `package.json`, `index.html`, `docs/`, `.github/`.

## Check

All must pass before you report `done`:

- `npm run build`
- `npm run lint`
- Look at your work in the running app with `agent-browser`, always passing `--session hq-envsentry-006`:
  - `agent-browser --session hq-envsentry-006 open http://localhost:5173`
  - `agent-browser --session hq-envsentry-006 snapshot -i`, click "Try sample files", then check the page with `snapshot -i` and `errors`
  - open the paste form and the export menu and confirm with `snapshot -i` which element has focus
  - `agent-browser --session hq-envsentry-006 set viewport 375 812` and take one screenshot to `.hq/logs/006-mobile.png`
  - `agent-browser --session hq-envsentry-006 close` when finished
  - If `agent-browser` fails to run, skip this step and say so under NOT DONE.

## Report

Write your report to `.hq/reports/006-review-fixes.md`, under 30 lines:

```
STATUS: done | partial | failed
CHANGED: <files>
CHECKS: <command> -> pass|fail (one line each)
FIXES: <1-9, each: fixed | not applicable (why)>
ASSUMPTIONS: <anything you decided without being told>
NOT DONE: <anything from the brief left out, and why>
```
