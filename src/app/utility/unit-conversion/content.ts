import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `A unit converter restates a measurement in a different unit without changing the quantity itself. Six feet and 1.8288 meters describe exactly the same length; they are simply written on different scales. Conversions come up all the time: following a recipe written in cups when your measuring jug is marked in milliliters, checking a tire pressure listed in psi against a gauge that reads kilopascals, translating a race distance from kilometers to miles, or comparing a forecast in Fahrenheit with one in Celsius. This converter covers seven categories of measurement: length, weight, volume, temperature, speed, area, and pressure.

These are the units available in each category. Length: meters (m), kilometers (km), miles (mi), feet (ft), inches (in), centimeters (cm), and yards (yd). Weight: kilograms (kg), grams (g), pounds (lb), ounces (oz), and metric tonnes (t, equal to 1,000 kilograms). Volume: liters (L), milliliters (mL), US gallons (gal), US fluid ounces (fl oz), US cups, US pints (pt), and US quarts (qt). Temperature: Celsius (C), Fahrenheit (F), and Kelvin (K). Speed: meters per second (m/s), kilometers per hour (km/h), miles per hour (mph), and knots. Area: square meters, square kilometers, square feet, acres, square miles, and square centimeters. Pressure: pascals (Pa), kilopascals (kPa), bar, pounds per square inch (psi), and standard atmospheres (atm).

How to use this converter: choose a category first. Switching category resets the From and To boxes to the first two units in that category, so picking Weight starts you at kilograms to grams. Type the number you want to convert in the Value box, then choose the unit you are converting from and the unit you are converting to. The result updates as you type and is shown to seven significant figures. The line beneath it shows the conversion factor, meaning how many of the target unit one source unit is worth, for example "1 km = 0.621371 mi". Your choices are saved in the page address, so you can bookmark a conversion you use often or send the link to someone else.

How the conversion works: for every category except temperature, each unit has a fixed factor that says how much it is worth in a base unit. The base units are the meter, kilogram, liter, meter per second, square meter, and pascal. To convert, the calculator multiplies your value by the factor of the unit you are converting from and divides by the factor of the unit you are converting to. A mile is 1,609.344 meters and a kilometer is 1,000 meters, so 10 kilometers becomes 10 × 1,000 ÷ 1,609.344, which is 6.213712 miles. Because these conversions are pure ratios, they scale in a straight line: doubling the input doubles the output, and zero always converts to zero.

Temperature works differently because the three scales do not share the same zero point. The calculator first turns your value into Celsius and then into the target scale. To go from Fahrenheit to Celsius, subtract 32 and multiply by 5/9. To go from Celsius to Fahrenheit, multiply by 9/5 and add 32. To go from Celsius to Kelvin, add 273.15. Since one degree Celsius is not a fixed number of degrees Fahrenheit, the line under a temperature result restates your full conversion instead of a "1 unit equals" factor.

Worked examples, all produced by this converter: 150 pounds is 68.0388 kilograms. 5 US gallons is 18.92705 liters. 32 psi, a common car tire pressure, is 220.6323 kilopascals. 65 miles per hour is 104.6074 kilometers per hour. A body temperature of 98.6 °F is exactly 37 °C, and 25 °C is 298.15 K. One handy check: minus 40 is the same temperature in both Celsius and Fahrenheit, and the converter shows -40 °F as -40 °C.

Interpreting the result: seven significant figures is more precision than most everyday tasks need, so round to match how precisely you measured in the first place. If you measured a board as roughly 6 feet, calling it 1.83 meters is more honest than 1.8288. Very large or very small results are shown in scientific notation; converting 1 square centimeter to square miles gives 3.861004e-11, which means 3.861004 × 10 to the power of -11. The conversion factor line is useful when you need to convert many values by hand or in a spreadsheet: multiply each value by that one number.

Tips for avoiding common mistakes. The gallon, cup, pint, quart, and fluid ounce here are US customary measures. A UK imperial gallon is about 4.546 liters rather than 3.785, and imperial pints and fluid ounces differ too, so British recipes and fuel figures will not match these units. Weight ounces and fluid ounces are different things: one measures mass and the other volume, and moving between them requires knowing the density of the ingredient, which is why weight and volume sit in separate categories. The tonne is the metric tonne of 1,000 kilograms, about 2,204.62 pounds, not the US short ton of 2,000 pounds. A knot is one nautical mile per hour, which works out to 1.852 kilometers per hour.

Limitations: some conversion factors are stored to about six significant figures, so a few results carry a tiny rounding difference. One square mile shows as 640.0024 acres instead of exactly 640, and one acre shows as 43,560.06 square feet instead of exactly 43,560. That is fine for everyday use but not for legal surveys, engineering specifications, or anything that needs exact values. The converter does not include millimeters, imperial volume units, stones, short tons, energy, data storage, time, or currency, and it cannot convert between categories, such as cups of flour to grams. It also does not stop you from entering physically impossible values, such as a temperature below absolute zero.`

export const faqItems: FAQItem[] = [
  {
    question: 'How many kilometers are in a mile?',
    answer: 'One mile is exactly 1.609344 kilometers, and one kilometer is about 0.621371 miles. A 26.2-mile marathon is 42.16481 kilometers, and a 10 km run is 6.213712 miles.',
  },
  {
    question: 'How do I convert Fahrenheit to Celsius?',
    answer: 'Subtract 32 from the Fahrenheit temperature, then multiply by 5/9. For example, (98.6 − 32) × 5/9 = 37 °C. To go the other way, multiply Celsius by 9/5 and add 32, so 100 °C is 212 °F.',
  },
  {
    question: 'How many pounds are in a kilogram?',
    answer: 'One kilogram is about 2.20462 pounds, and one pound is 0.453592 kilograms. A person weighing 70 kg weighs about 154.3237 lb, and 150 lb is about 68.0388 kg.',
  },
  {
    question: 'How many liters are in a gallon?',
    answer: 'One US gallon is about 3.78541 liters, so 5 US gallons is 18.92705 liters. This converter uses US gallons only. A UK imperial gallon is larger, about 4.546 liters, and is not one of the available units.',
  },
  {
    question: 'How many square feet are in an acre?',
    answer: 'An acre is defined as exactly 43,560 square feet, or about 4,046.86 square meters. This converter shows 1 acre as 43,560.06 square feet because its acre and square foot factors are rounded to about six significant figures.',
  },
  {
    question: 'Is a fluid ounce the same as an ounce?',
    answer: 'No. A fluid ounce measures volume (one US fluid ounce is about 29.5735 mL), while an ounce measures weight (about 28.35 grams). They only line up for liquids with a density close to water, which is why this converter keeps them in separate Volume and Weight categories.',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Unit Converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free unit converter for length, weight, volume, temperature, speed, area, and pressure.',
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
