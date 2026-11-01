import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A debt payoff plan is a way of deciding which debt to focus on first when you owe money on several accounts at once, such as credit cards, a car loan, or a personal loan. Paying more than the minimum on any debt reduces its principal faster, and because interest is charged on the remaining balance, a lower balance means less interest every month after that. Removing a debt that charges 20% interest saves you that 20% on every dollar you would otherwise have owed. This calculator estimates how many months it would take to become debt-free and how much interest you would pay along the way, and it compares two popular strategies on your own debts: the avalanche method and the snowball method.

The avalanche method targets the debt with the highest interest rate first. Because the most expensive balance is eliminated earliest, it generally produces the lowest total interest. The snowball method targets the debt with the smallest balance first. It usually costs somewhat more in interest, but it pays off the first account sooner, and many people find that early win helps them stay motivated. In both methods, once a debt is paid off, the money that was going to it moves on to the next debt in line.

How to use this calculator: in the Your Debts table, enter each debt's name, current balance, annual interest rate, and minimum monthly payment. Use Add Debt to add more rows and the x button to remove one. Choose a Strategy, Avalanche or Snowball, and enter any Extra Monthly Payment you can put toward debt on top of your minimums. If you expect a one-time payment, such as a tax refund or bonus, use Add Lump Sum and enter the month it will be paid, where month 1 is your next payment, and the amount. The page starts with two example debts: a $5,000 credit card at 20% with a $100 minimum, and an $8,000 car loan at 6% with a $200 minimum. The results show Months to Debt-Free, the Debt-Free Date counted from the current month, Total Interest Paid, the interest saved compared with paying only the minimums, and the Payoff Order for the strategy you selected. The Strategy Comparison table and chart show the months, debt-free date and total interest for both strategies and for paying minimum payments only, side by side, so you can see the difference without switching back and forth.

How the calculation works: the calculator adds up all of your minimum payments plus your extra payment to get a fixed monthly debt budget, and that budget stays the same until every debt is gone. Each month, interest is added to every balance at one-twelfth of its annual rate. Then the entire monthly budget is applied to one target debt: the smallest current balance under snowball, or the highest interest rate under avalanche. The other debts accrue interest that month but do not receive a separate payment in this model. When the target debt reaches zero, any money left over that month goes straight to the next target, and from then on the full budget goes to that next debt. This is a simplified model. In real life lenders require at least the minimum on every account each month, so your actual month-by-month payments will be split differently, but the total amount you put toward debt each month is the same. A lump sum is added to the budget for its month only and goes to debts in the same strategy order. The minimum payments only scenario is different: each debt receives just its own minimum, with no extra payment and no lump sums, and when a debt is paid off its minimum is not moved to the others, so your monthly outlay falls as debts clear.

Worked example: suppose you owe $1,200 on a medical bill at 8% with a $50 minimum, and $6,000 on a credit card at 22% with a $150 minimum, and you can pay an extra $100 a month. Your total monthly budget is $300. With the avalanche method, the credit card is paid first because it has the higher rate; you would be debt-free in 30 months and pay about $1,789 in interest. With the snowball method, the smaller medical bill is paid first; you would be debt-free in 32 months and pay about $2,313 in interest. In this case avalanche saves about $524 and two months. With the page's default debts, both strategies give the same answer, because the credit card is both the smallest balance and the highest rate: 52 months and about $2,477 in interest with no extra payment. Adding $200 a month in extra payments shortens that to 29 months and about $1,369 in interest.

Interpreting the results: the comparison chart shows the cost of choosing snowball over avalanche for your particular debts. If the two bars are close, the choice is mostly about which approach you are more likely to stick with. If avalanche saves a large amount, it may be worth the wait for the first payoff. The Payoff Order tells you which account to focus on first. If Months to Debt-Free shows Never, with a warning above the results, your monthly budget does not cover the interest being added and the balance would not go down; you would need a larger payment or a lower rate.

Practical tips: use the current balance, rate, and minimum payment from your latest statements rather than estimates. Even a modest extra payment can make a large difference, so try several values in the Extra Monthly Payment field. When a debt is paid off, keep paying the same total amount toward the rest rather than spending the freed-up minimum. If you have a promotional 0% rate, enter it as 0, but remember that the rate will change when the promotion ends. Your debts, lump sums, strategy and extra payment are all saved in the page address, so you can reload the page or share the link without losing them.

Limitations and common mistakes: the calculator assumes fixed interest rates, no new charges, no fees, and the same monthly budget throughout apart from any lump sums you enter. It does not model minimum payments that fall as balances shrink, which is how many credit cards work, or rate changes after a promotional period. A common mistake is entering an annual payment or a total loan amount in the minimum payment field; it should be the monthly minimum from your statement. Another is adding new purchases to a card while paying it down, which the projection cannot account for. The results are estimates to help compare strategies and are not financial advice.`

export const faqItems: FAQItem[] = [
  {
    question: 'Which is better: snowball or avalanche?',
    answer: 'Avalanche (highest interest rate first) minimizes total interest. Snowball (smallest balance first) usually costs more, but pays off the first account sooner, which helps some people stay motivated. In one example in this calculator, a $1,200 medical bill at 8% and a $6,000 credit card at 22% with a $300 monthly budget take 30 months and about $1,789 in interest with avalanche, versus 32 months and about $2,313 with snowball. The best method is the one you will stick with.',
  },
  {
    question: 'Why do snowball and avalanche give the same result?',
    answer: 'If your smallest debt also has the highest interest rate, both strategies choose the same debt first and follow the same order, so the results are identical. That is the case with this calculator\'s default debts, where the $5,000 credit card at 20% is both smaller and more expensive than the $8,000 car loan at 6%.',
  },
  {
    question: 'How much extra should I pay toward debt?',
    answer: 'Any amount above the minimum helps, and the effect is often larger than expected. For a single $5,000 credit card at 22% with a $125 monthly payment, this calculator estimates 73 months and about $4,095 in interest. Adding $100 a month cuts that to 29 months and about $1,481 in interest. Try different amounts in the Extra Monthly Payment field to see the effect on your own debts.',
  },
  {
    question: 'Does the calculator pay the minimum on every debt?',
    answer: 'Not separately. It adds all your minimum payments and your extra payment into one monthly budget and applies the whole budget to the current target debt, while the other debts accrue interest. This keeps your total monthly payment the same as in a real plan, but in practice lenders require at least the minimum on each account, so your actual payments will be split differently and results will vary somewhat.',
  },
  {
    question: 'Should I pay off debt or invest?',
    answer: 'Compare the debt\'s interest rate with the return you could reasonably expect from investing. High-interest debt, such as credit cards at 18% to 25%, is usually worth paying first because few investments reliably return that much. Low-interest debt is less clear-cut. Many people capture any employer retirement match first, then pay down high-interest debt before investing more. Your situation, including emergency savings, should guide the decision.',
  },
  {
    question: 'What is debt consolidation?',
    answer: 'Debt consolidation combines several debts into one, ideally at a lower interest rate, using a personal loan or a balance transfer card. It can reduce interest costs, but watch for balance transfer fees (often 3% to 5%), the rate after any promotional period ends, and the risk of running up new balances on the cleared cards. You can model a consolidation loan here by entering it as a single debt with its new rate and payment.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Debt Payoff Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free debt payoff calculator comparing snowball vs avalanche strategies by payoff time and total interest.',
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
