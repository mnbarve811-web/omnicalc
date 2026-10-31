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
