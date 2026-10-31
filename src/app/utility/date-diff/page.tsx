import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
import { DateDiffCalculator } from './DateDiffCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Date Calculator',
  description: 'Find the exact difference between two dates in years, months, and days.',
  alternates: { canonical: '/utility/date-diff' },
  openGraph: { title: 'Date Calculator — OmniCalc', description: 'Free calculator for the difference between two dates in years, months, days, and total days.', type: 'website' },
}

export default function DateDiffPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Date Calculator</h1>
      <p className="text-muted-foreground mb-8">Find the exact difference between two dates.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <DateDiffCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
