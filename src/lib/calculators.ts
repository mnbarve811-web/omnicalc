// Single source for calculator names, URLs, and descriptions used by navigation, search, hubs, and related links.
// Tailwind only picks up complete literal class names, so each pillar spells out its colour classes.

export interface CalculatorEntry {
  name: string
  title: string
  href: string
  description: string
  keywords: string
}

export interface Pillar {
  id: 'financial' | 'fitness' | 'math' | 'utility'
  title: string
  navLabel: string
  href: string
  description: string
  dotClass: string
  textClass: string
  calculators: CalculatorEntry[]
}

export const PILLARS: Pillar[] = [
  {
    id: 'financial',
    title: 'Financial Calculators',
    navLabel: 'Financial',
    href: '/financial',
    description: 'Free, accurate tools for mortgage planning, investment projections, and debt management.',
    dotClass: 'bg-pillar-financial',
    textClass: 'text-pillar-financial',
    calculators: [
      { name: 'Mortgage', title: 'Mortgage Calculator', href: '/financial/mortgage', description: 'Estimate monthly payments and see your full amortization schedule.', keywords: 'home loan house payment amortization piti' },
      { name: 'Compound Interest', title: 'Compound Interest Calculator', href: '/financial/compound-interest', description: 'Project investment growth with regular contributions over time.', keywords: 'investment savings growth interest' },
      { name: 'Retirement', title: 'Retirement Calculator', href: '/financial/retirement', description: 'Plan your retirement savings and forecast your nest egg.', keywords: 'pension 401k savings nest egg' },
      { name: 'Auto Loan', title: 'Auto Loan Calculator', href: '/financial/auto-loan', description: 'Calculate car loan payments including taxes and trade-in value.', keywords: 'car vehicle loan payment' },
      { name: 'Salary / Paycheck', title: 'Salary / Paycheck Calculator', href: '/financial/salary', description: 'Break down your paycheck with federal, state, and FICA taxes.', keywords: 'income tax take home pay wage' },
      { name: 'Debt Payoff', title: 'Debt Payoff Calculator', href: '/financial/debt-payoff', description: 'Compare snowball vs avalanche strategies to become debt-free faster.', keywords: 'credit card snowball avalanche loans' },
    ],
  },
  {
    id: 'fitness',
    title: 'Fitness & Health Calculators',
    navLabel: 'Fitness',
    href: '/fitness',
    description: 'Free, accurate tools for tracking your health, planning your nutrition, and monitoring your fitness goals.',
    dotClass: 'bg-pillar-fitness',
    textClass: 'text-pillar-fitness',
    calculators: [
      { name: 'TDEE', title: 'TDEE Calculator', href: '/fitness/tdee', description: 'Calculate your Total Daily Energy Expenditure and calorie targets for cutting, maintaining, or bulking.', keywords: 'calories energy bmr maintenance' },
      { name: 'BMI', title: 'BMI Calculator', href: '/fitness/bmi', description: 'Find your Body Mass Index and see which weight category you fall into.', keywords: 'body mass index weight height' },
      { name: 'Body Fat', title: 'Body Fat Calculator', href: '/fitness/body-fat', description: 'Estimate your body fat percentage using the accurate US Navy tape measurement method.', keywords: 'body composition navy method' },
      { name: 'Macros', title: 'Macro Calculator', href: '/fitness/macro', description: 'Get your daily protein, carb, and fat targets based on your TDEE and goal.', keywords: 'protein carbs fat diet nutrition' },
      { name: 'Pregnancy Due Date', title: 'Pregnancy Due Date', href: '/fitness/pregnancy', description: 'Calculate your due date, current week, and trimester from your last menstrual period.', keywords: 'due date trimester lmp baby' },
    ],
  },
  {
    id: 'math',
    title: 'Math & Scientific Calculators',
    navLabel: 'Math',
    href: '/math',
    description: 'Free, accurate math tools for students, engineers, and everyday problem-solving.',
    dotClass: 'bg-pillar-math',
    textClass: 'text-pillar-math',
    calculators: [
      { name: 'Statistics', title: 'Statistics Calculator', href: '/math/statistics', description: 'Calculate mean, median, mode, standard deviation, variance, and more from any dataset.', keywords: 'mean median mode standard deviation variance' },
      { name: 'Scientific', title: 'Scientific Calculator', href: '/math/scientific', description: 'Evaluate expressions with sin, cos, tan, logs, powers, roots, and factorials in degrees or radians.', keywords: 'trigonometry sin cos log expression' },
      { name: 'Percentage', title: 'Percentage Calculator', href: '/math/percentage', description: 'Find what percent X is of Y, calculate percentage change, or find X% of any number.', keywords: 'percent change increase decrease' },
      { name: 'Fractions', title: 'Fractions Calculator', href: '/math/fractions', description: 'Add, subtract, multiply, and divide fractions with fully simplified results and mixed numbers.', keywords: 'fraction simplify mixed number' },
      { name: 'Quadratic Solver', title: 'Quadratic Equation Solver', href: '/math/quadratic', description: 'Solve ax² + bx + c = 0 instantly — get real roots, discriminant, and step-by-step display.', keywords: 'quadratic equation roots discriminant algebra' },
    ],
  },
  {
    id: 'utility',
    title: 'Utility Calculators',
    navLabel: 'Utility',
    href: '/utility',
    description: 'Free, practical tools for everyday conversions, date calculations, and geometry.',
    dotClass: 'bg-pillar-utility',
    textClass: 'text-pillar-utility',
    calculators: [
      { name: 'Unit Converter', title: 'Unit Converter', href: '/utility/unit-conversion', description: 'Convert between length, weight, volume, temperature, speed, area, and pressure units.', keywords: 'convert units length weight temperature metric imperial' },
      { name: 'Date Difference', title: 'Date Calculator', href: '/utility/date-diff', description: 'Find the exact difference between two dates in years, months, and days.', keywords: 'days between dates age duration' },
      { name: 'Geometry', title: 'Geometry Calculator', href: '/utility/geometry', description: 'Calculate area, perimeter, volume, and surface area for circles, rectangles, spheres, and more.', keywords: 'area volume perimeter circle shape' },
    ],
  },
]

export const ALL_CALCULATORS = PILLARS.flatMap((pillar) =>
  pillar.calculators.map((calculator) => ({ ...calculator, pillar }))
)

export function findPillarByHref(href: string): Pillar | undefined {
  return PILLARS.find((pillar) => href === pillar.href || href.startsWith(`${pillar.href}/`))
}
