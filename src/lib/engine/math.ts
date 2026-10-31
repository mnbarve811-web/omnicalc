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

function gcd(a: number, b: number): number {
  while (b !== 0) {
    ;[a, b] = [b, a % b]
  }
  return Math.abs(a)
}

function simplify(n: number, d: number): [number, number] {
  if (d === 0) return [0, 1]
  const g = gcd(Math.abs(n), Math.abs(d))
  const sign = d < 0 ? -1 : 1
  return [sign * n / g, Math.abs(d) / g]
}

function mixedString(numerator: number, denominator: number): string {
  const whole = Math.trunc(numerator / denominator)
  const rem = Math.abs(numerator % denominator)
  if (denominator === 1 || rem === 0) return String(whole)
  if (whole === 0) return `${Math.abs(numerator)}/${denominator}`
  return `${whole} ${rem}/${denominator}`
}

export function calculateFraction(inputs: FractionInputs): FractionResult {
  const { numerator1: n1, denominator1: d1, numerator2: n2, denominator2: d2, operation } = inputs

  if (operation === 'divide' && n2 === 0) {
    return { numerator: 0, denominator: 1, decimal: 0, mixed: '0' }
  }

  let rawN: number
  let rawD: number

  if (operation === 'add') {
    rawN = n1 * d2 + n2 * d1
    rawD = d1 * d2
  } else if (operation === 'subtract') {
    rawN = n1 * d2 - n2 * d1
    rawD = d1 * d2
  } else if (operation === 'multiply') {
    rawN = n1 * n2
    rawD = d1 * d2
  } else {
    rawN = n1 * d2
    rawD = n2 * d1
  }

  const [numerator, denominator] = simplify(rawN, rawD)
  const decimal = numerator / denominator
  const mixed = mixedString(numerator, denominator)

  return { numerator, denominator, decimal, mixed }
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
