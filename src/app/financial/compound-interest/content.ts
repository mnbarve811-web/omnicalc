import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Compound interest is interest earned on both your original money and on the interest it has already earned. With simple interest, a balance grows by the same dollar amount every year. With compound interest, each period's growth is added to the balance, so the next period's growth is calculated on a larger number. Over short periods the difference is small, but over decades this "interest on interest" effect becomes the largest part of the final balance. This calculator projects how an initial deposit plus regular monthly contributions could grow at a constant rate of return, and it separates the result into the money you put in and the growth it earned.

How to use this calculator: enter an Initial Investment, which is the amount you start with (use 0 if you are starting from nothing). Enter a Monthly Contribution, the amount you plan to add every month. Enter the Annual Interest Rate as a percentage, such as 7 for 7%. Enter the Compound Frequency as the number of times per year interest is compounded: 1 for annually, 4 for quarterly, 12 for monthly, or 365 for daily. Finally, enter the Time Period in years. The page starts with $10,000 initial, $500 a month, 7% a year, monthly compounding, and 20 years. Results update immediately and the inputs are kept in the page address, so a scenario can be bookmarked or shared.

The results show Future Value (the projected ending balance), Total Contributions (your initial investment plus every monthly contribution), and Interest Earned (the difference between the two). A stacked chart shows contributions and interest for each year, and a yearly breakdown table lists the balance, total contributed, and interest earned at the end of each year.

How the calculation works: the calculator steps through every month of the time period. Because contributions are monthly but compounding can happen at a different frequency, it first converts your annual rate and compound frequency into an equivalent monthly growth rate. The formula is (1 + annual rate divided by compound frequency) raised to the power of (compound frequency divided by 12), minus 1. For monthly compounding this is simply the annual rate divided by 12. Each month, the contribution is added to the balance first, and then the whole balance grows by the monthly rate. That means every contribution earns a full month of growth in the month it is made. This repeats for every month, and the balance is recorded at the end of each year.

Worked example using the default values: $10,000 to start, $500 a month, 7% a year compounded monthly, for 20 years. Over that time you contribute $130,000 in total: the $10,000 initial amount plus 240 monthly payments of $500. The projected future value is about $302,370, so interest earned is about $172,370, which is more than everything you put in. The growth is uneven over time. After 10 years the balance is about $107,144, of which $70,000 is contributions and only about $37,144 is interest. In the second 10 years you contribute another $60,000, but the balance grows by about $195,000, because growth is now being calculated on a much larger base. Changing only the compound frequency shows how much that setting matters: with annual compounding the 20-year result is about $293,900, with quarterly compounding about $300,755, and with daily compounding about $303,164.

Interpreting the results: the most useful number is often the split between contributions and interest rather than the final balance itself. In the early years most of the balance is money you deposited. The point where the interest band in the chart becomes larger than the contributions band is when growth starts to do more of the work than saving. The yearly table also lets you see what the balance would be if you stopped at an earlier year, which is helpful for medium-term goals such as a home down payment.

Practical tips: test a range of interest rates rather than a single number, since real investment returns vary from year to year. For a savings account or CD, use the stated annual percentage rate and the compounding frequency in the account terms. For stock or bond funds, there is no fixed compounding schedule; monthly compounding at an assumed average return is a reasonable approximation. Increasing the time period usually has a bigger effect than increasing the rate by a point, so try adding five years to see the impact of starting earlier. You can also enter a monthly contribution of 0 to see how a single lump sum grows on its own.

Limitations and common mistakes: the calculator assumes the same rate of return every year with no losses, which is realistic for a fixed-rate deposit but not for investments, whose returns rise and fall. It does not account for inflation, so the future value is in future dollars, not today's purchasing power; to approximate today's dollars, use an inflation-adjusted rate (for example, a 7% expected return minus 3% inflation gives roughly 4%). It does not subtract taxes on interest or investment gains, account fees, or fund expense ratios. Contributions are assumed to be the same every month and are added at the start of each month. A common mistake is entering the rate as a decimal, such as 0.07, which the calculator reads as 0.07%; enter 7 instead. Another is confusing compound frequency with contribution frequency: contributions here are always monthly. The projection is an illustration of how compounding works, not a forecast or financial advice.`

export const faqItems: FAQItem[] = [
  {
    question: 'What compounding frequency should I use?',
    answer: 'Use the frequency stated by your bank for savings accounts and CDs; many compound daily (enter 365) or monthly (enter 12). For index funds and other investments there is no fixed compounding schedule, so monthly compounding (12) at an assumed average annual return is a reasonable approximation.',
  },
  {
    question: 'Does compounding frequency make a big difference?',
    answer: 'Less than most people expect. With $10,000 to start, $500 a month, and 7% over 20 years, this calculator projects about $293,900 with annual compounding, $300,755 quarterly, $302,370 monthly, and $303,164 daily. Going from annual to monthly adds roughly 3%, while going from monthly to daily adds very little. The rate of return and the number of years matter far more.',
  },
  {
    question: 'What annual return rate should I assume?',
    answer: 'The US stock market (S&P 500) has historically returned about 10% a year before inflation, or roughly 7% after inflation, with large swings from year to year. For conservative long-term planning many people use 5% to 7%. For savings accounts, CDs, or bonds, use the current stated rate. Past returns do not guarantee future results.',
  },
  {
    question: 'How much does starting early really matter?',
    answer: 'A great deal. $10,000 invested once at 7% compounded annually grows to about $149,745 after 40 years (age 25 to 65), but only about $76,123 after 30 years (age 35 to 65). Starting 10 years later roughly halves the result, even though the amount invested is the same.',
  },
  {
    question: 'What is the Rule of 72?',
    answer: 'Divide 72 by the annual interest rate to estimate how many years it takes for money to double. At 7%, money doubles roughly every 10 years (72 divided by 7 is about 10.3). At 4%, it takes about 18 years. It is a quick mental shortcut and is most accurate for rates between about 4% and 12%.',
  },
  {
    question: 'Does this calculator account for inflation or taxes?',
    answer: 'No. The future value is shown in nominal dollars, before taxes and fees. To estimate the result in today\'s purchasing power, enter an inflation-adjusted rate, such as your expected return minus expected inflation. Taxes depend on the type of account (taxable, tax-deferred, or tax-free) and are not modeled.',
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
