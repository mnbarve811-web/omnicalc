import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
import { TDEECalculator } from './TDEECalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'TDEE Calculator',
  description: 'Calculate your Total Daily Energy Expenditure and calorie targets for cutting, maintaining, or bulking.',
  alternates: { canonical: '/fitness/tdee' },
  openGraph: { title: 'TDEE Calculator — OmniCalc', description: 'Free TDEE calculator with calorie targets for cutting, maintaining, and bulking.', type: 'website' },
}

export default function TDEEPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">TDEE Calculator</h1>
      <p className="text-muted-foreground mb-8">Find your Total Daily Energy Expenditure and set calorie targets for your goal.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <TDEECalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
