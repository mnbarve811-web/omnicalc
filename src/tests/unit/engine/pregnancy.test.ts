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
})
