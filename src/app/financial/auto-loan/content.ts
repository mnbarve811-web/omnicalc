import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `An auto loan works like any installment loan: you borrow the vehicle price minus your down payment, repay it in fixed monthly installments over the loan term, and pay interest on the outstanding balance each month. Because interest accrues on a declining balance, paying it off in 48 months versus 72 months can save thousands of dollars in total interest—even if the monthly payment difference looks modest.

Taxes, fees, and trade-in value all affect your actual loan amount in ways the sticker price hides. Sales tax on a $35,000 vehicle at 8% adds $2,800 to the amount financed. Dealer fees can add another $500–2,000. A trade-in, by contrast, reduces the amount you need to borrow—though whether you sell privately or trade in at a dealer affects how much of that offset you actually capture. This calculator lets you enter all these factors so your monthly payment reflects reality, not just the sticker price.

The total interest figure shown in the summary is often a surprise. On a $30,000 loan at 7% over 72 months, you will pay over $6,800 in interest—that is 23% on top of the vehicle price. Shortening the term to 48 months at the same rate reduces total interest to roughly $4,500. Use the calculator to compare scenarios before committing to a term.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is a good interest rate for an auto loan?',
    answer: 'Auto loan rates depend heavily on credit score and loan term. As a general benchmark, borrowers with excellent credit (750+) typically qualify for rates around 5–7% for new vehicles; those with good credit (680–749) might see 7–10%. Rates on used vehicles are typically 1–3 percentage points higher. Rates above 15–18% usually indicate subprime credit, and it is worth exploring credit union rates before accepting dealer financing.',
  },
  {
    question: 'Should I put more money down on a car?',
    answer: 'A larger down payment reduces your loan balance, lowers your monthly payment, and reduces total interest paid. It also reduces the risk of going "underwater"—owing more than the car is worth—which matters if you need to sell or the vehicle is totaled. A 20% down payment is a common guideline for new cars. If a large down payment is not feasible, a shorter loan term accomplishes the same goal of staying ahead of depreciation.',
  },
  {
    question: 'How does a trade-in affect my loan?',
    answer: 'A trade-in reduces the amount you need to finance. If you trade in a vehicle worth $8,000 and owe $5,000 on it, you have $3,000 in equity to apply toward the new purchase. If you owe more than the trade-in value (negative equity), that balance typically gets rolled into the new loan, increasing your financed amount. Rolling negative equity into a new loan is a common way buyers find themselves perpetually underwater.',
  },
  {
    question: 'Is a 72- or 84-month auto loan a good idea?',
    answer: 'Long loan terms lower monthly payments but significantly increase total interest paid and leave you underwater for most of the loan term—new vehicles depreciate roughly 20% in the first year and 15% per year after that. An 84-month loan on a $35,000 vehicle at 8% means you will likely owe more than the car is worth for the first 4–5 years. If a vehicle is only affordable on a 72–84 month term, the payment is a signal the vehicle is outside your budget.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Auto Loan Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free auto loan calculator to compute monthly payments including taxes, fees, and trade-in value.',
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
