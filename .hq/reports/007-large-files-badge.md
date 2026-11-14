STATUS: done
CHANGED: src/App.tsx, src/components/AuditMatrix.tsx, src/components/CellMark.tsx
CHECKS:
npm run build -> pass
npm run lint -> pass
agent-browser --session hq-envsentry-007 (sample files, snapshot -i, errors, screenshot .hq/logs/007-sample.png) -> pass
agent-browser 40,000-row pagination, filter/search/re-run reset, 375px overflow check -> pass
ASSUMPTIONS:
- Reset visibleCount in AuditMatrix when the memoized filteredRows reference changes (covering statusFilter, normalized searchQuery, and auditResult changes; trailing whitespace changes that leave the trimmed query identical keep current page).
- Wrapped the duplicate badge in a block-level flex container (`flex items-center justify-center`) inside its table cell so vertical alignment ignores the cell's inline text baseline without changing badge colors or size.
NOT DONE: none
