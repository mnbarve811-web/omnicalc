import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
import { MacroCalculator } from './MacroCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Macro Calculator',
  description: 'Get your daily protein, carb, and fat targets based on your TDEE and goal.',
  alternates: { canonical: '/fitness/macro' },
  openGraph: { title: 'Macro Calculator — OmniCalc', description: 'Free macro calculator for daily protein, carb, and fat targets.', type: 'website' },
}

export default function MacroPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Macro Calculator</h1>
      <p className="text-muted-foreground mb-8">Set your TDEE and goal to get daily macronutrient targets.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <MacroCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
