import { describe, it, expect } from 'vitest'
import { calculateScientific } from '@/lib/engine'

function evalDeg(expression: string) {
  return calculateScientific({ expression, angleMode: 'deg' })
}

function evalRad(expression: string) {
  return calculateScientific({ expression, angleMode: 'rad' })
}

describe('calculateScientific', () => {
  it('respects operator precedence and parentheses', () => {
    expect(evalDeg('2 + 3 * 4').value).toBe(14)
    expect(evalDeg('(2 + 3) * 4').value).toBe(20)
    expect(evalDeg('10 / 4 - 1').value).toBe(1.5)
  })

  it('treats ^ as right-associative and binds tighter than unary minus', () => {
    expect(evalDeg('2^3^2').value).toBe(512)
    expect(evalDeg('-2^2').value).toBe(-4)
    expect(evalDeg('2^-1').value).toBe(0.5)
  })

  it('accepts × ÷ and − symbols from the keypad', () => {
    expect(evalDeg('6 × 7').value).toBe(42)
    expect(evalDeg('9 ÷ 3').value).toBe(3)
    expect(evalDeg('5 − 8').value).toBe(-3)
  })

  it('supports implicit multiplication', () => {
    expect(evalDeg('2(3 + 1)').value).toBe(8)
    expect(evalDeg('2π').value).toBeCloseTo(2 * Math.PI, 10)
    expect(evalDeg('(1 + 1)(2 + 2)').value).toBe(8)
  })

  it('evaluates trig functions in degrees and radians', () => {
    expect(evalDeg('sin(30)').value).toBeCloseTo(0.5, 12)
    expect(evalDeg('cos(180)').value).toBeCloseTo(-1, 12)
    expect(evalRad('sin(pi / 2)').value).toBeCloseTo(1, 12)
    expect(evalDeg('asin(1)').value).toBeCloseTo(90, 10)
    expect(evalRad('acos(-1)').value).toBeCloseTo(Math.PI, 12)
  })

  it('displays clean values for exact trig angles', () => {
    expect(evalDeg('sin(180)').display).toBe('0')
    expect(evalDeg('cos(90)').display).toBe('0')
  })

  it('reports tan at 90 degrees as undefined', () => {
    const r = evalDeg('tan(90)')
    expect(r.value).toBeNull()
    expect(r.error).toMatch(/undefined/i)
  })

  it('evaluates logs, roots, and other functions', () => {
    expect(evalDeg('ln(e)').value).toBeCloseTo(1, 12)
    expect(evalDeg('log(1000)').value).toBeCloseTo(3, 12)
    expect(evalDeg('sqrt(16)').value).toBe(4)
    expect(evalDeg('√(81)').value).toBe(9)
    expect(evalDeg('cbrt(27)').value).toBeCloseTo(3, 12)
    expect(evalDeg('abs(-7)').value).toBe(7)
    expect(evalDeg('exp(0)').value).toBe(1)
    expect(evalRad('sinh(0) + cosh(0) + tanh(0)').value).toBe(1)
  })

  it('handles factorial and percent postfix operators', () => {
    expect(evalDeg('5!').value).toBe(120)
    expect(evalDeg('0!').value).toBe(1)
    expect(evalDeg('50%').value).toBe(0.5)
    expect(evalDeg('200 * 15%').value).toBe(30)
  })

  it('rejects factorial of non-integers and negatives', () => {
    expect(evalDeg('2.5!').error).toMatch(/factorial/i)
    expect(evalDeg('(-3)!').error).toMatch(/factorial/i)
  })

  it('parses decimals and scientific notation', () => {
    expect(evalDeg('.5 + 1.25').value).toBe(1.75)
    expect(evalDeg('1.5e3').value).toBe(1500)
    expect(evalDeg('2e-2').value).toBe(0.02)
  })

  it('reports division by zero and domain errors', () => {
    expect(evalDeg('1 / 0').error).toMatch(/undefined/i)
    expect(evalDeg('sqrt(-1)').error).toMatch(/undefined/i)
    expect(evalDeg('ln(0)').error).toMatch(/undefined/i)
  })

  it('reports syntax errors instead of throwing', () => {
    expect(evalDeg('2 +').error).toMatch(/incomplete|unexpected/i)
    expect(evalDeg('(2 + 3').error).toMatch(/bracket/i)
    expect(evalDeg('2 + 3)').error).toMatch(/unexpected/i)
    expect(evalDeg('foo(2)').error).toMatch(/unknown/i)
    expect(evalDeg('2 $ 3').error).toMatch(/unexpected/i)
  })

  it('rejects overly long expressions instead of overflowing the stack', () => {
    expect(evalDeg('('.repeat(20000) + '1').error).toMatch(/too long/i)
  })

  it('returns an empty result for a blank expression', () => {
    const r = evalDeg('   ')
    expect(r.value).toBeNull()
    expect(r.error).toBeNull()
    expect(r.display).toBe('')
  })

  it('rounds display to 12 significant digits', () => {
    expect(evalDeg('0.1 + 0.2').display).toBe('0.3')
    expect(evalDeg('1 / 3').display).toBe('0.333333333333')
  })
})
