import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
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
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Pregnancy Due Date Calculator</h1>
      <p className="text-muted-foreground mb-8">Enter your last menstrual period to calculate your due date and track your pregnancy.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <PregnancyCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
