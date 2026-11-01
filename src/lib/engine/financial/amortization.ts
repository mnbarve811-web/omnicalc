// omnicalc/src/lib/engine/financial/amortization.ts

export interface AmortizationRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}
