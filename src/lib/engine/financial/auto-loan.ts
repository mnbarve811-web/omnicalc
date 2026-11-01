// omnicalc/src/lib/engine/financial/auto-loan.ts

import type { AmortizationRow } from './amortization'

export interface AutoLoanInputs {
  vehiclePrice: number
  downPayment: number
  tradeInValue: number
  interestRate: number   // annual %
  loanTermMonths: number
  salesTaxRate: number   // %
}

export interface AutoLoanResult {
  monthlyPayment: number
  loanBalance: number
  totalInterestPaid: number
  amortizationSchedule: AmortizationRow[]
}

export function calculateAutoLoan(inputs: AutoLoanInputs): AutoLoanResult {
  const { vehiclePrice, downPayment, tradeInValue, interestRate, loanTermMonths, salesTaxRate } = inputs
  const loanBalance = Math.max(0, vehiclePrice * (1 + salesTaxRate / 100) - downPayment - tradeInValue)
  const monthlyRate = interestRate / 100 / 12
  const n = loanTermMonths

  if (n <= 0) return { monthlyPayment: 0, loanBalance, totalInterestPaid: 0, amortizationSchedule: [] }

  const monthlyPayment = monthlyRate === 0
    ? loanBalance / n
    : loanBalance * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)

  const amortizationSchedule: AmortizationRow[] = []
  let balance = loanBalance
  let totalInterestPaid = 0

  for (let month = 1; month <= n; month++) {
    const interest = balance * monthlyRate
    const principal = monthlyPayment - interest
    balance = Math.max(0, balance - principal)
    totalInterestPaid += interest
    amortizationSchedule.push({ month, payment: monthlyPayment, principal, interest, balance })
  }

  return { monthlyPayment, loanBalance, totalInterestPaid, amortizationSchedule }
}
