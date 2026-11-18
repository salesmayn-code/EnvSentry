import { useState } from 'react'
import { CellMark } from '../components/CellMark'
import type { Cell } from '../lib/types'

interface ColorToken {
  name: string
  token: string
  hex: string
}

const COLOR_TOKENS: ReadonlyArray<ColorToken> = [
  { name: 'bg', token: '--color-bg', hex: '#0b0d10' },
  { name: 'surface', token: '--color-surface', hex: '#12151a' },
  { name: 'raised', token: '--color-raised', hex: '#181c22' },
  { name: 'border', token: '--color-border', hex: '#252a33' },
  { name: 'text', token: '--color-text', hex: '#e6e8eb' },
  { name: 'muted', token: '--color-muted', hex: '#8b93a1' },
  { name: 'accent', token: '--color-accent', hex: '#2dd4a3' },
  { name: 'critical', token: '--color-critical', hex: '#f05252' },
  { name: 'info', token: '--color-info', hex: '#f5a524' },
  { name: 'present', token: '--color-present', hex: '#3fb950' },
]

const BG_HEX = COLOR_TOKENS[0].hex

function hexToLinearRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const channels = [0, 2, 4].map((offset) => {
    const srgb = Number.parseInt(clean.slice(offset, offset + 2), 16) / 255
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  })
  return [channels[0], channels[1], channels[2]]
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToLinearRgb(hex)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatioAgainstBg(hex: string): number {
  const l1 = relativeLuminance(hex)
  const l2 = relativeLuminance(BG_HEX)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

type WcagRating = 'AA' | 'AA large' | 'fail'

function wcagRating(ratio: number): WcagRating {
  if (ratio >= 4.5) {
    return 'AA'
  }
  if (ratio >= 3) {
    return 'AA large'
  }
  return 'fail'
}

function ratingClass(rating: WcagRating): string {
  if (rating === 'AA') {
    return 'border-present/40 bg-present/12 text-present'
  }
  if (rating === 'AA large') {
    return 'border-info/40 bg-info/12 text-info'
  }
  return 'border-border bg-raised text-muted'
}

const SPACING_STEPS = [4, 8, 12, 16, 24, 32, 48] as const

interface StatusExample {
  name: string
  note: string
  cell: Cell
  inReference: boolean
  isReferenceFile: boolean
  fileName: string
}

const STATUS_EXAMPLES: ReadonlyArray<StatusExample> = [
  {
    name: 'Present',
    note: 'Declared with a non-empty value',
    cell: { lines: [3], empty: false },
    inReference: true,
    isReferenceFile: false,
    fileName: '.env.production',
  },
  {
    name: 'Missing',
    note: 'In reference, absent from target file',
    cell: { lines: [], empty: false },
    inReference: true,
    isReferenceFile: false,
    fileName: '.env.production',
  },
  {
    name: 'Empty',
    note: 'Declared in target file without a value',
    cell: { lines: [7], empty: true },
    inReference: true,
    isReferenceFile: false,
    fileName: '.env.production',
  },
  {
    name: 'Empty in reference',
    note: 'Empty in the reference file (not flagged)',
    cell: { lines: [7], empty: true },
    inReference: true,
    isReferenceFile: true,
    fileName: '.env.example',
  },
  {
    name: 'Extra',
    note: 'Declared in target file, absent from reference',
    cell: { lines: [12], empty: false },
    inReference: false,
    isReferenceFile: false,
    fileName: '.env.local',
  },
  {
    name: 'Duplicate',
    note: 'Declared multiple times in the same file',
    cell: { lines: [4, 18], empty: false },
    inReference: true,
    isReferenceFile: false,
    fileName: '.env.local',
  },
  {
    name: 'Not declared',
    note: 'Extra key not present in this file',
    cell: { lines: [], empty: false },
    inReference: false,
    isReferenceFile: false,
    fileName: '.env.staging',
  },
]

export function TokensPage() {
  const [sampleInput, setSampleInput] = useState('.env.production')

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 p-4 sm:p-6">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="size-2 shrink-0 rounded-full bg-accent"
              aria-hidden="true"
            />
            <h1 className="text-[20px] font-semibold leading-tight tracking-tight text-text">
              EnvSentry design tokens
            </h1>
          </div>
          <a
            href="./"
            className="inline-flex h-8 items-center rounded-[6px] border border-border bg-raised px-3 text-[13px] font-medium text-text transition-colors hover:border-muted/60"
          >
            Back to app
          </a>
        </header>

        <main className="flex flex-col gap-10">
          <section aria-labelledby="heading-colors" className="flex flex-col gap-4">
            <h2 id="heading-colors" className="text-[15px] font-semibold text-text">
              Colors
            </h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {COLOR_TOKENS.map((item) => {
                const ratio = contrastRatioAgainstBg(item.hex)
                const rating = wcagRating(ratio)
                return (
                  <li
                    key={item.token}
                    className="flex flex-col overflow-hidden rounded-[6px] border border-border bg-surface"
                  >
                    <div
                      className="h-14 w-full border-b border-border"
                      style={{ backgroundColor: item.hex }}
                      aria-hidden="true"
                    />
                    <div className="flex flex-col gap-1.5 p-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-mono text-[13px] font-medium text-text">
                          {item.name}
                        </span>
                        <span className="font-mono text-[12px] text-muted">
                          {item.hex}
                        </span>
                      </div>
                      <span className="truncate font-mono text-[11px] text-muted">
                        {item.token}
                      </span>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="font-mono text-[12px] text-text tabular-nums">
                          {ratio.toFixed(1)}:1
                        </span>
                        <span
                          className={`rounded border px-1.5 py-0.5 font-mono text-[11px] font-medium leading-none ${ratingClass(rating)}`}
                        >
                          {rating}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-labelledby="heading-type" className="flex flex-col gap-4">
            <h2 id="heading-type" className="text-[15px] font-semibold text-text">
              Type
            </h2>
            <div className="divide-y divide-border rounded-[6px] border border-border bg-surface">
              <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="shrink-0 font-mono text-[12px] text-muted">
                  Page title — 20px / 600
                </span>
                <p className="min-w-0 break-words text-[20px] font-semibold leading-tight tracking-tight text-text">
                  EnvSentry
                </p>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="shrink-0 font-mono text-[12px] text-muted">
                  Section title — 15px / 600
                </span>
                <p className="min-w-0 break-words text-[15px] font-semibold text-text">
                  Audit report
                </p>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="shrink-0 font-mono text-[12px] text-muted">
                  Body — 14px / 400
                </span>
                <p className="min-w-0 break-words text-[14px] text-text">
                  EnvSentry compares variable names against a reference file.
                </p>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="shrink-0 font-mono text-[12px] text-muted">
                  Table — 13px / 400
                </span>
                <p className="min-w-0 break-words text-[13px] text-text">
                  Declared in every environment file
                </p>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="shrink-0 font-mono text-[12px] text-muted">
                  Small — 12px / 400
                </span>
                <p className="min-w-0 break-words text-[12px] text-muted">
                  Reports include variable names and line numbers only, never values.
                </p>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="shrink-0 font-mono text-[12px] text-muted">
                  Table header — 11px / 500 uppercase muted
                </span>
                <p className="min-w-0 break-words text-[11px] font-medium uppercase tracking-wider text-muted">
                  Variable
                </p>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="shrink-0 font-mono text-[12px] text-muted">
                  Monospace — 13px / 500 &amp; 11px / 400
                </span>
                <p className="flex min-w-0 flex-wrap items-baseline gap-2">
                  <code className="font-mono text-[13px] font-medium text-text">
                    DATABASE_URL
                  </code>
                  <span className="font-mono text-[11px] text-muted tabular-nums">
                    line 42
                  </span>
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="heading-spacing" className="flex flex-col gap-4">
            <h2 id="heading-spacing" className="text-[15px] font-semibold text-text">
              Spacing
            </h2>
            <ul className="flex flex-col gap-2.5 rounded-[6px] border border-border bg-surface p-4">
              {SPACING_STEPS.map((px) => (
                <li key={px} className="flex items-center gap-3">
                  <span className="w-12 shrink-0 font-mono text-[12px] text-muted tabular-nums">
                    {px}px
                  </span>
                  <span
                    className="h-3 shrink-0 rounded-[2px] border border-accent bg-accent/30"
                    style={{ width: `${px}px` }}
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="heading-components" className="flex flex-col gap-4">
            <h2 id="heading-components" className="text-[15px] font-semibold text-text">
              Components
            </h2>
            <div className="flex flex-col gap-5 rounded-[6px] border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="h-8 cursor-pointer rounded-[6px] border border-accent bg-accent/12 px-3 text-[13px] font-medium text-accent transition-colors enabled:hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Primary button
                </button>
                <button
                  type="button"
                  disabled
                  className="h-8 cursor-pointer rounded-[6px] border border-accent bg-accent/12 px-3 text-[13px] font-medium text-accent transition-colors enabled:hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Primary disabled
                </button>
                <button
                  type="button"
                  className="h-8 cursor-pointer rounded-[6px] border border-border bg-raised px-3 text-[13px] font-medium text-text transition-colors hover:border-muted/60"
                >
                  Secondary button
                </button>
                <span className="shrink-0 rounded border border-accent/40 bg-accent/12 px-1.5 py-0.5 text-[11px] font-medium leading-none text-accent">
                  Reference
                </span>
              </div>

              <div className="flex flex-col gap-1.5 sm:max-w-xs">
                <label
                  htmlFor="token-sample-input"
                  className="text-[12px] font-medium text-muted"
                >
                  Text input
                </label>
                <input
                  id="token-sample-input"
                  type="text"
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                  placeholder=".env.example"
                  className="h-8 w-full min-w-0 rounded-[6px] border border-border bg-bg px-2.5 font-mono text-[13px] text-text placeholder:text-muted"
                />
              </div>

              <p className="border-t border-border/70 pt-3 text-[12px] text-muted">
                Tip: press Tab to move through the interactive controls above and inspect the visible focus rings.
              </p>
            </div>
          </section>

          <section aria-labelledby="heading-status" className="flex flex-col gap-4">
            <h2 id="heading-status" className="text-[15px] font-semibold text-text">
              Status marks
            </h2>
            <ul className="divide-y divide-border rounded-[6px] border border-border bg-surface">
              {STATUS_EXAMPLES.map((example) => (
                <li
                  key={example.name}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span className="inline-flex h-6 w-10 shrink-0 items-center justify-center rounded-[4px] border border-border bg-bg">
                    <CellMark
                      cell={example.cell}
                      inReference={example.inReference}
                      isReferenceFile={example.isReferenceFile}
                      fileName={example.fileName}
                    />
                  </span>
                  <div className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-2">
                    <span className="text-[13px] font-medium text-text">
                      {example.name}
                    </span>
                    <span className="text-[12px] text-muted">
                      {example.note}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  )
}
