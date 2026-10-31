import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { AutoLoanCalculator } from './AutoLoanCalculator'

export const metadata: Metadata = {
  title: 'Auto Loan Calculator',
  description: 'Calculate your monthly car payment, total interest, and full amortization schedule.',
  alternates: { canonical: '/financial/auto-loan' },
}

export default function AutoLoanPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Auto Loan Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate your monthly payment including taxes and trade-in value.
        </p>
      </div>
      <CalculatorShell>
        <AutoLoanCalculator />
      </CalculatorShell>
    </main>
  )
}
