// omnicalc/src/lib/engine/financial/debt-payoff.ts

export interface DebtItem {
  name: string
  balance: number
  interestRate: number     // annual %
  minimumPayment: number
}

export type DebtPayoffStrategy = 'snowball' | 'avalanche'

export interface DebtPayoffInputs {
  debts: DebtItem[]
  strategy: DebtPayoffStrategy
  extraMonthlyPayment: number
}

export interface DebtPayoffResult {
  monthsToDebtFree: number
  totalInterestPaid: number
  payoffOrder: string[]   // debt names in order paid off
  paidOff: boolean        // false when the 1200-month cap is hit because payments never cover the interest
}

export function calculateDebtPayoff(inputs: DebtPayoffInputs): DebtPayoffResult {
  const { strategy, extraMonthlyPayment } = inputs

  // Deep copy debts to avoid mutating input
  let debts = inputs.debts.map(d => ({ ...d }))

  let month = 0
  let totalInterestPaid = 0
  const payoffOrder: string[] = []
  const MAX_MONTHS = 1200 // safety cap

  // Total monthly budget is fixed: all minimums + extra.
  // The budget goes to debts in strategy order, so the target gets it all and anything left after
  // clearing the target rolls to the next debt that month; other debts only accrue interest.
  const totalBudget = inputs.debts.reduce((sum, d) => sum + d.minimumPayment, 0) + extraMonthlyPayment

  while (debts.length > 0 && month < MAX_MONTHS) {
    month++

    // Debts are compared by object, not name, so two debts sharing a name stay separate
    const ordered = [...debts].sort((a, b) =>
      strategy === 'snowball'
        ? a.balance - b.balance
        : b.interestRate - a.interestRate
    )

    for (const debt of debts) {
      const interest = debt.balance * (debt.interestRate / 100 / 12)
      totalInterestPaid += interest
      debt.balance += interest
    }

    let remaining = totalBudget
    for (const debt of ordered) {
      if (remaining <= 0) break
      const payment = Math.min(remaining, debt.balance)
      debt.balance -= payment
      remaining -= payment
    }

    for (const debt of ordered) {
      if (debt.balance <= 0.01) payoffOrder.push(debt.name)
    }
    debts = debts.filter(debt => debt.balance > 0.01)
  }

  return { monthsToDebtFree: month, totalInterestPaid, payoffOrder, paidOff: debts.length === 0 }
}
