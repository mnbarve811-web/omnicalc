import { Suspense } from 'react'

function CalculatorSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="h-40 bg-muted rounded" />
      <div className="h-64 bg-muted rounded" />
    </div>
  )
}

export function CalculatorShell({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<CalculatorSkeleton />}>{children}</Suspense>
}
