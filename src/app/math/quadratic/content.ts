import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A quadratic equation has the form ax² + bx + c = 0, where a, b, and c are numbers and a is not zero. The highest power of x is 2, which is what makes it quadratic. Its graph is a U-shaped curve called a parabola, and the real roots, also called solutions, zeros, or x-intercepts, are the x-values where that parabola crosses the x-axis. Quadratics appear throughout algebra and in real problems involving areas, projectile motion, and profit, so being able to solve them quickly and check your working is useful well beyond the classroom.

How to use this solver: first rearrange your equation into standard form, with every term on one side and 0 on the other. Then type the three coefficients into the boxes in the equation template. The template shows plus signs between the terms, so for x² − 5x + 6 = 0 you enter a = 1, b = −5, and c = 6. If a term is missing, its coefficient is 0, so x² − 9 = 0 has b = 0. The roots update instantly as you type, the number line marks where each real root falls, and a separate card shows the discriminant with a short note on what it means. Roots are shown to six significant digits. Your coefficients are saved in the page address, so you can bookmark or share an equation.

The quadratic formula: every quadratic equation can be solved with x = (−b ± √(b² − 4ac)) / 2a. The ± sign means there are two calculations, one adding the square root and one subtracting it. The solver labels the result of adding as x₁ and the result of subtracting as x₂. Note that the whole top line, not just the square root, is divided by 2a.

The discriminant: the expression under the square root, b² − 4ac, is called the discriminant, and it tells you how many real roots to expect before you solve. A positive discriminant gives two distinct real roots, so the parabola crosses the x-axis twice. A discriminant of zero gives one repeated root, so the parabola just touches the x-axis at its vertex. A negative discriminant means the parabola never touches the x-axis, so there are no real roots, and the solver says No real roots.

Worked example: solve 2x² − 4x − 6 = 0. Here a = 2, b = −4, and c = −6. The discriminant is (−4)² − 4 × 2 × (−6) = 16 + 48 = 64, which is positive, so there are two real roots. The square root of 64 is 8, so x = (4 ± 8) / 4. Adding gives 12 / 4 = 3 and subtracting gives −4 / 4 = −1. The solver shows x₁ = 3, x₂ = −1. You can check by substituting: 2 × 3² − 4 × 3 − 6 = 18 − 12 − 6 = 0.

Two more cases: for x² − 6x + 9 = 0 the discriminant is 36 − 36 = 0, so there is one repeated root, x = 3, because the equation is (x − 3)² = 0. For x² + 2x + 5 = 0 the discriminant is 4 − 20 = −16, so the solver reports No real roots. Not every answer is a whole number. For x² + x − 1 = 0 the discriminant is 5, and the roots are shown as 0.618034 and −1.61803.

A real-world example: a ball is thrown upward from 1.5 metres with a speed of 20 metres per second, and its height after t seconds is −4.9t² + 20t + 1.5. To find when it lands, solve −4.9t² + 20t + 1.5 = 0 by entering a = −4.9, b = 20, and c = 1.5. The discriminant is 429.4, and the solver gives x₁ = −0.0736703 and x₂ = 4.1553. A negative time makes no sense here, so the ball lands after about 4.16 seconds. Because a is negative in this equation, x₁ is the smaller root; when a is positive, x₁ is the larger one.

Interpreting the results: the two roots are always placed symmetrically around the vertex of the parabola, which sits at x = −b / 2a. For 2x² − 4x − 6 = 0 that is x = 1, exactly halfway between −1 and 3. Two quick checks help catch typing errors: the roots add up to −b / a and multiply to c / a. For the worked example, 3 + (−1) = 2 = 4 / 2 and 3 × (−1) = −3 = −6 / 2. If a is positive the parabola opens upward, and if a is negative it opens downward.

Tips: if all three coefficients share a common factor, you can divide it out first without changing the roots, so 2x² − 4x − 6 = 0 has the same roots as x² − 2x − 3 = 0. When the roots are whole numbers, try factoring as well, since it is quicker by hand and the solver lets you confirm the answer. Always substitute at least one root back into the original equation when the result matters.

Common mistakes and limitations: the most frequent mistakes are entering b with the wrong sign, forgetting to move every term to one side before reading off a, b, and c, and, when working by hand, dividing only the square root by 2a. This solver reports real roots only. When the discriminant is negative, the roots are complex numbers, which you can find by hand as −b / 2a ± i√(−(b² − 4ac)) / 2a; for x² + 2x + 5 = 0 they are −1 + 2i and −1 − 2i. If a is 0, the equation is linear rather than quadratic, and the solver shows Not a quadratic equation (a = 0); solve bx + c = 0 directly with x = −c / b. Roots are rounded to six significant digits, so √2 appears as 1.41421. Finally, with decimal coefficients, rounding inside the computer can stop a discriminant that should be exactly zero from coming out as zero. For example, x² − 1.4x + 0.49 = 0 is (x − 0.7)², but the discriminant is computed as a tiny negative number and the solver reports No real roots, while x² − 0.2x + 0.01 = 0 shows two roots that both display as 0.1. If the discriminant shown is extremely close to zero, treat the equation as having one repeated root, or multiply through to whole-number coefficients, such as 100x² − 140x + 49 = 0, before solving.`

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
    question: 'How do I put an equation into standard form?',
    answer: 'Move every term to one side so the other side is 0, then collect like terms. For x² = 5x − 6, subtract 5x and add 6 to both sides to get x² − 5x + 6 = 0, so a = 1, b = −5, and c = 6. A missing term has a coefficient of 0.',
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
