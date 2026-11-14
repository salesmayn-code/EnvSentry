STATUS: done
CHANGED: src/App.tsx, src/components/FilesPanel.tsx, src/components/SummaryStrip.tsx, src/components/AuditMatrix.tsx
CHECKS:
npm run build -> pass
npm run lint -> pass
agent-browser --session hq-envsentry-006 (samples, focus, 375x812 screenshot, errors) -> pass
FIXES:
1: fixed
2: fixed
3: fixed
4: fixed
5: fixed
6: fixed
7: fixed
8: fixed
9: fixed
ASSUMPTIONS:
- Combined files, referenceId, and runAt into one AuditState object in App.tsx with functional updates.
- Moved drag-and-drop listeners exclusively to window so drop-zone and window do not double-count dragDepth.
- Used tabIndex={-1} on export menuitems and focused the trigger on Tab before closing so Tab/Shift+Tab leave the menu cleanly.
- Rendered the empty-reference note as a second detail list item under "No issues — declared in every file."
NOT DONE: none
