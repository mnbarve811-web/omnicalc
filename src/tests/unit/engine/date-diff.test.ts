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

describe('calculateDateDiff: edge cases', () => {
  it('a single day apart', () => {
    const r = calculateDateDiff({ startDate: '2026-10-30', endDate: '2026-10-31' })
    expect([r.years, r.months, r.days, r.totalDays]).toEqual([0, 0, 1, 1])
  })
  it('crosses a year boundary by one day', () => {
    const r = calculateDateDiff({ startDate: '2025-12-31', endDate: '2026-01-01' })
    expect([r.years, r.months, r.days, r.totalDays]).toEqual([0, 0, 1, 1])
  })
  it('crosses a year boundary by months', () => {
    const r = calculateDateDiff({ startDate: '2025-11-15', endDate: '2026-02-10' })
    expect([r.years, r.months, r.days, r.totalDays]).toEqual([0, 2, 26, 87])
  })
  it('a leap year has 366 days', () => {
    const r = calculateDateDiff({ startDate: '2024-01-01', endDate: '2025-01-01' })
    expect([r.years, r.months, r.days, r.totalDays]).toEqual([1, 0, 0, 366])
  })
  it('a common year has 365 days', () => {
    const r = calculateDateDiff({ startDate: '2025-01-01', endDate: '2026-01-01' })
    expect(r.totalDays).toBe(365)
  })
  it('February in a leap year has 29 days', () => {
    const r = calculateDateDiff({ startDate: '2024-02-01', endDate: '2024-03-01' })
    expect([r.months, r.days, r.totalDays]).toEqual([1, 0, 29])
  })
  it('February in a common year has 28 days', () => {
    const r = calculateDateDiff({ startDate: '2026-02-01', endDate: '2026-03-01' })
    expect([r.months, r.days, r.totalDays]).toEqual([1, 0, 28])
  })
  it('1900 is not a leap year but 2000 is', () => {
    expect(calculateDateDiff({ startDate: '1900-02-28', endDate: '1900-03-01' }).totalDays).toBe(1)
    expect(calculateDateDiff({ startDate: '2000-02-28', endDate: '2000-03-01' }).totalDays).toBe(2)
  })
  it('leap day to leap day four years later is exactly 4 years', () => {
    const r = calculateDateDiff({ startDate: '2020-02-29', endDate: '2024-02-29' })
    expect([r.years, r.months, r.days, r.totalDays]).toEqual([4, 0, 0, 1461])
  })
  it('leap day to Feb 28 of the next year clamps to exactly 1 year', () => {
    const r = calculateDateDiff({ startDate: '2024-02-29', endDate: '2025-02-28' })
    expect([r.years, r.months, r.days, r.totalDays]).toEqual([1, 0, 0, 365])
  })
  it('Jan 31 to Feb 29 clamps to the end of February', () => {
    const r = calculateDateDiff({ startDate: '2024-01-31', endDate: '2024-02-29' })
    expect([r.years, r.months, r.days]).toEqual([0, 1, 0])
  })
  it('a multi-decade span counts every day', () => {
    const r = calculateDateDiff({ startDate: '2000-01-01', endDate: '2026-10-31' })
    expect([r.years, r.months, r.days, r.totalDays]).toEqual([26, 9, 30, 9800])
  })
  it('reversing the dates never changes the result', () => {
    const pairs: [string, string][] = [
      ['2024-02-29', '2025-03-01'],
      ['2023-12-15', '2025-01-10'],
      ['2026-01-31', '2026-03-30'],
    ]
    for (const [a, b] of pairs) {
      expect(calculateDateDiff({ startDate: b, endDate: a })).toEqual(calculateDateDiff({ startDate: a, endDate: b }))
    }
  })
  it('a malformed date yields NaN rather than throwing', () => {
    const r = calculateDateDiff({ startDate: 'not-a-date', endDate: '2026-10-31' })
    expect(r.totalDays).toBeNaN()
  })
})
