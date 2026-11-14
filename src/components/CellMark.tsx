import type { Cell } from '../lib/types'

interface CellMarkProps {
  cell: Cell
  inReference: boolean
  fileName: string
}

export function CellMark({ cell, inReference, fileName }: CellMarkProps) {
  if (cell.lines.length === 0) {
    if (inReference) {
      return (
        <span
          className="inline-flex items-center justify-center text-critical"
          aria-label={`Missing in ${fileName}`}
          title={`Missing in ${fileName}`}
        >
          <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
            <path
              d="M4.5 4.5l7 7m0-7l-7 7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )
    }

    return (
      <span
        className="inline-flex items-center justify-center font-mono text-[13px] text-muted"
        aria-label={`Not declared in ${fileName}`}
      >
        —
      </span>
    )
  }

  if (!inReference) {
    return (
      <span
        className="inline-flex items-center justify-center text-info"
        aria-label={`Extra variable in ${fileName} (line ${cell.lines.join(', ')})`}
        title={`Extra in ${fileName} (line ${cell.lines.join(', ')})`}
      >
        <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
          <path
            d="M8 3.5v9M3.5 8h9"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </span>
    )
  }

  if (cell.lines.length > 1) {
    return (
      <span
        className="inline-flex items-center justify-center rounded bg-info/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold leading-none text-info tabular-nums"
        aria-label={`Declared ${cell.lines.length} times in ${fileName} (lines ${cell.lines.join(', ')})`}
        title={`Declared ${cell.lines.length} times (lines ${cell.lines.join(', ')})`}
      >
        ×{cell.lines.length}
      </span>
    )
  }

  if (cell.empty) {
    return (
      <span
        className="inline-flex items-center justify-center text-info"
        title="Empty value"
        aria-label={`Empty value in ${fileName} (line ${cell.lines[0]})`}
      >
        <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden="true">
          <circle cx="8" cy="8" r="4.75" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center justify-center text-present"
      aria-label={`Present in ${fileName} (line ${cell.lines[0]})`}
      title={`Line ${cell.lines[0]}`}
    >
      <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
        <path
          d="M3.5 8.5l3 3 6-6.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
