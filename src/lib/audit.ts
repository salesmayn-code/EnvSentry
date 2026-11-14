import type {
  AuditResult,
  AuditRow,
  Cell,
  Declaration,
  EnvFile,
  FileSummary,
  Finding,
  IssueType,
  ParsedEnv,
} from './types.ts'
import { parseEnv } from './parse.ts'

interface FileAnalysis {
  file: EnvFile
  parsed: ParsedEnv
  declarations: Map<string, Declaration[]>
}

function analyze(file: EnvFile): FileAnalysis {
  const parsed = parseEnv(file.text)
  const declarations = new Map<string, Declaration[]>()

  for (const declaration of parsed.declarations) {
    const existing = declarations.get(declaration.key)
    if (existing) {
      existing.push(declaration)
    } else {
      declarations.set(declaration.key, [declaration])
    }
  }

  return { file, parsed, declarations }
}

export function audit(files: EnvFile[], referenceId: string, now: Date = new Date()): AuditResult {
  const referenceIndex = files.findIndex(file => file.id === referenceId)
  if (referenceIndex === -1) {
    throw new Error(`Reference file not found: ${referenceId}`)
  }

  const analyses = files.map(analyze)

  const referenceKeys: string[] = []
  const referenceKeySet = new Set<string>()
  for (const declaration of analyses[referenceIndex].parsed.declarations) {
    if (!referenceKeySet.has(declaration.key)) {
      referenceKeySet.add(declaration.key)
      referenceKeys.push(declaration.key)
    }
  }

  const extraKeys: string[] = []
  const knownKeys = new Set(referenceKeySet)
  for (const analysis of analyses) {
    for (const key of analysis.declarations.keys()) {
      if (!knownKeys.has(key)) {
        knownKeys.add(key)
        extraKeys.push(key)
      }
    }
  }
  extraKeys.sort()

  const rows: AuditRow[] = []
  const findings: Finding[] = []
  const criticalByFile = new Array<number>(files.length).fill(0)
  const infoByFile = new Array<number>(files.length).fill(0)
  const byType: Record<IssueType, number> = { missing: 0, extra: 0, empty: 0, duplicate: 0 }
  let criticalTotal = 0
  let infoTotal = 0

  const record = (finding: Finding, fileIndex: number, rowFindings: Finding[]): void => {
    rowFindings.push(finding)
    findings.push(finding)
    byType[finding.type] += 1
    if (finding.severity === 'critical') {
      criticalByFile[fileIndex] += 1
      criticalTotal += 1
    } else {
      infoByFile[fileIndex] += 1
      infoTotal += 1
    }
  }

  for (const key of referenceKeys.concat(extraKeys)) {
    const inReference = referenceKeySet.has(key)
    const cells: Record<string, Cell> = {}
    const rowFindings: Finding[] = []

    for (let fileIndex = 0; fileIndex < analyses.length; fileIndex += 1) {
      const analysis = analyses[fileIndex]
      const declared = analysis.declarations.get(key) ?? []
      const lines = declared.map(declaration => declaration.line)
      const last = declared.at(-1)
      cells[analysis.file.id] = { lines, empty: last !== undefined && !last.hasValue }

      if (fileIndex === referenceIndex) {
        if (declared.length > 1) {
          record(
            { type: 'duplicate', severity: 'info', key, fileId: analysis.file.id, lines },
            fileIndex,
            rowFindings,
          )
        }
        continue
      }

      if (declared.length === 0) {
        if (inReference) {
          record(
            { type: 'missing', severity: 'critical', key, fileId: analysis.file.id, lines: [] },
            fileIndex,
            rowFindings,
          )
        }
        continue
      }

      if (last !== undefined && !last.hasValue) {
        record(
          { type: 'empty', severity: 'critical', key, fileId: analysis.file.id, lines: [last.line] },
          fileIndex,
          rowFindings,
        )
      }
      if (!inReference) {
        record(
          { type: 'extra', severity: 'info', key, fileId: analysis.file.id, lines },
          fileIndex,
          rowFindings,
        )
      }
      if (declared.length > 1) {
        record(
          { type: 'duplicate', severity: 'info', key, fileId: analysis.file.id, lines },
          fileIndex,
          rowFindings,
        )
      }
    }

    const status = rowFindings.some(finding => finding.severity === 'critical')
      ? 'critical'
      : rowFindings.length > 0
        ? 'info'
        : 'ok'

    rows.push({ key, inReference, cells, findings: rowFindings, status })
  }

  const summaries: FileSummary[] = analyses.map((analysis, fileIndex) => ({
    id: analysis.file.id,
    name: analysis.file.name,
    isReference: fileIndex === referenceIndex,
    keyCount: analysis.declarations.size,
    critical: criticalByFile[fileIndex],
    info: infoByFile[fileIndex],
    invalidLines: analysis.parsed.invalidLines,
  }))

  return {
    referenceId,
    files: summaries,
    rows,
    findings,
    totals: {
      keys: rows.length,
      critical: criticalTotal,
      info: infoTotal,
      byType,
    },
    generatedAt: now.toISOString(),
  }
}
