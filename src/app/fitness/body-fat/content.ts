import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Body fat percentage is the share of your total body weight that is fat tissue. It is a more useful health and fitness marker than weight or BMI alone, because two people with the same weight can carry very different amounts of muscle and fat.

This calculator uses the US Navy tape method, which estimates body fat from a few circumference measurements and your height. Men need neck and waist measurements; women also need a hip measurement. Measure the neck just below the larynx, the waist at the navel for men or at the narrowest point for women, and the hips at their widest point. Keep the tape snug but not compressing the skin.

The result is placed into one of five reference categories, from essential fat (the minimum needed for normal body function) through athletes, fitness, acceptable, and obese. Women naturally carry more essential fat than men, so the category ranges differ by sex.`

export const faqItems: FAQItem[] = [
  {
    question: 'How accurate is the US Navy body fat method?',
    answer: 'Studies typically put the Navy tape method within about 3–4 percentage points of DEXA scans for most people. Accuracy depends heavily on consistent, careful measurement, so take each measurement two or three times and use the average.',
  },
  {
    question: 'What is a healthy body fat percentage?',
    answer: 'For men, roughly 14–24% falls in the fitness to acceptable range; for women, roughly 21–31%. Athletes often sit lower, around 6–13% for men and 14–20% for women.',
  },
  {
    question: 'Why do women need a hip measurement?',
    answer: 'Women tend to store more fat around the hips and thighs. Including the hip circumference makes the female formula a better fit for that distribution.',
  },
  {
    question: 'Is body fat percentage better than BMI?',
    answer: 'BMI only uses height and weight, so it cannot tell muscle from fat and can misclassify muscular people as overweight. Body fat percentage measures composition directly, which makes it a better indicator of fitness.',
  },
  {
    question: 'How often should I measure my body fat?',
    answer: 'Every 2–4 weeks is enough to see meaningful trends. Measure at the same time of day, ideally in the morning before eating, to reduce day-to-day variation.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Body Fat Calculator',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free body fat percentage calculator using the US Navy tape measurement method.',
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
