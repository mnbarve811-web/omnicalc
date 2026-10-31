import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
import { DebtPayoffCalculator } from './DebtPayoffCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Debt Payoff Calculator',
  description: 'Compare snowball vs avalanche debt payoff strategies and see how extra payments help.',
  alternates: { canonical: '/financial/debt-payoff' },
  openGraph: { title: 'Debt Payoff Calculator — OmniCalc', description: 'Free debt payoff calculator comparing snowball vs avalanche strategies with full payoff schedules.', type: 'website' },
}

export default function DebtPayoffPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Debt Payoff Calculator</h1>
      <p className="text-muted-foreground mb-8">Compare snowball vs avalanche strategies and see how extra payments accelerate your payoff.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <DebtPayoffCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
