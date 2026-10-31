import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Financial Calculators',
  description: 'Free financial calculators for mortgage, loans, investments, and retirement planning.',
  alternates: { canonical: '/financial' },
}

const CALCULATORS = [
  { title: 'Mortgage Calculator', description: 'Estimate monthly payments and see your full amortization schedule.', href: '/financial/mortgage' },
  { title: 'Compound Interest Calculator', description: 'Project investment growth with regular contributions over time.', href: '/financial/compound-interest' },
  { title: 'Retirement Calculator', description: 'Plan your retirement savings and forecast your nest egg.', href: '/financial/retirement' },
  { title: 'Auto Loan Calculator', description: 'Calculate car loan payments including taxes and trade-in value.', href: '/financial/auto-loan' },
  { title: 'Salary / Paycheck Calculator', description: 'Break down your paycheck with federal, state, and FICA taxes.', href: '/financial/salary' },
  { title: 'Debt Payoff Calculator', description: 'Compare snowball vs avalanche strategies to become debt-free faster.', href: '/financial/debt-payoff' },
] as const

export default function FinancialPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Financial Calculators</h1>
        <p className="text-lg text-muted-foreground">
          Free, accurate tools for mortgage planning, investment projections, and debt management.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {CALCULATORS.map((calc) => (
          <Link key={calc.href} href={calc.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{calc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{calc.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
