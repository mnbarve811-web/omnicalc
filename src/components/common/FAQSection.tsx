import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface FAQItem {
  question: string
  answer: string
}

export function FAQSection({ items }: { items: FAQItem[] }) {
  return (
    <section className="mt-16 max-w-[38rem]">
      <h2 className="mb-4 text-2xl font-semibold tracking-[-0.02em]">Frequently Asked Questions</h2>
      <Accordion multiple>
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="py-4 text-base">{item.question}</AccordionTrigger>
            <AccordionContent className="text-base leading-7 text-foreground/85">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
