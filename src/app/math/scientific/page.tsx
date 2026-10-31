import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
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
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Scientific Calculator</h1>
      <p className="text-muted-foreground mb-8">Evaluate expressions with trigonometry, logarithms, powers, roots, and factorials.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <ScientificCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
