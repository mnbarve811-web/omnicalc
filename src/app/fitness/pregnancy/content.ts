import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A pregnancy due date, also called the estimated date of delivery, is the day a pregnancy reaches 40 weeks. It helps you and your healthcare team plan prenatal visits, schedule screening tests at the right time, and keep track of how the baby is developing. It is an estimate rather than a deadline: most babies are born in the weeks around the due date, not on it.

Pregnancy is counted from the first day of your last menstrual period (LMP), not from the day of conception. That is because the first day of a period is usually easy to remember, while the exact day of ovulation and conception is rarely known. In a typical 28-day cycle, ovulation happens around day 14, so by the time conception occurs you are already considered about two weeks pregnant. This is why a full-term pregnancy is described as 40 weeks, even though the baby develops for about 38 weeks after conception.

How to use this calculator: enter the first day of your last menstrual period in the date field. The calculator then shows three results. Due Date is your estimated date of delivery. Current Week is the number of full weeks that have passed since your LMP, shown as Week X of 40. Trimester tells you whether you are in the first, second or third trimester. A progress bar divided into the three trimesters marks where you are across the 40 weeks. When the page first opens, the date is set to ten weeks before today as an example, so remember to replace it with your own date. Your date is stored in the page address, so you can bookmark the page; keep in mind that anyone you share the link with will see the date you entered.

The method: this calculator uses Naegele's Rule, the standard method clinicians have used for well over a century. It adds 280 days, which is exactly 40 weeks, to the first day of your LMP. A common shortcut gives the same answer: add one year, subtract three months, and add seven days. To find your current week, the calculator counts the days from your LMP to today and divides by seven, counting only completed weeks. The week shown is capped at 42, and it shows 0 if fewer than seven days have passed or if the date entered is in the future.

Trimesters in this calculator are grouped by completed weeks: weeks 0 to 12 are the first trimester, weeks 13 to 27 are the second, and week 28 onward is the third. Some sources draw the boundaries a week differently, for example ending the first trimester at the end of week 13, so you may see slightly different groupings elsewhere.

A worked example: suppose the first day of your last period was January 1, 2026. Adding 280 days gives a due date of October 8, 2026. The shortcut agrees: January 1 plus one year, minus three months, plus seven days is October 8. If today were April 15, 2026, then 104 days would have passed since the LMP. That is 14 full weeks and 6 days, so the calculator would show Week 14 of 40 and place you in the second trimester. On April 1, 2026, 90 days after the LMP, it would show Week 12 and the first trimester, and on July 20, 2026, it would show Week 28 and the third trimester.

How to interpret your results: clinicians often write gestational age as weeks plus days, so the example above would be written as 14+6, meaning 14 weeks and 6 days. The calculator shows only the completed weeks. Your due date marks 40 weeks, but a full-term birth is defined as one between 39 weeks and 40 weeks 6 days. Births from 37 weeks to 38 weeks 6 days are called early term, and from 41 weeks they are called late term. Only a small share of babies, often quoted at around 4 to 5 percent, arrive on the exact due date. It is more helpful to think of the due date as the middle of a window of several weeks.

Practical tips: if you are not sure of the first day of your last period, use your best estimate and tell your healthcare provider that the date is uncertain. Note your cycle length too, because it affects how accurate the estimate is. Use the current week to follow general information about each stage of pregnancy, and bring your questions to your prenatal appointments.

Limitations: Naegele's Rule assumes a regular 28-day cycle with ovulation around day 14. If your cycles are longer, shorter or irregular, or if you recently stopped hormonal contraception or were breastfeeding, the estimate may be off by a week or more. The calculator does not adjust for cycle length and does not support dating from a known conception or embryo transfer date, as with IVF. Your healthcare provider will confirm your due date, usually with an ultrasound. An ultrasound in the first trimester, which measures the length of the embryo or fetus, is generally considered the most accurate way to date a pregnancy, and your provider may change your due date based on it. This calculator is for general information only and is not medical advice. If you think you may be pregnant, or have any concerns during pregnancy, contact a healthcare provider.`

export const faqItems: FAQItem[] = [
  {
    question: 'How accurate is a due date calculated from my last period?',
    answer: "Naegele's Rule assumes a regular 28-day cycle with ovulation on day 14. If your cycles are longer, shorter, or irregular, the estimate can be off by a week or more. A first-trimester ultrasound is usually the most accurate way to date a pregnancy, and your healthcare provider will confirm the date you should use.",
  },
  {
    question: 'How is my due date calculated?',
    answer: "This calculator adds 280 days (40 weeks) to the first day of your last menstrual period, known as Naegele's Rule. For example, an LMP of January 1, 2026 gives a due date of October 8, 2026. The shortcut of adding one year, subtracting three months, and adding seven days gives the same result.",
  },
  {
    question: 'Why is pregnancy counted from my last period instead of conception?',
    answer: 'The exact date of conception is rarely known, while the first day of the last period usually is. Counting from the LMP gives providers a consistent starting point, which is why a full-term pregnancy is described as 40 weeks rather than 38.',
  },
  {
    question: 'What are the weeks of each trimester?',
    answer: 'This calculator places weeks 0 to 12 in the first trimester, weeks 13 to 27 in the second, and week 28 until birth in the third, which is typically around week 40. Some sources end the first trimester at week 13 or 14, so groupings can differ by a week.',
  },
  {
    question: 'What if my cycle is longer than 28 days?',
    answer: 'With a longer cycle you likely ovulated later, so your actual due date may be later than this estimate. For example, with a 35-day cycle, adding about 7 days to the result is a common adjustment. Your healthcare provider can confirm the date with an ultrasound.',
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
