import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A fraction represents part of a whole: the numerator (top number) counts the parts, and the denominator (bottom number) says how many equal parts make up the whole. In 3/4, the whole is split into 4 equal parts and you have 3 of them. This calculator adds, subtracts, multiplies, or divides two fractions and always reduces the answer to lowest terms, so you get the same simplified answer a teacher would expect.

How to use this calculator: pick an operation with the Add, Subtract, Multiply, or Divide buttons, then type the numerator and denominator of each fraction into the stacked boxes. The symbol between the two fractions changes to match the operation you chose. The result updates instantly and is shown three ways: as a simplified fraction, as a decimal rounded to at most four decimal places, and as a mixed number, which is a whole number plus a proper fraction, such as 3 1/2. Your inputs are saved in the page address, so you can bookmark or share a calculation. Use whole numbers in the boxes. To enter a whole number such as 5, type it as 5/1. To enter a negative fraction, put the minus sign in the numerator, for example −1/2.

Entering mixed numbers: the input boxes take simple fractions only, so convert a mixed number to an improper fraction first. Multiply the whole number by the denominator and add the numerator, keeping the same denominator. For 2 1/3, that is 2 × 3 + 1 = 7, so type 7/3. For 1 1/4, it is 1 × 4 + 1 = 5, so type 5/4.

How each operation works: to add two fractions a/b and c/d, the calculator rewrites them over a common denominator by cross-multiplying, giving (a × d + c × b) / (b × d). Subtraction works the same way with a minus sign: (a × d − c × b) / (b × d). To multiply, it multiplies the numerators together and the denominators together: (a × c) / (b × d). To divide, it multiplies the first fraction by the reciprocal of the second, which means flipping the second fraction upside down: (a × d) / (b × c). The product b × d is not always the lowest common denominator, but that does not matter, because every result is then divided by the greatest common divisor of its numerator and denominator. That final step gives the fraction in lowest terms, where no whole number other than 1 divides both the top and the bottom.

Worked example: add 3/4 and 5/6. Cross-multiplying gives a numerator of 3 × 6 + 5 × 4 = 18 + 20 = 38 and a denominator of 4 × 6 = 24, so the unsimplified answer is 38/24. The greatest common divisor of 38 and 24 is 2, so the simplified result is 19/12. As a decimal that is 1.5833, and as a mixed number it is 1 7/12, because 12 goes into 19 once with 7 left over. The same two fractions give different results with the other operations. Multiplying, 3/4 × 5/6 = 15/24, which simplifies to 5/8 or 0.625. Dividing, 3/4 ÷ 5/6 = 3/4 × 6/5 = 18/20, which simplifies to 9/10 or 0.9. Subtracting gives 3/4 − 5/6 = −1/12, a small negative number, because 5/6 is slightly larger than 3/4.

A second example with mixed numbers: to add 2 1/3 and 1 1/4, enter 7/3 and 5/4. The calculator gives 43/12, which is 3.5833 as a decimal and 3 7/12 as a mixed number. Multiplying the same two values gives 35/12, or 2 11/12.

Interpreting the result: an improper fraction such as 19/12 has a numerator larger than its denominator, so it is worth more than 1. The mixed number shows the same value split into whole parts and a remainder, which is often easier to picture in measurements and recipes. If the denominator of the result is 1, the answer is a whole number, and the mixed number box shows just that number. For example, 3/4 ÷ 3/8 is 2. The fraction is always exact, while the decimal may be rounded. 1/3 appears as 0.3333 even though the true decimal repeats forever, so use the fraction when you need an exact answer.

Tips: to work with more than two fractions, combine the first two, then enter the result as the first fraction of the next calculation. To check an addition, subtract one of the original fractions from the result and see whether you get the other one back. When working by hand, simplify before you multiply by cancelling common factors between a numerator and the other fraction's denominator. For 2/3 × 3/4, the 3s cancel and you are left with 2/4, which is 1/2, the same result the calculator gives.

Common mistakes and limitations: the most common mistake when adding by hand is adding the denominators as well as the numerators. 1/2 + 1/3 is not 2/5; it is 5/6, because the fractions must first be written over a common denominator. When dividing, remember to flip the second fraction, not the first. A denominator of 0 is undefined, and dividing by a fraction whose numerator is 0 means dividing by zero. In both cases the calculator shows a result of 0 rather than an error, so if you see an unexpected 0, check that no denominator is 0 and that you are not dividing by zero. The calculator works with two simple fractions at a time and expects whole-number numerators and denominators. To use a decimal such as 0.5, rewrite it as a fraction, such as 1/2, before entering it.`

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
    question: 'How do you multiply fractions?',
    answer: 'Multiply the numerators together and the denominators together, then simplify. For example, 3/4 × 5/6 = 15/24, which simplifies to 5/8. No common denominator is needed for multiplication.',
  },
  {
    question: 'What does simplifying a fraction mean?',
    answer: 'Simplifying (or reducing) divides the numerator and denominator by their greatest common divisor until no whole number other than 1 divides both. For example, 6/8 simplifies to 3/4 because both 6 and 8 are divisible by 2.',
  },
  {
    question: 'How do I enter a mixed number?',
    answer: 'Convert it to an improper fraction first: multiply the whole number by the denominator, add the numerator, and keep the denominator. 2 1/3 becomes 2 × 3 + 1 = 7, so enter 7/3. The result is shown as a mixed number again, so 7/3 + 5/4 gives 43/12, or 3 7/12.',
  },
  {
    question: 'What happens if I divide by a zero fraction?',
    answer: 'Dividing by a fraction whose numerator is 0 is undefined, because it means dividing by zero. The calculator shows a result of 0 instead of an error so the page stays usable while you correct the input. The same happens if any denominator is 0.',
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
