import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Geometry formulas describe how much space a shape covers or holds. Flat (2D) shapes such as circles, rectangles, and triangles have an area (the surface they cover) and a perimeter (the distance around their edge). Solid (3D) shapes such as cylinders, spheres, and cones have a volume (the space inside) and a surface area (the total area of their outer faces).

How to use this calculator: pick a shape, then enter its dimensions. The diagram shows what each measurement means — for example, the radius is the distance from the center to the edge, and the height of a triangle is measured straight up from the base, not along a slanted side. For a triangle, enter all three side lengths to also get the perimeter.

All results use the same unit you enter. If your dimensions are in centimeters, area is in square centimeters and volume is in cubic centimeters.`

export const faqItems: FAQItem[] = [
  {
    question: 'What is the formula for the area of a circle?',
    answer: 'Area = π × r², where r is the radius. A circle with a radius of 5 has an area of about 78.54 square units. The circumference (perimeter) is 2 × π × r, about 31.42 units for the same circle.',
  },
  {
    question: 'How do I find the area of a triangle?',
    answer: 'Area = ½ × base × height, where the height is the perpendicular distance from the base to the opposite corner. A triangle with a base of 3 and a height of 6 has an area of 9 square units.',
  },
  {
    question: 'What is the difference between volume and surface area?',
    answer: 'Volume measures the space inside a 3D shape, in cubic units — how much it can hold. Surface area measures the total area of its outside, in square units — how much material it would take to wrap it.',
  },
  {
    question: 'How do I calculate the volume of a cylinder?',
    answer: 'Volume = π × r² × h. It is the area of the circular base multiplied by the height. A cylinder with a radius of 2 and a height of 5 holds about 62.83 cubic units.',
  },
  {
    question: 'Why is a cone exactly one third of a cylinder?',
    answer: 'A cone with the same radius and height as a cylinder holds exactly one third of the cylinder\'s volume: V = ⅓ × π × r² × h. Its surface area uses the slant height, √(r² + h²), giving π × r × (r + √(r² + h²)).',
  },
]

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Geometry Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free geometry calculator for area, perimeter, volume, and surface area of common 2D and 3D shapes.',
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
