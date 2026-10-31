import { describe, it, expect } from 'vitest'
import { calculatePercentage } from '@/lib/engine'

describe('calculatePercentage', () => {
  it('whatIsXPercentOfY: 20% of 80 = 16', () => {
    const r = calculatePercentage({ mode: 'whatIsXPercentOfY', x: 20, y: 80 })
    expect(r.result).toBeCloseTo(16, 2)
  })
  it('xIsWhatPercentOfY: 25 is 50% of 50', () => {
    const r = calculatePercentage({ mode: 'xIsWhatPercentOfY', x: 25, y: 50 })
    expect(r.result).toBeCloseTo(50, 2)
  })
  it('percentChange: 100 to 150 = +50%', () => {
    const r = calculatePercentage({ mode: 'percentChange', x: 150, y: 100 })
    expect(r.result).toBeCloseTo(50, 2)
  })
  it('percentChange: 100 to 50 = -50%', () => {
    const r = calculatePercentage({ mode: 'percentChange', x: 50, y: 100 })
    expect(r.result).toBeCloseTo(-50, 2)
  })
  it('division by zero (y=0) returns 0 without NaN', () => {
    const r = calculatePercentage({ mode: 'xIsWhatPercentOfY', x: 10, y: 0 })
    expect(r.result).toBe(0)
  })
  it('percentChange with y=0 returns 0 without NaN', () => {
    const r = calculatePercentage({ mode: 'percentChange', x: 10, y: 0 })
    expect(r.result).toBe(0)
    expect(r.label).not.toContain('NaN')
  })
  it('label rounds the result to 2 decimals', () => {
    const r = calculatePercentage({ mode: 'xIsWhatPercentOfY', x: 1, y: 3 })
    expect(r.label).toBe('1 is 33.33% of 3')
  })
  it('label is a non-empty string', () => {
    const r = calculatePercentage({ mode: 'whatIsXPercentOfY', x: 10, y: 200 })
    expect(typeof r.label).toBe('string')
    expect(r.label.length).toBeGreaterThan(0)
  })
})
