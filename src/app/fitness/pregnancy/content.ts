import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Most due dates are estimated with Naegele's Rule: add 280 days (40 weeks) to the first day of your last menstrual period (LMP). Pregnancy is counted from the LMP rather than conception, so by the time conception happens you are already considered about two weeks pregnant.

How to use this calculator: enter the first day of your last period. The calculator shows your estimated due date, how many full weeks have passed since your LMP, and which trimester you are in. The progress bar marks where you are across the 40 weeks.

Trimesters are grouped as weeks 1 to 12 (first), 13 to 27 (second), and 28 to birth (third). Your due date is an estimate: only about 4% of babies arrive on the exact day, and most are born within two weeks either side. An early ultrasound may adjust the date your provider uses.`

export const faqItems: FAQItem[] = [
  {
    question: 'How accurate is a due date calculated from my last period?',
    answer: "Naegele's Rule assumes a regular 28-day cycle with ovulation on day 14. If your cycles are longer, shorter, or irregular, the estimate can be off by a week or more. A first-trimester ultrasound is usually the most accurate way to date a pregnancy.",
  },
  {
    question: 'Why is pregnancy counted from my last period instead of conception?',
    answer: 'The exact date of conception is rarely known, while the first day of the last period usually is. Counting from the LMP gives providers a consistent starting point, which is why a full-term pregnancy is described as 40 weeks rather than 38.',
  },
  {
    question: 'What are the weeks of each trimester?',
    answer: 'The first trimester covers weeks 1 to 12, the second trimester weeks 13 to 27, and the third trimester week 28 until birth, typically around week 40.',
  },
  {
    question: 'What if my cycle is longer than 28 days?',
    answer: 'With a longer cycle you likely ovulated later, so your actual due date may be later than this estimate. For example, with a 35-day cycle, adding about 7 days to the result is a common adjustment. Your healthcare provider can confirm with an ultrasound.',
  },
  {
    question: 'Is it normal to go past my due date?',
    answer: 'Yes. Many first pregnancies go past 40 weeks. A pregnancy is considered full term from 39 weeks through 40 weeks and 6 days, and late term from 41 weeks. Your provider will usually discuss options if you reach 41 to 42 weeks.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pregnancy Due Date Calculator',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free pregnancy due date calculator using Naegele\'s Rule, with current week and trimester.',
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
