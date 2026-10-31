import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
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
    <CalculatorPage
      href="/math/statistics"
      title="Statistics Calculator"
      description="Enter a list of numbers to get mean, median, mode, standard deviation, and more."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <StatisticsCalculator />
    </CalculatorPage>
  )
}
