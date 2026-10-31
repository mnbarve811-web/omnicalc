import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A fraction represents part of a whole: the numerator (top number) counts the parts, and the denominator (bottom number) says how many equal parts make up the whole. This calculator adds, subtracts, multiplies, or divides two fractions and always reduces the answer to lowest terms.

How to use this calculator: pick an operation, then type the numerator and denominator of each fraction into the stacked boxes. The result updates instantly as a simplified fraction, a decimal, and a mixed number (a whole number plus a proper fraction, such as 3 1/2).

To add or subtract, the calculator cross-multiplies to a common denominator. To multiply, it multiplies the numerators together and the denominators together. To divide, it multiplies the first fraction by the reciprocal of the second. Every result is then divided by the greatest common divisor of its numerator and denominator.`

export const faqItems: FAQItem[] = [
  {
    question: 'How do you add fractions with different denominators?',
    answer: 'Rewrite both fractions over a common denominator, then add the numerators. For 1/2 + 1/3, the common denominator is 6, so 3/6 + 2/6 = 5/6.',
  },
  {
    question: 'How do you divide fractions?',
    answer: 'Multiply the first fraction by the reciprocal of the second (flip it upside down). For example, 3/4 ÷ 3/8 = 3/4 × 8/3 = 24/12 = 2.',
  },
  {
    question: 'What does simplifying a fraction mean?',
    answer: 'Simplifying (or reducing) divides the numerator and denominator by their greatest common divisor until no whole number other than 1 divides both. For example, 6/8 simplifies to 3/4 because both 6 and 8 are divisible by 2.',
  },
  {
    question: 'What is a mixed number?',
    answer: 'A mixed number combines a whole number and a proper fraction. The improper fraction 7/2 equals 3 whole parts with 1/2 left over, written as 3 1/2.',
  },
  {
    question: 'What happens if I divide by a zero fraction?',
    answer: 'Dividing by a fraction whose numerator is 0 is undefined, because it means dividing by zero. The calculator shows a result of 0 instead of an error so the page stays usable while you correct the input.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fractions Calculator',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free fractions calculator that adds, subtracts, multiplies, and divides fractions with simplified, decimal, and mixed-number results.',
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
