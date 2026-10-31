import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Paying off debt faster than the minimum required is one of the highest-return moves in personal finance. Every dollar you pay above the minimum directly reduces principal, which reduces future interest charges on every subsequent payment. The compounding works in reverse: eliminating a debt with a 20% APR is mathematically equivalent to earning a guaranteed 20% return on that money.

The two dominant strategies are the avalanche and snowball methods. Avalanche orders your debts by interest rate—highest first—and directs all extra payment toward the most expensive debt while paying minimums on the rest. This minimizes total interest paid. Snowball orders debts by balance—smallest first—and focuses extra payment there. This pays off the first account sooner, creating a psychological win that many people find motivating. The calculator lets you compare both side-by-side on your actual debts so you can see the difference in total interest and payoff time.

How to use this calculator: add each debt with its current balance, interest rate, and minimum payment. Enter any additional monthly amount you can put toward debt. The results show the payoff schedule under each strategy and the total interest you will pay. The month-by-month breakdown shows exactly when each debt disappears and how your freed-up minimums roll into the remaining balances.`

export const faqItems: FAQItem[] = [
  {
    question: 'Which is better: Snowball or Avalanche?',
    answer: 'Avalanche is mathematically optimal—it minimizes total interest paid. If two debts have the same balance but different rates, paying the higher-rate one first is strictly better financially. Snowball costs more in interest but tends to produce better real-world results for people who struggle with motivation, because early wins (paid-off accounts) sustain the behavior. The best method is the one you will actually stick with. If you are analytical and disciplined, choose avalanche. If you need momentum, choose snowball.',
  },
  {
    question: 'How much extra should I pay toward debt?',
    answer: 'Any amount above the minimum accelerates payoff, but the impact is not linear—it compounds. An extra $100/month on a $5,000 credit card at 22% APR can cut payoff time by more than half. A practical starting point is to audit subscriptions and discretionary spending to find $100–300/month, then direct the full amount to the target debt. As each debt is paid off, its minimum payment rolls into the extra payment, creating an accelerating snowball or avalanche effect.',
  },
  {
    question: 'Should I pay off debt or invest?',
    answer: 'The break-even is the expected investment return versus the debt interest rate. High-interest debt (credit cards at 18–25%) should almost always be paid first—no investment reliably beats that guaranteed return. Low-interest debt (a mortgage at 3–4%) is more nuanced: investing in a diversified portfolio has historically returned 7–10% annually, making investing while carrying cheap debt potentially rational. A practical middle ground: always capture employer 401(k) matching (it is a 50–100% immediate return), then attack high-interest debt aggressively before shifting toward investing.',
  },
  {
    question: 'What is debt consolidation?',
    answer: 'Debt consolidation combines multiple debts into a single loan—ideally at a lower interest rate. A balance transfer card with a 0% promotional period or a personal loan at 10% can dramatically reduce interest costs on credit card debt at 20%+. The risks: balance transfer fees (typically 3–5%), the rate after the promo period ends, and the temptation to re-accumulate balances on the now-empty cards. Consolidation works best when paired with a concrete payoff plan and closing or freezing the original accounts.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Debt Payoff Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free debt payoff calculator comparing snowball vs avalanche strategies with month-by-month schedules.',
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
