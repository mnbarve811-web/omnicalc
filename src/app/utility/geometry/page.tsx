import type { Metadata } from 'next'
import { CalculatorPage } from '@/components/common/CalculatorPage'
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
    <CalculatorPage
      href="/utility/geometry"
      title="Geometry Calculator"
      description="Calculate area, perimeter, volume, and surface area for common shapes."
      schemas={[webApplicationSchema, buildFaqSchema(faqItems)]}
      guideText={guideText}
      faqItems={faqItems}
    >
      <GeometryCalculator />
    </CalculatorPage>
  )
}
