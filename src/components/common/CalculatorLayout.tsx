import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function CalculatorGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,22.5rem)_minmax(0,1fr)] lg:gap-8">{children}</div>
}

export function InputPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    // Capped to the viewport so a long form stays fully reachable while sticky
    <Card className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
      <CardHeader>
        <h2 data-slot="card-title" className="text-base font-semibold tracking-[-0.01em]">
          {title}
        </h2>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  )
}

export function ResultPanel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={id} className="min-w-0 scroll-mt-20 space-y-4">
      {children}
    </div>
  )
}
