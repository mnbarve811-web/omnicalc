import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A mortgage is a loan used to purchase a home, repaid in monthly installments over 10–30 years. Each payment covers two components: principal (reducing your loan balance) and interest (the lender's fee for borrowing). In the early years of a 30-year mortgage, most of each payment is interest—this gradually shifts as your balance shrinks.

How to use this calculator: enter the home price and your planned down payment. The interest rate field reflects the annual rate your lender quotes for a fixed-rate mortgage. Add monthly property tax, homeowner's insurance, and any HOA dues to see your true all-in housing cost.

The amortization schedule below shows exactly how each payment is divided between principal and interest across the life of the loan. Use it to understand how much you'll owe at any point, or to see the impact of a larger down payment.`

export const faqItems: FAQItem[] = [
  {
    question: 'How much house can I afford?',
    answer: 'A common guideline is to keep total housing costs (principal, interest, taxes, and insurance) below 28% of your gross monthly income. For a $80,000/year salary, that is roughly $1,867/month in housing costs.',
  },
  {
    question: 'What is the difference between a 15-year and 30-year mortgage?',
    answer: 'A 15-year mortgage has higher monthly payments but costs significantly less in total interest. On a $240,000 loan at 6.5%, a 30-year mortgage costs about $305,000 in interest vs $135,000 for a 15-year—a $170,000 difference.',
  },
  {
    question: 'What is PMI and when do I need it?',
    answer: 'Private Mortgage Insurance is required when your down payment is less than 20%. It typically adds 0.5–1.5% of the loan amount annually to your payment. On a $240,000 loan, that is $100–300/month until you reach 20% equity.',
  },
  {
    question: 'Does making extra payments really help?',
    answer: 'Yes, significantly. Adding just one extra monthly payment per year to a 30-year mortgage can reduce the loan term by 4–5 years and save tens of thousands in interest.',
  },
  {
    question: 'What is included in monthly housing costs (PITI)?',
    answer: 'PITI stands for Principal, Interest, Taxes, and Insurance. This calculator covers all four: enter your estimated monthly property tax and homeowner\'s insurance in the fields provided. HOA fees, if applicable, are added separately.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mortgage Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free mortgage calculator with amortization schedule and monthly payment breakdown.',
}

export function buildFaqSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
