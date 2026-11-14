import { useState } from 'react'
import { AuditMatrix } from './components/AuditMatrix'
import { FilesPanel } from './components/FilesPanel'
import { FilterBar, type StatusFilter } from './components/FilterBar'
import { SummaryStrip } from './components/SummaryStrip'
import { TopBar } from './components/TopBar'
import type { AuditResult } from './lib/types'
import { sampleAudit } from './sample/sampleAudit'

export default function App() {
  const audit: AuditResult = sampleAudit
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredRows = audit.rows.filter((row) => {
    if (statusFilter !== 'all' && row.status !== statusFilter) {
      return false
    }
    if (normalizedQuery && !row.key.toLowerCase().includes(normalizedQuery)) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-bg text-text">
      <TopBar />

      <main className="mx-auto max-w-[1440px] px-4 py-6">
        <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-[300px_minmax(0,1fr)] min-[900px]:items-start">
          <FilesPanel files={audit.files} />

          <section
            aria-labelledby="audit-heading"
            className="flex min-w-0 flex-col gap-4"
          >
            <h2 id="audit-heading" className="text-[15px] font-semibold text-text">
              Audit report
            </h2>

            <SummaryStrip
              totals={audit.totals}
              fileCount={audit.files.length}
            />

            <FilterBar
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            />

            <AuditMatrix
              rows={filteredRows}
              files={audit.files}
              referenceId={audit.referenceId}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
