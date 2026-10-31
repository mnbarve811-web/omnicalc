import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { BodyFatCalculator } from './BodyFatCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Body Fat Calculator',
  description: 'Estimate your body fat percentage using the accurate US Navy tape measurement method.',
  alternates: { canonical: '/fitness/body-fat' },
  openGraph: { title: 'Body Fat Calculator — OmniCalc', description: 'Free body fat percentage calculator using the US Navy method.', type: 'website' },
}

export default function BodyFatPage() {
  return (
    <CalculatorPage
      href="/fitness/body-fat"
      title="Body Fat Calculator"
      description="Estimate body fat percentage using the US Navy tape method."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <BodyFatCalculator />
    </CalculatorPage>
  )
}
