import { describe, it, expect } from 'vitest'
import { calculateCompoundInterest } from '@/lib/engine'

const BASE = {
  initialInvestment: 10000,
  monthlyContribution: 500,
  annualInterestRate: 7,
  compoundFrequency: 12,
  years: 10,
}

describe('calculateCompoundInterest', () => {
  it('returns futureValue greater than total contributions', () => {
    const r = calculateCompoundInterest(BASE)
    const totalContribs = BASE.initialInvestment + BASE.monthlyContribution * 12 * BASE.years
    expect(r.futureValue).toBeGreaterThan(totalContribs)
  })

  it('totalContributions equals initial + monthly * 12 * years', () => {
    const r = calculateCompoundInterest(BASE)
    expect(r.totalContributions).toBeCloseTo(BASE.initialInvestment + BASE.monthlyContribution * 12 * BASE.years, 0)
  })

  it('totalInterestEarned = futureValue - totalContributions', () => {
    const r = calculateCompoundInterest(BASE)
    expect(r.totalInterestEarned).toBeCloseTo(r.futureValue - r.totalContributions, 0)
  })

  it('yearlyBreakdown has correct length', () => {
    const r = calculateCompoundInterest(BASE)
    expect(r.yearlyBreakdown).toHaveLength(BASE.years)
  })

  it('yearlyBreakdown last year balance equals futureValue', () => {
    const r = calculateCompoundInterest(BASE)
    const last = r.yearlyBreakdown[BASE.years - 1]
    expect(last.balance).toBeCloseTo(r.futureValue, 0)
  })

  it('no contributions grows by compound formula', () => {
    const r = calculateCompoundInterest({ ...BASE, monthlyContribution: 0 })
    // A = P(1 + r/n)^(nt)
    const expected = BASE.initialInvestment * Math.pow(1 + 0.07 / 12, 12 * BASE.years)
    expect(r.futureValue).toBeCloseTo(expected, 0)
  })

  it('zero interest returns exact contribution sum', () => {
    const r = calculateCompoundInterest({ ...BASE, annualInterestRate: 0 })
    const expected = BASE.initialInvestment + BASE.monthlyContribution * 12 * BASE.years
    expect(r.futureValue).toBeCloseTo(expected, 0)
  })
})
