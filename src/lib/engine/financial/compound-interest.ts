// omnicalc/src/lib/engine/financial/compound-interest.ts

export interface AdditionalContribution {
  year: number    // deposited at the start of this year, 1-based
  amount: number
}

export interface CompoundInterestInputs {
  initialInvestment: number
  // Named for the original monthly-only calculator; it is the deposit per contribution period
  monthlyContribution: number
  annualInterestRate: number  // %
  compoundFrequency: number   // times per year, e.g. 12
  years: number
  contributionFrequency?: number         // deposits per year, e.g. 52, 26, 12, 4, 1; default 12
  annualContributionIncrease?: number    // %, applied at the start of each year after the first
  additionalContributions?: AdditionalContribution[]
  taxRate?: number                       // %, charged on each year's growth
  inflationRate?: number                 // %, only affects inflationAdjustedBalance
}

export interface CompoundInterestDataPoint {
  year: number
  balance: number
  contributions: number
  interest: number
  inflationAdjustedBalance: number
}

export interface CompoundInterestResult {
  futureValue: number
  totalContributions: number
  totalInterestEarned: number
  yearlyBreakdown: CompoundInterestDataPoint[]
}

export interface RateComparisonRow {
  annualInterestRate: number
  futureValue: number
}

const roundCents = (n: number) => Math.round(n * 100) / 100

export function toTodaysDollars(amount: number, inflationRate: number, years: number): number {
  return roundCents(amount / Math.pow(1 + inflationRate / 100, years))
}

export function calculateCompoundInterest(inputs: CompoundInterestInputs): CompoundInterestResult {
  const {
    initialInvestment,
    monthlyContribution: contributionPerPeriod,
    annualInterestRate,
    compoundFrequency,
    years,
    contributionFrequency = 12,
    annualContributionIncrease = 0,
    additionalContributions = [],
    taxRate = 0,
    inflationRate = 0,
  } = inputs

  if (years <= 0) {
    return { futureValue: initialInvestment, totalContributions: initialInvestment, totalInterestEarned: 0, yearlyBreakdown: [] }
  }

  // Simulating once per contribution period at the equivalent periodic rate gives the same growth as
  // the stated compounding schedule, so deposits and compounding can use different frequencies
  const periodRate = compoundFrequency > 0 && annualInterestRate > 0
    ? Math.pow(1 + (annualInterestRate / 100) / compoundFrequency, compoundFrequency / contributionFrequency) - 1
    : annualInterestRate / 100 / contributionFrequency

  const yearlyBreakdown: CompoundInterestDataPoint[] = []
  let balance = initialInvestment
  let totalContributions = initialInvestment

  for (let year = 1; year <= years; year++) {
    const yearStartBalance = balance
    const contributionsBefore = totalContributions
    const deposit = contributionPerPeriod * Math.pow(1 + annualContributionIncrease / 100, year - 1)

    for (const extra of additionalContributions) {
      if (extra.year !== year) continue
      balance += extra.amount
      totalContributions += extra.amount
    }

    for (let period = 1; period <= contributionFrequency; period++) {
      balance += deposit
      totalContributions += deposit
      balance *= (1 + periodRate)
    }

    const growthThisYear = balance - yearStartBalance - (totalContributions - contributionsBefore)
    balance -= Math.max(0, growthThisYear) * taxRate / 100

    yearlyBreakdown.push({
      year,
      balance: roundCents(balance),
      contributions: roundCents(totalContributions),
      interest: roundCents(balance - totalContributions),
      inflationAdjustedBalance: toTodaysDollars(balance, inflationRate, year),
    })
  }

  return {
    futureValue: roundCents(balance),
    totalContributions: roundCents(totalContributions),
    totalInterestEarned: roundCents(balance - totalContributions),
    yearlyBreakdown,
  }
}

export function compareInterestRates(inputs: CompoundInterestInputs, rateOffsets: number[]): RateComparisonRow[] {
  const rates = rateOffsets
    .map(offset => roundCents(inputs.annualInterestRate + offset))
    .filter(rate => rate >= 0)
  return [...new Set(rates)]
    .sort((a, b) => a - b)
    .map(annualInterestRate => ({
      annualInterestRate,
      futureValue: calculateCompoundInterest({ ...inputs, annualInterestRate }).futureValue,
    }))
}
