import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
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
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">BMI Calculator</h1>
      <p className="text-muted-foreground mb-8">Calculate your Body Mass Index and healthy weight range.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <BMICalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
