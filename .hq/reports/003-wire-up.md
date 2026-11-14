STATUS: done
CHANGED: src/App.tsx, src/components/AuditMatrix.tsx, src/components/CellMark.tsx, src/components/FilesPanel.tsx, src/components/SummaryStrip.tsx, src/sample/sampleFiles.ts (added), src/sample/sampleAudit.ts (deleted)
CHECKS:
npm run build -> pass
npm run lint -> pass
node sampleFiles audit verification -> pass (critical 3, info 4, keys 10)
ASSUMPTIONS:
- Used 1048576 bytes (1024 * 1024) as the 1 MB file-size limit for dropped, chosen, and pasted files.
- Computed single-file FileSummary metadata (distinct keyCount and invalidLines) via parseEnv in App.tsx so 1-file state displays accurately in FilesPanel without running audit() on fewer than 2 files.
- Preserved the active reference when additional files are added unless no valid reference was set or the current reference was removed.
NOT DONE: none
