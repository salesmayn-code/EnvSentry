STATUS: done
CHANGED: tokens.html, vite.config.ts, src/tokens/main.tsx, src/tokens/TokensPage.tsx
CHECKS: npm run build -> pass (dist/tokens.html created)
CHECKS: npm run lint -> pass
CHECKS: agent-browser errors (http://localhost:5173/tokens.html) -> pass (0 errors)
CHECKS: agent-browser viewport 375x812 overflow & screenshots -> pass (.hq/logs/d01-desktop.png, .hq/logs/d01-phone.png)
ASSUMPTIONS: In src/components/SummaryStrip.tsx, the Export button uses the raised secondary style while Re-run audit uses the accent primary style; used Re-run audit's exact class string for Primary button and the raised style for Secondary button. Kept favicon and theme-color links in tokens.html head basics alongside charset, viewport, noindex, and title.
NOT DONE: none
