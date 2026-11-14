STATUS: done
FILES READ: 22
FINDINGS: 10

1. [medium] src/App.tsx:61 — `handleAddFiles` builds the next file and reference state from the render-time `files`/`referenceId` snapshot instead of the latest state.
   Fails when: two file batches overlap (a large drop is still being read when another drop or paste completes) -> the later completion rebuilds from the old list, silently dropping the other batch's file(s), or re-adding a file the user just removed.
   Confidence: high
   Suggested fix: Move the merge into a functional state update (`setFiles(prev => ...)`) and derive the reference from that result, or serialize batch processing so only one add is in flight.

2. [medium] src/components/FilesPanel.tsx:144 — Drop handlers exist only on the sidebar drop card, so a file released anywhere else hits the browser's default drag-and-drop behavior.
   Fails when: the user misses the card slightly and drops an `.env` file over the matrix or page background -> the tab navigates to or downloads the local file and the entire in-memory file list and chosen reference are lost.
   Confidence: high
   Suggested fix: Add window-level `dragover`/`drop` handlers that call `preventDefault` (or make the whole page an additional drop target wired to `onAddFiles`).

3. [medium] src/components/FilesPanel.tsx:105 — Opening, cancelling or submitting the paste form unmounts the focused control without moving focus into the form or back to the trigger.
   Fails when: a keyboard user activates "Paste instead" -> the button disappears and focus falls to the document body, so the next Tab starts from the top of the page instead of the file-name field; Cancel and Add file have the same effect in reverse.
   Confidence: high
   Suggested fix: Focus the name input when the form mounts (ref/effect) and restore focus to the "Paste instead" button when the form closes.

4. [medium] src/components/SummaryStrip.tsx:131 — The menu opens with focus still on the trigger, and the Tab branch closes the menu while the focused menu item is inside it.
   Fails when: a keyboard user presses Enter on "Export report", Tabs into the first item, then Tabs again -> the menu unmounts, the focused element is removed, and focus lands on the body instead of the next control.
   Confidence: medium
   Suggested fix: Focus the first item on open and, on Tab, close the menu and explicitly focus the trigger (or the next focusable element after it).

5. [low] src/App.tsx:63 — Name-based replacement also applies inside a single incoming batch, so two same-named files silently collapse to the last one.
   Fails when: `apps/api/.env` and `apps/web/.env` are dragged in together (both arrive as name `.env`) -> only one file is added and no message says a file was discarded, so the audit silently covers one project.
   Confidence: medium
   Suggested fix: Detect duplicate names within one incoming batch and either keep both with a distinguishing suffix or show an error asking the user to add them separately.

6. [low] src/components/AuditMatrix.tsx:121 — Every row is rendered and every row's detail lines are computed on each render, with no cap, although files up to 1 MB are accepted.
   Fails when: a 1 MB file of short lines (about 260k `A=1` declarations) is added or pasted -> the table attempts hundreds of thousands of rows and cells and the tab freezes or runs out of memory.
   Confidence: high
   Suggested fix: Cap the number of parsed declarations or virtualize/paginate the matrix, and only format detail lines for expanded rows.

7. [low] src/components/FilesPanel.tsx:283 — Per-file critical/info counts are bare color-coded numbers; the zero state uses `text-muted/60` (about 2.9:1 on the surface) and the `title`/`aria-label` sits on a non-focusable span.
   Fails when: a low-vision user reads a file row, or a keyboard-only user wants the breakdown -> they see "0 / 3" with no visible labels and sub-4.5:1 zero text, cannot reach the hover tooltip, and the counts' names are not reliably exposed from a plain span.
   Confidence: medium
   Suggested fix: Render explicit text such as "3 critical, 2 info" (visible or sr-only) and use full-opacity muted text for the zero state.

8. [low] src/components/AuditMatrix.tsx:16 — Ok rows are described as "present with a value in all files", but a deliberately empty reference value leaves the row ok.
   Fails when: `.env.example` contains `SMTP_HOST=` while every other file has a value -> expanding the row says "present with a value in all files" while the reference cell shows the empty (not flagged) mark.
   Confidence: high
   Suggested fix: Say "declared in all files" or special-case the reference-empty state in the detail text.

9. [low] src/App.tsx:89 — `handleRemoveFile` (and `handleSelectReference` at line 100) recompute the audit but never refresh `runAt`, so `generatedAt` and the export filename stay stale.
   Fails when: files are added at 09:00, the reference is switched or a file removed at 10:00, then the report is exported -> the report and filename still carry 09:00 as the generation time.
   Confidence: high
   Suggested fix: Call `setRunAt(new Date())` in both handlers, or timestamp the audit where it is computed.

10. [low] src/components/AuditMatrix.tsx:70 — The zero-row state always says "No variables match this filter" even when no filter or search is active.
    Fails when: two empty or comment-only files are audited -> the matrix has zero rows and claims the filter matched nothing instead of saying the files contain no variables, sending the user looking for a hidden filter.
    Confidence: high
    Suggested fix: Pass whether a filter/search is active and show "No variables found in these files" when it is not.

NOT REVIEWED: None in scope — all 7 in-scope files were read in full. `src/lib/*`, `src/sample/*`, `src/main.tsx`, docs and config were read only for context and not reviewed per the brief.
