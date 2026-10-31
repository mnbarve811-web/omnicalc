import type { FAQItem } from '@/components/common/FAQSection'

export const guideText = `Geometry formulas describe how much space a shape covers or holds. Flat (2D) shapes such as circles, rectangles, and triangles have an area, which is the surface they cover, and a perimeter, which is the distance around their edge. Solid (3D) shapes such as cylinders, spheres, and cones have a volume, which is the space inside them, and a surface area, which is the total area of their outer faces. These numbers answer everyday questions: how much paint covers a wall, how much soil fills a round planter, how much fencing goes around a yard, or how much water a tank holds.

This calculator supports six shapes and shows two results for each. For a circle it gives the area and the perimeter, which for a circle is called the circumference. For a rectangle it gives the area and the perimeter. For a triangle it gives the area and the perimeter. For a cylinder, a sphere, and a cone it gives the volume and the total surface area.

How to use this calculator: pick a shape with the buttons at the top, and the matching measurement fields appear below. The diagram shows what each measurement means. The radius is the distance from the center to the edge, which is half the diameter. The height of a triangle or cone is measured straight up from the base at a right angle, not along a slanted side. Results update as you type and are rounded to four decimal places, with trailing zeros dropped. Radius and height are shared between the shapes that use them, so if you switch from a cylinder to a cone the same radius and height carry over, which makes it easy to compare the two. Your shape and measurements are saved in the page address, so you can bookmark or share the exact calculation.

Triangles need a little extra care. The area comes from the base and the perpendicular height. The perimeter comes from three separate side fields, labeled a, b, and c, which start at 3, 4, and 5, so a perimeter is always shown. Update all three sides to match your triangle. The calculator does not check that the sides agree with the base and height you entered, or that the three lengths can form a real triangle, so double-check your measurements.

The 2D formulas in plain language. A circle's area is pi times the radius squared, and its circumference is 2 times pi times the radius. A rectangle's area is width times height, and its perimeter is twice the width plus twice the height. A triangle's area is half the base times the height, and its perimeter is the three sides added together. Pi is about 3.14159, and the calculator uses its full precision.

The 3D formulas in plain language. A cylinder's volume is the area of its circular base, pi times the radius squared, multiplied by its height. Its surface area is the curved side, 2 times pi times the radius times the height, plus the two circular ends, 2 times pi times the radius squared. A sphere's volume is four thirds times pi times the radius cubed, and its surface area is 4 times pi times the radius squared. A cone's volume is one third of the matching cylinder, one third times pi times the radius squared times the height. Its surface area is pi times the radius times the sum of the radius and the slant height, where the slant height is the square root of the radius squared plus the height squared. Both the cylinder and cone surface areas include their flat circular ends.

Worked examples, all produced by this calculator. A circle with a radius of 5 has an area of 78.5398 and a circumference of 31.4159. A rectangle 4 wide and 6 high has an area of 24 and a perimeter of 20. A right triangle with a base of 4, a height of 3, and sides of 3, 4, and 5 has an area of 6 and a perimeter of 12. A cylinder with a radius of 3 and a height of 10 has a volume of 282.7433 and a surface area of 245.0442. A sphere with a radius of 5 has a volume of 523.5988 and a surface area of 314.1593. A cone with a radius of 3 and a height of 4 has a slant height of exactly 5, giving a volume of 37.6991 and a surface area of 75.3982.

Interpreting the results: every result uses the same unit you enter, so the calculator has no unit menu. If your measurements are in centimeters, lengths are in centimeters, areas are in square centimeters, and volumes are in cubic centimeters. Keep every measurement in the same unit before you start, because mixing inches and feet will give a wrong answer. For capacity, 1,000 cubic centimeters is 1 liter and 1 cubic meter is 1,000 liters, so the cylinder above, if measured in centimeters, holds 282.7433 cubic centimeters, or about 0.28 liters.

Tips: if you know the diameter, divide it by 2 to get the radius before entering it. For a square, choose Rectangle and enter the same value for width and height. For a hemisphere, halve the sphere volume. Its outer surface is half the sphere surface area plus a flat circle on top, so add pi times the radius squared if the flat face counts. For an open container such as a cup or a pipe, subtract the circular ends you do not need from the surface area. When estimating materials like paint, tiles, or concrete, add a margin for waste on top of the exact figure.

Limitations: only the six listed shapes are available, so ellipses, trapezoids, regular polygons, pyramids, prisms, and other solids are not covered. The calculator works forward from dimensions to results only; it cannot solve backward, for example finding the radius that gives a certain area. The slant height of a cone is used internally but not displayed. Inputs are not validated, so negative numbers or impossible triangles will still produce a result, and that result will not describe a real shape.`

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
  {
    question: 'How do I find the volume of a sphere?',
    answer: 'Volume = 4/3 × π × r³, where r is the radius. A sphere with a radius of 5 has a volume of about 523.5988 cubic units. Its surface area is 4 × π × r², about 314.1593 square units for the same sphere.',
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
