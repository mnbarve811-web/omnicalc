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

describe('calculateCompoundInterest edge cases', () => {
  it('a zero-year period leaves the initial investment untouched', () => {
    const r = calculateCompoundInterest({ ...BASE, years: 0 })
    expect(r).toEqual({
      futureValue: BASE.initialInvestment,
      totalContributions: BASE.initialInvestment,
      totalInterestEarned: 0,
      yearlyBreakdown: [],
    })
  })

  it('annual compounding grows a lump sum by exactly the annual rate each year', () => {
    const r = calculateCompoundInterest({ ...BASE, monthlyContribution: 0, compoundFrequency: 1, years: 1 })
    expect(r.futureValue).toBeCloseTo(10700, 2)
  })

  it('more frequent compounding earns more at the same nominal rate', () => {
    const annual = calculateCompoundInterest({ ...BASE, compoundFrequency: 1 })
    const monthly = calculateCompoundInterest({ ...BASE, compoundFrequency: 12 })
    const daily = calculateCompoundInterest({ ...BASE, compoundFrequency: 365 })
    expect(monthly.futureValue).toBeGreaterThan(annual.futureValue)
    expect(daily.futureValue).toBeGreaterThan(monthly.futureValue)
  })

  it('a zero compound frequency falls back to the nominal monthly rate', () => {
    const zeroFreq = calculateCompoundInterest({ ...BASE, compoundFrequency: 0 })
    const monthly = calculateCompoundInterest({ ...BASE, compoundFrequency: 12 })
    expect(zeroFreq.futureValue).toBeCloseTo(monthly.futureValue, 2)
  })

  it('contributions are added at the start of each month before interest', () => {
    const r = calculateCompoundInterest({ initialInvestment: 0, monthlyContribution: 100, annualInterestRate: 12, compoundFrequency: 12, years: 1 })
    const expected = Array.from({ length: 12 }, (_, i) => 100 * Math.pow(1.01, 12 - i)).reduce((a, b) => a + b, 0)
    expect(r.futureValue).toBeCloseTo(expected, 2)
  })

  it('yearly contributions rise by 12 monthly contributions per year', () => {
    const r = calculateCompoundInterest(BASE)
    r.yearlyBreakdown.forEach((row, i) => {
      expect(row.contributions).toBe(BASE.initialInvestment + BASE.monthlyContribution * 12 * (i + 1))
    })
  })

  it('rounds currency results to cents', () => {
    const r = calculateCompoundInterest({ ...BASE, annualInterestRate: 6.37 })
    expect(Math.round(r.futureValue * 100) / 100).toBe(r.futureValue)
    expect(Math.round(r.totalInterestEarned * 100) / 100).toBe(r.totalInterestEarned)
    r.yearlyBreakdown.forEach(row => expect(Math.round(row.balance * 100) / 100).toBe(row.balance))
  })

  it('a zero initial investment still grows contributions', () => {
    const r = calculateCompoundInterest({ ...BASE, initialInvestment: 0 })
    expect(r.totalContributions).toBe(500 * 12 * 10)
    expect(r.totalInterestEarned).toBeGreaterThan(0)
  })
})
