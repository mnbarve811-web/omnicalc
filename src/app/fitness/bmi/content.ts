import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Body Mass Index (BMI) is a quick screening measure that compares your weight to your height. It is calculated by dividing your weight in kilograms by the square of your height in meters. A 70 kg adult who is 1.75 m tall has a BMI of 70 / (1.75 × 1.75) ≈ 22.9.

How to use this calculator: enter your weight in kilograms and your height in centimeters. Your BMI updates instantly, along with the weight category it falls into and a marker on the color-coded scale.

The standard adult categories are: under 18.5 is underweight, 18.5 to 24.9 is normal weight, 25 to 29.9 is overweight, and 30 or above is obese. BMI is a population-level screening tool, not a diagnosis. It does not distinguish muscle from fat, so athletes and older adults may be misclassified.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is a healthy BMI?',
    answer: 'For most adults, a BMI between 18.5 and 24.9 is considered a healthy weight range. For someone 170 cm tall, that corresponds to roughly 53–72 kg.',
  },
  {
    question: 'How is BMI calculated?',
    answer: 'BMI equals weight in kilograms divided by height in meters squared. For example, 80 kg at 1.80 m gives 80 / (1.80 × 1.80) ≈ 24.7.',
  },
  {
    question: 'Is BMI accurate for athletes?',
    answer: 'Not always. BMI cannot tell muscle from fat, so muscular people often score as overweight despite low body fat. A body fat measurement gives a better picture in that case.',
  },
  {
    question: 'Does BMI apply to children?',
    answer: 'No. Children and teens use age- and sex-specific BMI percentiles rather than the fixed adult categories shown here.',
  },
  {
    question: 'Should I worry if my BMI is outside the normal range?',
    answer: 'BMI is a screening tool, not a diagnosis. If your result is outside the 18.5–24.9 range, consider discussing it with a healthcare provider, who can assess other factors such as waist size, blood pressure, and activity level.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BMI Calculator',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free BMI calculator showing your Body Mass Index and weight category.',
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
