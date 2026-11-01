import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A mortgage is a loan used to buy a home, repaid in equal monthly installments over a fixed term, most often 15 or 30 years. Each payment has two parts: principal, which reduces the amount you still owe, and interest, which is the lender's charge for borrowing. On top of the loan payment, most homeowners also pay property tax, homeowner's insurance, and sometimes homeowners association (HOA) dues. This calculator estimates both the loan payment on its own and the all-in monthly housing cost, and it shows how every payment is split between principal and interest for the full life of a fixed-rate loan.

How to use this calculator: start with the Home Price and your Down Payment, both entered in dollars; the Down Payment (%) slider sets the same down payment as a share of the price. The calculator subtracts the down payment from the price to get the Loan Amount. Enter the Loan Term in years and the annual Interest Rate your lender quotes for a fixed-rate loan. Then add your estimated monthly Property Tax, monthly Home Insurance, and monthly HOA dues. If your property tax bill is annual, divide it by 12 before entering it. The page starts with example values: a $400,000 home, $80,000 down, a 30-year term at 7.0%, $300 a month in property tax, $120 a month in insurance, and no HOA. Every result updates as you type, and the inputs are saved in the page address so you can bookmark or share a scenario.

The results show five main figures. Monthly P&I is the principal-and-interest payment owed to the lender. Total Monthly adds property tax, insurance, and HOA to that payment. Total Interest is the sum of all interest paid until the loan is paid off. Loan Amount is the price minus the down payment. Payoff Time is how long that takes. Below the summary, a table compares 15, 20, 25 and 30-year terms at your inputs, a chart shows how much principal and interest you pay each year, and two tables give a yearly summary and a month-by-month amortization schedule with the remaining balance after each payment.

The method is the standard fixed-rate amortization formula. The annual rate is divided by 12 to get a monthly rate, and the term in years is multiplied by 12 to get the number of payments. The monthly payment is the loan amount multiplied by the monthly rate times (1 + monthly rate) raised to the number of payments, divided by (1 + monthly rate) raised to the number of payments minus 1. This produces a payment that stays the same every month and brings the balance to exactly zero at the end of the term. Each month, interest is charged on the balance still owed, and whatever is left of the payment goes to principal. Because the balance is largest at the start, early payments are mostly interest; as the balance falls, more of each payment goes to principal. If you enter a 0% rate, the calculator simply divides the loan amount by the number of payments.

Extra payments and biweekly payments: under Advanced options you can add an extra amount to principal every month, one-time lump sums in chosen months, or switch to biweekly payments. Biweekly means half the monthly payment every two weeks, with interest charged on the balance each two-week period; 26 half-payments a year add up to 13 monthly payments instead of 12. Every extra dollar lowers the balance that later interest is charged on, so the loan ends early. The final payment is trimmed to whatever is left, and the results show Interest Saved and Time Saved compared with paying only the scheduled amount. On the default $320,000 loan at 7%, an extra $500 a month pays the loan off in 17 years 9 months and saves about $206,900 in interest.

Worked example using the default values: a $400,000 home with $80,000 down leaves a loan of $320,000. At 7.0% over 30 years, the monthly principal-and-interest payment is about $2,129. Adding $300 for property tax and $120 for insurance brings the total monthly cost to about $2,549. In the first month, $1,866.67 of the payment is interest and only $262.30 reduces the balance. Over the first year you pay roughly $22,297 in interest. After 10 years the balance is still about $274,600, and principal does not overtake interest in a single payment until month 242, early in year 21. Over the full 30 years, total interest comes to about $446,428, more than the original loan. Changing only the term to 15 years raises the payment to about $2,876 but cuts total interest to about $197,725, a difference of roughly $248,700.

Interpreting the results: the Total Monthly figure is the number to compare against your budget, because taxes and insurance are real monthly costs even when they are paid through an escrow account. The Total Interest figure is the clearest way to compare loan terms and rates; a difference of half a percentage point can change total interest by tens of thousands of dollars on a large loan. The yearly table is useful for seeing how much equity you will have built at a given point, which matters if you expect to sell or refinance before the loan is paid off.

Practical tips: try several down payment amounts to see how a smaller loan changes both the payment and total interest. Use the term comparison table to see a 15-year and a 30-year term side by side. Look up actual property tax rates for the area you are considering, since they vary widely between towns and can change your monthly cost more than a small rate difference. Ask an insurance agent for a real quote rather than guessing. Many lenders look at the share of your gross income that goes to housing, so it helps to know your Total Monthly figure before you apply.

Limitations and common mistakes: this calculator models a fixed-rate loan with a constant payment. It does not model adjustable-rate mortgages or interest-only periods. It does not include private mortgage insurance (PMI), closing costs, points, or lender fees. If you expect to pay PMI, you can add your estimated monthly PMI to the HOA field so it appears in the Total Monthly figure, but it will be labelled as part of the add-on costs rather than as PMI. Property tax and insurance are treated as fixed monthly amounts, while in reality both tend to rise over time. A common mistake is entering the annual property tax bill in the monthly field, which inflates the total twelvefold. Another is typing a percentage into the Down Payment field, which expects dollars; use the percentage slider instead. Results are estimates for planning and comparison, not a loan offer or financial advice; your lender's Loan Estimate will show the exact figures for your loan.`

export const faqItems: FAQItem[] = [
  {
    question: 'How much house can I afford?',
    answer: 'A common guideline is to keep total housing costs (principal, interest, property tax, and insurance) below 28% of your gross monthly income, and all debt payments combined below about 36%. For an $80,000 salary, 28% is roughly $1,867 a month. Enter different home prices in this calculator until the Total Monthly figure fits within that range, then confirm with a lender, since actual approval also depends on your credit, other debts, and down payment.',
  },
  {
    question: 'What is the difference between a 15-year and 30-year mortgage?',
    answer: 'A 15-year mortgage has a higher monthly payment but costs far less in total interest, and lenders usually offer it at a lower rate. On a $240,000 loan at 6.5%, a 30-year term costs about $306,000 in interest versus about $136,000 for a 15-year term at the same rate, a difference of roughly $170,000. A 30-year term keeps the required payment lower, which gives more monthly flexibility.',
  },
  {
    question: 'Why is so much of my early mortgage payment interest?',
    answer: 'Interest is charged each month on the balance you still owe, and that balance is largest at the start. On a $320,000 loan at 7% over 30 years, the first payment of about $2,129 includes $1,866.67 of interest and only $262.30 of principal. As the balance shrinks, the interest portion falls and the principal portion grows. The monthly detail table in this calculator shows that shift payment by payment.',
  },
  {
    question: 'What is PMI and when do I need it?',
    answer: 'Private mortgage insurance protects the lender on conventional loans when your down payment is less than 20% of the price. It commonly costs about 0.3% to 1.5% of the loan amount per year, depending on credit score and down payment, and can usually be removed once you reach 20% to 22% equity. This calculator does not calculate PMI; if you have a quote, add the monthly amount to the HOA field to include it in your total monthly cost.',
  },
  {
    question: 'Does making extra payments really help?',
    answer: 'Yes. Any extra amount paid toward principal reduces the balance that future interest is charged on, which shortens the loan and lowers total interest. Even one extra payment a year can take several years off a 30-year loan. Open Advanced options in this calculator to add an extra monthly amount, one-time lump sums, or biweekly payments, and it shows the interest and time saved.',
  },
  {
    question: 'What is included in monthly housing costs (PITI)?',
    answer: 'PITI stands for principal, interest, taxes, and insurance. This calculator covers all four: principal and interest come from the loan amount, rate, and term, and you enter your estimated monthly property tax and homeowner\'s insurance in their own fields. HOA dues, if you have them, are added on top in the Total Monthly figure.',
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
