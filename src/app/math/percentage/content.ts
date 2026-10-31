import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A percentage expresses a number as a fraction of 100. "20 percent" means 20 out of every 100, so 20% of 80 is 0.20 × 80 = 16. Percentages make it easy to compare quantities of different sizes, from discounts and tax rates to test scores, survey results, and investment returns. This percentage calculator handles the three questions people ask most often: what is a given percentage of a number, what percentage is one number of another, and by what percentage has a value changed.

How to use this calculator: pick one of the three modes with the buttons at the top. "X% of Y" finds a portion of a number, such as a 15% tip on a $60 bill. Enter the percentage in the first box and the number in the second. "X is what % of Y" tells you what share one number is of another, such as 45 correct answers out of 60 questions. Enter the part first and the whole second. "% Change" compares an original value to a new one and shows the increase or decrease as a percentage. Note that in this mode the new value goes in the first box and the original value in the second. The result updates instantly as you type, and a line underneath restates the calculation, such as 15% of 60 = 9, so you can check that the numbers went in the right boxes. Results are rounded to two decimal places, and a percentage increase is shown with a plus sign. Your inputs are saved in the page address, so you can bookmark or share a calculation.

The formulas: to find X% of Y, divide X by 100 and multiply by Y. To find what percentage X is of Y, divide X by Y and multiply by 100. To find the percentage change from an original value to a new value, subtract the original from the new value, divide by the original, and multiply by 100: (new − original) ÷ original × 100. A positive answer is an increase and a negative answer is a decrease.

Worked examples: a 15% tip on a $60 bill is 15 ÷ 100 × 60 = 9, so the tip is $9. If you answered 45 questions correctly out of 60, your score is 45 ÷ 60 × 100 = 75%. If a jacket's price drops from $80 to $62, the change is (62 − 80) ÷ 80 × 100 = −22.5%, so the price fell by 22.5%. If a salary rises from 60,000 to 72,000, the change is (72,000 − 60,000) ÷ 60,000 × 100 = +20%. Percentages above 100 work too: 150% of 40 is 60. Some answers do not come out evenly, and 1 out of 3 is shown as 33.33%.

Finding the whole from a part: a common question is the reverse one, such as "68 is 80% of what number?" This calculator does not have a separate mode for it, but the arithmetic is short: divide the part by the percentage written as a decimal, so 68 ÷ 0.80 = 85. You can confirm the answer with the "X is what % of Y" mode, which shows that 68 is 80% of 85. The same idea finds an original price before a discount. If an item costs $60 after a 25% discount, you paid 75% of the original, so the original price was 60 ÷ 0.75 = $80.

Applying increases and decreases: to raise a value by a percentage, multiply it by 1 plus the percentage as a decimal, so a 20% raise on 60,000 is 60,000 × 1.20 = 72,000. To lower a value, multiply by 1 minus the percentage, so a 25% discount on $80 is 80 × 0.75 = $60. Successive changes multiply rather than add. A 10% rise followed by another 10% rise is a total increase of 21%, not 20%, because the second rise is applied to the already-larger number.

Interpreting results: in the "% Change" mode, the sign tells you the direction. A result of +50% means the new value is one and a half times the original, while −50% means it has halved. In the "X is what % of Y" mode, a result above 100% simply means X is larger than Y. Be careful when comparing increases and decreases between the same two numbers. A rise from 100 to 150 is +50%, but a fall from 150 back to 100 is only −33.33%, because the starting point is different each time.

Percent versus percentage points: when the values being compared are themselves percentages, there are two ways to describe the difference. If an interest rate moves from 4% to 5%, it has risen by 1 percentage point, which is the plain difference. Measured with the percentage change formula, the same move is a 25% increase, because 1 is 25% of 4. Both statements are correct, but they answer different questions, so say which one you mean.

Common mistakes and limitations: the most frequent mistake is putting the numbers in the wrong boxes, especially swapping the original and new values in the "% Change" mode, which gives a different answer. Read the line under the result to make sure it says what you intended. Type plain numbers without a % sign. Percentage change is undefined when the original value is 0, and in that case the calculator shows 0 rather than an error; the "X is what % of Y" mode also shows 0% when Y is 0. When the original value is negative, the calculator divides by its size rather than its signed value, so a rise stays positive: going from −50 to −25 shows +50%, and going from −50 to −75 shows −50%. Some textbooks divide by the signed value instead and get the opposite sign, and for losses, debts, or temperatures below zero it is often clearer to describe the change in absolute terms as well. Finally, because results are rounded to two decimal places, keep extra precision in your own working if you plan to use the answer in further calculations.`

export const faqItems: FAQItem[] = [
  {
    question: 'How do I calculate a percentage of a number?',
    answer: 'Divide the percentage by 100 and multiply by the number. For example, 15% of 200 is 0.15 × 200 = 30.',
  },
  {
    question: 'How do I find what percent one number is of another?',
    answer: 'Divide the part by the whole and multiply by 100. For example, 30 out of 120 is 30 ÷ 120 × 100 = 25%.',
  },
  {
    question: 'How is percentage change calculated?',
    answer: 'Subtract the original value from the new value, divide by the original value, and multiply by 100. Going from 80 to 100 is (100 − 80) ÷ 80 × 100 = +25%. A negative result is a decrease, so going from 80 to 62 is −22.5%.',
  },
  {
    question: 'How do I find the original number from a percentage?',
    answer: 'Divide the part by the percentage written as a decimal. If 68 is 80% of a number, the number is 68 ÷ 0.80 = 85. If a price is $60 after a 25% discount, you paid 75% of the original, so the original was 60 ÷ 0.75 = $80.',
  },
  {
    question: 'Why is a 50% increase followed by a 50% decrease not back to the start?',
    answer: 'Each percentage applies to a different base. 100 increased by 50% is 150, but 50% of 150 is 75, so a 50% decrease brings you to 75, not 100.',
  },
  {
    question: 'What is the difference between percent and percentage points?',
    answer: 'Percentage points measure the plain difference between two percentages. An interest rate rising from 4% to 5% is a 1 percentage point increase, but a 25% relative increase.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Percentage Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free percentage calculator: find X% of Y, what percent X is of Y, and percentage change.',
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
