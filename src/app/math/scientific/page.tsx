import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { ScientificCalculator } from './ScientificCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Scientific Calculator',
  description: 'Free online scientific calculator with sin, cos, tan, logarithms, powers, roots, and factorials. Works in degrees or radians.',
  alternates: { canonical: '/math/scientific' },
  openGraph: { title: 'Scientific Calculator — OmniCalc', description: 'Free scientific calculator with trigonometry, logs, powers, and factorials.', type: 'website' },
}

export default function ScientificPage() {
  return (
    <CalculatorPage
      href="/math/scientific"
      title="Scientific Calculator"
      description="Evaluate expressions with trigonometry, logarithms, powers, roots, and factorials."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <ScientificCalculator />
    </CalculatorPage>
  )
}
