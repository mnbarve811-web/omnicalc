import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A percentage expresses a number as a fraction of 100. "20 percent" means 20 out of every 100, so 20% of 80 is 0.20 × 80 = 16. Percentages make it easy to compare quantities of different sizes, from discounts and tax rates to test scores and investment returns.

How to use this calculator: pick one of the three modes. "X% of Y" finds a portion of a number, such as a 15% tip on a $60 bill. "X is what % of Y" tells you what share one number is of another, such as 45 correct answers out of 60 questions (75%). "% Change" compares an original value to a new one and shows the increase or decrease as a percentage.

Percentage change is always measured relative to the original value: (new − original) ÷ original × 100. A rise from 100 to 150 is +50%, but a fall from 150 back to 100 is only −33.33%, because the starting point is different. When the original value is 0, percentage change is undefined, and the calculator shows 0.`

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
    answer: 'Subtract the original value from the new value, divide by the original value, and multiply by 100. Going from 80 to 100 is (100 − 80) ÷ 80 × 100 = +25%.',
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
