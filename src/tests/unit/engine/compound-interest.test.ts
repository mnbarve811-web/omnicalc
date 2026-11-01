import { describe, it, expect } from 'vitest'
import { calculateCompoundInterest, compareInterestRates, toTodaysDollars } from '@/lib/engine'

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

// Future value of an annuity due: each deposit is made at the start of its period
const annuityDue = (deposit: number, periodRate: number, periods: number) =>
  deposit * ((Math.pow(1 + periodRate, periods) - 1) / periodRate) * (1 + periodRate)

describe('calculateCompoundInterest default options', () => {
  it('explicit defaults for the new options reproduce the original results exactly', () => {
    const implicit = calculateCompoundInterest({ ...BASE, years: 20 })
    const explicit = calculateCompoundInterest({
      ...BASE,
      years: 20,
      contributionFrequency: 12,
      annualContributionIncrease: 0,
      additionalContributions: [],
      taxRate: 0,
      inflationRate: 0,
    })
    expect(explicit).toEqual(implicit)
    expect(implicit.futureValue).toBe(302370.09)
    expect(implicit.yearlyBreakdown[9]).toMatchObject({ balance: 107143.85, contributions: 70000, interest: 37143.85 })
  })

  it('daily compounding with monthly deposits keeps its original value', () => {
    const r = calculateCompoundInterest({ initialInvestment: 25000, monthlyContribution: 250, annualInterestRate: 5.5, compoundFrequency: 365, years: 15 })
    expect(r.futureValue).toBe(127122.11)
  })
})

describe('calculateCompoundInterest contribution frequency', () => {
  it('weekly deposits with weekly compounding match the annuity-due formula', () => {
    const r = calculateCompoundInterest({ initialInvestment: 0, monthlyContribution: 100, contributionFrequency: 52, annualInterestRate: 5, compoundFrequency: 52, years: 10 })
    expect(r.futureValue).toBeCloseTo(annuityDue(100, 0.05 / 52, 520), 2)
    expect(r.totalContributions).toBe(100 * 52 * 10)
  })

  it('biweekly deposits with biweekly compounding match the annuity-due formula', () => {
    const r = calculateCompoundInterest({ initialInvestment: 2000, monthlyContribution: 250, contributionFrequency: 26, annualInterestRate: 6, compoundFrequency: 26, years: 15 })
    const expected = 2000 * Math.pow(1 + 0.06 / 26, 26 * 15) + annuityDue(250, 0.06 / 26, 26 * 15)
    expect(r.futureValue).toBeCloseTo(expected, 2)
    expect(r.totalContributions).toBe(2000 + 250 * 26 * 15)
  })

  it('quarterly deposits with quarterly compounding match the annuity-due formula', () => {
    const r = calculateCompoundInterest({ initialInvestment: 0, monthlyContribution: 1500, contributionFrequency: 4, annualInterestRate: 6, compoundFrequency: 4, years: 20 })
    expect(r.futureValue).toBeCloseTo(annuityDue(1500, 0.015, 80), 2)
  })

  it('annual deposits with annual compounding match the annuity-due formula', () => {
    const r = calculateCompoundInterest({ initialInvestment: 0, monthlyContribution: 6000, contributionFrequency: 1, annualInterestRate: 7, compoundFrequency: 1, years: 30 })
    expect(r.futureValue).toBeCloseTo(annuityDue(6000, 0.07, 30), 2)
    // Hand check: 6000 * ((1.07^30 - 1) / 0.07) * 1.07
    expect(r.futureValue).toBe(606438.25)
  })

  it('annual deposits with monthly compounding grow at the effective annual rate', () => {
    const r = calculateCompoundInterest({ initialInvestment: 0, monthlyContribution: 6000, contributionFrequency: 1, annualInterestRate: 7, compoundFrequency: 12, years: 30 })
    const effectiveAnnual = Math.pow(1 + 0.07 / 12, 12) - 1
    expect(r.futureValue).toBeCloseTo(annuityDue(6000, effectiveAnnual, 30), 2)
  })

  it('weekly deposits with monthly compounding grow at the equivalent weekly rate', () => {
    const r = calculateCompoundInterest({ initialInvestment: 0, monthlyContribution: 50, contributionFrequency: 52, annualInterestRate: 8, compoundFrequency: 12, years: 5 })
    const weeklyRate = Math.pow(1 + 0.08 / 12, 12 / 52) - 1
    expect(r.futureValue).toBeCloseTo(annuityDue(50, weeklyRate, 260), 2)
  })

  it('the contribution frequency does not change how the initial investment grows', () => {
    const lumpOnly = { initialInvestment: 10000, monthlyContribution: 0, annualInterestRate: 7, compoundFrequency: 4, years: 12 }
    const expected = 10000 * Math.pow(1 + 0.07 / 4, 4 * 12)
    for (const contributionFrequency of [52, 26, 12, 4, 1]) {
      expect(calculateCompoundInterest({ ...lumpOnly, contributionFrequency }).futureValue).toBeCloseTo(expected, 2)
    }
  })

  it('at zero interest the balance is the plain sum of deposits for any frequency', () => {
    const r = calculateCompoundInterest({ initialInvestment: 1000, monthlyContribution: 40, contributionFrequency: 26, annualInterestRate: 0, compoundFrequency: 12, years: 3 })
    expect(r.futureValue).toBe(1000 + 40 * 26 * 3)
    expect(r.totalInterestEarned).toBe(0)
  })
})

describe('calculateCompoundInterest annual contribution increase', () => {
  it('annual deposits that grow each year match the growing annuity-due formula', () => {
    const r = calculateCompoundInterest({ initialInvestment: 0, monthlyContribution: 1000, contributionFrequency: 1, annualContributionIncrease: 3, annualInterestRate: 7, compoundFrequency: 1, years: 10 })
    // FV = C(1+r)((1+r)^n - (1+g)^n) / (r - g)
    const expected = 1000 * 1.07 * (Math.pow(1.07, 10) - Math.pow(1.03, 10)) / (0.07 - 0.03)
    expect(r.futureValue).toBeCloseTo(expected, 2)
    expect(r.totalContributions).toBeCloseTo(1000 * (Math.pow(1.03, 10) - 1) / 0.03, 2)
  })

  it('steps monthly deposits up at the start of each year', () => {
    const r = calculateCompoundInterest({ initialInvestment: 0, monthlyContribution: 100, annualContributionIncrease: 10, annualInterestRate: 0, compoundFrequency: 12, years: 3 })
    expect(r.yearlyBreakdown.map(row => row.contributions)).toEqual([1200, 2520, 3972])
  })
})

describe('calculateCompoundInterest additional contributions', () => {
  const lumpOnly = { initialInvestment: 0, monthlyContribution: 0, annualInterestRate: 7, compoundFrequency: 1, years: 10 }

  it('a deposit at the start of year 3 compounds for the remaining 8 years', () => {
    const r = calculateCompoundInterest({ ...lumpOnly, additionalContributions: [{ year: 3, amount: 5000 }] })
    expect(r.futureValue).toBeCloseTo(5000 * Math.pow(1.07, 8), 2)
    expect(r.totalContributions).toBe(5000)
    expect(r.yearlyBreakdown[1].contributions).toBe(0)
    expect(r.yearlyBreakdown[2].contributions).toBe(5000)
  })

  it('a deposit in year 1 behaves like the initial investment', () => {
    const extra = calculateCompoundInterest({ ...lumpOnly, additionalContributions: [{ year: 1, amount: 10000 }] })
    const initial = calculateCompoundInterest({ ...lumpOnly, initialInvestment: 10000 })
    expect(extra.futureValue).toBe(initial.futureValue)
  })

  it('adds up several deposits, including two in the same year', () => {
    const r = calculateCompoundInterest({ ...lumpOnly, additionalContributions: [{ year: 2, amount: 1000 }, { year: 5, amount: 2000 }, { year: 5, amount: 500 }] })
    const expected = 1000 * Math.pow(1.07, 9) + 2500 * Math.pow(1.07, 6)
    expect(r.futureValue).toBeCloseTo(expected, 2)
    expect(r.totalContributions).toBe(3500)
  })

  it('ignores deposits scheduled after the time period ends', () => {
    const r = calculateCompoundInterest({ ...lumpOnly, additionalContributions: [{ year: 11, amount: 5000 }] })
    expect(r.futureValue).toBe(0)
    expect(r.totalContributions).toBe(0)
  })
})

describe('calculateCompoundInterest tax on returns', () => {
  it('taxing each year of growth turns the rate into an after-tax rate for a lump sum', () => {
    const r = calculateCompoundInterest({ initialInvestment: 10000, monthlyContribution: 0, annualInterestRate: 7, compoundFrequency: 1, years: 10, taxRate: 25 })
    // 7% growth taxed at 25% leaves 5.25% a year
    expect(r.futureValue).toBeCloseTo(10000 * Math.pow(1.0525, 10), 2)
  })

  it('taxes only the growth, not the deposits', () => {
    const r = calculateCompoundInterest({ initialInvestment: 0, monthlyContribution: 1000, contributionFrequency: 1, annualInterestRate: 10, compoundFrequency: 1, years: 1, taxRate: 20 })
    // 1000 grows to 1100; 20% of the 100 growth is 20
    expect(r.futureValue).toBe(1080)
    expect(r.totalContributions).toBe(1000)
    expect(r.totalInterestEarned).toBe(80)
  })

  it('lowers the balance below the untaxed result without changing contributions', () => {
    const untaxed = calculateCompoundInterest(BASE)
    const taxed = calculateCompoundInterest({ ...BASE, taxRate: 15 })
    expect(taxed.futureValue).toBeLessThan(untaxed.futureValue)
    expect(taxed.totalContributions).toBe(untaxed.totalContributions)
  })

  it('does not tax a loss', () => {
    const lossInputs = { initialInvestment: 10000, monthlyContribution: 0, annualInterestRate: -5, compoundFrequency: 1, years: 1 }
    const taxed = calculateCompoundInterest({ ...lossInputs, taxRate: 30 })
    expect(taxed.futureValue).toBe(calculateCompoundInterest(lossInputs).futureValue)
  })
})

describe('inflation adjustment', () => {
  it('toTodaysDollars discounts by compounded inflation', () => {
    expect(toTodaysDollars(100000, 3, 20)).toBeCloseTo(100000 / Math.pow(1.03, 20), 2)
    expect(toTodaysDollars(100000, 3, 20)).toBeCloseTo(55367.58, 2)
    expect(toTodaysDollars(5000, 0, 30)).toBe(5000)
  })

  it('reports each year in today\'s dollars without changing the nominal balance', () => {
    const nominal = calculateCompoundInterest(BASE)
    const r = calculateCompoundInterest({ ...BASE, inflationRate: 3 })
    expect(r.futureValue).toBe(nominal.futureValue)
    r.yearlyBreakdown.forEach(row => {
      // Both sides round to cents separately, so allow a cent of difference
      expect(row.inflationAdjustedBalance).toBeCloseTo(row.balance / Math.pow(1.03, row.year), 1)
    })
  })

  it('the today\'s-dollar balance equals the nominal balance when inflation is zero', () => {
    calculateCompoundInterest(BASE).yearlyBreakdown.forEach(row => {
      expect(row.inflationAdjustedBalance).toBe(row.balance)
    })
  })
})

describe('compareInterestRates', () => {
  it('returns future values two points either side of the current rate', () => {
    const rows = compareInterestRates(BASE, [-2, -1, 0, 1, 2])
    expect(rows.map(r => r.annualInterestRate)).toEqual([5, 6, 7, 8, 9])
    rows.forEach(row => {
      expect(row.futureValue).toBe(calculateCompoundInterest({ ...BASE, annualInterestRate: row.annualInterestRate }).futureValue)
    })
  })

  it('skips negative rates and duplicates', () => {
    const rows = compareInterestRates({ ...BASE, annualInterestRate: 1 }, [-2, -1, 0, 1, 2, 2])
    expect(rows.map(r => r.annualInterestRate)).toEqual([0, 1, 2, 3])
  })

  it('rounds the compared rates to avoid floating-point noise', () => {
    const rows = compareInterestRates({ ...BASE, annualInterestRate: 6.37 }, [-1, 0, 1])
    expect(rows.map(r => r.annualInterestRate)).toEqual([5.37, 6.37, 7.37])
  })
})
