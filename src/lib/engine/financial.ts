// omnicalc/src/lib/engine/financial.ts

// --- Mortgage ---
export interface MortgageInputs {
  homePrice: number
  downPayment: number
  loanTermYears: number
  interestRate: number   // annual %, e.g. 6.5
  propertyTax: number    // monthly $
  homeInsurance: number  // monthly $
  hoa: number            // monthly $
}

export interface AmortizationRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface MortgageResult {
  monthlyPrincipalAndInterest: number
  monthlyTotal: number
  totalPaymentCount: number
  totalInterestPaid: number
  amortizationSchedule: AmortizationRow[]
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  const { homePrice, downPayment, loanTermYears, interestRate, propertyTax, homeInsurance, hoa } = inputs
  const principal = Math.max(0, homePrice - downPayment)
  const monthlyRate = interestRate / 100 / 12
  const n = loanTermYears * 12

  if (n === 0) {
    return { monthlyPrincipalAndInterest: 0, monthlyTotal: 0, totalPaymentCount: 0, totalInterestPaid: 0, amortizationSchedule: [] }
  }

  const monthlyPrincipalAndInterest = monthlyRate === 0
    ? principal / n
    : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)

  const monthlyTotal = monthlyPrincipalAndInterest + propertyTax + homeInsurance + hoa

  const amortizationSchedule: AmortizationRow[] = []
  let balance = principal
  let totalInterestPaid = 0

  for (let month = 1; month <= n; month++) {
    const interest = balance * monthlyRate
    const principalPaid = monthlyPrincipalAndInterest - interest
    balance = Math.max(0, balance - principalPaid)
    totalInterestPaid += interest
    amortizationSchedule.push({ month, payment: monthlyPrincipalAndInterest, principal: principalPaid, interest, balance })
  }

  return { monthlyPrincipalAndInterest, monthlyTotal, totalPaymentCount: n, totalInterestPaid, amortizationSchedule }
}

// --- Auto Loan ---
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

// --- Compound Interest ---
export interface CompoundInterestInputs {
  initialInvestment: number
  monthlyContribution: number
  annualInterestRate: number  // %
  compoundFrequency: number   // times per year, e.g. 12
  years: number
}

export interface CompoundInterestDataPoint {
  year: number
  balance: number
  contributions: number
  interest: number
}

export interface CompoundInterestResult {
  futureValue: number
  totalContributions: number
  totalInterestEarned: number
  yearlyBreakdown: CompoundInterestDataPoint[]
}

export function calculateCompoundInterest(inputs: CompoundInterestInputs): CompoundInterestResult {
  const { initialInvestment, monthlyContribution, annualInterestRate, compoundFrequency, years } = inputs

  if (years === 0) return { futureValue: 0, totalContributions: 0, totalInterestEarned: 0, yearlyBreakdown: [] }

  const monthlyRate = compoundFrequency > 0 && annualInterestRate > 0
    ? Math.pow(1 + (annualInterestRate / 100) / compoundFrequency, compoundFrequency / 12) - 1
    : annualInterestRate / 100 / 12

  const yearlyBreakdown: CompoundInterestDataPoint[] = []
  let balance = initialInvestment
  let totalContributions = initialInvestment

  for (let year = 1; year <= years; year++) {
    for (let _month = 1; _month <= 12; _month++) {
      balance += monthlyContribution
      totalContributions += monthlyContribution
      balance *= (1 + monthlyRate)
    }
    yearlyBreakdown.push({
      year,
      balance: Math.round(balance * 100) / 100,
      contributions: totalContributions,
      interest: Math.round((balance - totalContributions) * 100) / 100,
    })
  }

  return {
    futureValue: Math.round(balance * 100) / 100,
    totalContributions,
    totalInterestEarned: Math.round((balance - totalContributions) * 100) / 100,
    yearlyBreakdown,
  }
}

// --- Retirement ---
export interface RetirementInputs {
  currentAge: number
  retirementAge: number
  currentSavings: number
  annualSavings: number
  expectedReturn: number   // annual %, e.g. 7
  annualExpenses: number   // in today's dollars
}

export interface RetirementDataPoint {
  age: number
  balance: number
}

export interface RetirementResult {
  balanceAtRetirement: number
  yearsOfFunding: number
  projectedRunout: number | null   // age at which funds run out, or null if they don't
  growthPhase: RetirementDataPoint[]
  drawdownPhase: RetirementDataPoint[]
}

export function calculateRetirement(inputs: RetirementInputs): RetirementResult {
  const { currentAge, retirementAge, currentSavings, annualSavings, expectedReturn, annualExpenses } = inputs
  const r = expectedReturn / 100

  // Growth phase: accumulate savings
  const growthPhase: RetirementDataPoint[] = []
  let balance = currentSavings
  for (let age = currentAge; age <= retirementAge; age++) {
    growthPhase.push({ age, balance })
    if (age < retirementAge) {
      balance = balance * (1 + r) + annualSavings
    }
  }
  const balanceAtRetirement = balance

  // Drawdown phase: spend until funds run out or 50 years post-retirement
  const drawdownPhase: RetirementDataPoint[] = []
  let drawBalance = balanceAtRetirement
  let projectedRunout: number | null = null
  const maxDrawdownYears = 50

  for (let i = 0; i <= maxDrawdownYears; i++) {
    const age = retirementAge + i
    drawdownPhase.push({ age, balance: Math.max(0, drawBalance) })
    if (drawBalance <= 0 && projectedRunout === null) {
      projectedRunout = age
      break
    }
    drawBalance = drawBalance * (1 + r) - annualExpenses
  }

  const yearsOfFunding = projectedRunout !== null
    ? projectedRunout - retirementAge
    : maxDrawdownYears

  return { balanceAtRetirement, yearsOfFunding, projectedRunout, growthPhase, drawdownPhase }
}

// --- Salary / Paycheck ---
export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly'

export interface SalaryInputs {
  grossPay: number
  payFrequency: PayFrequency
  federalTaxRate: number   // %
  stateTaxRate: number     // %
  otherDeductions: number  // $ per pay period
}

export interface SalaryResult {
  grossPay: number
  federalTax: number
  socialSecurity: number
  medicare: number
  stateTax: number
  otherDeductions: number
  netPay: number
  annualGross: number
  annualNet: number
}

export function calculateSalary(inputs: SalaryInputs): SalaryResult {
  const { grossPay, payFrequency, federalTaxRate, stateTaxRate, otherDeductions } = inputs

  const periodsPerYear: Record<PayFrequency, number> = {
    weekly: 52,
    biweekly: 26,
    semimonthly: 24,
    monthly: 12,
  }

  const federalTax = grossPay * (federalTaxRate / 100)
  const stateTax = grossPay * (stateTaxRate / 100)
  const socialSecurity = grossPay * 0.062
  const medicare = grossPay * 0.0145
  const netPay = grossPay - federalTax - stateTax - socialSecurity - medicare - otherDeductions
  const periods = periodsPerYear[payFrequency]

  return {
    grossPay,
    federalTax,
    socialSecurity,
    medicare,
    stateTax,
    otherDeductions,
    netPay,
    annualGross: grossPay * periods,
    annualNet: netPay * periods,
  }
}

// --- Debt Payoff ---
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
  // The target debt receives the full budget each month;
  // non-target debts only accrue interest (no payment) until they become the target.
  const totalBudget = inputs.debts.reduce((sum, d) => sum + d.minimumPayment, 0) + extraMonthlyPayment

  while (debts.length > 0 && month < MAX_MONTHS) {
    month++

    // Sort by strategy to determine which debt is the current target
    const sorted = [...debts].sort((a, b) =>
      strategy === 'snowball'
        ? a.balance - b.balance
        : b.interestRate - a.interestRate
    )
    const targetName = sorted[0].name

    // Apply interest to all debts; apply full budget only to the target
    const newDebts: typeof debts = []
    for (const debt of debts) {
      const interest = debt.balance * (debt.interestRate / 100 / 12)
      totalInterestPaid += interest
      debt.balance += interest

      if (debt.name === targetName) {
        const payment = Math.min(totalBudget, debt.balance)
        debt.balance -= payment
      }

      if (debt.balance <= 0.01) {
        payoffOrder.push(debt.name)
      } else {
        newDebts.push(debt)
      }
    }
    debts = newDebts
  }

  return { monthsToDebtFree: month, totalInterestPaid, payoffOrder }
}
