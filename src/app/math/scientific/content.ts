import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A scientific calculator goes beyond basic arithmetic. It handles powers, roots, logarithms, factorials, and trigonometric functions, and it follows the standard order of operations so that 2 + 3 × 4 gives 14, not 20.

How to use this calculator: type an expression into the box or build it with the keypad. The result updates as you type. Press = or Enter to replace the expression with its result so you can keep calculating from there. Every expression is saved in the page address, so you can bookmark or share a calculation exactly as you entered it.

Order of operations: brackets are worked out first, then powers (^) from right to left, then multiplication and division, then addition and subtraction. A minus sign in front of a power applies after the power, so −2^2 is −4. Factorial (!) and percent (%) apply to the number directly before them, so 200 × 15% is 30.

Degrees and radians: the trigonometric functions sin, cos, and tan read their input in the selected angle mode, and the inverse functions asin, acos, and atan return their answer in that mode. In degrees, sin(30) is 0.5. In radians, sin(π/2) is 1.

You can also write implied multiplication, such as 2π or 3(4 + 1), just as you would on paper.`

export const faqItems: FAQItem[] = [
  {
    question: 'Should I use degrees or radians?',
    answer: 'Use degrees for everyday geometry, navigation, and most school trigonometry problems, where a full turn is 360°. Use radians for calculus, physics, and engineering formulas, where a full turn is 2π. Switching the mode changes how sin, cos, and tan read their input and how the inverse functions report their answer.',
  },
  {
    question: 'What is the difference between log and ln?',
    answer: 'log is the base-10 logarithm, so log(1000) = 3 because 10³ = 1000. ln is the natural logarithm with base e (about 2.71828), so ln(e) = 1. Both are undefined for zero and negative numbers.',
  },
  {
    question: 'Why does tan(90) say the result is undefined?',
    answer: 'The tangent of 90° (and 270°, 450°, and so on) is sin divided by cos, and cos is zero at those angles, so the value is undefined. The same applies to dividing by zero, the square root of a negative number, and the logarithm of zero or a negative number.',
  },
  {
    question: 'How does the factorial button work?',
    answer: 'n! multiplies every whole number from 1 up to n, so 5! = 5 × 4 × 3 × 2 × 1 = 120, and 0! is defined as 1. Factorials only work on whole numbers of zero or more. Results above 170! are too large to represent and show as undefined.',
  },
  {
    question: 'How many digits of precision does the calculator show?',
    answer: 'Results are rounded to 12 significant digits. This hides tiny floating-point errors, so 0.1 + 0.2 shows 0.3 rather than 0.30000000000000004, while still giving more precision than most handheld calculators.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Scientific Calculator',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free online scientific calculator with trigonometry, logarithms, powers, roots, and factorials in degrees or radians.',
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
