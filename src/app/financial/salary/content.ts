import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Your gross pay is what you earn before anything is taken out. Your net pay, or take-home pay, is what actually reaches your bank account after taxes and other deductions. For most US workers the gap between the two comes from four main items: federal income tax, state income tax, Social Security, and Medicare, plus any other paycheck deductions such as health insurance or retirement contributions. This calculator gives a quick estimate of take-home pay for a single pay period and for a full year, using tax rates that you provide, so you can see where each dollar of a paycheck goes.

How to use this calculator: enter your Gross Pay per Period, meaning the amount you earn in one paycheck before deductions, not your annual salary. Choose your Pay Frequency: weekly (52 paychecks a year), bi-weekly (26), semi-monthly (24), or monthly (12). Enter a Federal Tax Rate and a State Tax Rate as percentages, and enter Other Deductions as a dollar amount taken from each paycheck. The page starts with $5,000 of gross pay per month, a 22% federal rate, a 5% state rate, and $200 of other deductions. Results update as you type, and your inputs are saved in the page address so a scenario can be bookmarked or shared.

The results show Net Pay per period, Annual Gross, and Annual Net. A bar chart compares the size of each deduction, and a pay breakdown table lists gross pay, each deduction, and net pay for one period.

How the calculation works: this is a simplified, flat-rate estimate. Federal income tax is your gross pay multiplied by the federal rate you enter, and state tax is your gross pay multiplied by the state rate you enter. Social Security is calculated at 6.2% of gross pay and Medicare at 1.45% of gross pay, which are the standard employee FICA rates. Other Deductions are then subtracted as a fixed dollar amount. Net pay is gross pay minus all of these. Annual figures are the per-period figures multiplied by the number of pay periods in a year for the frequency you chose. The calculator does not apply tax brackets, the standard deduction, tax credits, or filing status, so the federal and state rates you enter are applied to every dollar of gross pay.

Because of that, the most important choice is which federal rate to enter. Your marginal tax bracket, such as 22%, applies only to the top slice of your income. Under the progressive federal system, lower slices are taxed at 10% and 12%, and the standard deduction shields part of your income from tax entirely. Entering your bracket rate as a flat rate will usually overstate your federal tax. For a more realistic estimate, enter your effective rate. You can find it by dividing the federal income tax withheld on a recent pay stub by the gross pay on that stub, or by dividing the total tax on last year's return by your total income.

Worked example using the default values: with $5,000 of monthly gross pay, a 22% federal rate takes $1,100, a 5% state rate takes $250, Social Security takes $310, Medicare takes $72.50, and other deductions take $200. Net pay is $3,067.50 per month. Over 12 months that is $60,000 gross and $36,810 net. If you replace the 22% bracket rate with a 10% effective federal rate, federal tax falls to $500 and net pay rises to $3,667.50 a month, or $44,010 a year, which shows how much the rate choice matters. As a second example, a worker paid $2,000 bi-weekly with a 12% federal rate, a 4% state rate, and $100 of other deductions would see $240 federal tax, $80 state tax, $124 Social Security, and $29 Medicare, for net pay of $1,427 per paycheck. Over 26 paychecks that is $52,000 gross and $37,102 net.

Interpreting the results: the per-period net pay is the figure to use for a monthly or bi-weekly budget. If you are paid bi-weekly, remember that 26 paychecks means two months each year with three paychecks, so a monthly budget based on two paychecks leaves some extra. The annual net figure is useful when comparing job offers or deciding how much you can save. The chart makes it easy to see which deduction is largest; for many people it is federal tax, but at lower incomes FICA can be larger than federal income tax.

Practical tips: compare the calculator's result with a real pay stub and adjust the rates until they match; after that, the calculator is a reliable way to test a raise or a change in pay frequency. If your state has no income tax, enter 0 for the state rate. Include all regular per-paycheck deductions in Other Deductions, such as health, dental, and vision premiums, retirement contributions, and union dues.

Limitations and common mistakes: Social Security tax in reality stops once your wages for the year pass the annual wage base ($184,500 in 2026), and an Additional Medicare Tax of 0.9% applies to wages above $200,000; this calculator applies the flat 6.2% and 1.45% rates to all pay and does not model either rule. Pre-tax deductions such as traditional 401(k) contributions and many health premiums reduce taxable income in reality, but here Other Deductions are subtracted after taxes and do not lower the tax amounts, so the calculator may slightly overstate taxes when you have pre-tax deductions. Local and city income taxes, bonuses, overtime, and self-employment tax are not included. A common mistake is entering an annual salary in the Gross Pay per Period field; divide your salary by the number of pay periods first. The results are estimates for budgeting, not tax advice; your employer's payroll system and your tax return determine the actual amounts.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is the difference between gross and net pay?',
    answer: 'Gross pay is your total earnings before any deductions. Net pay, or take-home pay, is what remains after federal income tax, state income tax, Social Security, Medicare, and other deductions such as health insurance or retirement contributions. With this calculator\'s default inputs, $5,000 of monthly gross pay becomes $3,067.50 of net pay.',
  },
  {
    question: 'What are FICA taxes?',
    answer: 'FICA (Federal Insurance Contributions Act) taxes fund Social Security and Medicare. Employees pay 6.2% of wages for Social Security, up to an annual wage base ($184,500 in 2026), and 1.45% for Medicare with no cap, for a combined 7.65%. Employers pay a matching amount. An Additional Medicare Tax of 0.9% applies to wages above $200,000 for single filers. This calculator applies the flat 6.2% and 1.45% rates to all wages.',
  },
  {
    question: 'What federal tax rate should I enter?',
    answer: 'Enter your effective rate, not your tax bracket. This calculator applies the rate you enter to all of your gross pay, while the real federal system taxes income in brackets after the standard deduction. To find your effective rate, divide the federal income tax withheld on a recent pay stub by the gross pay on that stub. Entering a bracket rate such as 22% will usually overstate your federal tax.',
  },
  {
    question: 'What is the difference between bi-weekly and semi-monthly pay?',
    answer: 'Bi-weekly means every two weeks, which gives 26 paychecks a year. Semi-monthly means twice a month, usually on fixed dates, which gives 24 paychecks a year. For the same annual salary, each semi-monthly paycheck is slightly larger than a bi-weekly one. Select the matching Pay Frequency so the annual totals are correct.',
  },
  {
    question: 'What should I put in Other Deductions?',
    answer: 'Enter the total dollar amount of any other regular deductions taken from each paycheck, such as health, dental, and vision insurance premiums, 401(k) or HSA contributions, life insurance, or union dues. This calculator subtracts Other Deductions after taxes. Pre-tax deductions reduce taxable income in reality, so the estimate may slightly overstate taxes if your deductions are pre-tax.',
  },
  {
    question: 'Why doesn\'t my real paycheck match the calculator?',
    answer: 'This is a simplified flat-rate estimate. Real withholding depends on your W-4 elections, filing status, tax brackets, the standard deduction, pre-tax deductions, local taxes, and the Social Security wage base. To get closer, set the federal and state rates to the effective rates on your pay stub (tax withheld divided by gross pay) and enter your actual deductions.',
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
