// omnicalc/src/lib/engine/fitness.ts

export type GenderBiological = 'male' | 'female'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete'
export type MacroGoal = 'cut' | 'maintain' | 'bulk'
export type MacroSplit = 'balanced' | 'lowCarb' | 'highProtein'

// --- BMI ---
export interface BMIInputs {
  weightKg: number
  heightCm: number
}

export interface BMIResult {
  value: number
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese'
}

export function calculateBMI(_inputs: BMIInputs): BMIResult {
  throw new Error('Not implemented')
}

// --- TDEE ---
export interface TDEEInputs {
  gender: GenderBiological
  weightKg: number
  heightCm: number
  ageYears: number
  activityLevel: ActivityLevel
}

export interface TDEEResult {
  bmr: number
  tdee: number
  cut: number      // tdee - 20%
  maintain: number // tdee
  bulk: number     // tdee + 15%
}

export function calculateTDEE(_inputs: TDEEInputs): TDEEResult {
  throw new Error('Not implemented')
}

// --- Body Fat (US Navy Method) ---
export interface BodyFatInputs {
  gender: GenderBiological
  heightCm: number
  neckCm: number
  waistCm: number
  hipCm: number   // used for female only; ignored for male
}

export interface BodyFatResult {
  bodyFatPercentage: number
  fatMassKg: number
  leanMassKg: number
  category: string
}

export function calculateBodyFat(_inputs: BodyFatInputs): BodyFatResult {
  throw new Error('Not implemented')
}

// --- Macro ---
export interface MacroInputs {
  tdee: number
  goal: MacroGoal
  split: MacroSplit
}

export interface MacroResult {
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export function calculateMacro(_inputs: MacroInputs): MacroResult {
  throw new Error('Not implemented')
}

// --- Pregnancy Due Date ---
export interface PregnancyInputs {
  lastMenstrualPeriod: string   // ISO date string YYYY-MM-DD
}

export interface PregnancyResult {
  dueDate: string       // ISO date string YYYY-MM-DD
  currentWeek: number
  trimester: 1 | 2 | 3
}

export function calculatePregnancy(inputs: PregnancyInputs): PregnancyResult {
  // YYYY-MM-DD parses as UTC midnight, so do all day math in UTC to avoid timezone/DST drift
  const lmp = new Date(inputs.lastMenstrualPeriod)
  const now = new Date()
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))

  const dueDate = new Date(lmp)
  dueDate.setUTCDate(dueDate.getUTCDate() + 280)

  const msPerDay = 1000 * 60 * 60 * 24
  const daysElapsed = (today.getTime() - lmp.getTime()) / msPerDay
  const currentWeek = Math.max(0, Math.min(42, Math.floor(daysElapsed / 7)))

  const trimester: 1 | 2 | 3 = currentWeek <= 12 ? 1 : currentWeek <= 27 ? 2 : 3

  return {
    dueDate: dueDate.toISOString().split('T')[0],
    currentWeek,
    trimester,
  }
}
