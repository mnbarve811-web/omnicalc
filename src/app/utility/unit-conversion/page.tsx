import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
import { UnitConversionCalculator } from './UnitConversionCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Unit Converter',
  description: 'Convert between length, weight, volume, temperature, speed, area, and pressure units.',
  alternates: { canonical: '/utility/unit-conversion' },
  openGraph: { title: 'Unit Converter — OmniCalc', description: 'Free unit converter for length, weight, volume, temperature, speed, area, and pressure.', type: 'website' },
}

export default function UnitConversionPage() {
  return (
    <CalculatorPage
      href="/utility/unit-conversion"
      title="Unit Converter"
      description="Convert between common units across 7 categories."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <UnitConversionCalculator />
    </CalculatorPage>
  )
}
