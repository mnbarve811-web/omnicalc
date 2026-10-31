import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { QuadraticCalculator } from './QuadraticCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Quadratic Equation Solver',
  description: 'Solve ax² + bx + c = 0 instantly. Find the real roots and discriminant of any quadratic equation.',
  alternates: { canonical: '/math/quadratic' },
  openGraph: { title: 'Quadratic Equation Solver — OmniCalc', description: 'Free quadratic equation solver with roots, discriminant, and number line.', type: 'website' },
}

export default function QuadraticPage() {
  return (
    <CalculatorPage
      href="/math/quadratic"
      title="Quadratic Equation Solver"
      description="Solve ax² + bx + c = 0 and find real roots instantly."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <QuadraticCalculator />
    </CalculatorPage>
  )
}
