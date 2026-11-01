// omnicalc/src/lib/engine/financial/retirement.ts

export interface RetirementInputs {
  currentAge: number
  retirementAge: number
  currentSavings: number
  annualSavings: number    // other savings outside the salary-based plan; stays flat each year
  expectedReturn: number   // annual %, e.g. 7; applies before retirement
  annualExpenses: number   // in today's dollars
  // Optional so inputs saved before these existed keep their results
  annualSalary?: number
  employeeContributionPct?: number   // % of salary
  employerMatchPct?: number          // % of the employee contribution the employer matches
  employerMatchCapPct?: number       // match applies to contributions up to this % of salary
  salaryIncreasePct?: number
  inflationRate?: number
  postRetirementReturn?: number      // annual %; defaults to expectedReturn
  socialSecurityMonthly?: number     // in today's dollars
  socialSecurityStartAge?: number
}

export interface RetirementDataPoint {
  age: number
  balance: number
}

export interface RetirementResult {
  balanceAtRetirement: number
  balanceAtRetirementToday: number   // balanceAtRetirement deflated to today's dollars
  firstYearWithdrawal: number        // taken from savings in the first retirement year, after Social Security
  yearsOfFunding: number
  projectedRunout: number | null   // age at which funds run out, or null if they don't
  growthPhase: RetirementDataPoint[]
  drawdownPhase: RetirementDataPoint[]
}

export function calculateRetirement(inputs: RetirementInputs): RetirementResult {
  const {
    currentAge, retirementAge, currentSavings, annualSavings, expectedReturn, annualExpenses,
    annualSalary = 0,
    employeeContributionPct = 0,
    employerMatchPct = 0,
    employerMatchCapPct = 0,
    salaryIncreasePct = 0,
    inflationRate = 0,
    postRetirementReturn = expectedReturn,
    socialSecurityMonthly = 0,
    socialSecurityStartAge = retirementAge,
  } = inputs
  const preReturn = expectedReturn / 100
  const postReturn = postRetirementReturn / 100
  const inflation = inflationRate / 100
  const contributionRate = employeeContributionPct / 100
  const matchRate = (employerMatchPct / 100) * Math.min(contributionRate, employerMatchCapPct / 100)

  // Growth phase: contributions land at the end of each year, after that year's return
  const growthPhase: RetirementDataPoint[] = []
  let balance = currentSavings
  let salary = annualSalary
  for (let age = currentAge; age <= retirementAge; age++) {
    growthPhase.push({ age, balance })
    if (age < retirementAge) {
      balance = balance * (1 + preReturn) + salary * (contributionRate + matchRate) + annualSavings
      salary *= 1 + salaryIncreasePct / 100
    }
  }
  const balanceAtRetirement = balance
  const yearsToRetirement = Math.max(0, retirementAge - currentAge)
  const priceLevelAtRetirement = (1 + inflation) ** yearsToRetirement
  const balanceAtRetirementToday = balanceAtRetirement / priceLevelAtRetirement

  // Drawdown phase: spend until funds run out or 50 years post-retirement
  const drawdownPhase: RetirementDataPoint[] = []
  let drawBalance = balanceAtRetirement
  let projectedRunout: number | null = null
  let firstYearWithdrawal = 0
  const maxDrawdownYears = 50

  for (let i = 0; i <= maxDrawdownYears; i++) {
    const age = retirementAge + i
    const priceLevel = priceLevelAtRetirement * (1 + inflation) ** i
    const benefit = age >= socialSecurityStartAge ? socialSecurityMonthly * 12 : 0
    const withdrawal = Math.max(0, annualExpenses - benefit) * priceLevel
    if (i === 0) firstYearWithdrawal = withdrawal

    drawdownPhase.push({ age, balance: Math.max(0, drawBalance) })
    // An exactly empty balance only counts as running out while savings still have spending to cover
    if (drawBalance < 0 || (drawBalance === 0 && withdrawal > 0)) {
      projectedRunout = age
      break
    }
    drawBalance = drawBalance * (1 + postReturn) - withdrawal
  }

  const yearsOfFunding = projectedRunout !== null
    ? projectedRunout - retirementAge
    : maxDrawdownYears

  return { balanceAtRetirement, balanceAtRetirementToday, firstYearWithdrawal, yearsOfFunding, projectedRunout, growthPhase, drawdownPhase }
}
