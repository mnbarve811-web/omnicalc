import { describe, it, expect } from 'vitest'
import { calculateStatistics } from '@/lib/engine'

describe('calculateStatistics', () => {
  it('calculates mean correctly', () => {
    expect(calculateStatistics({ values: [2, 4, 6] }).mean).toBeCloseTo(4, 2)
  })
  it('median of odd-length array', () => {
    expect(calculateStatistics({ values: [1, 3, 5] }).median).toBe(3)
  })
  it('median of even-length array', () => {
    expect(calculateStatistics({ values: [1, 2, 3, 4] }).median).toBe(2.5)
  })
  it('mode returns most frequent value', () => {
    const r = calculateStatistics({ values: [1, 2, 2, 3] })
    expect(r.mode).toContain(2)
  })
  it('standard deviation of [2,4,4,4,5,5,7,9] = 2', () => {
    const r = calculateStatistics({ values: [2, 4, 4, 4, 5, 5, 7, 9] })
    expect(r.standardDeviation).toBeCloseTo(2, 1)
  })
  it('single element: stdDev = 0, mean = value', () => {
    const r = calculateStatistics({ values: [7] })
    expect(r.mean).toBe(7)
    expect(r.standardDeviation).toBe(0)
  })
  it('range = max - min', () => {
    expect(calculateStatistics({ values: [3, 1, 7, 2] }).range).toBe(6)
  })
  it('sum and count are correct', () => {
    const r = calculateStatistics({ values: [10, 20, 30] })
    expect(r.sum).toBe(60)
    expect(r.count).toBe(3)
  })
  it('single element: median, range, variance are valid numbers', () => {
    const r = calculateStatistics({ values: [7] })
    expect(r.median).toBe(7)
    expect(r.range).toBe(0)
    expect(r.variance).toBe(0)
    expect(r.mode).toEqual([])
  })
  it('mode is empty when all values are unique', () => {
    expect(calculateStatistics({ values: [1, 2, 3] }).mode).toEqual([])
  })
})

describe('calculateStatistics edge cases', () => {
  it('single value: every statistic collapses to that value', () => {
    expect(calculateStatistics({ values: [-4.5] })).toEqual({
      count: 1, sum: -4.5, mean: -4.5, median: -4.5, mode: [], range: 0, variance: 0, standardDeviation: 0, min: -4.5, max: -4.5,
    })
  })
  it('even count: median averages the two middle values of the sorted data', () => {
    expect(calculateStatistics({ values: [10, 1, 7, 3] }).median).toBe(5)
  })
  it('odd count: median uses the sorted middle value, not the input order', () => {
    expect(calculateStatistics({ values: [9, 1, 5] }).median).toBe(5)
  })
  it('handles negative numbers', () => {
    const r = calculateStatistics({ values: [-5, -1, -3, 1] })
    expect(r.sum).toBe(-8)
    expect(r.mean).toBe(-2)
    expect(r.median).toBe(-2)
    expect(r.min).toBe(-5)
    expect(r.max).toBe(1)
    expect(r.range).toBe(6)
    expect(r.variance).toBe(5)
    expect(r.standardDeviation).toBeCloseTo(Math.sqrt(5), 12)
  })
  it('uses population variance (divides by n)', () => {
    expect(calculateStatistics({ values: [1, 2, 3, 4] }).variance).toBe(1.25)
  })
  it('handles decimals', () => {
    const r = calculateStatistics({ values: [0.1, 0.2, 0.3] })
    expect(r.mean).toBeCloseTo(0.2, 12)
    expect(r.variance).toBeCloseTo(0.02 / 3, 12)
  })
  it('returns every value that ties for the highest frequency', () => {
    expect(calculateStatistics({ values: [3, 1, 3, 1, 2] }).mode).toEqual([3, 1])
  })
  it('mode is empty when every value is identical', () => {
    const r = calculateStatistics({ values: [4, 4, 4] })
    expect(r.mode).toEqual([])
    expect(r.variance).toBe(0)
  })
  it('sorts numerically rather than lexically', () => {
    const r = calculateStatistics({ values: [10, 9, 100] })
    expect(r.min).toBe(9)
    expect(r.max).toBe(100)
    expect(r.median).toBe(10)
  })
})
