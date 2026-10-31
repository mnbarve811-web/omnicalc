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
