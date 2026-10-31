import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { DateDiffCalculator } from './DateDiffCalculator'

export const metadata: Metadata = {
  title: 'Date Calculator',
  description: 'Find the exact difference between two dates in years, months, and days.',
  alternates: { canonical: '/utility/date-diff' },
}

export default function DateDiffPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Date Calculator</h1>
      <p className="text-muted-foreground mb-8">Find the exact difference between two dates.</p>
      <CalculatorShell>
        <DateDiffCalculator />
      </CalculatorShell>
    </main>
  )
}
