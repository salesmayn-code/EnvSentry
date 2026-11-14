STATUS: done
CHANGED: src/lib/parse.ts, src/lib/audit.ts
CHECKS: npm run build -> pass
CHECKS: npm run lint -> pass
CHECKS: node --experimental-strip-types _check-002.ts -> pass (rows, findings, [ 6 ] 1 3 all matched expected comments; temp script deleted)
ASSUMPTIONS:
- Single-quoted/backtick values with no closing quote on the line take the rest of the line as the value; only double quotes continue across lines, per the brief.
- An extra (non-reference) key with an empty value yields both an empty/critical and an extra/info finding, since the empty rule is not limited to reference keys.
- Quoted values have no escape handling; the first matching quote closes the value.
- Only one leading `export ` prefix is stripped.
- Extra key rows are sorted with default JavaScript lexicographic order.
- File ids are assumed unique; findings are emitted per row in file input order, with empty before extra before duplicate within the same file.
NOT DONE: none
