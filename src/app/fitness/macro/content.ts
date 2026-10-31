import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Macronutrients, or macros, are the three nutrients that supply calories: protein and carbohydrates provide 4 calories per gram, and fat provides 9 calories per gram. Splitting your daily calories among them in a deliberate ratio helps you support training, recovery, and body composition goals.

How to use this calculator: enter your Total Daily Energy Expenditure (TDEE), the number of calories you burn per day. Choose a goal: Cut sets a 20% calorie deficit, Maintain keeps calories at your TDEE, and Bulk adds a 15% surplus. Then pick a split: Balanced (30% protein, 40% carbs, 30% fat), Low Carb (35/25/40), or High Protein (40/35/25).

The results show your daily calorie target and grams of each macro. The chart shows how your calories are divided between protein, carbs, and fat. Treat these numbers as a starting point and adjust based on how your weight and energy respond over a few weeks.`

export const faqItems: FAQItem[] = [
  {
    question: 'How are macro grams calculated?',
    answer: 'Each macro gets a percentage of your calorie target, which is then divided by its calories per gram. At 2,000 calories on the Balanced split, protein is 30% (600 kcal ÷ 4 = 150 g), carbs are 40% (800 kcal ÷ 4 = 200 g), and fat is 30% (600 kcal ÷ 9 ≈ 67 g).',
  },
  {
    question: 'How big a calorie deficit should I use to lose fat?',
    answer: 'This calculator uses a 20% deficit for cutting, which for a 2,500-calorie TDEE means eating about 2,000 calories per day. Moderate deficits like this support steady fat loss while helping preserve muscle, especially with adequate protein.',
  },
  {
    question: 'Which macro split is best?',
    answer: 'There is no single best split. Balanced suits most people, Low Carb can help those who feel better with fewer carbohydrates, and High Protein is useful during a cut or for heavy strength training. Total calories matter most; the split fine-tunes how you feel and perform.',
  },
  {
    question: 'How do I find my TDEE?',
    answer: 'TDEE is your resting metabolic rate plus the calories you burn through activity. Use a TDEE calculator, which estimates it from your age, sex, height, weight, and activity level, then enter that number here.',
  },
  {
    question: 'Should I hit my macros exactly every day?',
    answer: 'No. Landing within about 5–10% of each target is enough for most goals. Consistency over weeks matters far more than precision on any single day.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Macro Calculator',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free macro calculator for daily protein, carb, and fat targets based on your TDEE and goal.',
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
