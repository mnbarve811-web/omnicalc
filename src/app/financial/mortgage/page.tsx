import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { MortgageCalculator } from './MortgageCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Mortgage Calculator',
  description: 'Calculate your monthly mortgage payment with taxes, insurance, and HOA. See the full amortization schedule.',
  alternates: { canonical: '/financial/mortgage' },
  openGraph: { title: 'Mortgage Calculator — OmniCalc', description: 'Free mortgage calculator with full amortization schedule.', type: 'website' },
}

export default function MortgagePage() {
  return (
    <CalculatorPage
      href="/financial/mortgage"
      title="Mortgage Calculator"
      description="Estimate your monthly payment and see how every dollar is applied over the life of your loan."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <MortgageCalculator />
    </CalculatorPage>
  )
}
