// Shared contract between the parser/audit logic and the UI.
// Values from .env files are never stored here: only whether a value exists.

/** A file the user provided, as raw text. Lives only in browser memory. */
export interface EnvFile {
  id: string
  name: string
  text: string
}

/** One `KEY=value` line. The value itself is deliberately discarded. */
export interface Declaration {
  key: string
  /** 1-based line number where the declaration starts. */
  line: number
  /** False when the value is missing, empty, or only whitespace. */
  hasValue: boolean
}

export interface ParsedEnv {
  declarations: Declaration[]
  /** 1-based line numbers that are neither blank, a comment, nor a valid declaration. */
  invalidLines: number[]
}

export type IssueType = 'missing' | 'extra' | 'empty' | 'duplicate'

/**
 * missing, empty -> critical (will break or misconfigure a deploy)
 * extra, duplicate -> info (worth a look, rarely breaks anything)
 */
export type Severity = 'critical' | 'info'

export interface Finding {
  type: IssueType
  severity: Severity
  key: string
  fileId: string
  /** Lines involved: empty -> the declaration line, duplicate -> every line, missing -> []. */
  lines: number[]
}

/** State of one key in one file. */
export interface Cell {
  /** Every line the key is declared on. Empty array when the key is not in the file. */
  lines: number[]
  /** True when the last declaration has no value. False when not declared. */
  empty: boolean
}

export interface AuditRow {
  key: string
  /** True when the key is declared in the reference file. */
  inReference: boolean
  /** Keyed by file id. Every file has an entry. */
  cells: Record<string, Cell>
  findings: Finding[]
  /** Worst severity among findings, or 'ok' when there are none. */
  status: Severity | 'ok'
}

export interface FileSummary {
  id: string
  name: string
  isReference: boolean
  /** Number of distinct keys declared. */
  keyCount: number
  critical: number
  info: number
  invalidLines: number[]
}

export interface AuditResult {
  referenceId: string
  files: FileSummary[]
  /** Reference keys first in reference file order, then extra keys sorted A–Z. */
  rows: AuditRow[]
  findings: Finding[]
  totals: {
    keys: number
    critical: number
    info: number
    /** Count of findings by type. */
    byType: Record<IssueType, number>
  }
  /** ISO timestamp. */
  generatedAt: string
}
