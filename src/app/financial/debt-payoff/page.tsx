import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { DebtPayoffCalculator } from './DebtPayoffCalculator'

export const metadata: Metadata = {
  title: 'Debt Payoff Calculator',
  description: 'Compare snowball vs avalanche debt payoff strategies and see how extra payments help.',
  alternates: { canonical: '/financial/debt-payoff' },
}

export default function DebtPayoffPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Debt Payoff Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Compare snowball vs avalanche strategies and see how extra payments accelerate your payoff.
        </p>
      </div>
      <CalculatorShell>
        <DebtPayoffCalculator />
      </CalculatorShell>
    </main>
  )
}
