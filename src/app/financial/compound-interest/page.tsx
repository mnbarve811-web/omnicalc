import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { CompoundInterestCalculator } from './CompoundInterestCalculator'

export const metadata: Metadata = {
  title: 'Compound Interest Calculator',
  description: 'Calculate investment growth with compound interest and regular monthly contributions.',
  alternates: { canonical: '/financial/compound-interest' },
}

export default function CompoundInterestPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Compound Interest Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Project your investment growth with regular contributions over time.
        </p>
      </div>
      <CalculatorShell>
        <CompoundInterestCalculator />
      </CalculatorShell>
    </main>
  )
}
