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

  // percentChange: y = old value, x = new value. Dividing by |y| keeps a rise positive when the old value is negative
  const result = y === 0 ? 0 : ((x - y) / Math.abs(y)) * 100
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
  if (whole === 0) return `${numerator}/${denominator}`
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

function formatQuadraticRoot(n: number): string {
  return Number(n.toPrecision(6)).toString()
}

export function calculateQuadratic({ a, b, c }: QuadraticInputs): QuadraticResult {
  const rawDiscriminant = b * b - 4 * a * c
  // Decimal coefficients like (x - 0.7)² leave a residue such as -2.2e-16 that should count as zero
  const tolerance = 1e-12 * Math.max(b * b, Math.abs(4 * a * c))
  const discriminant = Math.abs(rawDiscriminant) <= tolerance ? 0 : rawDiscriminant

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

// --- Scientific Calculator ---
export type AngleMode = 'deg' | 'rad'

export interface ScientificInputs {
  expression: string
  angleMode: AngleMode
}

export interface ScientificResult {
  value: number | null
  display: string
  error: string | null
}

type ScientificToken =
  | { type: 'num'; value: number }
  | { type: 'ident'; value: string }
  | { type: 'op'; value: string }

class ScientificError extends Error {}

const SCIENTIFIC_MAX_LENGTH = 500

const SCIENTIFIC_CONSTANTS: Record<string, number> = { pi: Math.PI, e: Math.E }

// Keypad symbols are normalised to their ASCII equivalents before tokenising
const SCIENTIFIC_SYMBOLS: Record<string, string> = { '×': '*', '÷': '/', '−': '-', '√': 'sqrt', 'π': 'pi' }

function tokenizeScientific(expression: string): ScientificToken[] {
  const source = expression.replace(/[×÷−√π]/g, (ch) => ` ${SCIENTIFIC_SYMBOLS[ch]} `)
  const tokens: ScientificToken[] = []
  let i = 0

  while (i < source.length) {
    const ch = source[i]
    if (/\s/.test(ch)) { i++; continue }

    const numberMatch = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(source.slice(i))
    if (numberMatch) {
      tokens.push({ type: 'num', value: Number(numberMatch[0]) })
      i += numberMatch[0].length
      continue
    }

    const identMatch = /^[a-z]+/i.exec(source.slice(i))
    if (identMatch) {
      tokens.push({ type: 'ident', value: identMatch[0].toLowerCase() })
      i += identMatch[0].length
      continue
    }

    if ('+-*/^!%()'.includes(ch)) {
      tokens.push({ type: 'op', value: ch })
      i++
      continue
    }

    throw new ScientificError(`Unexpected "${ch}"`)
  }

  return tokens
}

function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new ScientificError('Factorial needs a whole number ≥ 0')
  let result = 1
  for (let k = 2; k <= n && Number.isFinite(result); k++) result *= k
  return result
}

// Rounds away floating-point residue such as sin(π) = 1.2e-16
function snapTiny(n: number): number {
  return Math.abs(n) < 1e-15 ? 0 : n
}

function buildScientificFunctions(angleMode: AngleMode): Record<string, (x: number) => number> {
  const toRadians = (x: number) => (angleMode === 'deg' ? (x * Math.PI) / 180 : x)
  const fromRadians = (x: number) => (angleMode === 'deg' ? (x * 180) / Math.PI : x)

  return {
    sin: (x) => snapTiny(Math.sin(toRadians(x))),
    cos: (x) => snapTiny(Math.cos(toRadians(x))),
    tan: (x) => {
      // Math.tan(π/2) returns 1.6e16 rather than failing; a cosine that snaps to zero marks those angles
      if (snapTiny(Math.cos(toRadians(x))) === 0) throw new ScientificError('Result is undefined')
      return snapTiny(Math.tan(toRadians(x)))
    },
    asin: (x) => fromRadians(Math.asin(x)),
    acos: (x) => fromRadians(Math.acos(x)),
    atan: (x) => fromRadians(Math.atan(x)),
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    ln: Math.log,
    log: Math.log10,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt,
    abs: Math.abs,
    exp: Math.exp,
  }
}

function evaluateScientific(tokens: ScientificToken[], angleMode: AngleMode): number {
  const functions = buildScientificFunctions(angleMode)
  let pos = 0

  const peek = () => tokens[pos]
  const isOp = (value: string) => peek()?.type === 'op' && peek()?.value === value
  const startsOperand = () => {
    const token = peek()
    return token !== undefined && (token.type !== 'op' || token.value === '(')
  }

  function unexpected(): never {
    const token = peek()
    if (token === undefined) throw new ScientificError('Incomplete expression')
    throw new ScientificError(`Unexpected "${token.value}"`)
  }

  function parseExpression(): number {
    let left = parseTerm()
    while (isOp('+') || isOp('-')) {
      const op = tokens[pos++].value
      const right = parseTerm()
      left = op === '+' ? left + right : left - right
    }
    return left
  }

  function parseTerm(): number {
    let left = parseUnary()
    while (true) {
      if (isOp('*')) { pos++; left *= parseUnary(); continue }
      if (isOp('/')) { pos++; left /= parseUnary(); continue }
      if (startsOperand()) { left *= parseUnary(); continue }
      return left
    }
  }

  function parseUnary(): number {
    if (isOp('-')) { pos++; return -parseUnary() }
    if (isOp('+')) { pos++; return parseUnary() }
    return parsePower()
  }

  function parsePower(): number {
    const base = parsePostfix()
    if (!isOp('^')) return base
    pos++
    return Math.pow(base, parseUnary())
  }

  function parsePostfix(): number {
    let value = parsePrimary()
    while (isOp('!') || isOp('%')) {
      value = tokens[pos++].value === '!' ? factorial(value) : value / 100
    }
    return value
  }

  function parseBracketed(): number {
    pos++
    const value = parseExpression()
    if (!isOp(')')) {
      if (peek() === undefined) throw new ScientificError('Missing closing bracket')
      unexpected()
    }
    pos++
    return value
  }

  function parsePrimary(): number {
    const token = peek()
    if (token === undefined) unexpected()
    if (token.type === 'num') { pos++; return token.value }
    if (isOp('(')) return parseBracketed()
    if (token.type === 'op') unexpected()

    pos++
    if (token.value in SCIENTIFIC_CONSTANTS) return SCIENTIFIC_CONSTANTS[token.value]
    const fn = functions[token.value]
    if (fn === undefined) throw new ScientificError(`Unknown function or constant "${token.value}"`)
    if (!isOp('(')) throw new ScientificError(`Expected "(" after ${token.value}`)
    return fn(parseBracketed())
  }

  const value = parseExpression()
  if (pos < tokens.length) unexpected()
  return value
}

export function calculateScientific({ expression, angleMode }: ScientificInputs): ScientificResult {
  if (expression.trim() === '') return { value: null, display: '', error: null }
  // Expressions arrive from the URL; the cap keeps the recursive parser well within stack limits
  if (expression.length > SCIENTIFIC_MAX_LENGTH) return { value: null, display: '', error: 'Expression is too long' }

  try {
    const value = evaluateScientific(tokenizeScientific(expression), angleMode)
    if (!Number.isFinite(value)) return { value: null, display: '', error: 'Result is undefined' }
    return { value, display: Number(value.toPrecision(12)).toString(), error: null }
  } catch (err) {
    if (err instanceof ScientificError) return { value: null, display: '', error: err.message }
    throw err
  }
}
