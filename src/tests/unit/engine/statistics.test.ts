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
