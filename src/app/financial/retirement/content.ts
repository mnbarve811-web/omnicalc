import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Retirement planning divides into two distinct phases: the accumulation phase, where you save and invest over your working years, and the drawdown phase, where your portfolio generates income in retirement. The relationship between these phases is everything—a higher savings rate during accumulation directly extends how long your money lasts when you stop working. Even modest increases in annual contributions, made early, compound dramatically over decades.

How to use this calculator: enter your current age, target retirement age, and current savings balance. Set your expected annual contribution and choose an annual return rate (a 7% real return is a common long-run assumption for a diversified stock portfolio). In the drawdown section, enter your expected monthly spending in retirement. The calculator will show whether your nest egg outlasts your projected lifespan—and by how much.

The balance chart shows two curves: the growth curve during accumulation and the declining balance during drawdown. The crossover point where the balance hits zero tells you if you're on track. If it reaches zero before your target end age, try increasing contributions or reducing projected retirement spending. Social Security income, if expected, effectively reduces the withdrawal you need from savings—enter it as a monthly income offset to see its impact.`

export const faqItems: FAQItem[] = [
  {
    question: 'How much do I need to retire?',
    answer: 'The most common rule of thumb is the 25x rule: multiply your expected annual retirement spending by 25. If you plan to spend $60,000 per year, you need roughly $1.5 million saved. This is derived from the 4% rule—the idea that withdrawing 4% of your portfolio annually has historically sustained a 30-year retirement without exhausting the balance.',
  },
  {
    question: 'What is the 4% rule?',
    answer: 'The 4% rule comes from the Trinity Study, which analyzed historical stock and bond returns. It found that retirees who withdrew 4% of their initial portfolio annually (adjusted for inflation each year) had a high probability of their money lasting 30 years. It is a guideline, not a guarantee—sequence-of-returns risk means a bad market early in retirement can significantly shorten your runway.',
  },
  {
    question: 'How much should I save annually?',
    answer: 'A widely used guideline is to save 15% of your gross income for retirement, including any employer match. For someone starting later or wanting to retire early, 20–25% is more appropriate. The most important variable is starting early: saving $5,000 per year from age 25 will typically result in more at age 65 than saving $10,000 per year starting at age 40.',
  },
  {
    question: 'Should I account for Social Security in my plan?',
    answer: 'Yes. Social Security replaces roughly 40% of pre-retirement income for average earners. You can get your personalized estimate at ssa.gov. Rather than counting on it fully, many planners use it as a floor that reduces required portfolio withdrawals. In this calculator, entering your expected monthly Social Security benefit reduces the monthly amount you need to draw from savings, which significantly extends how long your portfolio lasts.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Retirement Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free retirement calculator to forecast your nest egg balance and see how long your savings will last.',
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
