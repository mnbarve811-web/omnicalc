import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Your gross pay is what you earn before anything is taken out. Your net pay, or take-home pay, is what actually reaches your bank account after taxes and other deductions. For most US workers the gap between the two comes from four main items: federal income tax, state income tax, Social Security, and Medicare, plus any other paycheck deductions such as health insurance or retirement contributions. This calculator gives a quick estimate of take-home pay for a single pay period and for a full year, using tax rates that you provide, so you can see where each dollar of a paycheck goes.

How to use this calculator: enter your Gross Pay per Period, meaning the amount you earn in one paycheck before deductions, not your annual salary. Choose your Pay Frequency: weekly (52 paychecks a year), bi-weekly (26), semi-monthly (24), or monthly (12). Enter a Federal Tax Rate and a State Tax Rate as percentages, and enter Other Deductions as a dollar amount taken from each paycheck. The page starts with $5,000 of gross pay per month, a 22% federal rate, a 5% state rate, and $200 of other deductions. Results update as you type, and your inputs are saved in the page address so a scenario can be bookmarked or shared.

More options: switch Pay Type to Hourly to enter an hourly rate instead; pay is the rate times your regular hours per week times 52 weeks, divided across your pay periods. Hourly workers can add overtime hours per week and a multiplier (1.5x by default) in the Overtime section; salaried exempt employees don't earn overtime, so it only applies in hourly mode. The Bonus & Commission section adds annual amounts to gross pay, spread evenly across paychecks and taxed at your federal rate, or at the 22% federal supplemental rate if you tick that option. The Pre-tax Deductions section takes a 401(k) or 403(b) contribution, as a percentage of gross pay or a dollar amount per paycheck, and Section 125 health, HSA, or FSA deductions per paycheck. Other Deductions are after-tax amounts such as Roth 401(k) contributions or union dues.

The results show Net Pay per period, annual and monthly gross and net pay, and the equivalent hourly rate. A bar chart compares the size of each deduction, and a pay breakdown table lists gross pay, each deduction, and net pay for one period.

How the calculation works: this is a simplified, flat-rate estimate. Federal income tax is your taxable wages multiplied by the federal rate you enter, and state tax is your taxable wages multiplied by the state rate you enter. Taxable wages are gross pay minus pre-tax retirement and Section 125 deductions. Social Security is 6.2% of wages up to the annual wage base ($184,500 in 2026), and Medicare is 1.45% of all wages plus a 0.9% Additional Medicare Tax on wages above $200,000, the point at which employers must start withholding it. Retirement contributions do not reduce Social Security and Medicare wages, but Section 125 deductions do. Other Deductions are then subtracted as a fixed dollar amount after tax. FICA is worked out on annual wages and spread evenly over the year; real payroll withholds the full 6.2% until you reach the wage base and then stops, so high earners see larger paychecks late in the year rather than a steady amount. Net pay is gross pay minus all of these. Annual figures are the per-period figures multiplied by the number of pay periods in a year for the frequency you chose. The calculator does not apply tax brackets, the standard deduction, tax credits, or filing status, so the federal and state rates you enter are applied to every dollar of taxable wages.

Because of that, the most important choice is which federal rate to enter. Your marginal tax bracket, such as 22%, applies only to the top slice of your income. Under the progressive federal system, lower slices are taxed at 10% and 12%, and the standard deduction shields part of your income from tax entirely. Entering your bracket rate as a flat rate will usually overstate your federal tax. For a more realistic estimate, enter your effective rate. You can find it by dividing the federal income tax withheld on a recent pay stub by the gross pay on that stub, or by dividing the total tax on last year's return by your total income.

Worked example using the default values: with $5,000 of monthly gross pay, a 22% federal rate takes $1,100, a 5% state rate takes $250, Social Security takes $310, Medicare takes $72.50, and other deductions take $200. Net pay is $3,067.50 per month. Over 12 months that is $60,000 gross and $36,810 net. If you replace the 22% bracket rate with a 10% effective federal rate, federal tax falls to $500 and net pay rises to $3,667.50 a month, or $44,010 a year, which shows how much the rate choice matters. As a second example, a worker paid $2,000 bi-weekly with a 12% federal rate, a 4% state rate, and $100 of other deductions would see $240 federal tax, $80 state tax, $124 Social Security, and $29 Medicare, for net pay of $1,427 per paycheck. Over 26 paychecks that is $52,000 gross and $37,102 net.

Interpreting the results: the per-period net pay is the figure to use for a monthly or bi-weekly budget. If you are paid bi-weekly, remember that 26 paychecks means two months each year with three paychecks, so a monthly budget based on two paychecks leaves some extra. The annual net figure is useful when comparing job offers or deciding how much you can save. The chart makes it easy to see which deduction is largest; for many people it is federal tax, but at lower incomes FICA can be larger than federal income tax.

Practical tips: compare the calculator's result with a real pay stub and adjust the rates until they match; after that, the calculator is a reliable way to test a raise or a change in pay frequency. If your state has no income tax, enter 0 for the state rate. Enter traditional 401(k) or 403(b) contributions and pre-tax health, dental, vision, HSA, or FSA deductions in the Pre-tax Deductions section, and after-tax items such as Roth contributions and union dues in Other Deductions.

Limitations and common mistakes: bonuses and commission are averaged across every paycheck rather than taxed in the paycheck they arrive in, overtime assumes the same hours every week, and IRS contribution limits on 401(k) and HSA accounts are not enforced. A few states, such as Pennsylvania and New Jersey, tax 401(k) contributions, which this calculator does not reflect. The Additional Medicare Tax owed on your return depends on filing status; the calculator shows the amount withheld. Local and city income taxes and self-employment tax are not included. A common mistake is entering an annual salary in the Gross Pay per Period field; divide your salary by the number of pay periods first. The results are estimates for budgeting, not tax advice; your employer's payroll system and your tax return determine the actual amounts.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is the difference between gross and net pay?',
    answer: 'Gross pay is your total earnings before any deductions. Net pay, or take-home pay, is what remains after federal income tax, state income tax, Social Security, Medicare, and other deductions such as health insurance or retirement contributions. With this calculator\'s default inputs, $5,000 of monthly gross pay becomes $3,067.50 of net pay.',
  },
  {
    question: 'What are FICA taxes?',
    answer: 'FICA (Federal Insurance Contributions Act) taxes fund Social Security and Medicare. Employees pay 6.2% of wages for Social Security, up to an annual wage base ($184,500 in 2026), and 1.45% for Medicare with no cap, for a combined 7.65%. Employers pay a matching amount. Employers also withhold a 0.9% Additional Medicare Tax on wages above $200,000. This calculator applies the wage base and the Additional Medicare Tax using your annual wages, averaged across paychecks.',
  },
  {
    question: 'What federal tax rate should I enter?',
    answer: 'Enter your effective rate, not your tax bracket. This calculator applies the rate you enter to all of your taxable wages, while the real federal system taxes income in brackets after the standard deduction. To find your effective rate, divide the federal income tax withheld on a recent pay stub by the gross pay on that stub. Entering a bracket rate such as 22% will usually overstate your federal tax.',
  },
  {
    question: 'What is the difference between bi-weekly and semi-monthly pay?',
    answer: 'Bi-weekly means every two weeks, which gives 26 paychecks a year. Semi-monthly means twice a month, usually on fixed dates, which gives 24 paychecks a year. For the same annual salary, each semi-monthly paycheck is slightly larger than a bi-weekly one. Select the matching Pay Frequency so the annual totals are correct.',
  },
  {
    question: 'What should I put in Other Deductions?',
    answer: 'Enter after-tax deductions taken from each paycheck, such as Roth 401(k) contributions, supplemental life insurance, or union dues. Other Deductions are subtracted after taxes. Pre-tax items go in the Pre-tax Deductions section instead: a traditional 401(k) or 403(b) contribution lowers federal and state income tax, and Section 125 health, dental, vision, HSA, or FSA deductions lower income tax and Social Security and Medicare tax as well.',
  },
  {
    question: 'Why doesn\'t my real paycheck match the calculator?',
    answer: 'This is a simplified flat-rate estimate. Real withholding depends on your W-4 elections, filing status, tax brackets, the standard deduction, local taxes, and when in the year bonuses are paid or the Social Security wage base is reached. To get closer, set the federal and state rates to the effective rates on your pay stub (tax withheld divided by gross pay) and enter your actual deductions.',
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
