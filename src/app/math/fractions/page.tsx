import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
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
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Fractions Calculator</h1>
      <p className="text-muted-foreground mb-8">Add, subtract, multiply, or divide any two fractions — results simplified automatically.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <FractionsCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
