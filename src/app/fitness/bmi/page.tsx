import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { BMICalculator } from './BMICalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'BMI Calculator',
  description: 'Find your Body Mass Index and see which weight category you fall into.',
  alternates: { canonical: '/fitness/bmi' },
  openGraph: { title: 'BMI Calculator — OmniCalc', description: 'Free BMI calculator with weight category and BMI scale.', type: 'website' },
}

export default function BMIPage() {
  return (
    <CalculatorPage
      href="/fitness/bmi"
      title="BMI Calculator"
      description="Calculate your Body Mass Index and healthy weight range."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <BMICalculator />
    </CalculatorPage>
  )
}
