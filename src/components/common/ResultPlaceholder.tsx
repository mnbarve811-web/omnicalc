// Stands in for a result that depends on the visitor's clock until the page has hydrated
export function ResultPlaceholder() {
  return (
    <div role="status" className="rounded-lg border border-border bg-card p-5 md:p-6">
      <span className="sr-only">Loading result</span>
      <div aria-hidden className="space-y-3 motion-safe:animate-pulse">
        <div className="h-4 w-24 rounded-sm bg-muted" />
        <div className="h-12 w-56 rounded-sm bg-muted" />
        <div className="h-3 w-full rounded-full bg-muted" />
      </div>
    </div>
  )
}
