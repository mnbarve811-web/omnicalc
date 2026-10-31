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
    expect(evalDeg('tan(-270)').error).toMatch(/undefined/i)
  })

  it('reports tan at π/2 radians as undefined', () => {
    expect(evalRad('tan(pi / 2)').error).toMatch(/undefined/i)
    expect(evalRad('tan(3pi / 2)').error).toMatch(/undefined/i)
    expect(evalRad('tan(pi / 4)').value).toBeCloseTo(1, 12)
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

describe('calculateScientific coverage', () => {
  it('evaluates nested functions', () => {
    expect(evalDeg('sqrt(abs(-16))').value).toBe(4)
    expect(evalDeg('ln(exp(2))').value).toBeCloseTo(2, 12)
    expect(evalDeg('log(sqrt(10000))').value).toBeCloseTo(2, 12)
    expect(evalDeg('sin(asin(0.5))').value).toBeCloseTo(0.5, 12)
    expect(evalDeg('abs(cos(180)) + cbrt(abs(-8))').value).toBeCloseTo(3, 12)
  })

  it('applies chains of unary operators', () => {
    expect(evalDeg('--3').value).toBe(3)
    expect(evalDeg('---1').value).toBe(-1)
    expect(evalDeg('-+-2').value).toBe(2)
    expect(evalDeg('+5').value).toBe(5)
    expect(evalDeg('2 * -3').value).toBe(-6)
    expect(evalDeg('2^--2').value).toBe(4)
    expect(evalDeg('-(2 + 3)').value).toBe(-5)
  })

  it('evaluates every inverse trig function in both angle modes', () => {
    expect(evalDeg('atan(1)').value).toBeCloseTo(45, 10)
    expect(evalRad('atan(1)').value).toBeCloseTo(Math.PI / 4, 12)
    expect(evalDeg('acos(0)').value).toBeCloseTo(90, 10)
    expect(evalRad('asin(1)').value).toBeCloseTo(Math.PI / 2, 12)
  })

  it('evaluates tan away from its asymptotes', () => {
    expect(evalDeg('tan(45)').value).toBeCloseTo(1, 12)
    expect(evalDeg('tan(180)').display).toBe('0')
    expect(evalRad('cos(pi)').value).toBe(-1)
  })

  it('ignores the angle mode for hyperbolic, log, and exponential functions', () => {
    for (const expression of ['sinh(1)', 'cosh(1)', 'tanh(1)', 'ln(2)', 'log(2)', 'exp(1)']) {
      expect(evalDeg(expression).value).toBe(evalRad(expression).value)
    }
    expect(evalRad('sinh(1)').value).toBeCloseTo(Math.sinh(1), 12)
    expect(evalRad('cosh(1)').value).toBeCloseTo(Math.cosh(1), 12)
    expect(evalRad('tanh(1)').value).toBeCloseTo(Math.tanh(1), 12)
    expect(evalRad('exp(1)').value).toBeCloseTo(Math.E, 12)
  })

  it('reports out-of-domain inverse trig as undefined', () => {
    expect(evalDeg('asin(2)').error).toBe('Result is undefined')
    expect(evalRad('acos(-1.5)').error).toBe('Result is undefined')
  })

  it('resolves constants and identifiers case-insensitively', () => {
    expect(evalDeg('pi').value).toBe(Math.PI)
    expect(evalDeg('e').value).toBe(Math.E)
    expect(evalDeg('PI').value).toBe(Math.PI)
    expect(evalDeg('Sin(30)').value).toBeCloseTo(0.5, 12)
    expect(evalDeg('π').value).toBe(Math.PI)
  })

  it('multiplies implicitly before functions and constants', () => {
    expect(evalDeg('2sin(30)').value).toBeCloseTo(1, 12)
    expect(evalDeg('3e').value).toBeCloseTo(3 * Math.E, 12)
    expect(evalDeg('2 3').value).toBe(6)
  })

  it('chains postfix operators', () => {
    expect(evalDeg('3!!').value).toBe(720)
    expect(evalDeg('50%%').value).toBeCloseTo(0.005, 15)
    expect(evalDeg('3!^2').value).toBe(36)
  })

  it('reports factorial overflow as undefined', () => {
    expect(evalDeg('170!').value).toBeGreaterThan(1e306)
    expect(evalDeg('171!').error).toBe('Result is undefined')
  })

  it('returns the exact syntax error messages', () => {
    expect(evalDeg('2 +').error).toBe('Incomplete expression')
    expect(evalDeg('(2 + 3').error).toBe('Missing closing bracket')
    expect(evalDeg('2 + 3)').error).toBe('Unexpected ")"')
    expect(evalDeg('()').error).toBe('Unexpected ")"')
    expect(evalDeg('* 2').error).toBe('Unexpected "*"')
    expect(evalDeg('(2 + 3 *)').error).toBe('Unexpected ")"')
    expect(evalDeg('foo(2)').error).toBe('Unknown function or constant "foo"')
    expect(evalDeg('sin 30').error).toBe('Expected "(" after sin')
    expect(evalDeg('2 $ 3').error).toBe('Unexpected "$"')
    expect(evalDeg('2.5!').error).toBe('Factorial needs a whole number ≥ 0')
    expect(evalDeg('1 / 0').error).toBe('Result is undefined')
  })

  it('accepts expressions up to the 500-character limit', () => {
    const atLimit = '1+'.repeat(249) + '11'
    expect(atLimit).toHaveLength(500)
    expect(evalDeg(atLimit).value).toBe(260)
    expect(evalDeg(atLimit + '1').error).toBe('Expression is too long')
  })

  it('formats very large and very small results', () => {
    expect(evalDeg('10^21').display).toBe('1e+21')
    expect(evalDeg('10^-7').display).toBe('1e-7')
    expect(evalDeg('2^0.5').display).toBe('1.41421356237')
  })

  it('returns the numeric value alongside the display', () => {
    expect(evalDeg('2 + 2')).toEqual({ value: 4, display: '4', error: null })
  })
})
