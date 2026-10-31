import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Total Daily Energy Expenditure (TDEE) is the number of calories your body burns in a full day, including everything from breathing and digestion to walking and exercise. It starts with your Basal Metabolic Rate (BMR), the energy needed to keep you alive at complete rest, and scales it up by how active you are.

This calculator uses the Mifflin-St Jeor equation, which research has found to be the most accurate BMR formula for most adults. Enter your biological sex, weight, height, and age, then pick the activity level that best matches a typical week. Your BMR is multiplied by an activity factor from 1.2 (sedentary) to 1.9 (athlete) to estimate TDEE.

The three targets show where to aim depending on your goal: eat about 20% below TDEE to lose fat, at TDEE to maintain your weight, or about 15% above TDEE to build muscle. Treat these as starting points, track your weight for two to three weeks, and adjust by 100–200 calories if progress stalls.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is the difference between BMR and TDEE?',
    answer: 'BMR is the calories your body burns at complete rest just to stay alive. TDEE adds the calories burned through daily movement, exercise, and digesting food. For most people TDEE is 20–90% higher than BMR depending on activity level.',
  },
  {
    question: 'How accurate is the Mifflin-St Jeor equation?',
    answer: 'Mifflin-St Jeor predicts resting metabolic rate within about 10% for most healthy adults, which makes it more reliable than the older Harris-Benedict formula. Individual results vary with muscle mass, genetics, and health conditions.',
  },
  {
    question: 'Which activity level should I choose?',
    answer: 'Choose based on your average week, not your best week. Desk workers who exercise 3–5 times per week usually fit "Moderate". If unsure, pick the lower level — people tend to overestimate how active they are.',
  },
  {
    question: 'How many calories should I eat to lose weight?',
    answer: 'A 20% deficit below TDEE is a sustainable starting point for most people and typically produces about 0.5–1% of body weight lost per week. Larger deficits make it harder to keep muscle and stick to the plan.',
  },
  {
    question: 'Why has my weight stopped changing at the same calorie intake?',
    answer: 'As your weight changes, your TDEE changes too. A lighter body burns fewer calories, so recalculate your TDEE after every 2–4 kg of weight change and adjust your intake accordingly.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'TDEE Calculator',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free TDEE calculator using the Mifflin-St Jeor equation with calorie targets for cutting, maintaining, and bulking.',
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
