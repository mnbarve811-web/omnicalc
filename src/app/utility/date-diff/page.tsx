import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
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
    <CalculatorPage
      href="/utility/date-diff"
      title="Date Calculator"
      description="Find the exact difference between two dates."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <DateDiffCalculator />
    </CalculatorPage>
  )
}
