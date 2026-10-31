import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
import { AutoLoanCalculator } from './AutoLoanCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Auto Loan Calculator',
  description: 'Calculate your monthly car payment, total interest, and full amortization schedule.',
  alternates: { canonical: '/financial/auto-loan' },
  openGraph: { title: 'Auto Loan Calculator — OmniCalc', description: 'Free auto loan calculator with taxes, trade-in, and full amortization schedule.', type: 'website' },
}

export default function AutoLoanPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Auto Loan Calculator</h1>
      <p className="text-muted-foreground mb-8">Calculate your monthly payment including taxes and trade-in value.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <AutoLoanCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
