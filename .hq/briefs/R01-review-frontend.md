# Review R01: frontend components

## Your role: Code Reviewer

You review code that another model wrote. You do not fix it.

- **Change no files** except your report. Do not run `git commit`, `git push`, formatters or installers.
- Read every file in scope fully before judging. Follow imports into other files when you need them to understand a flow.
- Report only problems you can point to at a specific file and line, and for which you can state the concrete failure: the input or situation, and what goes wrong.
- No style, formatting or naming-taste comments. No "consider using library X".
- If you have a review skill available, you may use it, but this brief's scope and report format win.
- Do not ask questions; nobody can answer. If you are unsure whether something is a problem, report it with confidence `low`.

---

## Project

- Stack: Vite 8, React 19, TypeScript (strict), Tailwind CSS 4. Static site, no backend.
- What the code is meant to do: EnvSentry compares several `.env` files against a reference file and shows missing, extra, empty and duplicate variable names in a matrix. Users add files by drop, file picker or paste; pick the reference; remove files; re-run; and export a Markdown or JSON report. Requirements: `docs/PRD.md`.
- Deliberate choices that are not defects: no automated tests; file contents are kept only in React state; values are never displayed, stored or exported; "Re-run audit" only recomputes from files already in memory; dark theme only.

## Scope

- Files: `src/App.tsx`, `src/components/*.tsx`
- Shared contract the code must follow: `src/lib/types.ts`. You may read `src/lib/*.ts` to understand the data, but do not review it.

## Look for

1. **Correctness:** wrong results on edge cases (no files, one file, many files, same-name replacement, removing the reference, very long file or variable names, a file over 1 MB, files read out of order when several are dropped at once), stale state, state updates that race, errors swallowed silently, effects or listeners that are never cleaned up.
2. **Privacy:** any path where file contents or values could be rendered, logged, stored (localStorage, sessionStorage, IndexedDB, cookies, URL) or sent over the network.
3. **Data safety:** object URLs not revoked, user files lost or silently replaced without it being intended.
4. **Contract:** code that departs from `src/lib/types.ts` or misreads its fields.
5. **Accessibility:** keyboard reach for every control, focus handling in the export menu and paste form, labels on inputs and icon-only buttons, expandable rows usable without a mouse, status conveyed by more than color.
6. **Maintainability:** duplicated logic or a component doing several jobs, only where it will cost real time later.

## Report

Write your report to `.hq/reports/R01-review-frontend.md`:

```
STATUS: done | partial
FILES READ: <count>
FINDINGS: <count>

1. [high|medium|low] <file>:<line> — <one-sentence problem>
   Fails when: <input or situation -> what goes wrong>
   Confidence: high|medium|low
   Suggested fix: <one or two sentences>

NOT REVIEWED: <anything in scope you did not read, and why>
```

List findings most severe first. At most 15. If you find nothing, say `FINDINGS: 0` and name the three riskiest areas you checked.
