import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Descriptive statistics summarize a dataset with a handful of numbers. The mean is the arithmetic average, the median is the middle value once the data is sorted, and the mode is the value that appears most often. Together they describe where the "center" of your data sits.

How to use this calculator: type or paste your numbers separated by commas. Results update instantly, including count, sum, minimum, maximum, range, variance, and standard deviation. Non-numeric entries are ignored.

Variance and standard deviation measure spread—how far values typically fall from the mean. This calculator uses the population formulas (dividing by n). The frequency chart shows how often each value occurs, making clusters and outliers easy to spot.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is the difference between mean and median?',
    answer: 'The mean adds every value and divides by the count, so a single extreme value can pull it up or down. The median is the middle value of the sorted list and is unaffected by outliers. For the data 1, 2, 3, 4, 100 the mean is 22 but the median is 3.',
  },
  {
    question: 'Why does the mode show a dash?',
    answer: 'A mode exists only when some values occur more often than others. If every value appears the same number of times—for example 1, 2, 3, or 5, 5, 5—no value stands out, so no mode is reported.',
  },
  {
    question: 'Is this population or sample standard deviation?',
    answer: 'This calculator reports population variance and standard deviation, dividing by n. Sample statistics divide by n − 1 and are slightly larger; use them when your data is a sample drawn from a bigger population.',
  },
  {
    question: 'What does the standard deviation tell me?',
    answer: 'It describes the typical distance between a value and the mean. For roughly bell-shaped data, about 68% of values fall within one standard deviation of the mean and about 95% fall within two.',
  },
  {
    question: 'How is the range calculated?',
    answer: 'The range is the largest value minus the smallest. For 3, 1, 7, 2 the range is 7 − 1 = 6. It is a quick measure of spread but is sensitive to outliers.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Statistics Calculator',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free statistics calculator for mean, median, mode, range, variance, and standard deviation.',
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
