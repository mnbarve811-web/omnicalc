import { describe, it, expect } from 'vitest'
import { calculateDebtPayoff, calculateMinimumPaymentsOnly, getDebtFreeDate } from '@/lib/engine'

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
    expect(r).toEqual({ monthsToDebtFree: 0, totalInterestPaid: 0, payoffOrder: [], paidOff: true })
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

  it('budget left over after clearing a debt is applied to the next debt that month', () => {
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

  it('debts with duplicate names are paid off as separate debts', () => {
    const debt = { name: 'Card', balance: 5000, interestRate: 10, minimumPayment: 100 }
    const duplicate = calculateDebtPayoff({ debts: [debt, { ...debt }], strategy: 'avalanche', extraMonthlyPayment: 0 })
    const distinct = calculateDebtPayoff({ debts: [debt, { ...debt, name: 'Card 2' }], strategy: 'avalanche', extraMonthlyPayment: 0 })
    expect(duplicate.monthsToDebtFree).toBe(distinct.monthsToDebtFree)
  })
  it('reports debts that are never paid off when payments do not cover interest', () => {
    const r = calculateDebtPayoff({
      debts: [{ name: 'Card', balance: 10000, interestRate: 30, minimumPayment: 100 }],
      strategy: 'avalanche',
      extraMonthlyPayment: 0,
    })
    expect(r.paidOff).toBe(false)
  })
  it('reports paid off when every debt is cleared', () => {
    const r = calculateDebtPayoff({
      debts: [{ name: 'Card', balance: 1000, interestRate: 10, minimumPayment: 100 }],
      strategy: 'avalanche',
      extraMonthlyPayment: 0,
    })
    expect(r.paidOff).toBe(true)
  })
})

describe('calculateDebtPayoff lump sums', () => {
  it('a lump sum is paid on top of the budget in its month', () => {
    // 1000 left after month 2; month 3 pays 100 + 500, leaving 400 for four more months
    const r = calculateDebtPayoff({
      debts: [{ name: 'A', balance: 1200, interestRate: 0, minimumPayment: 100 }],
      strategy: 'avalanche',
      extraMonthlyPayment: 0,
      lumpSums: [{ month: 3, amount: 500 }],
    })
    expect(r.monthsToDebtFree).toBe(7)
  })

  it('a lump sum follows strategy order and spills into the next debt', () => {
    // Month 1: A grows to 1010 and is cleared by 200 + 1000; the 190 left reduces B to 810, then 200 a month
    const r = calculateDebtPayoff({
      debts: [
        { name: 'A', balance: 1000, interestRate: 12, minimumPayment: 100 },
        { name: 'B', balance: 1000, interestRate: 0, minimumPayment: 100 },
      ],
      strategy: 'avalanche',
      extraMonthlyPayment: 0,
      lumpSums: [{ month: 1, amount: 1000 }],
    })
    expect(r.payoffOrder).toEqual(['A', 'B'])
    expect(r.monthsToDebtFree).toBe(6)
    expect(r.totalInterestPaid).toBeCloseTo(10, 10)
  })

  it('lump sums in the same month add up', () => {
    // Month 2 pays 100 + 600, leaving 200
    const r = calculateDebtPayoff({
      debts: [{ name: 'A', balance: 1000, interestRate: 0, minimumPayment: 100 }],
      strategy: 'snowball',
      extraMonthlyPayment: 0,
      lumpSums: [{ month: 2, amount: 300 }, { month: 2, amount: 300 }],
    })
    expect(r.monthsToDebtFree).toBe(4)
  })

  it('a lump sum after the debts are paid off changes nothing', () => {
    const debts = [{ name: 'A', balance: 1000, interestRate: 10, minimumPayment: 500 }]
    const without = calculateDebtPayoff({ debts, strategy: 'avalanche', extraMonthlyPayment: 0 })
    const late = calculateDebtPayoff({ debts, strategy: 'avalanche', extraMonthlyPayment: 0, lumpSums: [{ month: 5, amount: 1000 }] })
    expect(late).toEqual(without)
  })

  it('an empty lump-sum list matches no lump sums', () => {
    const without = calculateDebtPayoff({ debts: DEBTS, strategy: 'snowball', extraMonthlyPayment: 50 })
    const empty = calculateDebtPayoff({ debts: DEBTS, strategy: 'snowball', extraMonthlyPayment: 50, lumpSums: [] })
    expect(empty).toEqual(without)
  })
})

describe('calculateMinimumPaymentsOnly', () => {
  it('freed minimums are not rolled over to the remaining debts', () => {
    const debts = [
      { name: 'A', balance: 400, interestRate: 0, minimumPayment: 100 },
      { name: 'B', balance: 600, interestRate: 0, minimumPayment: 100 },
    ]
    const r = calculateMinimumPaymentsOnly(debts)
    // Snowball with rollover takes 5 months for the same debts
    expect(r.monthsToDebtFree).toBe(6)
    expect(r.payoffOrder).toEqual(['A', 'B'])
    expect(r.totalInterestPaid).toBe(0)
    expect(r.paidOff).toBe(true)
  })

  it('charges interest on each balance before its minimum is paid', () => {
    // 1000 -> 1010 - 500 = 510 -> 515.10 - 500 = 15.10 -> 15.251 paid off; interest 10 + 5.10 + 0.151
    const r = calculateMinimumPaymentsOnly([{ name: 'A', balance: 1000, interestRate: 12, minimumPayment: 500 }])
    expect(r.monthsToDebtFree).toBe(3)
    expect(r.totalInterestPaid).toBeCloseTo(15.251, 10)
  })

  it('costs at least as much interest as either strategy', () => {
    const baseline = calculateMinimumPaymentsOnly(DEBTS)
    const avalanche = calculateDebtPayoff({ debts: DEBTS, strategy: 'avalanche', extraMonthlyPayment: 0 })
    expect(baseline.monthsToDebtFree).toBeGreaterThan(avalanche.monthsToDebtFree)
    expect(baseline.totalInterestPaid).toBeGreaterThan(avalanche.totalInterestPaid)
  })

  it('reports never paid off at the 1200-month cap when a minimum does not cover interest', () => {
    const r = calculateMinimumPaymentsOnly([{ name: 'A', balance: 10000, interestRate: 24, minimumPayment: 100 }])
    expect(r.monthsToDebtFree).toBe(1200)
    expect(r.paidOff).toBe(false)
  })

  it('no debts are paid off in zero months', () => {
    expect(calculateMinimumPaymentsOnly([])).toEqual({ monthsToDebtFree: 0, totalInterestPaid: 0, payoffOrder: [], paidOff: true })
  })

  it('does not mutate the input debts', () => {
    const debts = DEBTS.map(d => ({ ...d }))
    calculateMinimumPaymentsOnly(debts)
    expect(debts).toEqual(DEBTS)
  })
})

describe('getDebtFreeDate', () => {
  it('adds the months to the start month', () => {
    const d = getDebtFreeDate(new Date(2026, 9, 15), 52)
    expect([d.getFullYear(), d.getMonth()]).toEqual([2031, 1])
  })

  it('rolls over the year', () => {
    const d = getDebtFreeDate(new Date(2026, 10, 1), 3)
    expect([d.getFullYear(), d.getMonth()]).toEqual([2027, 1])
  })

  it('does not skip a short month when starting at the end of a long one', () => {
    const d = getDebtFreeDate(new Date(2027, 0, 31), 1)
    expect([d.getFullYear(), d.getMonth()]).toEqual([2027, 1])
  })

  it('zero months is the start month', () => {
    const d = getDebtFreeDate(new Date(2026, 9, 31), 0)
    expect([d.getFullYear(), d.getMonth()]).toEqual([2026, 9])
  })
})
