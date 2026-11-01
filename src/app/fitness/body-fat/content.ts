import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Body fat percentage is the share of your total body weight that is fat tissue. The rest, often called lean mass, includes muscle, bone, organs, water and connective tissue. Body fat percentage is a more useful fitness marker than weight or BMI alone, because two people with the same height and weight can carry very different amounts of muscle and fat. Tracking it over time shows whether changes on the scale come from losing fat, gaining muscle, or both.

Some body fat is essential. It stores energy, cushions organs, insulates the body and is involved in producing hormones. Women naturally carry more essential fat than men, partly because of its role in reproductive health, so healthy ranges differ by sex.

This calculator uses the US Navy circumference method, a tape-measure technique developed by the US Navy to estimate body fat in large groups of service members without lab equipment. The percentage comes from your height and a few body circumferences alone; your weight is only used to split the result into fat mass and lean mass.

How to use this calculator: choose Male or Female, then enter your height, neck and waist measurements in centimeters. If you choose Female, a hip field also appears, because the female formula uses hip circumference as well. The page starts with example values of a male, 177 cm tall, with a 38 cm neck and an 85 cm waist. Your result updates as you type and is shown to one decimal place, together with a category badge and a table of the category ranges for your sex. Your inputs are also saved in the page address, so you can bookmark them and compare later.

How to measure: use a flexible, non-stretch tape and keep it level and snug against the skin without compressing it. Measure the neck just below the larynx (Adam's apple), with the tape sloping slightly downward toward the front. For men, measure the waist horizontally at the level of the navel. For women, measure the waist at its narrowest point, usually a little above the navel, and the hips at the widest point of the buttocks. Stand relaxed, breathe out normally, and do not pull your stomach in. Take each measurement two or three times and use the average.

The formula, in metric units: for men, body fat percentage equals 495 divided by (1.0324 − 0.19077 × log10(waist − neck) + 0.15456 × log10(height)), minus 450. For women, it equals 495 divided by (1.29579 − 0.35004 × log10(waist + hip − neck) + 0.22100 × log10(height)), minus 450. The equations first estimate body density from your measurements and then convert density to a fat percentage. The calculator never shows a value below 0 percent, which can only happen when the measurements entered are not realistic, for example a neck measurement larger than the waist.

A worked example using the default values: for a man who is 177 cm tall with a 38 cm neck and an 85 cm waist, waist minus neck is 47 cm. The base-10 logarithm of 47 is about 1.672 and the logarithm of 177 is about 2.248. The bracket becomes 1.0324 − (0.19077 × 1.672) + (0.15456 × 2.248) ≈ 1.0609. Then 495 ÷ 1.0609 ≈ 466.6, and subtracting 450 gives about 16.6 percent body fat, which falls in the Fitness category. If the same man's waist were 95 cm instead, the result would rise to about 23.7 percent, in the Acceptable category. For a woman who is 165 cm tall with a 33 cm neck, a 72 cm waist and 98 cm hips, the calculator gives about 26.9 percent, also in the Acceptable range.

The categories follow a widely used chart from the American Council on Exercise. For men: Essential is below 6 percent, Athletes 6 to 13 percent, Fitness 14 to 17 percent, Acceptable 18 to 24 percent, and Obese 25 percent or more. For women: Essential is below 14 percent, Athletes 14 to 20 percent, Fitness 21 to 24 percent, Acceptable 25 to 31 percent, and Obese 32 percent or more.

How to interpret your result: the Fitness and Acceptable ranges cover most healthy, active adults. The Athletes range is typical of people who train seriously, and it is not a target everyone needs to reach. Staying near the essential level for long periods can affect hormones, energy and recovery, especially in women. Fat mass is your body weight multiplied by the percentage; for example, an 80 kg person at 16.6 percent carries about 13.3 kg of fat, and the remaining 66.7 kg is lean mass. The calculator shows both figures from the weight you enter.

Practical tips: measure under the same conditions each time, ideally in the morning before eating or exercising, because bloating and fluid shifts change waist size. Use the same tape and the same landmarks, and if possible have someone else help you. Re-measure every two to four weeks rather than daily, and focus on the trend across several readings. A falling waist measurement with a stable neck is usually a good sign of fat loss.

Limitations: the Navy method is an estimate. Studies generally find it lands within about 3 to 4 percentage points of laboratory methods such as DEXA scans for most people, but errors can be larger for very lean people, people with high body fat, and those with unusual body shapes, such as a very muscular neck. Small measuring errors matter, because in the male example above each extra centimeter of waist adds roughly 0.7 percentage points. It does not show where fat is stored, and it is not designed for children or for use during pregnancy. These results are for general information and are not medical advice. If you need an accurate assessment for health reasons, a healthcare provider can recommend a clinical method.`

export const faqItems: FAQItem[] = [
  {
    question: 'How accurate is the US Navy body fat method?',
    answer: 'Studies typically put the Navy tape method within about 3–4 percentage points of DEXA scans for most people. Accuracy depends heavily on consistent, careful measurement, so take each measurement two or three times and use the average.',
  },
  {
    question: 'What is a healthy body fat percentage?',
    answer: 'For men, roughly 14–24% falls in the fitness to acceptable range; for women, roughly 21–31%. Athletes often sit lower, around 6–13% for men and 14–20% for women. Going below essential fat levels (about 6% for men and 14% for women in this chart) is not recommended.',
  },
  {
    question: 'Where should I measure my neck, waist, and hips?',
    answer: 'Measure the neck just below the Adam\'s apple. Men measure the waist level with the navel; women measure it at the narrowest point. Women also measure the hips at the widest part of the buttocks. Keep the tape snug but not tight, and stand relaxed without holding your stomach in.',
  },
  {
    question: 'Why do women need a hip measurement?',
    answer: 'Women tend to store more fat around the hips and thighs. Including the hip circumference makes the female formula a better fit for that distribution, which is why the hip field only appears when Female is selected.',
  },
  {
    question: 'Is body fat percentage better than BMI?',
    answer: 'BMI only uses height and weight, so it cannot tell muscle from fat and can misclassify muscular people as overweight. Body fat percentage estimates how much of your weight is fat, which makes it a better indicator of body composition, although tape-based estimates still have a margin of error.',
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
