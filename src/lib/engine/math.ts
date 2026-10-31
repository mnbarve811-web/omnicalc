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

export function calculateStatistics({ values }: StatisticsInputs): StatisticsResult {
  const count = values.length
  const sum = values.reduce((a, b) => a + b, 0)
  const mean = sum / count

  const sorted = [...values].sort((a, b) => a - b)
  const min = sorted[0]
  const max = sorted[sorted.length - 1]

  const median =
    count % 2 === 1
      ? sorted[Math.floor(count / 2)]
      : (sorted[count / 2 - 1] + sorted[count / 2]) / 2

  const range = max - min

  const variance = values.reduce((acc, x) => acc + (x - mean) ** 2, 0) / count
  const standardDeviation = Math.sqrt(variance)

  // No value stands out when every frequency ties (all unique or all identical), so mode is [].
  const freq = new Map<number, number>()
  for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1)
  const freqValues = Array.from(freq.values())
  const freqEntries = Array.from(freq.entries())
  const maxFreq = Math.max(...freqValues)
  const allSameFreq = freqValues.every(f => f === maxFreq)
  const mode = allSameFreq ? [] : freqEntries.filter(([, f]) => f === maxFreq).map(([v]) => v)

  return { count, sum, mean, median, mode, range, variance, standardDeviation, min, max }
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
