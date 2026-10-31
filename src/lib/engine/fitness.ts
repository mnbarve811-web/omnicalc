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

export function calculatePregnancy(_inputs: PregnancyInputs): PregnancyResult {
  throw new Error('Not implemented')
}
