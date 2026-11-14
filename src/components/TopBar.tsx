export function TopBar() {
  return (
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className="size-2 shrink-0 rounded-full bg-accent"
            aria-hidden="true"
          />
          <h1 className="font-mono text-[20px] font-semibold leading-tight tracking-tight text-text">
            EnvSentry
          </h1>
        </div>
        <p className="rounded-[6px] border border-border bg-surface px-2.5 py-1 text-[12px] text-muted">
          Runs locally — values never leave your browser
        </p>
      </div>
    </header>
  )
}
