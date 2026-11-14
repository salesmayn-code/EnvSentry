STATUS: done
CHANGED: src/components/SummaryStrip.tsx, src/App.tsx, index.html, public/favicon.svg, public/robots.txt
CHECKS:
npm run build -> pass
npm run lint -> pass
ASSUMPTIONS: Used a keyboard-accessible dropdown menu below the Export report button (aligned left on narrow screens and right on sm+); revoked object URL on next tick via setTimeout(..., 0) after anchor click; placed the privacy note at the bottom of SummaryStrip separated by a subtle top border; combined shield outline and check mark in public/favicon.svg; duplicated existing title and description into og:title and og:description.
NOT DONE: None
