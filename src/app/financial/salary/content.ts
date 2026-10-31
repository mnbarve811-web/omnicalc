import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Your gross salary is the number on your offer letter—but your take-home pay depends on a cascade of deductions that rarely get explained clearly. The most predictable deductions are FICA taxes: Social Security (6.2% on wages up to the annual wage base) and Medicare (1.45%, with an additional 0.9% on high earners). These are flat percentages that apply before any credits or deductions, so they behave the same regardless of filing status.

Federal income tax is more complex. It uses a progressive bracket system, meaning only the portion of income within each bracket is taxed at that bracket's rate. A single filer earning $80,000 does not pay 22% on all $80,000—they pay 10% on the first $11,600, 12% on income from $11,600 to $47,150, and 22% on income above that. The standard deduction reduces your taxable income before any bracket calculation begins. State income tax follows a similar structure, but rates and brackets vary widely by state—several states have no income tax at all.

Pre-tax deductions like 401(k) contributions and health insurance premiums reduce your federal and state taxable income directly, which is why they are more valuable than post-tax deductions of the same dollar amount. This calculator applies pre-tax deductions before computing your income tax, giving you an accurate picture of what actually lands in your bank account each pay period.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is the difference between gross and net pay?',
    answer: 'Gross pay is your total earnings before any deductions—your salary or hourly wages times hours worked. Net pay (take-home pay) is what remains after federal income tax, state income tax, Social Security, Medicare, and any voluntary deductions like health insurance or 401(k) contributions are subtracted. The gap between gross and net varies by income level, state, and elections, but for most workers it is 25–35% of gross pay.',
  },
  {
    question: 'What are FICA taxes?',
    answer: 'FICA stands for the Federal Insurance Contributions Act, which funds Social Security and Medicare. Employees pay 6.2% of wages toward Social Security (on wages up to $168,600 in 2024) and 1.45% toward Medicare—a combined 7.65%. Employers match this amount. Self-employed individuals pay the full 15.3% themselves (though half is deductible). High earners pay an additional 0.9% Medicare surtax on wages above $200,000 (single) or $250,000 (married filing jointly).',
  },
  {
    question: 'How do I find my effective federal tax rate?',
    answer: 'Your effective tax rate is total federal income tax paid divided by your gross income. It is always lower than your marginal rate (the rate on your last dollar of income) because of the progressive bracket structure and the standard deduction. For example, a single filer with $75,000 in gross income might have an effective rate around 12–14% even though their marginal bracket is 22%. The calculator displays both figures so you can see the difference.',
  },
  {
    question: 'What should I put in Other Deductions?',
    answer: 'The Other Deductions field captures any regular paycheck deductions not already covered by the dedicated fields. Common examples include dental and vision insurance premiums, HSA or FSA contributions, life insurance premiums, union dues, commuter benefits, or supplemental disability coverage. If a deduction reduces your taxable income (pre-tax), it should be entered as a pre-tax amount. If it is taken after taxes—like Roth 401(k) contributions—enter it as a post-tax deduction so the tax calculation is not affected.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Salary / Paycheck Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free paycheck calculator showing federal tax, state tax, Social Security, and Medicare deductions.',
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
