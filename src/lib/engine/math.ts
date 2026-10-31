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

function roundPercentageLabel(n: number): number {
  return Math.round(n * 100) / 100
}

export function calculatePercentage(inputs: PercentageInputs): PercentageResult {
  const { mode, x, y } = inputs

  if (mode === 'whatIsXPercentOfY') {
    const result = (x / 100) * y
    return { result, label: `${x}% of ${y} = ${roundPercentageLabel(result)}` }
  }

  if (mode === 'xIsWhatPercentOfY') {
    const result = y === 0 ? 0 : (x / y) * 100
    return { result, label: `${x} is ${roundPercentageLabel(result)}% of ${y}` }
  }

  // percentChange: y = old value, x = new value
  const result = y === 0 ? 0 : ((x - y) / y) * 100
  return { result, label: `${y} → ${x} = ${roundPercentageLabel(result)}% change` }
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

export function calculateQuadratic(_inputs: QuadraticInputs): QuadraticResult {
  throw new Error('Not implemented')
}
