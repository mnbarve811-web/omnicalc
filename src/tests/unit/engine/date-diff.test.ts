import { describe, it, expect } from 'vitest'
import { calculateDateDiff } from '@/lib/engine'

describe('calculateDateDiff', () => {
  it('same date returns all zeros', () => {
    const r = calculateDateDiff({ startDate: '2024-01-01', endDate: '2024-01-01' })
    expect(r.totalDays).toBe(0)
    expect(r.years).toBe(0)
    expect(r.months).toBe(0)
    expect(r.days).toBe(0)
  })
  it('exactly 1 year apart', () => {
    const r = calculateDateDiff({ startDate: '2023-01-01', endDate: '2024-01-01' })
    expect(r.years).toBe(1)
    expect(r.months).toBe(0)
    expect(r.days).toBe(0)
  })
  it('totalDays is positive even when start > end', () => {
    const r = calculateDateDiff({ startDate: '2024-12-31', endDate: '2024-01-01' })
    expect(r.totalDays).toBeGreaterThan(0)
  })
  it('2020-01-01 to 2025-06-15 has years >= 5', () => {
    const r = calculateDateDiff({ startDate: '2020-01-01', endDate: '2025-06-15' })
    expect(r.years).toBe(5)
    expect(r.months).toBe(5)
  })
  it('30-day month span returns 30 total days', () => {
    const r = calculateDateDiff({ startDate: '2024-01-01', endDate: '2024-01-31' })
    expect(r.totalDays).toBe(30)
  })
})
