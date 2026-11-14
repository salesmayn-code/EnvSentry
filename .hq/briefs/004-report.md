# Task 004: sanitized audit report builders

## Your role: Backend Worker

- Read the brief fully before touching files. Do only what it asks.
- Inspect the project first. Reuse what is there. Never invent an API.
- Do not add any npm dependency.
- Stay inside the files listed below. Never run `git push`, never deploy, never switch branches.
- Do not ask questions; nobody can answer. If something is unclear, take the most conservative option and note it in your report.

---

## Project

- Stack: Vite 8, React 19, TypeScript (strict). npm. Dependencies are installed.
- Build: `npm run build`  Lint: `npm run lint`
- Branch: you are on `task/004-report`. Do not switch branches.

## Context

`src/lib/types.ts` defines `AuditResult` (read it). `src/lib/audit.ts` produces it. The result contains variable names, file names and line numbers only, never values. Do not change either file.

## Outcome

`src/lib/report.ts`: pure functions (no React, no DOM, no Node APIs) that turn an `AuditResult` into a downloadable report. Relative imports end in `.ts` (`./types.ts`); use `import type` for types.

## Do

Export exactly these three functions:

### `toMarkdownReport(result: AuditResult): string`

Sections in this order:

1. `# EnvSentry audit report`
2. A short list: generated time (the `generatedAt` ISO string), reference file name, number of files, number of variables, and the line `Values are not included in this report.`
3. `## Summary`: a table with columns File, Variables, Critical, Info. One row per file in `result.files` order. Append ` (reference)` to the reference file's name.
4. `## Critical findings`: grouped by file (a `###` heading per file name, files in `result.files` order, only files that have critical findings). One bullet per finding:
   - missing: `` `KEY` is missing ``
   - empty: `` `KEY` is empty (line N) ``
   If there are none, the single line `None.`
5. `## Informational findings`: same grouping. Bullets:
   - extra: `` `KEY` is not in the reference (line N) `` (if several lines, `lines N, M`)
   - duplicate: `` `KEY` is declared 2 times (lines N, M) `` (use the real count)
   If there are none, `None.`
6. `## Matrix`: a table with a `Variable` column then one column per file name. Cells: `ok` when declared with a value, `missing` for a reference key not declared, `empty` when `cell.empty`, append ` ×N` when declared N>1 times (for example `ok ×2`), `extra` for a non-reference key declared in that file, `-` for a non-reference key not declared in that file. In the reference column, an empty reference key shows `empty (not flagged)`.

Escape `|` as `\|` inside table cells. Wrap variable names in backticks in the matrix. End the document with a single trailing newline.

### `toJsonReport(result: AuditResult): string`

`JSON.stringify(obj, null, 2)` of:

```json
{
  "tool": "EnvSentry",
  "reportVersion": 1,
  "generatedAt": "...",
  "reference": ".env.example",
  "valuesIncluded": false,
  "totals": { "files": 0, "variables": 0, "critical": 0, "info": 0, "byType": { "missing": 0, "extra": 0, "empty": 0, "duplicate": 0 } },
  "files": [ { "name": "...", "isReference": true, "variables": 0, "critical": 0, "info": 0, "unreadableLines": [] } ],
  "findings": [ { "severity": "critical", "type": "missing", "variable": "KEY", "file": ".env.production", "lines": [] } ]
}
```

Use file **names**, never internal ids. Findings in `result.findings` order.

### `reportFileName(result: AuditResult, ext: 'md' | 'json'): string`

`envsentry-audit-YYYY-MM-DD-HHMM.<ext>` from `generatedAt` in UTC.

## Files

- Create: `src/lib/report.ts`
- Do not touch anything else. Do not add test files.

## Check

All must pass before you report `done`:

- `npm run build`
- `npm run lint`
- Write a temporary script outside `src/` that builds an `AuditResult` with `audit()` from three small files (include a missing, an empty, an extra, a duplicate, and an empty value in the reference), prints both reports, and confirms by eye that every section is correct. Run it with `node <file>.ts`, then delete it.

## Report

Write your report to `.hq/reports/004-report.md`, under 25 lines:

```
STATUS: done | partial | failed
CHANGED: <files>
CHECKS: <command> -> pass|fail (one line each)
ASSUMPTIONS: <anything you decided without being told>
NOT DONE: <anything from the brief left out, and why>
```
