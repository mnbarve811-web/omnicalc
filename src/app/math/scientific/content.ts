import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A scientific calculator goes beyond basic arithmetic. It handles powers, roots, logarithms, factorials, and trigonometric functions, and it follows the standard order of operations so that 2 + 3 × 4 gives 14, not 20. This online scientific calculator evaluates a whole expression at once, so you can type a formula the way it appears in your textbook and see the answer immediately.

How to use this calculator: type an expression into the box or build it with the keypad. Function keys such as sin, ln, and √ insert the function name with an opening bracket, so you type the argument and then close the bracket yourself. The result updates as you type. If the expression cannot be worked out, a short message appears in place of the result, such as Missing closing bracket or Result is undefined. Press = or Enter to replace the expression with its result so you can keep calculating from there. The C key clears the expression and the backspace key removes the last character. Every expression and the chosen angle mode are saved in the page address, so you can bookmark or share a calculation exactly as you entered it. Expressions can be up to 500 characters long.

Supported functions: sin, cos, and tan for trigonometry; asin, acos, and atan for the inverse functions (shown as sin⁻¹, cos⁻¹, and tan⁻¹ on the keypad); sinh, cosh, and tanh for the hyperbolic functions; ln for the natural logarithm and log for the base-10 logarithm; sqrt or √ for the square root and cbrt for the cube root; abs for absolute value; and exp for e raised to a power. The operators are + and −, × or * for multiplication, ÷ or / for division, ^ for powers (the x² key inserts ^2), ! for factorial, and % for percent. The constants pi (or π) and e are built in. Function names are not case-sensitive, so SIN(30) works too, and numbers can be written in scientific notation, so 2e3 means 2000.

Order of operations: brackets are worked out first, then powers, then multiplication and division from left to right, then addition and subtraction. Powers are evaluated from right to left, so 2^3^2 means 2^9, which is 512. A minus sign in front of a power applies after the power, so −2^2 is −4, while (−2)^2 is 4. A negative exponent needs no brackets, so 2^-1 gives 0.5. Factorial (!) and percent (%) apply to the number directly before them, so 5! is 120 and 200 × 15% is 30.

Implied multiplication: you can leave out the multiplication sign, just as you would on paper, so 2π, 3(4 + 1), and 5 sin(30) all work. Implied multiplication has the same priority as an ordinary multiplication sign and is worked out from left to right. That means 1/2π is read as (1/2) × π, which is about 1.57079632679, not 1/(2π), which is about 0.159154943092. When in doubt, add brackets.

Degrees and radians: the trigonometric functions sin, cos, and tan read their input in the selected angle mode, and the inverse functions asin, acos, and atan return their answer in that mode. In degrees, sin(30) is 0.5 and atan(1) is 45. In radians, sin(π/2) is 1 and cos(π) is −1. The hyperbolic functions do not use angles, so the mode does not affect them.

Worked example: a 6 metre ladder leans against a wall at 75° to the ground. How high up the wall does it reach? The height is the side opposite the angle, so height = 6 × sin(75°). With the calculator in degree mode, type 6 sin(75) and the result is 5.79555495773, so the ladder reaches about 5.80 metres. To find the hypotenuse of a right triangle with sides 3 and 4, type √(3^2 + 4^2) and the result is exactly 5. To count the ways of choosing 2 items from 4, type 4!/(2! × 2!) and the result is 6.

Precision and how results are shown: results are rounded to 12 significant digits. This hides the tiny errors that computers make with decimal fractions, so 0.1 + 0.2 shows 0.3 rather than 0.30000000000000004, and sin(30) shows 0.5 even though the raw value is a hair below it. Results from the trigonometric functions that are within 10⁻¹⁵ of zero are shown as 0, so sin(180) and cos(90) in degrees both give 0. Very large or very small answers use e notation; for example, 170! shows as 7.25741561531e+306.

When a result is undefined: the calculator reports Result is undefined for division by zero, the square root of a negative number, the logarithm of zero or a negative number, asin or acos of a value outside −1 to 1, tan of 90°, 270°, and other odd multiples of 90° (or of π/2 in radian mode), and factorials larger than 170!. A factorial of a number that is not a whole number, such as 1.5!, gives the message Factorial needs a whole number ≥ 0. Writing sin30 without brackets gives an error because every function needs its argument in brackets.

Common mistakes and limitations: the percent key always means divide by 100, so 200 + 10% gives 200.1, not 220. To add 10% to 200, type 200 + 200 × 10% or 200 × 1.1, both of which give 220. Check the angle mode before any trigonometry; sin(30) in radian mode is about −0.988, which is the most common source of wrong answers. Remember that log is base 10 and ln is base e. A negative number raised to a fractional power, such as (−8)^(1/3), is reported as undefined, so use cbrt(−8), which gives −2. For other roots, use a fractional power such as 16^(1/4), which gives 2. This calculator works with real numbers only: it has no complex numbers, variables, memory keys, or calculation history.`

export const faqItems: FAQItem[] = [
  {
    question: 'Should I use degrees or radians?',
    answer: 'Use degrees for everyday geometry, navigation, and most school trigonometry problems, where a full turn is 360°. Use radians for calculus, physics, and engineering formulas, where a full turn is 2π. Switching the mode changes how sin, cos, and tan read their input and how the inverse functions report their answer. For example, sin(30) is 0.5 in degrees but about −0.988 in radians.',
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
    question: 'How does the percent key work?',
    answer: 'The % sign divides the number directly before it by 100, so 15% is 0.15 and 200 × 15% is 30. It does not add a percentage on top of a number the way some handheld calculators do: 200 + 10% gives 200.1. To increase 200 by 10%, type 200 + 200 × 10% or 200 × 1.1, which both give 220.',
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
