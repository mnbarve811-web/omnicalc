import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { MortgageCalculator } from './MortgageCalculator'

export const metadata: Metadata = {
  title: 'Mortgage Calculator',
  description: 'Calculate your monthly mortgage payment, total interest, and see your full amortization schedule.',
  alternates: { canonical: '/financial/mortgage' },
}

export default function MortgagePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mortgage Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Estimate your monthly payment and explore your full amortization schedule.
        </p>
      </div>
      <CalculatorShell>
        <MortgageCalculator />
      </CalculatorShell>
    </main>
  )
}
