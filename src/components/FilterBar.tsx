export type StatusFilter = 'all' | 'critical' | 'info' | 'ok'

interface FilterBarProps {
  statusFilter: StatusFilter
  onStatusFilterChange: (value: StatusFilter) => void
  searchQuery: string
  onSearchQueryChange: (value: string) => void
}

const FILTER_OPTIONS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'info', label: 'Info' },
  { value: 'ok', label: 'Consistent' },
]

export function FilterBar({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="group"
        aria-label="Filter variables by status"
        className="inline-flex w-full overflow-x-auto rounded-[6px] border border-border bg-surface p-0.5 sm:w-auto"
      >
        {FILTER_OPTIONS.map((option) => {
          const active = statusFilter === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onStatusFilterChange(option.value)}
              className={`h-7 flex-1 cursor-pointer whitespace-nowrap rounded-[4px] px-2.5 text-[13px] font-medium transition-colors sm:flex-initial ${
                active
                  ? 'bg-raised text-text'
                  : 'text-muted hover:text-text'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="relative w-full sm:w-64">
        <label htmlFor="filter-variables" className="sr-only">
          Filter variables
        </label>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted"
        >
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M10.5 10.5L13.5 13.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <input
          id="filter-variables"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Filter variables"
          className="h-8 w-full rounded-[6px] border border-border bg-surface pr-3 pl-8 text-[13px] text-text placeholder:text-muted"
        />
      </div>
    </div>
  )
}
