import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `An auto loan is an installment loan used to buy a car, truck, or other vehicle. You borrow the amount you cannot pay up front, then repay it in equal monthly payments over a set number of months, usually between 36 and 84. Each payment covers the interest charged on the balance that month plus a portion of the principal. Because the sticker price is not the same as the amount you finance, this calculator starts with the vehicle price, adds sales tax, and subtracts your down payment and trade-in to find the actual loan amount before calculating the payment and the total interest you would pay.

How to use this calculator: enter the Vehicle Price you expect to pay. Enter your Down Payment in dollars and the Trade-In Value of any vehicle you are trading in. Enter the Annual Interest Rate offered by your lender or dealer, the Loan Term in months (for example 60 for a five-year loan), and your local Sales Tax Rate as a percentage. The page starts with a $30,000 vehicle, $5,000 down, no trade-in, a 6.0% rate, a 60-month term, and 8% sales tax. Results update as you type, and your inputs are saved in the page address so you can compare scenarios or share them.

The results show the Monthly Payment, the Loan Amount you would finance, and the Total Interest paid over the full term if you make every scheduled payment. A chart shows how much principal and interest you pay in each year of the loan, and an amortization schedule lists every month's payment, the split between principal and interest, and the remaining balance.

How the calculation works: first, the loan amount is the vehicle price plus sales tax, plus any fees you choose to finance, minus the down payment, minus the trade-in value. By default sales tax is charged on the vehicle price minus the trade-in value, as most states do; you can turn this off under Advanced options if your state taxes the full price. The down payment does not reduce the taxable price. Next, the annual rate is divided by 12 to get a monthly rate, and the payment is found with the standard amortization formula: the loan amount multiplied by the monthly rate times (1 + monthly rate) raised to the number of months, divided by (1 + monthly rate) raised to the number of months minus 1. This gives a fixed payment that pays the loan off exactly at the end of the term. Each month, interest is charged on the remaining balance and the rest of the payment reduces principal. At a 0% rate, the loan amount is simply divided by the number of months.

Worked example using the default values: 8% sales tax on a $30,000 vehicle adds $2,400, bringing the cost to $32,400. Subtracting the $5,000 down payment leaves a loan amount of $27,400. At 6.0% for 60 months, the monthly payment is about $529.72, and total interest over the loan is about $4,383. In the first month, $137 of the payment is interest and the rest goes toward principal. Changing only the term shows the trade-off between payment size and total cost. At 36 months the payment rises to about $833.56 but total interest falls to about $2,608. At 48 months the payment is about $643.49 with about $3,488 in interest. Stretching to 72 months lowers the payment to about $454.10 but raises interest to about $5,295, and at 84 months the payment is about $400.27 with about $6,223 in interest. Going from 36 to 84 months cuts the payment by more than half but more than doubles the interest.

Interpreting the results: the monthly payment tells you whether a loan fits your budget, but the total interest tells you what the loan actually costs. A lower payment from a longer term almost always means paying more in total. Watch the remaining balance column in the amortization schedule as well. Vehicles lose value quickly, especially in the first few years, and on a long loan with a small down payment the balance can stay above the car's market value for a long time. That matters if the car is totaled or you want to sell or trade it early.

Practical tips: get a rate quote from a bank or credit union before visiting a dealer so you have a number to compare against dealer financing. Compare offers at the same term, since a lower rate on a longer term can still cost more overall. Try increasing the down payment by a few thousand dollars to see how much it lowers both the payment and the interest. If you are offered a choice between a cash rebate and a low promotional rate, run both scenarios here, entering the rebate as a lower vehicle price, and compare total cost.

Limitations and common mistakes: registration, title and documentation fees can be entered under Advanced options, either financed or paid upfront, and are not taxed; some states do tax documentation fees, so the tax may be slightly understated there. Extended warranties and other add-ons are not included; if those will be financed, add them to the vehicle price, keeping in mind that the calculator will then apply sales tax to them as well. Tax rules vary by state, and a few states tax the full price regardless of a trade-in, so check your state's rule and set the trade-in tax option to match. If you still owe money on your trade-in, enter its net equity (its value minus the payoff amount) rather than the full value. The calculator assumes a simple-interest loan with a fixed rate. Any extra monthly payment is applied entirely to principal, and the scheduled payment shown stays the same while the loan is paid off sooner. A common mistake is entering the term in years instead of months; 5 here means a five-month loan. The figures are estimates for comparison and are not a loan offer or financial advice.`

export const faqItems: FAQItem[] = [
  {
    question: 'How is my auto loan amount calculated?',
    answer: 'This calculator adds sales tax to the vehicle price, then subtracts your down payment and trade-in value. With the default inputs, a $30,000 vehicle plus 8% tax is $32,400, and subtracting $5,000 down leaves a $27,400 loan. If you have a trade-in, sales tax is charged on the price minus the trade-in value by default, as most states do. Registration, title and documentation fees can be added under Advanced options and financed or paid upfront.',
  },
  {
    question: 'What is a good interest rate for an auto loan?',
    answer: 'Auto loan rates depend on your credit score, the loan term, whether the vehicle is new or used, and current market rates. Borrowers with excellent credit generally qualify for the lowest advertised rates, while used-vehicle loans and longer terms usually carry higher rates. Rates well into the teens typically indicate subprime credit. Compare quotes from a bank or credit union with dealer financing before you sign.',
  },
  {
    question: 'Should I put more money down on a car?',
    answer: 'A larger down payment lowers the loan amount, the monthly payment, and the total interest. It also reduces the chance of owing more than the car is worth if it is totaled or you sell it early. A 20% down payment is a common guideline for new cars. If that is not possible, a shorter loan term also helps you build equity faster.',
  },
  {
    question: 'How does a trade-in affect my loan?',
    answer: 'A trade-in reduces the amount you need to finance. If your trade-in is worth $8,000 and you owe $5,000 on it, you have $3,000 of equity; enter $3,000 as the trade-in value in this calculator. If you owe more than the vehicle is worth (negative equity), that amount is usually added to the new loan, which increases what you finance and how much interest you pay.',
  },
  {
    question: 'Is a 72- or 84-month auto loan a good idea?',
    answer: 'Longer terms lower the monthly payment but increase total interest and keep you owing more for longer while the car loses value. On a $27,400 loan at 6%, a 60-month term costs about $4,383 in interest, a 72-month term about $5,295, and an 84-month term about $6,223. Longer loans are also often offered at higher rates, which widens the gap further.',
  },
  {
    question: 'How much interest will I pay on a car loan?',
    answer: 'It depends on the loan amount, rate, and term. For example, a $30,000 loan at 7% costs about $4,483 in interest over 48 months (about $718 a month) and about $6,826 over 72 months (about $511 a month). Enter your own figures to see the total interest and a month-by-month amortization schedule.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Auto Loan Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free auto loan calculator to compute monthly payments including sales tax, down payment, and trade-in value.',
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
