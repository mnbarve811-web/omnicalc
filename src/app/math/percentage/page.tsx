import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { PercentageCalculator } from './PercentageCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Percentage Calculator',
  description: 'Find what percent X is of Y, calculate percentage change, or find X% of any number.',
  alternates: { canonical: '/math/percentage' },
  openGraph: { title: 'Percentage Calculator — OmniCalc', description: 'Free percentage calculator for percentages, proportions, and percentage change.', type: 'website' },
}

export default function PercentagePage() {
  return (
    <CalculatorPage
      href="/math/percentage"
      title="Percentage Calculator"
      description="Three modes: find a percentage, find what percent X is of Y, or calculate percentage change."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <PercentageCalculator />
    </CalculatorPage>
  )
}
