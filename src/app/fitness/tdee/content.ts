import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Total Daily Energy Expenditure (TDEE) is the number of calories your body burns in a full day. It includes the energy needed to keep your heart beating and your lungs breathing, the energy used to digest food, the calories burned during exercise, and the many small movements of daily life such as walking to the car, doing chores, or fidgeting at your desk. If you eat roughly your TDEE in calories, your weight tends to stay stable over time. Eat less and you lose weight; eat more and you gain it. That makes TDEE the most practical starting point for any nutrition plan.

TDEE is built on your Basal Metabolic Rate (BMR), the energy your body uses at complete rest just to stay alive. For most people BMR accounts for the largest share of daily calorie burn, often around 60 to 70 percent. The rest comes from the thermic effect of food (roughly 10 percent of intake), planned exercise, and non-exercise activity, which varies a lot from person to person and is one reason two people of the same size can have different calorie needs.

How to use this calculator: choose your biological sex, then enter your weight in kilograms, your height in centimeters, and your age in years. Finally, pick the activity level that best describes a typical week. The options are Sedentary (little or no exercise), Light (exercise 1 to 3 days a week), Moderate (3 to 5 days a week), Heavy (6 to 7 days a week), and Athlete (training twice a day). The page starts with example values of a 30-year-old male, 75 kg, 170 cm, with moderate activity, and the results update as soon as you change any input. Your inputs are also saved in the page address, so you can bookmark the result or share it.

The calculator shows four numbers. The first is your BMR in calories per day. Below it are three daily targets: Cut, which is 20 percent below your TDEE; Maintain, which equals your TDEE; and Bulk, which is 15 percent above your TDEE. A bar chart compares the three targets side by side.

The method: BMR is calculated with the Mifflin-St Jeor equation, published in 1990 and widely regarded as the most reliable everyday BMR formula for healthy adults. For men, BMR equals 10 times weight in kilograms, plus 6.25 times height in centimeters, minus 5 times age in years, plus 5. For women the formula is the same except that 161 is subtracted instead of adding 5. Your BMR is then multiplied by an activity factor: 1.2 for Sedentary, 1.375 for Light, 1.55 for Moderate, 1.725 for Heavy, and 1.9 for Athlete. The result is your estimated TDEE.

A worked example using the default values: a 30-year-old man who weighs 75 kg and is 170 cm tall has a BMR of (10 × 75) + (6.25 × 170) − (5 × 30) + 5 = 750 + 1,062.5 − 150 + 5 = 1,667.5, which the calculator rounds to 1,668 calories per day. With Moderate activity, TDEE is 1,667.5 × 1.55 ≈ 2,585 calories per day. The Cut target is 2,585 × 0.8 ≈ 2,068 calories, and the Bulk target is 2,585 × 1.15 ≈ 2,972 calories.

A second example: a 35-year-old woman who weighs 65 kg, is 165 cm tall and exercises lightly has a BMR of 650 + 1,031.25 − 175 − 161 ≈ 1,345 calories. Multiplied by 1.375 for Light activity, her TDEE is about 1,850 calories, with a Cut target of about 1,480 and a Bulk target of about 2,127.

How to interpret your results: treat the Maintain number as an educated starting estimate, not a precise measurement. If you want to lose fat, the Cut target creates a deficit of about 20 percent. In the first example that is around 517 calories a day, or roughly 3,600 calories a week, which by the common rule of thumb of about 7,700 calories per kilogram of body fat works out to a bit under half a kilogram per week at first. Real-world loss is rarely perfectly linear, because water weight fluctuates and your TDEE falls slightly as you get lighter. If your goal is to build muscle, the Bulk target adds a 15 percent surplus, which supports training progress. Pair it with regular strength training and adequate protein so more of the gained weight is muscle.

Practical tips: be honest about your activity level and base it on your average week, not your most active one. Most people overestimate how much they move, so if you are torn between two levels, start with the lower one. Weigh yourself several times a week under the same conditions, such as first thing in the morning, and look at the weekly average rather than single readings. After two to three weeks, compare the trend with what you expected. If your weight is not moving in the direction you want, adjust your intake by 100 to 200 calories and reassess. Recalculate your TDEE after every few kilograms of weight change, since a lighter or heavier body burns a different number of calories.

Limitations: every BMR formula is a population average. Mifflin-St Jeor tends to predict resting energy use within about 10 percent for most healthy adults, but it does not know your body composition, so very muscular people may burn more than predicted and people with higher body fat may burn less. Activity multipliers are broad categories and cannot capture differences in job type, step count or training intensity. The formula is designed for adults and is not suitable for children, and it does not account for pregnancy, breastfeeding, thyroid conditions, or medications that affect metabolism. The results are estimates for general information and are not medical advice. If you have a health condition, are pregnant, or plan a large change in diet, talk to a doctor or registered dietitian before you start.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is the difference between BMR and TDEE?',
    answer: 'BMR is the calories your body burns at complete rest just to stay alive. TDEE adds the calories burned through daily movement, exercise, and digesting food. In this calculator TDEE is BMR multiplied by an activity factor from 1.2 to 1.9, so TDEE is 20–90% higher than BMR depending on activity level.',
  },
  {
    question: 'How accurate is the Mifflin-St Jeor equation?',
    answer: 'Mifflin-St Jeor predicts resting metabolic rate within about 10% for most healthy adults, which makes it more reliable than the older Harris-Benedict formula. Individual results vary with muscle mass, genetics, and health conditions, so use the result as a starting point and adjust based on your actual weight trend.',
  },
  {
    question: 'Which activity level should I choose?',
    answer: 'Choose based on your average week, not your best week. Desk workers who exercise 3–5 times per week usually fit "Moderate". If you are unsure, pick the lower level, because people tend to overestimate how active they are.',
  },
  {
    question: 'How many calories should I eat to lose weight?',
    answer: 'The Cut target in this calculator is 20% below your TDEE, a moderate deficit that suits most people. For a TDEE of 2,585 calories, that means about 2,068 calories per day, or a deficit of roughly 517 calories. Larger deficits make it harder to keep muscle and stick to the plan.',
  },
  {
    question: 'Can I eat fewer calories than my BMR?',
    answer: 'Your BMR is not a minimum you must eat, but eating far below it for long periods makes it hard to get enough protein and nutrients and is difficult to sustain. Most people do well with a moderate deficit from TDEE instead. Very low-calorie diets should only be followed with medical supervision.',
  },
  {
    question: 'Why has my weight stopped changing at the same calorie intake?',
    answer: 'As your weight changes, your TDEE changes too. A lighter body burns fewer calories, so recalculate your TDEE after every 2–4 kg of weight change and adjust your intake accordingly. Water retention can also hide fat loss for a week or two.',
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
