import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { TDEECalculator } from './TDEECalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'TDEE Calculator',
  description: 'Calculate your Total Daily Energy Expenditure and calorie targets for cutting, maintaining, or bulking.',
  alternates: { canonical: '/fitness/tdee' },
  openGraph: { title: 'TDEE Calculator — OmniCalc', description: 'Free TDEE calculator with calorie targets for cutting, maintaining, and bulking.', type: 'website' },
}

export default function TDEEPage() {
  return (
    <CalculatorPage
      href="/fitness/tdee"
      title="TDEE Calculator"
      description="Find your Total Daily Energy Expenditure and set calorie targets for your goal."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <TDEECalculator />
    </CalculatorPage>
  )
}
