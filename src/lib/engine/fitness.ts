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

export function calculateBMI({ weightKg, heightCm }: BMIInputs): BMIResult {
  const heightM = Math.max(1, heightCm) / 100
  const value = weightKg / (heightM * heightM)
  const category =
    value < 18.5 ? 'Underweight' :
    value < 25   ? 'Normal weight' :
    value < 30   ? 'Overweight' :
                   'Obese'
  return { value, category }
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

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light:     1.375,
  moderate:  1.55,
  heavy:     1.725,
  athlete:   1.9,
}

export function calculateTDEE(inputs: TDEEInputs): TDEEResult {
  const { gender, activityLevel } = inputs
  const weightKg = Math.max(1, inputs.weightKg)
  const heightCm = Math.max(1, inputs.heightCm)
  const ageYears = Math.max(1, inputs.ageYears)
  const offset = gender === 'male' ? 5 : -161
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + offset
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel]
  return {
    bmr,
    tdee,
    cut:      tdee * 0.8,
    maintain: tdee,
    bulk:     tdee * 1.15,
  }
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

export function calculateMacro(inputs: MacroInputs): MacroResult {
  if (inputs.tdee <= 0) return { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }

  const calorieMult = { cut: 0.8, maintain: 1, bulk: 1.15 }
  const calories = inputs.tdee * calorieMult[inputs.goal]

  const ratios = {
    balanced:    { protein: 30, carbs: 40, fat: 30 },
    lowCarb:     { protein: 35, carbs: 25, fat: 40 },
    highProtein: { protein: 40, carbs: 35, fat: 25 },
  }
  const { protein, carbs, fat } = ratios[inputs.split]

  return {
    calories,
    proteinG: calories * (protein / 100) / 4,
    carbsG:   calories * (carbs / 100) / 4,
    fatG:     calories * (fat / 100) / 9,
  }
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
