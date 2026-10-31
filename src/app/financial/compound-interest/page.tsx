import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { CompoundInterestCalculator } from './CompoundInterestCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Compound Interest Calculator',
  description: 'Calculate how your investment grows over time with compound interest and regular contributions.',
  alternates: { canonical: '/financial/compound-interest' },
}

export default function CompoundInterestPage() {
  return (
    <CalculatorPage
      href="/financial/compound-interest"
      title="Compound Interest Calculator"
      description="See how your savings grow when interest compounds on itself year after year."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <CompoundInterestCalculator />
    </CalculatorPage>
  )
}
