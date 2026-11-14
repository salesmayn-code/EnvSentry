import { useMemo, useState } from 'react'
import { AuditMatrix } from './components/AuditMatrix'
import { FilesPanel, type IncomingEnvFile } from './components/FilesPanel'
import { FilterBar, type StatusFilter } from './components/FilterBar'
import { SummaryStrip } from './components/SummaryStrip'
import { TopBar } from './components/TopBar'
import { audit } from './lib/audit'
import { parseEnv } from './lib/parse'
import type { AuditResult, EnvFile, FileSummary } from './lib/types'
import { sampleFiles } from './sample/sampleFiles'

function pickReferenceId(files: EnvFile[]): string | null {
  if (files.length === 0) {
    return null
  }
  const example = files.find((file) => file.name === '.env.example')
  return example ? example.id : files[0].id
}

export default function App() {
  const [files, setFiles] = useState<EnvFile[]>([])
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [runAt, setRunAt] = useState<Date>(() => new Date())
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const hasValidReference =
    referenceId !== null && files.some((file) => file.id === referenceId)

  const auditResult = useMemo<AuditResult | null>(() => {
    if (files.length < 2 || !hasValidReference || referenceId === null) {
      return null
    }
    return audit(files, referenceId, runAt)
  }, [files, hasValidReference, referenceId, runAt])

  const fileSummaries = useMemo<FileSummary[]>(() => {
    if (auditResult) {
      return auditResult.files
    }
    return files.map((file) => {
      const parsed = parseEnv(file.text)
      const distinctKeys = new Set(parsed.declarations.map((d) => d.key))
      return {
        id: file.id,
        name: file.name,
        isReference: file.id === referenceId,
        keyCount: distinctKeys.size,
        critical: 0,
        info: 0,
        invalidLines: parsed.invalidLines,
      }
    })
  }, [auditResult, files, referenceId])

  function handleAddFiles(incoming: IncomingEnvFile[]) {
    if (incoming.length === 0) {
      return
    }

    const nextFiles = files.map((file) => ({ ...file }))
    for (const item of incoming) {
      const existingIndex = nextFiles.findIndex((file) => file.name === item.name)
      if (existingIndex !== -1) {
        nextFiles[existingIndex] = {
          ...nextFiles[existingIndex],
          text: item.text,
        }
      } else {
        nextFiles.push({
          id: crypto.randomUUID(),
          name: item.name,
          text: item.text,
        })
      }
    }

    const refStillValid =
      referenceId !== null && nextFiles.some((file) => file.id === referenceId)
    const nextReferenceId = refStillValid
      ? referenceId
      : pickReferenceId(nextFiles)

    setFiles(nextFiles)
    setReferenceId(nextReferenceId)
    setRunAt(new Date())
  }

  function handleRemoveFile(id: string) {
    const nextFiles = files.filter((file) => file.id !== id)
    const nextReferenceId =
      referenceId === id || !nextFiles.some((file) => file.id === referenceId)
        ? pickReferenceId(nextFiles)
        : referenceId

    setFiles(nextFiles)
    setReferenceId(nextReferenceId)
  }

  function handleSelectReference(id: string) {
    if (files.some((file) => file.id === id)) {
      setReferenceId(id)
    }
  }

  function handleRerun() {
    if (files.length >= 2 && hasValidReference) {
      setRunAt(new Date())
    }
  }

  function handleLoadSampleFiles() {
    handleAddFiles(sampleFiles)
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredRows = auditResult
    ? auditResult.rows.filter((row) => {
        if (statusFilter !== 'all' && row.status !== statusFilter) {
          return false
        }
        if (normalizedQuery && !row.key.toLowerCase().includes(normalizedQuery)) {
          return false
        }
        return true
      })
    : []

  return (
    <div className="min-h-screen bg-bg text-text">
      <TopBar />

      <main className="mx-auto max-w-[1440px] px-4 py-6">
        <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-[300px_minmax(0,1fr)] min-[900px]:items-start">
          <FilesPanel
            files={fileSummaries}
            onAddFiles={handleAddFiles}
            onSelectReference={handleSelectReference}
            onRemoveFile={handleRemoveFile}
          />

          <section
            aria-labelledby="audit-heading"
            className="flex min-w-0 flex-col gap-4"
          >
            <h2 id="audit-heading" className="text-[15px] font-semibold text-text">
              Audit report
            </h2>

            {auditResult ? (
              <>
                <SummaryStrip
                  totals={auditResult.totals}
                  fileCount={auditResult.files.length}
                  canRerun={files.length >= 2 && hasValidReference}
                  onRerun={handleRerun}
                />

                <FilterBar
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                />

                <AuditMatrix
                  rows={filteredRows}
                  files={auditResult.files}
                  referenceId={auditResult.referenceId}
                />
              </>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-[6px] border border-border bg-surface px-4 py-8 text-center">
                <p className="max-w-md text-[14px] text-muted">
                  Add two or more .env files. EnvSentry compares variable names against a reference file and never shows or stores values.
                </p>
                <button
                  type="button"
                  onClick={handleLoadSampleFiles}
                  className="h-8 cursor-pointer rounded-[6px] border border-border bg-raised px-3 text-[13px] font-medium text-text transition-colors hover:border-muted/60"
                >
                  Try sample files
                </button>
              </div>
            ) : (
              <div className="rounded-[6px] border border-border bg-surface px-4 py-8 text-center text-[14px] text-muted">
                Add at least one more file to compare.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
