import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { DebtPayoffCalculator } from './DebtPayoffCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Debt Payoff Calculator',
  description: 'Compare snowball vs avalanche debt payoff strategies and see how extra payments help.',
  alternates: { canonical: '/financial/debt-payoff' },
  openGraph: { title: 'Debt Payoff Calculator — OmniCalc', description: 'Free debt payoff calculator comparing snowball vs avalanche strategies with full payoff schedules.', type: 'website' },
}

export default function DebtPayoffPage() {
  return (
    <CalculatorPage
      href="/financial/debt-payoff"
      title="Debt Payoff Calculator"
      description="Compare snowball vs avalanche strategies and see how extra payments accelerate your payoff."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <DebtPayoffCalculator />
    </CalculatorPage>
  )
}
