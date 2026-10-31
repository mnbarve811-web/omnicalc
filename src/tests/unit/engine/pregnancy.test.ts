import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { calculatePregnancy } from '@/lib/engine'

describe('calculatePregnancy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 5, 15, 12, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('due date is LMP + 280 days', () => {
    const r = calculatePregnancy({ lastMenstrualPeriod: '2025-01-01' })
    expect(r.dueDate).toBe('2025-10-08')
  })

  it('due date crosses year boundary', () => {
    const r = calculatePregnancy({ lastMenstrualPeriod: '2025-06-01' })
    expect(r.dueDate).toBe('2026-03-08')
  })

  it('currentWeek counts whole weeks since LMP', () => {
    const r = calculatePregnancy({ lastMenstrualPeriod: '2025-01-01' })
    expect(r.currentWeek).toBe(23)
  })

  it('currentWeek is 0 for future LMP', () => {
    const r = calculatePregnancy({ lastMenstrualPeriod: '2099-01-01' })
    expect(r.currentWeek).toBe(0)
    expect(r.trimester).toBe(1)
  })

  it('currentWeek clamps to 42 for distant past LMP', () => {
    const r = calculatePregnancy({ lastMenstrualPeriod: '2020-01-01' })
    expect(r.currentWeek).toBe(42)
  })

  it('trimester 1 at week 8', () => {
    const r = calculatePregnancy({ lastMenstrualPeriod: '2025-04-20' })
    expect(r.currentWeek).toBe(8)
    expect(r.trimester).toBe(1)
  })

  it('trimester boundaries at weeks 12/13 and 27/28', () => {
    expect(calculatePregnancy({ lastMenstrualPeriod: '2025-03-23' })).toMatchObject({ currentWeek: 12, trimester: 1 })
    expect(calculatePregnancy({ lastMenstrualPeriod: '2025-03-16' })).toMatchObject({ currentWeek: 13, trimester: 2 })
    expect(calculatePregnancy({ lastMenstrualPeriod: '2024-12-08' })).toMatchObject({ currentWeek: 27, trimester: 2 })
    expect(calculatePregnancy({ lastMenstrualPeriod: '2024-12-01' })).toMatchObject({ currentWeek: 28, trimester: 3 })
  })

  it('LMP today is week 0, trimester 1', () => {
    expect(calculatePregnancy({ lastMenstrualPeriod: '2025-06-15' })).toMatchObject({ currentWeek: 0, trimester: 1 })
  })

  it('week increments only after a full 7 days', () => {
    expect(calculatePregnancy({ lastMenstrualPeriod: '2025-06-09' }).currentWeek).toBe(0)
    expect(calculatePregnancy({ lastMenstrualPeriod: '2025-06-08' }).currentWeek).toBe(1)
  })

  it('currentWeek reaches exactly 42 at 294 days', () => {
    expect(calculatePregnancy({ lastMenstrualPeriod: '2024-08-26' }).currentWeek).toBe(41)
    expect(calculatePregnancy({ lastMenstrualPeriod: '2024-08-25' })).toMatchObject({ currentWeek: 42, trimester: 3 })
  })

  it('due date accounts for a leap day', () => {
    expect(calculatePregnancy({ lastMenstrualPeriod: '2024-02-29' }).dueDate).toBe('2024-12-05')
    expect(calculatePregnancy({ lastMenstrualPeriod: '2023-12-01' }).dueDate).toBe('2024-09-06')
  })

  it('week uses the local calendar date, not the time of day', () => {
    vi.setSystemTime(new Date(2025, 5, 15, 23, 59, 0))
    expect(calculatePregnancy({ lastMenstrualPeriod: '2025-06-08' }).currentWeek).toBe(1)
    vi.setSystemTime(new Date(2025, 5, 15, 0, 1, 0))
    expect(calculatePregnancy({ lastMenstrualPeriod: '2025-06-08' }).currentWeek).toBe(1)
  })
})
