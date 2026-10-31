import type { Metadata } from 'next'
import { CalculatorShell } from '@/components/common/CalculatorShell'
import { StructuredData } from '@/components/common/StructuredData'
import { GuideSection } from '@/components/common/GuideSection'
import { FAQSection } from '@/components/common/FAQSection'
import { GeometryCalculator } from './GeometryCalculator'
import { guideText, faqItems, webApplicationSchema, buildFaqSchema } from './content'

export const metadata: Metadata = {
  title: 'Geometry Calculator',
  description: 'Calculate area, perimeter, volume, and surface area for circles, rectangles, spheres, and more.',
  alternates: { canonical: '/utility/geometry' },
  openGraph: { title: 'Geometry Calculator — OmniCalc', description: 'Free calculator for area, perimeter, volume, and surface area of common shapes.', type: 'website' },
}

export default function GeometryPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Geometry Calculator</h1>
      <p className="text-muted-foreground mb-8">Calculate area, perimeter, volume, and surface area for common shapes.</p>
      <StructuredData schemas={[webApplicationSchema, buildFaqSchema(faqItems)]} />
      <CalculatorShell>
        <GeometryCalculator />
      </CalculatorShell>
      <GuideSection content={guideText} />
      <FAQSection items={faqItems} />
    </main>
  )
}
