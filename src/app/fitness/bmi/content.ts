import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Body Mass Index (BMI) is a simple number that compares your weight with your height. It was developed in the nineteenth century by the Belgian statistician Adolphe Quetelet and is now used by doctors, public health agencies and researchers around the world as a quick first check of whether a person's weight falls in a range associated with lower health risk. Because it only needs two measurements and no special equipment, BMI is one of the most widely used screening tools in health care.

BMI is a screening measure, not a diagnosis. It tells you how your weight relates to your height, but it does not measure body fat directly, and it does not tell you anything about fitness, diet, blood pressure or other markers of health. It is best used as a starting point for a conversation, alongside other measurements.

How to use this calculator: enter your weight in kilograms and your height in centimeters. The page starts with example values of 70 kg and 170 cm. Your BMI updates instantly as you type and is shown to one decimal place together with its weight category. A color-coded scale running from 10 to 45 places a marker at your result, and a table lists all four adult categories with your current category highlighted. Your inputs are also saved in the page address, so you can bookmark or share a result.

If you know your weight in pounds or your height in feet and inches, convert them first. One pound is about 0.4536 kg, so 154 lb is about 69.9 kg. One inch is 2.54 cm, so 5 feet 7 inches (67 inches) is about 170 cm.

The formula: BMI equals your weight in kilograms divided by the square of your height in meters. The calculator converts your height from centimeters to meters by dividing by 100, squares it, and divides your weight by that number. The result is expressed in kilograms per square meter, although it is usually written without units.

A worked example using the default values: a height of 170 cm is 1.70 m. Squared, that is 1.70 × 1.70 = 2.89. A weight of 70 kg divided by 2.89 gives 24.22, which the calculator displays as 24.2. That falls in the Normal weight category, close to its upper edge. A second example: a person who weighs 85 kg and is 178 cm tall has a squared height of 1.78 × 1.78 = 3.1684, and 85 divided by 3.1684 gives a BMI of 26.8, which falls in the Overweight category.

The categories used by this calculator are the standard adult cut-offs from the World Health Organization. A BMI below 18.5 is classed as Underweight, 18.5 to 24.9 is Normal weight, 25.0 to 29.9 is Overweight, and 30.0 or above is Obese. Clinicians often divide the obese range further into classes, with 30 to 34.9 as class 1, 35 to 39.9 as class 2, and 40 or above as class 3, but this calculator groups them into a single Obese category.

How to interpret your result: a BMI in the Normal weight range is associated, on average across large populations, with a lower risk of conditions such as type 2 diabetes, high blood pressure and heart disease. Risk tends to rise gradually as BMI moves further above 25, and a BMI below 18.5 can be linked to nutritional deficiencies, reduced bone density and a weaker immune system. These are population trends, though. A single number does not tell you whether you personally are healthy or unhealthy.

You can also work backward to find the healthy weight range for your height by multiplying your squared height in meters by 18.5 and by 24.9. For someone 170 cm tall, that gives 2.89 × 18.5 ≈ 53.5 kg and 2.89 × 24.9 ≈ 72.0 kg, so a weight between about 53.5 and 72 kg would fall in the Normal weight range.

Practical tips: weigh yourself at a consistent time, ideally in the morning after using the bathroom and before eating, because body weight can shift by a kilogram or more during the day. Measure your height without shoes, standing straight against a wall. Look at trends over weeks and months rather than reacting to one reading. For a fuller picture, pair BMI with a waist measurement: a waist above about 102 cm for men or 88 cm for women is widely used as a sign of higher health risk, even when BMI is in the normal range.

Limitations: BMI cannot tell muscle from fat. Muscular people and athletes often score as Overweight despite having little body fat, while older adults who have lost muscle may score as Normal weight while carrying more fat than is ideal. It does not show where fat is stored, and fat around the abdomen carries more risk than fat on the hips and thighs. The same cut-offs may not suit every population; for example, the World Health Organization has noted that health risks can rise at lower BMI values in many Asian populations, and some countries use lower thresholds for that reason. The adult categories do not apply to children and teenagers, who are assessed with age- and sex-specific percentiles, and BMI is not meaningful during pregnancy. This calculator gives an estimate for general information only and is not medical advice. If your result is outside the Normal weight range or you have concerns about your weight, a healthcare provider can assess it in the context of your overall health.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is a healthy BMI?',
    answer: 'For most adults, a BMI between 18.5 and 24.9 is considered a healthy weight range. For someone 170 cm tall, that corresponds to roughly 53.5–72 kg.',
  },
  {
    question: 'How is BMI calculated?',
    answer: 'BMI equals weight in kilograms divided by height in meters squared. For example, 70 kg at 1.70 m gives 70 / (1.70 × 1.70) ≈ 24.2, and 80 kg at 1.80 m gives 80 / (1.80 × 1.80) ≈ 24.7.',
  },
  {
    question: 'Is BMI accurate for athletes?',
    answer: 'Not always. BMI cannot tell muscle from fat, so muscular people often score as overweight despite low body fat. A body fat estimate, such as the US Navy tape method, gives a better picture in that case.',
  },
  {
    question: 'Is BMI different for men and women?',
    answer: 'No. The adult BMI formula and categories are the same for men and women. Women tend to carry more body fat than men at the same BMI, which is one reason BMI is only a rough guide to body composition.',
  },
  {
    question: 'Does BMI apply to children?',
    answer: 'No. Children and teens use age- and sex-specific BMI percentiles rather than the fixed adult categories shown here, because body composition changes as they grow.',
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
