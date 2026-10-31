import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
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
    <CalculatorPage
      href="/fitness/macro"
      title="Macro Calculator"
      description="Set your TDEE and goal to get daily macronutrient targets."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <MacroCalculator />
    </CalculatorPage>
  )
}
