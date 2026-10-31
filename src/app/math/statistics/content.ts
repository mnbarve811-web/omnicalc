import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Descriptive statistics summarize a dataset with a handful of numbers, so you can understand it without reading every value. This statistics calculator takes a list of numbers and reports ten results at once: the count, sum, mean, median, mode, range, minimum, maximum, variance, and standard deviation. It also draws a frequency chart showing how many times each distinct value occurs. It is useful for homework, lab measurements, survey answers, test scores, sports results, or any list of numbers where you want to know the typical value and how spread out the data is.

How to use this calculator: type or paste your numbers into the box, separated by commas, spaces, semicolons, or new lines, for example 12, 15, 15, 18. A column pasted from a spreadsheet, one number per line, works as it is, and negative numbers and decimals such as -3.5 or 0.25 work as normal. Results update instantly as you type, so there is no button to press. Your numbers are saved in the page address, so you can bookmark the page or share the link to show someone the same dataset. Any entry that is not a number, such as a word, a unit, or an empty slot, is skipped. If nothing valid remains, the calculator tells you that no valid numbers were found. Decimal results are shown to at most four decimal places.

Measures of center: the mean is the arithmetic average, found by adding every value and dividing by how many values there are. The median is the middle value once the data is sorted from smallest to largest. With an even number of values there is no single middle value, so the median is the average of the two middle ones. The mode is the value that occurs most often. If two or more values tie for the highest frequency, all of them are listed, so a dataset can have more than one mode. If every distinct value appears the same number of times, as in 1, 2, 3 or 5, 5, 5, no value stands out and the mode is shown as a dash.

Measures of spread: the range is simply the maximum minus the minimum. Variance measures how far values typically sit from the mean. To find it, subtract the mean from each value, square each difference, add the squares together, and divide by the count n. The standard deviation is the square root of the variance, which puts the spread back into the same units as the original data. This calculator uses the population formulas, dividing by n. That is the right choice when your list is the whole group you care about, such as every score in one class. If your numbers are a sample from a larger population and you want to estimate that population's spread, the sample formulas divide by n − 1 instead and give slightly larger results. To convert, multiply the variance shown here by n ÷ (n − 1), then take the square root to get the sample standard deviation.

Worked example: take the eight values 2, 4, 4, 4, 5, 5, 7, 9, which are the calculator's starting data. The count is 8 and the sum is 40, so the mean is 40 ÷ 8 = 5. Sorted, the two middle values are 4 and 5, so the median is 4.5. The value 4 appears three times, more than any other, so the mode is 4. The range is 9 − 2 = 7. The differences from the mean are −3, −1, −1, −1, 0, 0, 2, and 4. Their squares are 9, 1, 1, 1, 0, 0, 4, and 16, which add up to 32. Dividing 32 by 8 gives a population variance of 4, and the standard deviation is √4 = 2. For comparison, the sample variance would be 32 ÷ 7 ≈ 4.5714, with a sample standard deviation of about 2.1381.

A second example shows the effect of an outlier. For 12, 15, 15, 18, 22, 25, 40 the calculator reports a mean of 21, a median of 18, a mode of 15, a range of 28, a variance of about 77.1429, and a standard deviation of about 8.7831. The single large value of 40 pulls the mean above the median, while the median stays put.

Interpreting the results: compare the mean and the median first. When they are close, the data is roughly balanced around its center. When the mean is noticeably larger than the median, a few high values are stretching the data to the right; when it is smaller, a few low values are stretching it to the left. In skewed data such as incomes or house prices, the median is usually the better description of a typical value. The standard deviation tells you the typical distance from the mean. For data that is roughly bell-shaped, about 68% of values fall within one standard deviation of the mean and about 95% within two, but this rule does not hold for strongly skewed or very small datasets. The frequency chart has one bar for each distinct value, which makes repeated values, gaps, and outliers easy to spot.

Tips: enter every observation, including repeats. If a score of 80 occurred three times, type 80 three times, because each entry counts toward the mean, the median, and the mode. Keep all values in the same unit before you paste them, since mixing centimetres and metres will distort every result. If you need to check a single suspicious value, remove it and watch how much the mean and standard deviation change; a large shift means that value has a strong influence on the summary.

Common mistakes and limitations: because commas separate values, do not use thousands separators, since 1,200 is read as two values, 1 and 200; type 1200 instead. Symbols attached to numbers, such as 45% or $5, make an entry invalid and it is ignored. Remember that the variance and standard deviation shown are population values, so a textbook question that asks for the sample standard deviation will expect a slightly larger answer. Finally, this calculator works with a plain list of values. It does not calculate quartiles, percentiles, the interquartile range, weighted means, or statistics for grouped frequency tables.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is the difference between mean and median?',
    answer: 'The mean adds every value and divides by the count, so a single extreme value can pull it up or down. The median is the middle value of the sorted list and is unaffected by outliers. For the data 1, 2, 3, 4, 100 the mean is 22 but the median is 3.',
  },
  {
    question: 'Why does the mode show a dash?',
    answer: 'A mode exists only when some values occur more often than others. If every value appears the same number of times—for example 1, 2, 3, or 5, 5, 5—no value stands out, so no mode is reported. When two or more values tie for the most occurrences, such as 1 and 2 in 1, 1, 2, 2, 3, all of them are listed.',
  },
  {
    question: 'Is this population or sample standard deviation?',
    answer: 'This calculator reports population variance and standard deviation, dividing by n. Sample statistics divide by n − 1 and are slightly larger; use them when your data is a sample drawn from a bigger population. For 2, 4, 4, 4, 5, 5, 7, 9 the population standard deviation is 2, while the sample standard deviation is about 2.1381.',
  },
  {
    question: 'How do I calculate standard deviation by hand?',
    answer: 'Find the mean, subtract it from each value, square each difference, add the squares, divide by the number of values (or by n − 1 for a sample), and take the square root. For 2, 4, 4, 4, 5, 5, 7, 9 the mean is 5, the squared differences add up to 32, 32 ÷ 8 = 4, and √4 = 2.',
  },
  {
    question: 'What does the standard deviation tell me?',
    answer: 'It describes the typical distance between a value and the mean. A small standard deviation means values cluster tightly around the mean; a large one means they are widely spread. For roughly bell-shaped data, about 68% of values fall within one standard deviation of the mean and about 95% fall within two.',
  },
  {
    question: 'How do I enter my data?',
    answer: 'Separate the numbers with commas, spaces, semicolons, or new lines, for example 3, 7, 7, 10. A column copied from a spreadsheet, one number per line, can be pasted as it is. Do not use thousands separators (1,200 is read as 1 and 200), and leave out symbols such as % or $, because entries that are not plain numbers are skipped.',
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
