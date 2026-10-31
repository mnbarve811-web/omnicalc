import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
import { RetirementCalculator } from './RetirementCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Retirement Calculator',
  description: 'Plan your retirement savings and forecast your nest egg balance through retirement.',
  alternates: { canonical: '/financial/retirement' },
  openGraph: { title: 'Retirement Calculator — OmniCalc', description: 'Free retirement calculator to forecast your nest egg and see how long your savings will last.', type: 'website' },
}

export default function RetirementPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Retirement Calculator</h1>
      <p className="text-muted-foreground mb-8">Forecast your retirement nest egg and see how long your savings will last.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <RetirementCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
