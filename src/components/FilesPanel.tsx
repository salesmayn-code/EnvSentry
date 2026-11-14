import type { FileSummary } from '../lib/types'

interface FilesPanelProps {
  files: FileSummary[]
}

export function FilesPanel({ files }: FilesPanelProps) {
  return (
    <aside aria-labelledby="files-heading" className="flex flex-col gap-4">
      <h2 id="files-heading" className="text-[15px] font-semibold text-text">
        Files
      </h2>

      <div className="flex flex-col items-center justify-center gap-3 rounded-[6px] border border-dashed border-border bg-surface px-4 py-6 text-center">
        <p className="text-[13px] text-muted">Drop .env files here</p>
        <button
          type="button"
          className="h-8 cursor-pointer rounded-[6px] border border-border bg-raised px-3 text-[13px] font-medium text-text transition-colors hover:border-muted/60"
        >
          Choose files
        </button>
      </div>

      <div className="-mt-1 flex justify-center">
        <button
          type="button"
          className="cursor-pointer text-[12px] text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
        >
          Paste instead
        </button>
      </div>

      <fieldset className="m-0 border-0 p-0">
        <legend className="sr-only">Loaded environment files</legend>
        <ul className="divide-y divide-border overflow-hidden rounded-[6px] border border-border bg-surface">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between gap-2 px-3 py-2.5"
            >
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="reference-file"
                  value={file.id}
                  checked={file.isReference}
                  onChange={() => {}}
                  aria-label={`Set ${file.name} as reference`}
                  className="size-3.5 shrink-0 cursor-pointer accent-[#2dd4a3]"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate font-mono text-[13px] text-text">
                      {file.name}
                    </span>
                    {file.isReference && (
                      <span className="shrink-0 rounded border border-accent/40 bg-accent/12 px-1.5 py-0.5 text-[11px] font-medium leading-none text-accent">
                        Reference
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2 text-[12px] text-muted">
                    <span className="tabular-nums">{file.keyCount} keys</span>
                    <span className="flex items-center gap-1.5 font-mono tabular-nums">
                      <span
                        className={file.critical > 0 ? 'text-critical' : 'text-muted/60'}
                        title={`${file.critical} critical`}
                        aria-label={`${file.critical} critical`}
                      >
                        {file.critical}
                      </span>
                      <span className="text-border" aria-hidden="true">
                        /
                      </span>
                      <span
                        className={file.info > 0 ? 'text-info' : 'text-muted/60'}
                        title={`${file.info} info`}
                        aria-label={`${file.info} info`}
                      >
                        {file.info}
                      </span>
                    </span>
                  </span>
                </span>
              </label>

              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                title={`Remove ${file.name}`}
                className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-muted transition-colors hover:bg-raised hover:text-text"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="size-3.5"
                  aria-hidden="true"
                >
                  <path
                    d="M4.5 4.5l7 7m0-7l-7 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </fieldset>
    </aside>
  )
}
