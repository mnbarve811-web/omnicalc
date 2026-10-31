import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { AutoLoanCalculator } from './AutoLoanCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Auto Loan Calculator',
  description: 'Calculate your monthly car payment, total interest, and full amortization schedule.',
  alternates: { canonical: '/financial/auto-loan' },
  openGraph: { title: 'Auto Loan Calculator — OmniCalc', description: 'Free auto loan calculator with taxes, trade-in, and full amortization schedule.', type: 'website' },
}

export default function AutoLoanPage() {
  return (
    <CalculatorPage
      href="/financial/auto-loan"
      title="Auto Loan Calculator"
      description="Calculate your monthly payment including taxes and trade-in value."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <AutoLoanCalculator />
    </CalculatorPage>
  )
}
