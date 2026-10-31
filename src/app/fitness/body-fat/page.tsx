import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
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
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Body Fat Calculator</h1>
      <p className="text-muted-foreground mb-8">Estimate body fat percentage using the US Navy tape method.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <BodyFatCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
