// omnicalc/src/lib/engine/financial/auto-loan.ts

import type { AmortizationRow } from './amortization'

export interface AutoLoanInputs {
  vehiclePrice: number
  downPayment: number
  tradeInValue: number
  interestRate: number   // annual %
  loanTermMonths: number
  salesTaxRate: number   // %
  extraMonthlyPayment?: number
  fees?: number          // registration, title and doc fees
  feesFinanced?: boolean
  tradeInReducesTax?: boolean
}

export interface AutoLoanResult {
  monthlyPayment: number
  loanBalance: number
  totalInterestPaid: number
  amortizationSchedule: AmortizationRow[]
  salesTax: number
  upfrontFees: number
  totalCost: number
  payoffMonths: number
  monthsSaved: number
  interestSaved: number
}

export interface AutoLoanTermRow {
  termMonths: number
  monthlyPayment: number
  totalInterest: number
  totalCost: number
}

const AUTO_LOAN_COMPARISON_TERMS = [36, 48, 60, 72, 84]

// Below a ten-thousandth of a cent the balance is float noise, not money owed
const PAID_OFF = 1e-6

function amortize(loanBalance: number, monthlyRate: number, payment: number, maxMonths: number) {
  const schedule: AmortizationRow[] = []
  let balance = loanBalance
  let totalInterest = 0

  for (let month = 1; month <= maxMonths && balance > PAID_OFF; month++) {
    const interest = balance * monthlyRate
    const principal = Math.min(balance, payment - interest)
    balance = balance - principal < PAID_OFF ? 0 : balance - principal
    totalInterest += interest
    schedule.push({ month, payment: principal + interest, principal, interest, balance })
  }

  return { schedule, totalInterest }
}

export function calculateAutoLoan(inputs: AutoLoanInputs): AutoLoanResult {
  const {
    vehiclePrice, downPayment, tradeInValue, interestRate, loanTermMonths, salesTaxRate,
    extraMonthlyPayment = 0, fees = 0, feesFinanced = true, tradeInReducesTax = true,
  } = inputs

  // Most US states tax only the price left after the trade-in credit
  const taxablePrice = tradeInReducesTax ? Math.max(0, vehiclePrice - tradeInValue) : vehiclePrice
  const salesTax = taxablePrice * salesTaxRate / 100
  const financedFees = feesFinanced ? fees : 0
  const upfrontFees = feesFinanced ? 0 : fees
  const loanBalance = Math.max(0, vehiclePrice + salesTax + financedFees - downPayment - tradeInValue)
  const monthlyRate = interestRate / 100 / 12
  const n = loanTermMonths
  const costBeforeInterest = vehiclePrice + salesTax + fees

  if (n <= 0 || loanBalance === 0) {
    return {
      monthlyPayment: 0, loanBalance, totalInterestPaid: 0, amortizationSchedule: [],
      salesTax, upfrontFees, totalCost: costBeforeInterest, payoffMonths: 0, monthsSaved: 0, interestSaved: 0,
    }
  }

  const monthlyPayment = monthlyRate === 0
    ? loanBalance / n
    : loanBalance * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)

  const scheduled = amortize(loanBalance, monthlyRate, monthlyPayment, n)
  const actual = extraMonthlyPayment > 0
    ? amortize(loanBalance, monthlyRate, monthlyPayment + extraMonthlyPayment, n)
    : scheduled
  const payoffMonths = actual.schedule.length

  return {
    monthlyPayment,
    loanBalance,
    totalInterestPaid: actual.totalInterest,
    amortizationSchedule: actual.schedule,
    salesTax,
    upfrontFees,
    totalCost: costBeforeInterest + actual.totalInterest,
    payoffMonths,
    monthsSaved: scheduled.schedule.length - payoffMonths,
    interestSaved: scheduled.totalInterest - actual.totalInterest,
  }
}

// Extra payments are left out so each term is compared on the payment the lender would schedule
export function compareAutoLoanTerms(inputs: AutoLoanInputs): AutoLoanTermRow[] {
  return AUTO_LOAN_COMPARISON_TERMS.map(termMonths => {
    const r = calculateAutoLoan({ ...inputs, loanTermMonths: termMonths, extraMonthlyPayment: 0 })
    return { termMonths, monthlyPayment: r.monthlyPayment, totalInterest: r.totalInterestPaid, totalCost: r.totalCost }
  })
}
