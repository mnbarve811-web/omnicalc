import { describe, it, expect } from 'vitest'
import { calculateAutoLoan, compareAutoLoanTerms } from '@/lib/engine'

const BASE = {
  vehiclePrice: 30000,
  downPayment: 5000,
  tradeInValue: 2000,
  interestRate: 6.0,
  loanTermMonths: 60,
  salesTaxRate: 8,
}

describe('calculateAutoLoan', () => {
  it('calculates positive monthly payment', () => {
    const r = calculateAutoLoan(BASE)
    expect(r.monthlyPayment).toBeGreaterThan(0)
  })

  it('amortization schedule has correct length', () => {
    const r = calculateAutoLoan(BASE)
    expect(r.amortizationSchedule).toHaveLength(BASE.loanTermMonths)
  })

  it('final balance is close to zero', () => {
    const r = calculateAutoLoan(BASE)
    expect(r.amortizationSchedule[BASE.loanTermMonths - 1].balance).toBeCloseTo(0, 0)
  })

  it('loanBalance = vehiclePrice + tax on (price - tradeIn) - downPayment - tradeIn', () => {
    const r = calculateAutoLoan(BASE)
    expect(r.loanBalance).toBeCloseTo(30000 + 0.08 * 28000 - 5000 - 2000, 6)
  })

  it('totalInterestPaid is positive', () => {
    const r = calculateAutoLoan(BASE)
    expect(r.totalInterestPaid).toBeGreaterThan(0)
  })

  it('zero interest rate: monthly payment = loanBalance / term', () => {
    const r = calculateAutoLoan({ ...BASE, interestRate: 0 })
    expect(r.monthlyPayment).toBeCloseTo(25240 / BASE.loanTermMonths, 2)
  })
})

describe('calculateAutoLoan edge cases', () => {
  it('matches the standard payment for $25,000 at 6% over 60 months', () => {
    const r = calculateAutoLoan({ vehiclePrice: 25000, downPayment: 0, tradeInValue: 0, interestRate: 6, loanTermMonths: 60, salesTaxRate: 0 })
    expect(r.monthlyPayment).toBeCloseTo(483.32, 2)
  })

  it('sales tax is charged on the full price when the trade-in does not reduce the taxable price', () => {
    const r = calculateAutoLoan({ ...BASE, downPayment: 10000, tradeInValue: 5000, tradeInReducesTax: false })
    expect(r.salesTax).toBeCloseTo(2400, 6)
    expect(r.loanBalance).toBeCloseTo(30000 * 1.08 - 15000, 6)
  })

  it('a down payment and trade-in above the price are clamped to a zero loan', () => {
    const r = calculateAutoLoan({ ...BASE, downPayment: 30000, tradeInValue: 10000 })
    expect(r.loanBalance).toBe(0)
    expect(r.monthlyPayment).toBe(0)
    expect(r.totalInterestPaid).toBe(0)
  })

  it('total interest equals all payments minus the amount financed', () => {
    const r = calculateAutoLoan(BASE)
    expect(r.totalInterestPaid).toBeCloseTo(r.monthlyPayment * BASE.loanTermMonths - r.loanBalance, 2)
  })

  it('a one-month term repays the balance plus one month of interest', () => {
    const r = calculateAutoLoan({ vehiclePrice: 1000, downPayment: 0, tradeInValue: 0, interestRate: 12, loanTermMonths: 1, salesTaxRate: 0 })
    expect(r.monthlyPayment).toBeCloseTo(1010, 6)
    expect(r.totalInterestPaid).toBeCloseTo(10, 6)
  })

  it('zero interest rate charges no interest', () => {
    const r = calculateAutoLoan({ ...BASE, interestRate: 0 })
    expect(r.totalInterestPaid).toBe(0)
    expect(r.amortizationSchedule[BASE.loanTermMonths - 1].balance).toBeCloseTo(0, 6)
  })

  it('a longer term lowers the payment but raises total interest', () => {
    const short = calculateAutoLoan({ ...BASE, loanTermMonths: 36 })
    const long = calculateAutoLoan({ ...BASE, loanTermMonths: 84 })
    expect(long.monthlyPayment).toBeLessThan(short.monthlyPayment)
    expect(long.totalInterestPaid).toBeGreaterThan(short.totalInterestPaid)
  })

  it('a zero-month term returns a finite payment', () => {
    const r = calculateAutoLoan({ ...BASE, loanTermMonths: 0 })
    expect(Number.isFinite(r.monthlyPayment)).toBe(true)
  })
  it('a negative term is treated like a zero term', () => {
    const r = calculateAutoLoan({ ...BASE, loanTermMonths: -12 })
    expect(r.monthlyPayment).toBe(0)
    expect(r.amortizationSchedule).toEqual([])
  })
})

describe('calculateAutoLoan sales tax and fees', () => {
  const PLAIN = { vehiclePrice: 30000, downPayment: 10000, tradeInValue: 5000, interestRate: 6, loanTermMonths: 60, salesTaxRate: 8 }

  it('by default a trade-in reduces the taxable price', () => {
    const r = calculateAutoLoan(PLAIN)
    expect(r.salesTax).toBeCloseTo(2000, 6)
    expect(r.loanBalance).toBeCloseTo(30000 + 2000 - 10000 - 5000, 6)
  })

  it('down payment does not reduce the taxable price', () => {
    const r = calculateAutoLoan({ ...PLAIN, tradeInValue: 0 })
    expect(r.salesTax).toBeCloseTo(2400, 6)
  })

  it('a trade-in above the price leaves no sales tax and no loan', () => {
    const r = calculateAutoLoan({ ...PLAIN, vehiclePrice: 10000, downPayment: 0, tradeInValue: 12000 })
    expect(r.salesTax).toBe(0)
    expect(r.loanBalance).toBe(0)
  })

  it('financed fees are added to the loan and are not taxed', () => {
    const r = calculateAutoLoan({ ...PLAIN, fees: 600, feesFinanced: true })
    expect(r.salesTax).toBeCloseTo(2000, 6)
    expect(r.loanBalance).toBeCloseTo(17600, 6)
    expect(r.upfrontFees).toBe(0)
  })

  it('fees are financed by default', () => {
    const r = calculateAutoLoan({ ...PLAIN, fees: 600 })
    expect(r.loanBalance).toBeCloseTo(17600, 6)
  })

  it('fees paid upfront stay out of the loan but count toward total cost', () => {
    const r = calculateAutoLoan({ ...PLAIN, fees: 600, feesFinanced: false })
    expect(r.loanBalance).toBeCloseTo(17000, 6)
    expect(r.upfrontFees).toBe(600)
    expect(r.totalCost).toBeCloseTo(30000 + 2000 + 600 + r.totalInterestPaid, 6)
  })

  it('total cost is price plus tax, fees and interest', () => {
    const r = calculateAutoLoan({ vehiclePrice: 25000, downPayment: 0, tradeInValue: 0, interestRate: 6, loanTermMonths: 60, salesTaxRate: 0 })
    expect(r.totalCost).toBeCloseTo(28999.20, 1)
  })
})

describe('calculateAutoLoan extra monthly payment', () => {
  const LOAN = { vehiclePrice: 25000, downPayment: 0, tradeInValue: 0, interestRate: 6, loanTermMonths: 60, salesTaxRate: 0 }

  it('without an extra payment the loan runs the full term and saves nothing', () => {
    const r = calculateAutoLoan(LOAN)
    expect(r.payoffMonths).toBe(60)
    expect(r.monthsSaved).toBe(0)
    expect(r.interestSaved).toBe(0)
  })

  it('$100 extra on $25,000 at 6% over 60 months pays off in 49 months', () => {
    const r = calculateAutoLoan({ ...LOAN, extraMonthlyPayment: 100 })
    expect(r.monthlyPayment).toBeCloseTo(483.32, 2)
    expect(r.payoffMonths).toBe(49)
    expect(r.monthsSaved).toBe(11)
    expect(r.amortizationSchedule).toHaveLength(49)
    expect(r.amortizationSchedule[48].balance).toBe(0)
    expect(r.totalInterestPaid).toBeCloseTo(3206.27, 2)
    expect(r.interestSaved).toBeCloseTo(3999.20 - 3206.27, 1)
  })

  it('at 0% the final payment is trimmed to the remaining balance', () => {
    const r = calculateAutoLoan({ ...LOAN, vehiclePrice: 12000, interestRate: 0, loanTermMonths: 12, extraMonthlyPayment: 700 })
    expect(r.payoffMonths).toBe(8)
    expect(r.monthsSaved).toBe(4)
    expect(r.interestSaved).toBe(0)
    expect(r.amortizationSchedule[0].payment).toBeCloseTo(1700, 6)
    expect(r.amortizationSchedule[7].payment).toBeCloseTo(100, 6)
    expect(r.amortizationSchedule[7].balance).toBe(0)
  })

  it('an extra payment larger than the balance pays off in one month', () => {
    const r = calculateAutoLoan({ ...LOAN, vehiclePrice: 1000, interestRate: 12, loanTermMonths: 2, extraMonthlyPayment: 1000 })
    expect(r.payoffMonths).toBe(1)
    expect(r.amortizationSchedule[0].payment).toBeCloseTo(1010, 6)
    expect(r.totalInterestPaid).toBeCloseTo(10, 6)
    expect(r.interestSaved).toBeCloseTo(5.0249, 4)
  })

  it('total interest equals all payments minus the amount financed with an extra payment', () => {
    const r = calculateAutoLoan({ ...LOAN, extraMonthlyPayment: 250 })
    const paid = r.amortizationSchedule.reduce((s, row) => s + row.payment, 0)
    expect(r.totalInterestPaid).toBeCloseTo(paid - r.loanBalance, 6)
  })

  it('a zero loan has no payoff months', () => {
    const r = calculateAutoLoan({ ...LOAN, downPayment: 30000, extraMonthlyPayment: 100 })
    expect(r.payoffMonths).toBe(0)
    expect(r.monthsSaved).toBe(0)
    expect(r.amortizationSchedule).toEqual([])
  })
})

describe('compareAutoLoanTerms', () => {
  const LOAN = { vehiclePrice: 25000, downPayment: 0, tradeInValue: 0, interestRate: 6, loanTermMonths: 60, salesTaxRate: 0 }

  it('lists 36 to 84 month terms with payment, interest and total cost', () => {
    const rows = compareAutoLoanTerms(LOAN)
    expect(rows.map(r => r.termMonths)).toEqual([36, 48, 60, 72, 84])
    const expected = [
      [760.55, 2379.74, 27379.74],
      [587.13, 3182.03, 28182.03],
      [483.32, 3999.20, 28999.20],
      [414.32, 4831.20, 29831.20],
      [365.21, 5677.96, 30677.96],
    ]
    rows.forEach((row, i) => {
      expect(row.monthlyPayment).toBeCloseTo(expected[i][0], 2)
      expect(row.totalInterest).toBeCloseTo(expected[i][1], 1)
      expect(row.totalCost).toBeCloseTo(expected[i][2], 1)
    })
  })

  it('ignores the extra payment so terms compare on their scheduled payments', () => {
    const rows = compareAutoLoanTerms({ ...LOAN, extraMonthlyPayment: 100 })
    expect(rows[2].totalInterest).toBeCloseTo(3999.20, 1)
  })
})
