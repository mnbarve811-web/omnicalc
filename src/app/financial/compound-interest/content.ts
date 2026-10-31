import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Compound interest is the process of earning interest on both your initial investment and previously earned interest. Over time, this "interest on interest" effect causes wealth to grow exponentially rather than linearly—a key reason why starting to invest early makes such a dramatic difference.

How to use this calculator: enter your initial investment (or $0 if you're starting from scratch), a monthly contribution amount, and an expected annual return. The compounding frequency determines how often interest is calculated—monthly compounding is standard for most savings and investment accounts.

The chart shows how your balance grows year by year, with the gap between contributions and total balance representing your earned interest. Notice how this gap widens each year as compound growth accelerates.`

export const faqItems: FAQItem[] = [
  {
    question: 'What compounding frequency should I use?',
    answer: 'For savings accounts and CDs, use the frequency stated by your bank—usually daily or monthly. For broad market index funds, annual or monthly is a reasonable approximation since returns are not guaranteed.',
  },
  {
    question: 'What annual return rate should I assume?',
    answer: 'The US stock market (S&P 500) has historically returned about 10% annually before inflation, or roughly 7% after inflation. For conservative planning, use 6–7%. For bonds or savings accounts, use current market rates.',
  },
  {
    question: 'How much does starting early really matter?',
    answer: 'Enormously. $10,000 invested at age 25 at 7% grows to $149,000 by age 65. The same amount invested at age 35 grows to only $76,000—half as much, from starting just 10 years later.',
  },
  {
    question: 'What is the Rule of 72?',
    answer: 'Divide 72 by your annual interest rate to estimate how many years it takes to double your money. At 7%, your money doubles roughly every 10 years (72 ÷ 7 = 10.3).',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Compound Interest Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
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
