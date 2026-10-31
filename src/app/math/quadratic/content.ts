import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A quadratic equation has the form ax² + bx + c = 0, where a, b, and c are numbers and a is not zero. Its graph is a parabola, and the real roots are the x-values where that parabola crosses the x-axis.

How to use this solver: type the three coefficients directly into the equation. The roots update instantly using the quadratic formula, x = (−b ± √(b² − 4ac)) / 2a, and the number line shows where each real root falls.

The discriminant, b² − 4ac, tells you how many real roots to expect before you solve. A positive discriminant gives two distinct real roots, zero gives one repeated root, and a negative value means the parabola never touches the x-axis, so there are no real roots.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is the quadratic formula?',
    answer: 'The quadratic formula is x = (−b ± √(b² − 4ac)) / 2a. It solves any equation of the form ax² + bx + c = 0. For x² − 5x + 6 = 0, it gives x = (5 ± 1) / 2, so the roots are 3 and 2.',
  },
  {
    question: 'What does the discriminant tell me?',
    answer: 'The discriminant b² − 4ac decides the number of real roots. If it is positive there are two real roots, if it is zero there is exactly one repeated root, and if it is negative there are no real roots (the roots are complex numbers).',
  },
  {
    question: 'Why does the solver say "No real roots"?',
    answer: 'When the discriminant is negative, the square root in the quadratic formula is of a negative number, so the solutions are complex. For example, x² + 1 = 0 has the complex roots i and −i but no real roots. This solver reports real roots only.',
  },
  {
    question: 'What happens if a = 0?',
    answer: 'If a is zero, the x² term disappears and the equation becomes linear (bx + c = 0), so it is not a quadratic. Solve it directly with x = −c / b, or enter a non-zero value for a.',
  },
  {
    question: 'Can I solve a quadratic by factoring instead?',
    answer: 'Yes, when the roots are whole numbers or simple fractions. x² − 5x + 6 factors as (x − 2)(x − 3) = 0, giving roots 2 and 3. The quadratic formula works for every quadratic, including ones that do not factor neatly.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Quadratic Equation Solver',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free quadratic equation solver that finds real roots and the discriminant of ax² + bx + c = 0.',
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
