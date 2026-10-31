import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Retirement planning has two phases. In the accumulation phase you save and invest during your working years, and your balance grows from both new contributions and investment returns. In the drawdown phase you stop contributing and start withdrawing money to cover living costs, while whatever remains invested keeps earning a return. The question most people want answered is whether the balance built up in the first phase will last through the second. This calculator projects your savings year by year up to retirement, then projects how long that balance would cover a fixed level of annual spending.

How to use this calculator: enter your Current Age and the Retirement Age you are planning for. Enter your Current Savings, meaning the total already set aside for retirement across your accounts. Enter your Annual Savings, the amount you expect to add each year, including any employer contributions. Enter an Expected Annual Return as a percentage. Finally, enter your Annual Expenses in Retirement, the amount you expect to withdraw from savings each year once you stop working. The page starts with a 30-year-old planning to retire at 65, with $50,000 saved, $15,000 saved per year, a 7% return, and $60,000 a year in retirement spending. Results update as you type, and your inputs are kept in the page address so you can bookmark or share a scenario.

The results show three figures. Balance at Retirement is the projected total on your retirement date. Years of Funding is how many years of withdrawals that balance supports, shown as "50+ years" if it lasts through the full projection. Funds Run Out shows the age at which the balance reaches zero, or "Never" if it does not run out within 50 years of retiring. The chart plots the balance at every age, with a dashed line marking your retirement age, so you can see the rise during your working years and the path afterward.

How the calculation works: the calculator uses whole years. During accumulation, for each year between your current age and your retirement age, the balance grows by the expected return and then that year's annual savings are added. During drawdown, for each year after retirement, the balance grows by the same expected return and then your annual expenses are subtracted. This continues until the balance reaches zero or 50 years have passed. The same return is used before and after retirement, and the annual expense figure stays the same every year. Because expenses are not increased for inflation, the calculator works best when you treat all figures as today's dollars and use a real, inflation-adjusted return, such as 4% to 5% for a balanced portfolio rather than its nominal return.

Worked example: suppose you are 45, plan to retire at 65, have $100,000 saved, add $10,000 a year, expect a 6% return, and plan to spend $50,000 a year in retirement. After 20 years of growth and contributions, the projected Balance at Retirement is about $688,569. Withdrawing $50,000 a year while the rest keeps earning 6%, the money lasts 31 years and the calculator shows funds running out at age 96. If you instead plan to spend $60,000 a year, the same balance lasts only 21 years and runs out at age 86. Two changes can close that gap. Working until 67 raises the balance to about $794,277, and saving $15,000 a year instead of $10,000 raises it to about $872,497; with $50,000 of annual spending, either change keeps the balance from running out within 50 years. With the page's default values, the projected balance at 65 is about $2.61 million, and because 7% growth on that balance is more than $60,000 a year, the calculator shows that funds never run out.

Interpreting the results: the key comparison is between your balance's annual return and your annual expenses. If the return is larger than what you withdraw, the balance keeps growing and the calculator reports "Never." If expenses are larger, the balance shrinks faster each year as the base it earns on gets smaller. A "Funds Run Out" age comfortably beyond your expected lifespan suggests the plan has a margin of safety under the assumptions you entered. An age in your 70s or 80s is a signal to test changes such as saving more, retiring later, or planning lower spending.

Practical tips: to account for Social Security, a pension, rental income, or part-time work, subtract the expected annual amount from your retirement expenses and enter only the shortfall that must come from savings. Run the projection at several return rates, for example 4%, 6%, and 8%, because a single rate hides a wide range of possible outcomes. Include employer matching contributions in your annual savings. Revisit the numbers every year or two, since actual returns and your savings rate will differ from any assumption.

Limitations and common mistakes: the projection assumes a constant return every single year, while real markets rise and fall. A run of poor returns early in retirement, known as sequence-of-returns risk, can deplete a portfolio much faster than an average return suggests. The calculator does not model taxes on withdrawals, investment fees, required minimum distributions, changes in spending over time, or health-care costs. Annual savings are assumed to stay the same each year rather than rising with your income. A common mistake is pairing a nominal return, such as 10%, with expenses stated in today's dollars, which overstates how long the money lasts. Another is entering monthly spending in the annual expenses field. The results are educational estimates, not financial advice; a qualified financial planner can help with a full retirement plan.`

export const faqItems: FAQItem[] = [
  {
    question: 'How much do I need to retire?',
    answer: 'A common rule of thumb is the 25x rule: multiply the annual amount you expect to withdraw from savings by 25. If you plan to withdraw $60,000 a year, that suggests roughly $1.5 million. The rule comes from the 4% guideline, since 4% of $1.5 million is $60,000. Subtract expected Social Security or pension income from your spending first, because only the shortfall needs to come from savings.',
  },
  {
    question: 'What is the 4% rule?',
    answer: 'The 4% rule comes from research on historical US stock and bond returns, including the Trinity Study. It found that withdrawing 4% of a portfolio in the first year of retirement, then adjusting that dollar amount for inflation each year, lasted at least 30 years in most historical periods tested. It is a guideline, not a guarantee; poor returns early in retirement can shorten how long savings last.',
  },
  {
    question: 'What return rate should I use?',
    answer: 'Because this calculator keeps your retirement expenses the same every year, use a real (inflation-adjusted) return so all figures stay in today\'s dollars. Historically, US stocks have returned roughly 7% a year after inflation, and a mixed stock-and-bond portfolio somewhat less, so 4% to 6% is a common planning range for a balanced portfolio. Testing several rates shows how sensitive your plan is.',
  },
  {
    question: 'How much should I save each year?',
    answer: 'A widely used guideline is to save about 15% of gross income for retirement, including any employer match, and more if you start later or want to retire early. Starting early matters most: in this calculator, saving $15,000 a year instead of $10,000 from age 45 to 65 at 6% raises the projected balance from about $688,569 to about $872,497.',
  },
  {
    question: 'How do I include Social Security in this calculator?',
    answer: 'This calculator does not have a separate Social Security field. Subtract your expected annual benefit from your planned annual retirement spending and enter the difference in the Annual Expenses in Retirement field. For example, if you plan to spend $60,000 a year and expect $24,000 from Social Security, enter $36,000. You can get a personalized benefit estimate from the Social Security Administration at ssa.gov.',
  },
  {
    question: 'Why does the calculator say my money never runs out?',
    answer: 'If the return your balance earns each year is larger than your annual expenses, the balance keeps growing even while you withdraw from it. With the default inputs, the projected balance at 65 is about $2.61 million, and 7% of that is far more than $60,000 a year. The calculator projects up to 50 years after retirement and shows "Never" when the balance lasts the whole period. Try a lower return or higher expenses to stress-test the result.',
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
