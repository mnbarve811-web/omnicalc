import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
import { StatisticsCalculator } from './StatisticsCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Statistics Calculator',
  description: 'Calculate mean, median, mode, standard deviation, variance, and more from any dataset.',
  alternates: { canonical: '/math/statistics' },
  openGraph: { title: 'Statistics Calculator — OmniCalc', description: 'Free statistics calculator with frequency distribution chart.', type: 'website' },
}

export default function StatisticsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Statistics Calculator</h1>
      <p className="text-muted-foreground mb-8">Enter a list of numbers to get mean, median, mode, standard deviation, and more.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <StatisticsCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
