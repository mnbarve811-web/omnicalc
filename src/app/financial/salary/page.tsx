import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
import { SalaryCalculator } from './SalaryCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Salary / Paycheck Calculator',
  description: 'Break down your paycheck with federal tax, state tax, Social Security, and Medicare deductions.',
  alternates: { canonical: '/financial/salary' },
  openGraph: { title: 'Salary / Paycheck Calculator — OmniCalc', description: 'Free paycheck calculator showing exactly how federal, state, and FICA taxes reduce your take-home pay.', type: 'website' },
}

export default function SalaryPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Salary / Paycheck Calculator</h1>
      <p className="text-muted-foreground mb-8">See exactly how your paycheck breaks down after federal, state, and FICA taxes.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <SalaryCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
