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
  // These ran wrong west of UTC when ISO dates were parsed as UTC but stepped in local time
  it('first of one month to first of the next is exactly 1 month', () => {
    const r = calculateDateDiff({ startDate: '2026-03-01', endDate: '2026-04-01' })
    expect([r.years, r.months, r.days]).toEqual([0, 1, 0])
  })
  it('Jan 1 to Dec 31 is 11 months 30 days', () => {
    const r = calculateDateDiff({ startDate: '2024-01-01', endDate: '2024-12-31' })
    expect([r.years, r.months, r.days, r.totalDays]).toEqual([0, 11, 30, 365])
  })
  it('never returns negative days when the start falls on a month end', () => {
    const r = calculateDateDiff({ startDate: '2024-01-31', endDate: '2024-03-01' })
    expect([r.years, r.months, r.days]).toEqual([0, 1, 1])
  })
  it('clamps a month end to the shorter month before counting days', () => {
    const r = calculateDateDiff({ startDate: '2026-10-31', endDate: '2026-12-25' })
    expect([r.years, r.months, r.days, r.totalDays]).toEqual([0, 1, 25, 55])
  })
  it('counts a leap day birthday to the next year as 1 year', () => {
    const r = calculateDateDiff({ startDate: '2024-02-29', endDate: '2025-03-01' })
    expect([r.years, r.months, r.days]).toEqual([1, 0, 1])
  })
  it('gives the same breakdown when the dates are reversed', () => {
    const r = calculateDateDiff({ startDate: '2026-10-31', endDate: '2024-03-15' })
    expect([r.years, r.months, r.days, r.totalDays]).toEqual([2, 7, 16, 960])
  })
})
