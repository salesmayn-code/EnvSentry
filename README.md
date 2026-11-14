# EnvSentry

Compare `.env` files across environments before you deploy. EnvSentry checks every file against a reference (usually `.env.example`) and reports:

- **Critical:** variables missing from an environment, and variables declared with an empty value.
- **Info:** variables that are not in the reference, and variables declared more than once in a file.

Empty values in the reference file are not flagged, since example files are often blank on purpose.

## Privacy

Everything runs in your browser. Files are read into memory, never uploaded, never stored, and values are never shown. Exported reports (Markdown or JSON) contain variable names and line numbers only.

## Run locally

```bash
npm install
npm run dev
```

Build for production with `npm run build`; the static site is written to `dist/` and can be served by any static host.

## Stack

Vite, React, TypeScript, Tailwind CSS. The parser and audit logic in `src/lib/` have no UI dependencies.
