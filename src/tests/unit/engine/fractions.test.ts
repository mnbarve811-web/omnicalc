import { describe, it, expect } from 'vitest'
import { calculateFraction } from '@/lib/engine'

describe('calculateFraction', () => {
  it('1/2 + 1/3 = 5/6', () => {
    const r = calculateFraction({ numerator1:1, denominator1:2, numerator2:1, denominator2:3, operation:'add' })
    expect(r.numerator).toBe(5)
    expect(r.denominator).toBe(6)
  })
  it('3/4 - 1/4 = 1/2', () => {
    const r = calculateFraction({ numerator1:3, denominator1:4, numerator2:1, denominator2:4, operation:'subtract' })
    expect(r.numerator).toBe(1)
    expect(r.denominator).toBe(2)
  })
  it('2/3 × 3/4 = 1/2', () => {
    const r = calculateFraction({ numerator1:2, denominator1:3, numerator2:3, denominator2:4, operation:'multiply' })
    expect(r.numerator).toBe(1)
    expect(r.denominator).toBe(2)
  })
  it('3/4 ÷ 3/8 = 2/1', () => {
    const r = calculateFraction({ numerator1:3, denominator1:4, numerator2:3, denominator2:8, operation:'divide' })
    expect(r.numerator).toBe(2)
    expect(r.denominator).toBe(1)
    expect(r.decimal).toBeCloseTo(2, 2)
  })
  it('result is reduced to lowest terms', () => {
    const r = calculateFraction({ numerator1:2, denominator1:4, numerator2:1, denominator2:4, operation:'add' })
    expect(r.denominator).toBe(4)  // 3/4 already reduced
    expect(r.numerator).toBe(3)
  })
  it('mixed string for 7/2 is "3 1/2"', () => {
    const r = calculateFraction({ numerator1:5, denominator1:2, numerator2:1, denominator2:1, operation:'add' })
    expect(r.mixed).toBe('3 1/2')
  })
  it('divide by zero returns safe result', () => {
    const r = calculateFraction({ numerator1:1, denominator1:2, numerator2:0, denominator2:1, operation:'divide' })
    expect(r.denominator).not.toBe(0)
  })
  it('keeps the minus sign on a negative proper fraction in mixed form', () => {
    const r = calculateFraction({ numerator1:3, denominator1:4, numerator2:5, denominator2:6, operation:'subtract' })
    expect(r.mixed).toBe('-1/12')
  })
  it('formats a negative improper fraction as a negative mixed number', () => {
    const r = calculateFraction({ numerator1:-7, denominator1:4, numerator2:0, denominator2:1, operation:'add' })
    expect(r.mixed).toBe('-1 3/4')
  })
})

describe('calculateFraction signs and simplification', () => {
  function frac(n1: number, d1: number, op: 'add' | 'subtract' | 'multiply' | 'divide', n2: number, d2: number) {
    return calculateFraction({ numerator1: n1, denominator1: d1, numerator2: n2, denominator2: d2, operation: op })
  }

  it('adds a negative and a positive fraction', () => {
    expect(frac(-1, 2, 'add', 1, 3)).toEqual({ numerator: -1, denominator: 6, decimal: -1 / 6, mixed: '-1/6' })
  })
  it('subtracts a negative fraction', () => {
    expect(frac(1, 2, 'subtract', -1, 4)).toEqual({ numerator: 3, denominator: 4, decimal: 0.75, mixed: '3/4' })
  })
  it('multiplies two negatives into a positive', () => {
    expect(frac(-2, 3, 'multiply', -3, 4)).toEqual({ numerator: 1, denominator: 2, decimal: 0.5, mixed: '1/2' })
  })
  it('divides a negative fraction', () => {
    expect(frac(-1, 2, 'divide', 1, 4)).toEqual({ numerator: -2, denominator: 1, decimal: -2, mixed: '-2' })
  })
  it('moves the sign to the numerator when dividing by a negative', () => {
    const r = frac(1, 2, 'divide', -1, 4)
    expect(r.numerator).toBe(-2)
    expect(r.denominator).toBe(1)
  })
  it('normalises a negative input denominator', () => {
    const r = frac(1, -2, 'add', 0, 1)
    expect(r.numerator).toBe(-1)
    expect(r.denominator).toBe(2)
    expect(r.mixed).toBe('-1/2')
  })
  it('simplifies a product by the greatest common divisor', () => {
    const r = frac(6, 8, 'multiply', 4, 6)
    expect(r.numerator).toBe(1)
    expect(r.denominator).toBe(2)
  })
  it('simplifies a quotient fully', () => {
    const r = frac(10, 12, 'divide', 15, 18)
    expect(r.numerator).toBe(1)
    expect(r.denominator).toBe(1)
    expect(r.mixed).toBe('1')
  })
  it('returns 0/1 when a subtraction cancels out', () => {
    expect(frac(1, 2, 'subtract', 2, 4)).toEqual({ numerator: 0, denominator: 1, decimal: 0, mixed: '0' })
  })
  it('formats a positive improper fraction as a mixed number', () => {
    const r = frac(7, 3, 'multiply', 1, 1)
    expect(r.mixed).toBe('2 1/3')
    expect(r.decimal).toBeCloseTo(7 / 3, 12)
  })
  it('formats a whole-number result without a fraction part', () => {
    expect(frac(3, 2, 'add', 1, 2).mixed).toBe('2')
  })
  it('divide by a zero numerator returns 0 with decimal 0', () => {
    expect(frac(5, 7, 'divide', 0, 3)).toEqual({ numerator: 0, denominator: 1, decimal: 0, mixed: '0' })
  })
})
