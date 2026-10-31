import { describe, it, expect } from 'vitest'
import { calculateDebtPayoff } from '@/lib/engine'

const DEBTS = [
  { name: 'Credit Card', balance: 5000, interestRate: 20, minimumPayment: 100 },
  { name: 'Car Loan',    balance: 8000, interestRate: 6,  minimumPayment: 200 },
  { name: 'Student Loan', balance: 12000, interestRate: 5, minimumPayment: 150 },
]

describe('calculateDebtPayoff', () => {
  it('snowball pays smallest balance first', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, strategy: 'snowball', extraMonthlyPayment: 0 })
    expect(r.payoffOrder[0]).toBe('Credit Card')
  })

  it('avalanche pays highest interest first', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, strategy: 'avalanche', extraMonthlyPayment: 0 })
    expect(r.payoffOrder[0]).toBe('Credit Card')
  })

  it('avalanche pays higher-interest debt before lower-interest', () => {
    const debts = [
      { name: 'A', balance: 5000, interestRate: 20, minimumPayment: 100 },
      { name: 'B', balance: 3000, interestRate: 5,  minimumPayment: 60 },
    ]
    const r = calculateDebtPayoff({ debts, strategy: 'avalanche', extraMonthlyPayment: 0 })
    expect(r.payoffOrder[0]).toBe('A')
  })

  it('snowball pays smallest balance first when rates equal', () => {
    const debts = [
      { name: 'Big', balance: 10000, interestRate: 10, minimumPayment: 200 },
      { name: 'Small', balance: 2000, interestRate: 10, minimumPayment: 50 },
    ]
    const r = calculateDebtPayoff({ debts, strategy: 'snowball', extraMonthlyPayment: 0 })
    expect(r.payoffOrder[0]).toBe('Small')
  })

  it('extra payment reduces months to debt-free', () => {
    const base = calculateDebtPayoff({ debts: DEBTS, strategy: 'avalanche', extraMonthlyPayment: 0 })
    const withExtra = calculateDebtPayoff({ debts: DEBTS, strategy: 'avalanche', extraMonthlyPayment: 500 })
    expect(withExtra.monthsToDebtFree).toBeLessThan(base.monthsToDebtFree)
  })

  it('extra payment reduces total interest paid', () => {
    const base = calculateDebtPayoff({ debts: DEBTS, strategy: 'avalanche', extraMonthlyPayment: 0 })
    const withExtra = calculateDebtPayoff({ debts: DEBTS, strategy: 'avalanche', extraMonthlyPayment: 500 })
    expect(withExtra.totalInterestPaid).toBeLessThan(base.totalInterestPaid)
  })

  it('payoffOrder contains all debt names', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, strategy: 'snowball', extraMonthlyPayment: 0 })
    expect(r.payoffOrder).toHaveLength(DEBTS.length)
    expect(r.payoffOrder).toEqual(expect.arrayContaining(DEBTS.map(d => d.name)))
  })
})

describe('calculateDebtPayoff edge cases', () => {
  it('no debts are paid off in zero months', () => {
    const r = calculateDebtPayoff({ debts: [], strategy: 'avalanche', extraMonthlyPayment: 100 })
    expect(r).toEqual({ monthsToDebtFree: 0, totalInterestPaid: 0, payoffOrder: [] })
  })

  it('a zero-interest debt takes balance / payment months and no interest', () => {
    const r = calculateDebtPayoff({ debts: [{ name: 'A', balance: 1000, interestRate: 0, minimumPayment: 100 }], strategy: 'avalanche', extraMonthlyPayment: 0 })
    expect(r.monthsToDebtFree).toBe(10)
    expect(r.totalInterestPaid).toBe(0)
  })

  it('extra payment is added to the monthly budget', () => {
    const r = calculateDebtPayoff({ debts: [{ name: 'A', balance: 1200, interestRate: 0, minimumPayment: 100 }], strategy: 'avalanche', extraMonthlyPayment: 100 })
    expect(r.monthsToDebtFree).toBe(6)
  })

  it('minimums freed by a paid-off debt roll into the next one', () => {
    const debts = [
      { name: 'A', balance: 400, interestRate: 0, minimumPayment: 100 },
      { name: 'B', balance: 600, interestRate: 0, minimumPayment: 100 },
    ]
    const r = calculateDebtPayoff({ debts, strategy: 'snowball', extraMonthlyPayment: 0 })
    expect(r.monthsToDebtFree).toBe(5)
    expect(r.payoffOrder).toEqual(['A', 'B'])
  })

  // Bug: budget left over in the month a debt is cleared is discarded instead of going to the next debt
  it.todo('budget left over after clearing a debt is applied to the next debt that month', () => {
    const debts = [
      { name: 'A', balance: 500, interestRate: 0, minimumPayment: 100 },
      { name: 'B', balance: 500, interestRate: 0, minimumPayment: 100 },
    ]
    const r = calculateDebtPayoff({ debts, strategy: 'snowball', extraMonthlyPayment: 0 })
    expect(r.monthsToDebtFree).toBe(5)
  })

  it('avalanche pays less interest than snowball when the smallest debt has the lowest rate', () => {
    const debts = [
      { name: 'Small Low', balance: 2000, interestRate: 3, minimumPayment: 50 },
      { name: 'Big High', balance: 8000, interestRate: 24, minimumPayment: 200 },
    ]
    const snowball = calculateDebtPayoff({ debts, strategy: 'snowball', extraMonthlyPayment: 100 })
    const avalanche = calculateDebtPayoff({ debts, strategy: 'avalanche', extraMonthlyPayment: 100 })
    expect(snowball.payoffOrder).toEqual(['Small Low', 'Big High'])
    expect(avalanche.payoffOrder).toEqual(['Big High', 'Small Low'])
    expect(avalanche.totalInterestPaid).toBeLessThan(snowball.totalInterestPaid)
  })

  it('a higher balance takes more months', () => {
    const base = calculateDebtPayoff({ debts: DEBTS, strategy: 'avalanche', extraMonthlyPayment: 0 })
    const bigger = calculateDebtPayoff({ debts: [{ ...DEBTS[0], balance: 9000 }, DEBTS[1], DEBTS[2]], strategy: 'avalanche', extraMonthlyPayment: 0 })
    expect(bigger.monthsToDebtFree).toBeGreaterThan(base.monthsToDebtFree)
  })

  it('does not mutate the input debts', () => {
    const debts = DEBTS.map(d => ({ ...d }))
    calculateDebtPayoff({ debts, strategy: 'snowball', extraMonthlyPayment: 100 })
    expect(debts).toEqual(DEBTS)
  })

  it('stops at the 1200-month cap when payments never cover interest', () => {
    const r = calculateDebtPayoff({ debts: [{ name: 'A', balance: 10000, interestRate: 24, minimumPayment: 100 }], strategy: 'avalanche', extraMonthlyPayment: 0 })
    expect(r.monthsToDebtFree).toBe(1200)
    expect(r.payoffOrder).toEqual([])
  })

  // Bug: the target debt is matched by name, so two debts sharing a name both receive the full monthly budget
  it.todo('debts with duplicate names are paid off as separate debts', () => {
    const debt = { name: 'Card', balance: 5000, interestRate: 10, minimumPayment: 100 }
    const duplicate = calculateDebtPayoff({ debts: [debt, { ...debt }], strategy: 'avalanche', extraMonthlyPayment: 0 })
    const distinct = calculateDebtPayoff({ debts: [debt, { ...debt, name: 'Card 2' }], strategy: 'avalanche', extraMonthlyPayment: 0 })
    expect(duplicate.monthsToDebtFree).toBe(distinct.monthsToDebtFree)
  })
})
