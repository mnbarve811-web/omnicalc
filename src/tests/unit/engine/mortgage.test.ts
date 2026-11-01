import { describe, it, expect } from 'vitest'
import { calculateMortgage, calculateExtraPaymentSavings, compareMortgageTerms } from '@/lib/engine'

// $400,000 home, $80,000 down: a $320,000 loan at 7% over 30 years, scheduled P&I $2,128.97
const LOAN = {
  homePrice: 400000,
  downPayment: 80000,
  loanTermYears: 30,
  interestRate: 7,
  propertyTax: 0,
  homeInsurance: 0,
  hoa: 0,
}

// Reference values below come from closed-form annuity maths, not from the simulation:
// payments needed N = ceil(-ln(1 - P*i/A) / ln(1 + i)), and the trimmed final payment is the
// balance left after N-1 payments, P(1+i)^(N-1) - A((1+i)^(N-1) - 1)/i, plus one period of interest.

describe('calculateMortgage extra monthly payment', () => {
  it('pays a $320,000 7% loan off in 213 months with $500 extra a month', () => {
    const r = calculateMortgage({ ...LOAN, extraMonthlyPayment: 500 })
    expect(r.amortizationSchedule).toHaveLength(213)
    expect(r.totalInterestPaid).toBeCloseTo(239571.0, 1)
    expect(r.amortizationSchedule[0].extra).toBe(500)
    expect(r.amortizationSchedule[0].payment).toBeCloseTo(2628.97, 2)
  })

  it('trims the final payment so the balance ends at exactly zero', () => {
    const r = calculateMortgage({ ...LOAN, extraMonthlyPayment: 500 })
    const last = r.amortizationSchedule[r.amortizationSchedule.length - 1]
    expect(last.payment).toBeCloseTo(2229.79, 2)
    expect(last.balance).toBe(0)
    expect(r.amortizationSchedule.every(row => row.balance >= 0)).toBe(true)
  })

  it('keeps the scheduled monthly P&I and term payment count unchanged', () => {
    const r = calculateMortgage({ ...LOAN, extraMonthlyPayment: 500 })
    expect(r.monthlyPrincipalAndInterest).toBeCloseTo(2128.97, 2)
    expect(r.totalPaymentCount).toBe(360)
  })

  it('principal paid sums to the loan amount', () => {
    const r = calculateMortgage({ ...LOAN, extraMonthlyPayment: 750, lumpSums: [{ month: 24, amount: 20000 }] })
    const principalSum = r.amortizationSchedule.reduce((sum, row) => sum + row.principal, 0)
    expect(principalSum).toBeCloseTo(320000, 6)
  })

  it('caps an extra payment larger than the balance so it only clears the loan', () => {
    const r = calculateMortgage({ ...LOAN, extraMonthlyPayment: 1_000_000 })
    expect(r.amortizationSchedule).toHaveLength(1)
    const [row] = r.amortizationSchedule
    expect(row.balance).toBe(0)
    expect(row.principal).toBeCloseTo(320000, 6)
    expect(row.extra).toBeCloseTo(320000 - 262.3, 1)
    expect(row.interest).toBeCloseTo(1866.67, 2)
  })
})

describe('calculateMortgage lump sums', () => {
  it('applies a $10,000 lump sum in month 1 and then re-amortizes at the scheduled payment', () => {
    const r = calculateMortgage({ ...LOAN, lumpSums: [{ month: 1, amount: 10000 }] })
    expect(r.amortizationSchedule[0].extra).toBe(10000)
    expect(r.amortizationSchedule[0].balance).toBeCloseTo(309737.70, 2)
    expect(r.amortizationSchedule).toHaveLength(326)
    expect(r.totalInterestPaid).toBeCloseTo(383314.50, 1)
  })

  it('adds lump sums that share a month and leaves other months without extra', () => {
    const r = calculateMortgage({ ...LOAN, lumpSums: [{ month: 12, amount: 3000 }, { month: 12, amount: 2000 }] })
    expect(r.amortizationSchedule[11].extra).toBe(5000)
    expect(r.amortizationSchedule[10].extra).toBe(0)
    expect(r.amortizationSchedule[12].extra).toBe(0)
  })

  it('ignores a lump sum scheduled after the loan is paid off', () => {
    const withLate = calculateMortgage({ ...LOAN, extraMonthlyPayment: 500, lumpSums: [{ month: 300, amount: 5000 }] })
    const without = calculateMortgage({ ...LOAN, extraMonthlyPayment: 500 })
    expect(withLate.totalInterestPaid).toBeCloseTo(without.totalInterestPaid, 6)
    expect(withLate.amortizationSchedule).toHaveLength(213)
  })
})

describe('calculateMortgage biweekly', () => {
  // Half the monthly payment, $1,064.48, every two weeks at 7%/26 per period
  it('pays off in 617 biweekly payments, the 285th month', () => {
    const r = calculateMortgage({ ...LOAN, biweekly: true })
    expect(r.amortizationSchedule).toHaveLength(285)
    expect(r.totalInterestPaid).toBeCloseTo(336148.02, 1)
    expect(r.amortizationSchedule[284].balance).toBe(0)
  })

  it('pays 26 half-payments, worth 13 monthly payments, in the first year', () => {
    const r = calculateMortgage({ ...LOAN, biweekly: true })
    const firstYear = r.amortizationSchedule.slice(0, 12).reduce((sum, row) => sum + row.payment, 0)
    expect(firstYear).toBeCloseTo(13 * 2128.968, 1)
    expect(r.amortizationSchedule[0].payment).toBeCloseTo(2128.97, 2)
    expect(r.amortizationSchedule[5].payment).toBeCloseTo(3 * 1064.48, 1)
  })

  it('charges 7%/26 interest per two-week period', () => {
    const r = calculateMortgage({ ...LOAN, biweekly: true })
    const firstInterest = 320000 * 0.07 / 26
    const secondInterest = (320000 - (2128.968 / 2 - firstInterest)) * 0.07 / 26
    expect(r.amortizationSchedule[0].interest).toBeCloseTo(firstInterest + secondInterest, 2)
  })

  it('at 0% pays $240,000 in 720 half-payments, ending in month 333', () => {
    const r = calculateMortgage({ ...LOAN, homePrice: 300000, downPayment: 60000, interestRate: 0, biweekly: true })
    expect(r.amortizationSchedule).toHaveLength(333)
    expect(r.totalInterestPaid).toBe(0)
  })

  it('applies the extra monthly payment once a month, not every two weeks', () => {
    const r = calculateMortgage({ ...LOAN, biweekly: true, extraMonthlyPayment: 200 })
    expect(r.amortizationSchedule[0].extra).toBe(200)
    expect(r.amortizationSchedule[5].extra).toBe(200)
  })
})

describe('calculateExtraPaymentSavings', () => {
  it('reports interest and months saved against the plain schedule', () => {
    const s = calculateExtraPaymentSavings({ ...LOAN, extraMonthlyPayment: 500 })
    expect(s.payoffMonths).toBe(213)
    expect(s.baselinePayoffMonths).toBe(360)
    expect(s.monthsSaved).toBe(147)
    expect(s.baselineTotalInterest).toBeCloseTo(446428.47, 1)
    expect(s.interestSaved).toBeCloseTo(446428.47 - 239571.0, 0)
  })

  it('treats biweekly payments as an extra', () => {
    const s = calculateExtraPaymentSavings({ ...LOAN, biweekly: true })
    expect(s.monthsSaved).toBe(75)
    expect(s.interestSaved).toBeCloseTo(446428.47 - 336148.02, 0)
  })

  it('saves nothing without extras', () => {
    const s = calculateExtraPaymentSavings(LOAN)
    expect(s.monthsSaved).toBe(0)
    expect(s.interestSaved).toBeCloseTo(0, 6)
  })
})

describe('compareMortgageTerms', () => {
  it('compares 15, 20, 25 and 30 years by default', () => {
    const rows = compareMortgageTerms(LOAN)
    expect(rows.map(row => row.termYears)).toEqual([15, 20, 25, 30])
    const [fifteen, , , thirty] = rows
    expect(fifteen.monthlyPrincipalAndInterest).toBeCloseTo(2876.25, 2)
    expect(fifteen.totalInterestPaid).toBeCloseTo(197725.08, 1)
    expect(fifteen.payoffMonths).toBe(180)
    expect(thirty.monthlyPrincipalAndInterest).toBeCloseTo(2128.97, 2)
    expect(thirty.payoffMonths).toBe(360)
  })

  it('includes extras in every term', () => {
    const rows = compareMortgageTerms({ ...LOAN, extraMonthlyPayment: 500 })
    const thirty = rows[3]
    expect(thirty.payoffMonths).toBe(213)
    expect(thirty.totalInterestPaid).toBeCloseTo(239571.0, 1)
    expect(rows[0].payoffMonths).toBeLessThan(180)
  })
})
