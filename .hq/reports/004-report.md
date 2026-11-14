STATUS: done
CHANGED: src/lib/report.ts
CHECKS: npm run build -> pass
CHECKS: npm run lint -> pass
CHECKS: node check-report-004.ts -> pass (temporary script printed both reports, then deleted)
ASSUMPTIONS: List labels "Generated:" and "Reference:" are used since the brief did not prescribe exact wording. In the matrix, non-reference keys show "extra" even when empty (matching CellMark behavior); the ×N suffix is appended after the base label, including "empty (not flagged) ×N". A missing file-name mapping falls back to "(unknown)" instead of exposing internal ids.
NOT DONE: None.
