import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
import { MortgageCalculator } from './MortgageCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Mortgage Calculator',
  description: 'Calculate your monthly mortgage payment with taxes, insurance, and HOA. See the full amortization schedule.',
  alternates: { canonical: '/financial/mortgage' },
  openGraph: { title: 'Mortgage Calculator — OmniCalc', description: 'Free mortgage calculator with full amortization schedule.', type: 'website' },
}

export default function MortgagePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Mortgage Calculator</h1>
      <p className="text-muted-foreground mb-8">Estimate your monthly payment and see how every dollar is applied over the life of your loan.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <MortgageCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
