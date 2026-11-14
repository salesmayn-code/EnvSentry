import { Fragment, useState } from 'react'
import type { AuditRow, FileSummary, Finding } from '../lib/types'
import { CellMark } from './CellMark'

interface AuditMatrixProps {
  rows: AuditRow[]
  files: FileSummary[]
  referenceId: string
}

function formatRowFindings(
  findings: Finding[],
  fileNamesById: Record<string, string>,
): string[] {
  if (findings.length === 0) {
    return ['No issues — present with a value in all files.']
  }

  const lines: string[] = []
  const extraFiles: string[] = []

  for (const finding of findings) {
    const fileName = fileNamesById[finding.fileId] ?? finding.fileId

    if (finding.type === 'missing') {
      lines.push(`Missing in ${fileName}`)
    } else if (finding.type === 'empty') {
      lines.push(`Empty in ${fileName} (line ${finding.lines[0]})`)
    } else if (finding.type === 'duplicate') {
      const countText =
        finding.lines.length === 2 ? 'twice' : `${finding.lines.length} times`
      lines.push(
        `Declared ${countText} in ${fileName} (lines ${finding.lines.join(', ')})`,
      )
    } else if (finding.type === 'extra') {
      extraFiles.push(fileName)
    }
  }

  if (extraFiles.length > 0) {
    lines.push(`Not in reference — found in ${extraFiles.join(', ')}`)
  }

  return lines
}

function getRowBackground(status: AuditRow['status']): string | undefined {
  if (status === 'critical') {
    return 'rgba(240,82,82,0.08)'
  }
  if (status === 'info') {
    return 'rgba(245,165,36,0.07)'
  }
  return undefined
}

function getStickyBackground(status: AuditRow['status']): string {
  if (status === 'critical') {
    return 'linear-gradient(rgba(240,82,82,0.08), rgba(240,82,82,0.08)), var(--color-surface)'
  }
  if (status === 'info') {
    return 'linear-gradient(rgba(245,165,36,0.07), rgba(245,165,36,0.07)), var(--color-surface)'
  }
  return 'var(--color-surface)'
}

export function AuditMatrix({ rows, files, referenceId }: AuditMatrixProps) {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({})

  if (rows.length === 0) {
    return (
      <div className="rounded-[6px] border border-border bg-surface px-4 py-8 text-center text-[14px] text-muted">
        No variables match this filter.
      </div>
    )
  }

  const fileNamesById: Record<string, string> = {}
  for (const file of files) {
    fileNamesById[file.id] = file.name
  }

  function toggleRow(key: string) {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="overflow-x-auto rounded-[6px] border border-border bg-surface">
      <table className="w-full border-collapse text-left text-[13px]">
        <caption className="sr-only">
          Environment variable comparison matrix
        </caption>
        <thead>
          <tr className="border-b border-border bg-surface">
            <th
              scope="col"
              className="sticky left-0 z-20 min-w-[170px] border-r border-border bg-surface px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted"
            >
              Variable
            </th>
            {files.map((file) => (
              <th
                key={file.id}
                scope="col"
                className="min-w-[125px] px-3 py-2 text-center text-[11px] font-medium text-muted whitespace-nowrap"
              >
                <span className="font-mono">{file.name}</span>
                {file.isReference && (
                  <span className="ml-1.5 inline-block rounded border border-accent/40 bg-accent/12 px-1.5 py-0.5 text-[10px] font-medium leading-none text-accent">
                    Reference
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isExpanded = Boolean(expandedKeys[row.key])
            const detailId = `row-detail-${row.key}`
            const refLines = row.cells[referenceId]?.lines ?? []
            const lineHint =
              row.inReference && refLines.length > 0
                ? `L${refLines[0]}`
                : 'extra'
            const detailLines = formatRowFindings(row.findings, fileNamesById)

            return (
              <Fragment key={row.key}>
                <tr
                  onClick={() => toggleRow(row.key)}
                  style={{ backgroundColor: getRowBackground(row.status) }}
                  className="h-9 cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-raised/40"
                >
                  <th
                    scope="row"
                    style={{ background: getStickyBackground(row.status) }}
                    className="sticky left-0 z-10 border-r border-border px-3 py-0 font-normal"
                  >
                    <div className="flex h-9 items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-controls={detailId}
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${row.key}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleRow(row.key)
                          }}
                          className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-muted hover:text-text"
                        >
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                            className={`size-3 transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          >
                            <path
                              d="M6 3.5L10.5 8 6 12.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <span className="truncate font-mono text-[13px] font-medium text-text">
                          {row.key}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] text-muted tabular-nums">
                        {lineHint}
                      </span>
                    </div>
                  </th>
                  {files.map((file) => {
                    const cell = row.cells[file.id] ?? {
                      lines: [],
                      empty: false,
                    }
                    return (
                      <td
                        key={file.id}
                        className="h-9 px-3 py-0 text-center align-middle"
                      >
                        <CellMark
                          cell={cell}
                          inReference={row.inReference}
                          fileName={file.name}
                        />
                      </td>
                    )
                  })}
                </tr>
                {isExpanded && (
                  <tr
                    id={detailId}
                    className="border-b border-border bg-raised/60 last:border-b-0"
                  >
                    <td colSpan={1 + files.length} className="p-0">
                      <div className="sticky left-0 max-w-[calc(100vw-2.5rem)] px-4 py-2.5 sm:max-w-none">
                        <ul className="flex flex-col gap-1 text-[12px] text-text">
                          {detailLines.map((line) => (
                            <li key={line} className="flex items-start gap-2">
                              <span
                                className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                                  row.status === 'critical'
                                    ? 'bg-critical'
                                    : row.status === 'info'
                                      ? 'bg-info'
                                      : 'bg-present'
                                }`}
                                aria-hidden="true"
                              />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
