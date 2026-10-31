import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
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
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Percentage Calculator</h1>
      <p className="text-muted-foreground mb-8">Three modes: find a percentage, find what percent X is of Y, or calculate percentage change.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <PercentageCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
