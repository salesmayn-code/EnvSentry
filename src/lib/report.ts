import type { AuditResult, AuditRow, FileSummary, Finding } from './types.ts'

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|')
}

function formatLines(lines: number[]): string {
  return lines.length === 1 ? `line ${lines[0]}` : `lines ${lines.join(', ')}`
}

function groupFindings(findings: Finding[], severity: Finding['severity']): Map<string, Finding[]> {
  const grouped = new Map<string, Finding[]>()
  for (const finding of findings) {
    if (finding.severity !== severity) {
      continue
    }
    const existing = grouped.get(finding.fileId)
    if (existing) {
      existing.push(finding)
    } else {
      grouped.set(finding.fileId, [finding])
    }
  }
  return grouped
}

function matrixCell(row: AuditRow, file: FileSummary): string {
  const cell = row.cells[file.id] ?? { lines: [], empty: false }
  const count = cell.lines.length

  if (row.inReference) {
    if (count === 0) {
      return 'missing'
    }
    const suffix = count > 1 ? ` ×${count}` : ''
    if (cell.empty) {
      return `${file.isReference ? 'empty (not flagged)' : 'empty'}${suffix}`
    }
    return `ok${suffix}`
  }

  if (count === 0) {
    return '-'
  }
  return `extra${count > 1 ? ` ×${count}` : ''}`
}

export function toMarkdownReport(result: AuditResult): string {
  const namesById = new Map(result.files.map(file => [file.id, file.name]))
  const referenceName = namesById.get(result.referenceId) ?? '(unknown)'

  const lines: string[] = [
    '# EnvSentry audit report',
    '',
    `- Generated: ${result.generatedAt}`,
    `- Reference: ${referenceName}`,
    `- Files: ${result.files.length}`,
    `- Variables: ${result.totals.keys}`,
    '- Values are not included in this report.',
    '',
    '## Summary',
    '',
    '| File | Variables | Critical | Info |',
    '| --- | --- | --- | --- |',
  ]

  for (const file of result.files) {
    const name = `${escapeCell(file.name)}${file.isReference ? ' (reference)' : ''}`
    lines.push(`| ${name} | ${file.keyCount} | ${file.critical} | ${file.info} |`)
  }

  lines.push('', '## Critical findings', '')
  const criticalByFile = groupFindings(result.findings, 'critical')
  let hasCritical = false

  for (const file of result.files) {
    const findings = criticalByFile.get(file.id)
    if (!findings || findings.length === 0) {
      continue
    }
    hasCritical = true
    lines.push(`### ${file.name}`, '')
    for (const finding of findings) {
      if (finding.type === 'missing') {
        lines.push(`- \`${finding.key}\` is missing`)
      } else if (finding.type === 'empty') {
        lines.push(`- \`${finding.key}\` is empty (line ${finding.lines[0]})`)
      }
    }
    lines.push('')
  }

  if (!hasCritical) {
    lines.push('None.', '')
  }

  lines.push('## Informational findings', '')
  const infoByFile = groupFindings(result.findings, 'info')
  let hasInfo = false

  for (const file of result.files) {
    const findings = infoByFile.get(file.id)
    if (!findings || findings.length === 0) {
      continue
    }
    hasInfo = true
    lines.push(`### ${file.name}`, '')
    for (const finding of findings) {
      if (finding.type === 'extra') {
        lines.push(
          `- \`${finding.key}\` is not in the reference (${formatLines(finding.lines)})`,
        )
      } else if (finding.type === 'duplicate') {
        lines.push(
          `- \`${finding.key}\` is declared ${finding.lines.length} times (lines ${finding.lines.join(', ')})`,
        )
      }
    }
    lines.push('')
  }

  if (!hasInfo) {
    lines.push('None.', '')
  }

  lines.push(
    '## Matrix',
    '',
    `| Variable | ${result.files.map(file => escapeCell(file.name)).join(' | ')} |`,
    `| --- | ${result.files.map(() => '---').join(' | ')} |`,
  )

  for (const row of result.rows) {
    const cells = result.files.map(file => matrixCell(row, file))
    lines.push(`| \`${escapeCell(row.key)}\` | ${cells.join(' | ')} |`)
  }

  return `${lines.join('\n')}\n`
}

export function toJsonReport(result: AuditResult): string {
  const namesById = new Map(result.files.map(file => [file.id, file.name]))

  return JSON.stringify(
    {
      tool: 'EnvSentry',
      reportVersion: 1,
      generatedAt: result.generatedAt,
      reference: namesById.get(result.referenceId) ?? '(unknown)',
      valuesIncluded: false,
      totals: {
        files: result.files.length,
        variables: result.totals.keys,
        critical: result.totals.critical,
        info: result.totals.info,
        byType: {
          missing: result.totals.byType.missing,
          extra: result.totals.byType.extra,
          empty: result.totals.byType.empty,
          duplicate: result.totals.byType.duplicate,
        },
      },
      files: result.files.map(file => ({
        name: file.name,
        isReference: file.isReference,
        variables: file.keyCount,
        critical: file.critical,
        info: file.info,
        unreadableLines: file.invalidLines,
      })),
      findings: result.findings.map(finding => ({
        severity: finding.severity,
        type: finding.type,
        variable: finding.key,
        file: namesById.get(finding.fileId) ?? '(unknown)',
        lines: finding.lines,
      })),
    },
    null,
    2,
  )
}

export function reportFileName(result: AuditResult, ext: 'md' | 'json'): string {
  const date = new Date(result.generatedAt)
  const pad = (value: number, length = 2): string => String(value).padStart(length, '0')

  const year = pad(date.getUTCFullYear(), 4)
  const month = pad(date.getUTCMonth() + 1)
  const day = pad(date.getUTCDate())
  const hours = pad(date.getUTCHours())
  const minutes = pad(date.getUTCMinutes())

  return `envsentry-audit-${year}-${month}-${day}-${hours}${minutes}.${ext}`
}
