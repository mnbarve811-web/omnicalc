import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A date difference calculator tells you how much time lies between two calendar dates. This one gives the answer two ways at once: as a breakdown in years, months, and days, the way people usually describe ages and anniversaries, and as a single total number of days, the way contracts, deadlines, and countdowns are often measured. Common uses include working out someone's exact age, how long you have been in a job or a relationship, how many days remain until a holiday or a due date, how long a project or lease ran, and whether a warranty or return window has passed.

How to use this calculator: pick a start date and an end date using the two date fields. When the page first opens, the start date is set to one year ago and the end date to today, so you see a one-year example straight away. The results update the moment you change either date. Four cards show Years, Months, Days, and Total Days, and a sentence underneath spells out the answer in words, such as "From Mar 15, 2024 to Oct 31, 2026 is 2 years, 7 months, and 16 days." The dates are saved in the page address, so you can bookmark the result or share a link that opens with the same two dates already filled in.

The order of the dates does not matter. If the end date is earlier than the start date, the calculator simply swaps them and measures from the earlier date to the later one, so every result is shown as a positive number. It does not label the answer as being in the past or the future, which means you can use it equally for "how long ago" and "how long until" questions.

How total days are counted: the total is the number of days that pass between the two dates. In practice this counts the end date but not the start date, which is the same as counting how many midnights you cross. Two identical dates give 0 days, and a Monday to the following Tuesday gives 1 day. Leap years are handled automatically because the count follows the real calendar: January 1, 2024 to January 1, 2025 is 366 days because 2024 contained February 29, while January 1, 2026 to January 1, 2027 is 365 days. Both are shown as exactly 1 year in the breakdown.

How the years, months, and days breakdown works: the calculator steps forward from the start date in whole years as far as it can without passing the end date. From there it steps forward in whole calendar months, again stopping before it would overshoot, and whatever is left over is the number of days. Because calendar months have 28, 29, 30, or 31 days, the breakdown follows the actual months between your dates rather than assuming every month is 30 days long.

Worked example one, a duration. From March 15, 2024 to October 31, 2026, stepping forward whole years lands on March 15, 2026, which is 2 years. Stepping forward whole months from there lands on October 15, 2026, which is 7 more months. That leaves 16 days to reach October 31. The calculator shows 2 years, 7 months, and 16 days, with a total of 960 days.

Worked example two, an exact age. For someone born on June 15, 1990, entering that birth date as the start and October 31, 2026 as the end gives 36 years, 4 months, and 16 days. The total is 13,287 days, a fun figure to know for milestone celebrations such as a 10,000th or 15,000th day.

Worked example three, a school year. From September 2, 2025 to June 26, 2026 the calculator shows 0 years, 9 months, and 24 days, or 297 days in total. Every one of these results was produced by the same calculation that runs on this page.

Interpreting the results: the breakdown and the total describe the same span in different units, so use whichever suits the question. Ages, tenure, and anniversaries are usually quoted as years, months, and days. Notice periods, visa stays, interest calculations, and countdowns are usually quoted in days. To turn the total into weeks, divide by 7: 960 days is 137 weeks and 1 day. To estimate years from a day count, divide by about 365.25.

Tips: decide whether you need to include both the first and the last day. The total here excludes the start date, which matches how hotel nights or days elapsed are counted. If you need an inclusive count, such as the number of calendar days a festival or a trip runs including both the first and last day, add 1 to the total. For an age, put the date of birth in the start field and today's date, or the date you care about, in the end field. When a legal or financial deadline is involved, check whether the rule counts calendar days or business days, and whether the starting day counts, because the rules vary.

Limitations: this calculator works with whole dates only, so it does not account for times of day, hours, minutes, or time zones of the events themselves. It counts calendar days, not business days, and it does not skip weekends or public holidays. It measures the gap between two dates but does not add or subtract a number of days from a date to find a new one. When the start date falls on the 29th, 30th, or 31st, or either date sits right at the start or end of a month, the months-and-days split can differ by a day or more from other tools or from counting by hand, because months have different lengths and there is no single agreed rule for what "one month after January 31" means. The Total Days figure is not affected by this, so rely on it when an exact count matters. Both date fields need a value for the results to be calculated.`

export const faqItems: FAQItem[] = [
  {
    question: 'How do I calculate the number of days between two dates?',
    answer: 'Enter the earlier date as the start and the later date as the end, and read the Total Days result. For example, March 15, 2024 to October 31, 2026 is 960 days. The count includes the end date but not the start date, so two identical dates give 0 days.',
  },
  {
    question: 'Does the date calculator include the end date?',
    answer: 'The total counts the days that pass between the two dates, which includes the end date but not the start date. Monday to the following Tuesday is 1 day. If you need to count both the first and last day, such as the days a trip runs, add 1 to the total.',
  },
  {
    question: 'How do I calculate my exact age in years, months, and days?',
    answer: 'Put your date of birth in the start date field and today\'s date in the end date field. Someone born on June 15, 1990 is 36 years, 4 months, and 16 days old on October 31, 2026, which is 13,287 days in total.',
  },
  {
    question: 'What happens if the end date is before the start date?',
    answer: 'The calculator swaps the two dates and measures from the earlier one to the later one, so the result is always positive. October 31, 2026 to March 15, 2024 gives the same 2 years, 7 months, 16 days, and 960 total days as the dates in the usual order.',
  },
  {
    question: 'How does the calculator handle leap years?',
    answer: 'It follows the real calendar, so February 29 is counted whenever it falls between your dates. January 1, 2024 to January 1, 2025 is 366 days because 2024 was a leap year, while January 1, 2026 to January 1, 2027 is 365 days. Both show as exactly 1 year.',
  },
  {
    question: 'How many weeks are between two dates?',
    answer: 'Divide the Total Days result by 7. The calculator does not show weeks directly, but 960 days, for example, is 137 weeks and 1 day. For whole weeks only, ignore the remainder.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Date Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free date calculator that finds the difference between two dates in years, months, days, and total days.',
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
