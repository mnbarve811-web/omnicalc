import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
import { CompoundInterestCalculator } from './CompoundInterestCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Compound Interest Calculator',
  description: 'Calculate how your investment grows over time with compound interest and regular contributions.',
  alternates: { canonical: '/financial/compound-interest' },
}

export default function CompoundInterestPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Compound Interest Calculator</h1>
      <p className="text-muted-foreground mb-8">See how your savings grow when interest compounds on itself year after year.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <CompoundInterestCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
