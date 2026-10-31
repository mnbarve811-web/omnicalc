import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { RetirementCalculator } from './RetirementCalculator'

export const metadata: Metadata = {
  title: 'Retirement Calculator',
  description: 'Plan your retirement savings and forecast your nest egg balance through retirement.',
  alternates: { canonical: '/financial/retirement' },
}

export default function RetirementPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Retirement Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Forecast your retirement nest egg and see how long your savings will last.
        </p>
      </div>
      <CalculatorShell>
        <RetirementCalculator />
      </CalculatorShell>
    </main>
  )
}
