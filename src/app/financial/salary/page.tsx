import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { SalaryCalculator } from './SalaryCalculator'

export const metadata: Metadata = {
  title: 'Salary / Paycheck Calculator',
  description: 'Break down your paycheck with federal tax, state tax, Social Security, and Medicare deductions.',
  alternates: { canonical: '/financial/salary' },
}

export default function SalaryPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Salary / Paycheck Calculator</h1>
        <p className="text-muted-foreground mt-2">
          See exactly how your paycheck breaks down after federal, state, and FICA taxes.
        </p>
      </div>
      <CalculatorShell>
        <SalaryCalculator />
      </CalculatorShell>
    </main>
  )
}
