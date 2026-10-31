import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { RetirementCalculator } from './RetirementCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Retirement Calculator',
  description: 'Plan your retirement savings and forecast your nest egg balance through retirement.',
  alternates: { canonical: '/financial/retirement' },
  openGraph: { title: 'Retirement Calculator — OmniCalc', description: 'Free retirement calculator to forecast your nest egg and see how long your savings will last.', type: 'website' },
}

export default function RetirementPage() {
  return (
    <CalculatorPage
      href="/financial/retirement"
      title="Retirement Calculator"
      description="Forecast your retirement nest egg and see how long your savings will last."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <RetirementCalculator />
    </CalculatorPage>
  )
}
