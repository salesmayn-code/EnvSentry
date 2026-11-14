import type { AuditResult } from '../lib/types'

interface SummaryStripProps {
  totals: AuditResult['totals']
  fileCount: number
}

export function SummaryStrip({ totals, fileCount }: SummaryStripProps) {
  return (
    <section
      aria-label="Audit summary"
      className="flex flex-col gap-3 rounded-[6px] border border-border bg-surface p-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <dl className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-6">
        <div className="flex flex-col">
          <dt className="text-[12px] text-muted">Critical</dt>
          <dd className="font-mono text-[20px] font-semibold leading-tight tabular-nums text-critical">
            {totals.critical}
          </dd>
        </div>
        <div className="flex flex-col sm:border-l sm:border-border sm:pl-6">
          <dt className="text-[12px] text-muted">Info</dt>
          <dd className="font-mono text-[20px] font-semibold leading-tight tabular-nums text-info">
            {totals.info}
          </dd>
        </div>
        <div className="flex flex-col sm:border-l sm:border-border sm:pl-6">
          <dt className="text-[12px] text-muted">Variables</dt>
          <dd className="font-mono text-[20px] font-semibold leading-tight tabular-nums text-text">
            {totals.keys}
          </dd>
        </div>
        <div className="flex flex-col sm:border-l sm:border-border sm:pl-6">
          <dt className="text-[12px] text-muted">Files</dt>
          <dd className="font-mono text-[20px] font-semibold leading-tight tabular-nums text-text">
            {fileCount}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="h-8 cursor-pointer rounded-[6px] border border-accent bg-accent/12 px-3 text-[13px] font-medium text-accent transition-colors hover:bg-accent/20"
        >
          Re-run audit
        </button>
        <button
          type="button"
          className="h-8 cursor-pointer rounded-[6px] border border-border bg-raised px-3 text-[13px] font-medium text-text transition-colors hover:border-muted/60"
        >
          Export report
        </button>
      </div>
    </section>
  )
}
