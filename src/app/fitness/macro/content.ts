import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Macronutrients, or macros, are the three nutrients that supply most of the calories in your diet: protein, carbohydrates and fat. Protein and carbohydrates provide about 4 calories per gram, and fat provides about 9 calories per gram. Each plays a different role. Protein supplies the building blocks for muscle and other tissues and helps you feel full. Carbohydrates are the body's preferred fuel for higher-intensity exercise and help refill muscle glycogen. Fat supports hormone production, helps you absorb vitamins A, D, E and K, and provides a dense source of energy.

Counting macros means setting a daily calorie target and then dividing it among those three nutrients in a deliberate ratio. Total calories largely decide whether you lose, maintain or gain weight, while the macro split influences how full you feel, how well you train and recover, and how much muscle you keep or build along the way.

How to use this calculator: start by entering your Total Daily Energy Expenditure (TDEE), the number of calories you burn in a typical day. If you do not know it, a TDEE calculator can estimate it from your age, sex, height, weight and activity level. Next, choose a goal. Cut sets your calorie target 20 percent below your TDEE, Maintain keeps it equal to your TDEE, and Bulk sets it 15 percent above your TDEE. Then choose a split. Balanced uses 30 percent protein, 40 percent carbohydrates and 30 percent fat. Low Carb uses 35 percent protein, 25 percent carbohydrates and 40 percent fat. High Protein uses 40 percent protein, 35 percent carbohydrates and 25 percent fat. The page starts with a TDEE of 2,000 calories, the Maintain goal and the Balanced split, and the results update as soon as you change anything. Your choices are saved in the page address, so you can bookmark them.

The results show four cards: your daily calorie target and your daily grams of protein, carbohydrates and fat, each rounded to the nearest whole number. A donut chart shows how your calories are divided among the three macros.

The method: first, your TDEE is multiplied by the goal factor (0.8 for Cut, 1.0 for Maintain, 1.15 for Bulk) to get your calorie target. Next, each macro's percentage is applied to that target to find how many calories come from it. Finally, protein and carbohydrate calories are divided by 4, and fat calories by 9, to convert them to grams.

A worked example: suppose your TDEE is 2,600 calories and you choose Cut with the Balanced split. Your calorie target is 2,600 × 0.8 = 2,080 calories. Protein gets 30 percent, or 624 calories, which is 624 ÷ 4 = 156 g. Carbohydrates get 40 percent, or 832 calories, which is 832 ÷ 4 = 208 g. Fat gets 30 percent, or 624 calories, which is 624 ÷ 9 ≈ 69 g. Switching to High Protein at the same calorie target gives 208 g of protein, 182 g of carbohydrates and about 58 g of fat. Switching to Low Carb gives 182 g of protein, 130 g of carbohydrates and about 92 g of fat. With the default settings of 2,000 calories, Maintain and Balanced, the targets are 150 g of protein, 200 g of carbohydrates and about 67 g of fat.

How to interpret your results: the gram targets are daily averages to aim for, not limits you must hit exactly. A useful way to check the protein number is to compare it with your body weight. For people who do regular strength training, an intake of roughly 1.6 to 2.2 g of protein per kilogram of body weight is commonly recommended, and the upper part of that range is often suggested during a calorie deficit to help preserve muscle. In the example above, 156 g of protein would be about 1.95 g per kilogram for someone who weighs 80 kg. Because this calculator sets protein as a percentage of calories, the gram amount rises and falls with your calorie target, so on a low calorie target it may be worth choosing the High Protein split, and on a large bulk you may find the Balanced split already gives more protein than you need.

Practical tips: build most meals around a protein source, such as lean meat, fish, eggs, dairy, tofu or legumes, then add carbohydrates and fats to fill the rest of your targets. Choose mostly minimally processed foods, which supply fiber, vitamins and minerals that macro numbers do not track. A food scale and a tracking app make it much easier to learn portion sizes during the first few weeks. Remember that alcohol provides about 7 calories per gram and is not part of the three macros, so drinks still count toward your total calories. Review your progress every two to four weeks. If your weight is not changing as expected, adjust total calories first, by about 100 to 200 a day, before changing the split.

Limitations: these targets are only as accurate as the TDEE you enter, and any TDEE figure is an estimate. The three splits are general templates, not personalized prescriptions, and they do not account for food preferences, training type, or medical conditions such as diabetes or kidney disease, which can change how much of each macro is appropriate. The calculator also does not set targets for fiber, micronutrients or water. The results are for general information and are not medical advice. If you have a health condition, are pregnant or breastfeeding, or are an adolescent, speak with a doctor or registered dietitian before following a structured macro plan.`

export const faqItems: FAQItem[] = [
  {
    question: 'How are macro grams calculated?',
    answer: 'Each macro gets a percentage of your calorie target, which is then divided by its calories per gram. At 2,000 calories on the Balanced split, protein is 30% (600 kcal ÷ 4 = 150 g), carbs are 40% (800 kcal ÷ 4 = 200 g), and fat is 30% (600 kcal ÷ 9 ≈ 67 g).',
  },
  {
    question: 'How much protein do I need per day?',
    answer: 'For people who do regular strength training, about 1.6–2.2 g of protein per kilogram of body weight is commonly recommended, with the higher end often used during a calorie deficit. This calculator sets protein as a percentage of calories, so divide the protein grams it shows by your body weight to check where you land.',
  },
  {
    question: 'How big a calorie deficit should I use to lose fat?',
    answer: 'This calculator uses a 20% deficit for cutting, which for a 2,500-calorie TDEE means eating about 2,000 calories per day. Moderate deficits like this support steady fat loss while helping preserve muscle, especially with adequate protein.',
  },
  {
    question: 'Which macro split is best?',
    answer: 'There is no single best split. Balanced (30/40/30) suits most people, Low Carb (35/25/40) can help those who feel better with fewer carbohydrates, and High Protein (40/35/25) is useful during a cut or for heavy strength training. Total calories matter most; the split fine-tunes how you feel and perform.',
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
