import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { reportFileName, toJsonReport, toMarkdownReport } from '../lib/report'
import type { AuditResult } from '../lib/types'

interface SummaryStripProps {
  auditResult: AuditResult | null
  totals: AuditResult['totals']
  fileCount: number
  canRerun: boolean
  onRerun: () => void
}

type ExportFormat = 'md' | 'json'

function downloadReport(result: AuditResult, format: ExportFormat) {
  const content =
    format === 'md' ? toMarkdownReport(result) : toJsonReport(result)
  const mimeType =
    format === 'md'
      ? 'text/markdown;charset=utf-8'
      : 'application/json;charset=utf-8'
  const fileName = reportFileName(result, format)
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function SummaryStrip({
  auditResult,
  totals,
  fileCount,
  canRerun,
  onRerun,
}: SummaryStripProps) {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const menuContainerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const menuOpen = isExportOpen && auditResult !== null

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    itemRefs.current[0]?.focus()

    function handlePointerDown(event: PointerEvent) {
      if (
        menuContainerRef.current &&
        event.target instanceof Node &&
        !menuContainerRef.current.contains(event.target)
      ) {
        setIsExportOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsExportOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  function handleExportChoice(format: ExportFormat) {
    if (!auditResult) {
      return
    }
    downloadReport(auditResult, format)
    setIsExportOpen(false)
    triggerRef.current?.focus()
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' && auditResult) {
      event.preventDefault()
      setIsExportOpen(true)
    }
  }

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const items = itemRefs.current.filter(
      (item): item is HTMLButtonElement => item !== null,
    )
    if (items.length === 0) {
      return
    }

    const currentIndex = items.indexOf(
      document.activeElement as HTMLButtonElement,
    )

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length
      items[nextIndex].focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prevIndex =
        currentIndex <= 0 ? items.length - 1 : currentIndex - 1
      items[prevIndex].focus()
    } else if (event.key === 'Home') {
      event.preventDefault()
      items[0].focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      items[items.length - 1].focus()
    } else if (event.key === 'Tab') {
      triggerRef.current?.focus()
      setIsExportOpen(false)
    }
  }

  return (
    <section
      aria-label="Audit summary"
      className="flex flex-col gap-2.5 rounded-[6px] border border-border bg-surface p-3"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            onClick={onRerun}
            disabled={!canRerun}
            title="Re-run with the current files. Drop an updated file with the same name to replace it."
            className="h-8 cursor-pointer rounded-[6px] border border-accent bg-accent/12 px-3 text-[13px] font-medium text-accent transition-colors enabled:hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Re-run audit
          </button>

          <div ref={menuContainerRef} className="relative">
            <button
              ref={triggerRef}
              type="button"
              disabled={!auditResult}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setIsExportOpen((open) => !open)}
              onKeyDown={handleTriggerKeyDown}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[6px] border border-border bg-raised px-3 text-[13px] font-medium text-text transition-colors enabled:hover:border-muted/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Export report</span>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className={`size-3.5 text-muted transition-transform ${
                  menuOpen ? 'rotate-180' : ''
                }`}
              >
                <path
                  d="M4.25 6.25L8 10l3.75-3.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {menuOpen && (
              <div
                role="menu"
                aria-label="Export report format"
                onKeyDown={handleMenuKeyDown}
                className="absolute top-full left-0 z-20 mt-1.5 min-w-[164px] rounded-[6px] border border-border bg-raised p-1 shadow-lg sm:right-0 sm:left-auto"
              >
                <button
                  ref={(el) => {
                    itemRefs.current[0] = el
                  }}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => handleExportChoice('md')}
                  className="flex w-full cursor-pointer items-center rounded-[4px] px-2.5 py-1.5 text-left text-[13px] text-text transition-colors hover:bg-surface focus-visible:bg-surface"
                >
                  Markdown (.md)
                </button>
                <button
                  ref={(el) => {
                    itemRefs.current[1] = el
                  }}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => handleExportChoice('json')}
                  className="flex w-full cursor-pointer items-center rounded-[4px] px-2.5 py-1.5 text-left text-[13px] text-text transition-colors hover:bg-surface focus-visible:bg-surface"
                >
                  JSON (.json)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="border-t border-border/70 pt-2 text-[12px] text-muted">
        Reports include variable names and line numbers only, never values.
      </p>
    </section>
  )
}
