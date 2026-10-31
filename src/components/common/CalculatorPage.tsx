import { Breadcrumbs } from './Breadcrumbs'
import { StructuredData } from './StructuredData'
import { CalculatorShell } from './CalculatorShell'
import { GuideSection } from './GuideSection'
import { FAQSection, type FAQItem } from './FAQSection'
import { RelatedCalculators } from './RelatedCalculators'
import { AdSlot } from './AdSlot'

interface CalculatorPageProps {
  href: string
  title: string
  description: string
  schemas: Record<string, unknown>[]
  guideText: string
  faqItems: FAQItem[]
  children: React.ReactNode
}

export function CalculatorPage({ href, title, description, schemas, guideText, faqItems, children }: CalculatorPageProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 md:px-6 md:pt-8">
      <Breadcrumbs href={href} title={title} />
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance md:text-[2.5rem] md:leading-[1.1]">{title}</h1>
      <p className="mt-2 max-w-[65ch] text-base text-muted-foreground md:text-lg">{description}</p>
      <StructuredData schemas={schemas} />
      <div className="mt-8">
        <CalculatorShell>{children}</CalculatorShell>
      </div>
      <AdSlot placement="after-results" />
      <GuideSection content={guideText} />
      <AdSlot placement="in-content" />
      <FAQSection items={faqItems} />
      <RelatedCalculators href={href} />
    </main>
  )
}
