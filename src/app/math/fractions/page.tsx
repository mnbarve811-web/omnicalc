import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { FractionsCalculator } from './FractionsCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Fractions Calculator',
  description: 'Add, subtract, multiply, and divide fractions with fully simplified results and mixed numbers.',
  alternates: { canonical: '/math/fractions' },
  openGraph: { title: 'Fractions Calculator — OmniCalc', description: 'Free fractions calculator with simplified, decimal, and mixed-number results.', type: 'website' },
}

export default function FractionsPage() {
  return (
    <CalculatorPage
      href="/math/fractions"
      title="Fractions Calculator"
      description="Add, subtract, multiply, or divide any two fractions — results simplified automatically."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <FractionsCalculator />
    </CalculatorPage>
  )
}
