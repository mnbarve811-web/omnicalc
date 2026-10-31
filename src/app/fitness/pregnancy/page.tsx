import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { PregnancyCalculator } from './PregnancyCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Pregnancy Due Date Calculator',
  description: 'Calculate your due date, current week, and trimester from your last menstrual period.',
  alternates: { canonical: '/fitness/pregnancy' },
  openGraph: { title: 'Pregnancy Due Date Calculator — OmniCalc', description: 'Free due date calculator with current week and trimester progress.', type: 'website' },
}

export default function PregnancyPage() {
  return (
    <CalculatorPage
      href="/fitness/pregnancy"
      title="Pregnancy Due Date Calculator"
      description="Enter your last menstrual period to calculate your due date and track your pregnancy."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <PregnancyCalculator />
    </CalculatorPage>
  )
}
