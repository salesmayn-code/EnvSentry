# Task 002: parser and audit logic

## Your role: Backend Worker

You build logic for one task at a time, from a written brief.

- Read the brief fully before touching files. Do only what it asks.
- Inspect the project first. Reuse what is there.
- Never invent an API. Prefer the smallest correct code.
- Do not add any npm dependency.
- Stay inside the files listed below. Never run `git push`, never deploy, never switch branches.
- Do not ask questions; nobody can answer. If something is unclear, take the most conservative option and note it in your report.

---

## Project

- Stack: Vite 8, React 19, TypeScript (strict). Package manager: npm. Dependencies are installed.
- Build: `npm run build`  Lint: `npm run lint`
- Branch: you are on `task/002-parse-audit`. Do not switch branches.

## Product

EnvSentry compares several `.env` files against one reference file and reports missing, extra, empty and duplicate variable names. It runs only in the browser. **Privacy rule: values must never be stored, returned or logged.** The parser reads a value only to decide whether it is empty, then discards it.

## Outcome

Two pure TypeScript modules with no React, no DOM and no Node APIs, implementing the contract in `src/lib/types.ts`. Read that file first. Do not change it.

## Do

### 1. `src/lib/parse.ts`

Export `parseEnv(text: string): ParsedEnv`.

- Strip a leading UTF-8 BOM. Accept `\n` and `\r\n` line endings. Line numbers are 1-based.
- Skip blank lines and lines whose first non-space character is `#`.
- Optional leading `export ` before the key.
- Key: `[A-Za-z_][A-Za-z0-9_.-]*`, then optional spaces, then `=`. Anything else is recorded in `invalidLines`.
- Value is everything after the first `=`:
  - Unquoted: trim; an inline comment starts at ` #` (space then hash) and is removed.
  - Quoted with `"`, `'` or `` ` ``: the value is between the matching quotes; text after the closing quote is ignored.
  - A double-quoted value without a closing quote on its line continues over following lines until a line containing the closing `"`. Those lines are consumed (not parsed as declarations). If no closing quote ever appears, treat the declaration as running to end of file.
- `hasValue` is false when the resulting value is empty or only whitespace. `KEY=""` and `KEY=` are empty. `KEY` with no `=` is invalid.
- Return declarations in file order, including repeats.

### 2. `src/lib/audit.ts`

Export `audit(files: EnvFile[], referenceId: string, now: Date = new Date()): AuditResult`.

- Parse each file with `parseEnv`. Throw an `Error` if `referenceId` is not among the files.
- Cell per (key, file): `lines` = every line the key is declared on in that file; `empty` = true when the last declaration has no value.
- Findings:
  - **missing / critical:** a key declared in the reference but not in another file. `lines: []`.
  - **empty / critical:** a key whose cell is `empty` in a non-reference file. `lines` = the last declaration's line. Empty values in the reference file are never flagged.
  - **extra / info:** a key declared in a file but not in the reference. One finding per file that declares it. `lines` = every line it is declared on in that file.
  - **duplicate / info:** a key declared more than once in the same file, in any file including the reference. `lines` = all its lines.
- Rows: reference keys in the order they first appear in the reference, then all other keys sorted A–Z. Every row has a cell for every file. `row.status` is `critical` if any finding is critical, else `info` if any finding, else `ok`.
- `files`: one `FileSummary` per input file, in input order, with `keyCount` = distinct keys declared, `critical` and `info` = counts of findings for that file, and the file's `invalidLines`.
- `findings`: all findings, ordered by row order, then by file input order.
- `totals.keys` = number of rows; `critical`, `info` and `byType` count findings.
- `generatedAt` = `now.toISOString()`.

## Files

- Create: `src/lib/parse.ts`, `src/lib/audit.ts`
- Do not touch anything else. Do not add test files.
- Inside `src/lib`, write relative imports with the `.ts` extension (`./parse.ts`, `./types.ts`) so the modules also run directly under Node. The tsconfig allows this. Use `import type` for types.

## Check

All must pass before you report `done`:

- `npm run build`
- `npm run lint`
- Run this and confirm the output matches the comments (write the script to a temp file outside `src/`, run it, then delete it):

```ts
// run with: node --experimental-strip-types <file>.ts  (import paths must end in .ts)
import { audit } from './src/lib/audit.ts'
const r = audit([
  { id: 'ref', name: '.env.example', text: 'A=1\nB=\nC=3\n' },
  { id: 'prod', name: '.env.production', text: '﻿export A=1\r\nC=""\r\nC=x # note\r\nD=\'q\'\r\n# comment\r\nbad line\r\nM="line1\nline2"\n' },
], 'ref', new Date(0))
console.log(r.rows.map(x => `${x.key}:${x.status}`).join(' '))
// A:ok B:critical C:info D:info M:info
console.log(r.findings.map(f => `${f.type}:${f.key}:${f.fileId}:${f.lines.join(',')}`).join(' '))
// missing:B:prod: duplicate:C:prod:2,3 extra:D:prod:4 extra:M:prod:7
console.log(r.files[1].invalidLines, r.totals.critical, r.totals.info)
// [ 6 ] 1 3
```

## Report

Write your report to `.hq/reports/002-parse-audit.md`, under 25 lines:

```
STATUS: done | partial | failed
CHANGED: <files>
CHECKS: <command> -> pass|fail (one line each)
ASSUMPTIONS: <anything you decided without being told>
NOT DONE: <anything from the brief left out, and why>
```
