import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
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
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Quadratic Equation Solver</h1>
      <p className="text-muted-foreground mb-8">Solve ax² + bx + c = 0 and find real roots instantly.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <QuadraticCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
