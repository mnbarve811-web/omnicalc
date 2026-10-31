// omnicalc/src/lib/engine/math.ts

// --- Percentage ---
export type PercentageMode = 'whatIsXPercentOfY' | 'xIsWhatPercentOfY' | 'percentChange'

export interface PercentageInputs {
  mode: PercentageMode
  x: number
  y: number
}

export interface PercentageResult {
  result: number
  label: string
}

export function calculatePercentage(_inputs: PercentageInputs): PercentageResult {
  throw new Error('Not implemented')
}

// --- Statistics ---
export interface StatisticsInputs {
  values: number[]   // caller parses comma-separated string before passing here
}

export interface StatisticsResult {
  count: number
  sum: number
  mean: number
  median: number
  mode: number[]
  range: number
  variance: number
  standardDeviation: number
  min: number
  max: number
}

export function calculateStatistics(_inputs: StatisticsInputs): StatisticsResult {
  throw new Error('Not implemented')
}

// --- Fractions ---
export type FractionOperation = 'add' | 'subtract' | 'multiply' | 'divide'

export interface FractionInputs {
  numerator1: number
  denominator1: number
  numerator2: number
  denominator2: number
  operation: FractionOperation
}

export interface FractionResult {
  numerator: number
  denominator: number
  decimal: number
  mixed: string   // e.g. "1 1/2"
}

export function calculateFraction(_inputs: FractionInputs): FractionResult {
  throw new Error('Not implemented')
}

// --- Quadratic Equation ---
export interface QuadraticInputs {
  a: number
  b: number
  c: number
}

export interface QuadraticResult {
  discriminant: number
  roots: [] | [number] | [number, number]   // 0, 1, or 2 real roots
  rootsDisplay: string   // human-readable: "No real roots", "x = 2", "x = 1, x = -3"
}

function formatQuadraticRoot(n: number): string {
  return Number(n.toPrecision(6)).toString()
}

export function calculateQuadratic({ a, b, c }: QuadraticInputs): QuadraticResult {
  const discriminant = b * b - 4 * a * c

  if (a === 0) {
    return { discriminant, roots: [], rootsDisplay: 'Not a quadratic equation (a = 0)' }
  }

  if (discriminant < 0) {
    return { discriminant, roots: [], rootsDisplay: 'No real roots' }
  }

  if (discriminant === 0) {
    const x = -b / (2 * a)
    return { discriminant, roots: [x], rootsDisplay: `x = ${formatQuadraticRoot(x)}` }
  }

  const x1 = (-b + Math.sqrt(discriminant)) / (2 * a)
  const x2 = (-b - Math.sqrt(discriminant)) / (2 * a)
  return { discriminant, roots: [x1, x2], rootsDisplay: `x₁ = ${formatQuadraticRoot(x1)}, x₂ = ${formatQuadraticRoot(x2)}` }
}
