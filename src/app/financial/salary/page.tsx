import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
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
    <CalculatorPage
      href="/financial/salary"
      title="Salary / Paycheck Calculator"
      description="See exactly how your paycheck breaks down after federal, state, and FICA taxes."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <SalaryCalculator />
    </CalculatorPage>
  )
}
