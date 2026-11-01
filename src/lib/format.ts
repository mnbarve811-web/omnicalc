const compactUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

// For chart axes: "$1.5K", "$2.4M". Dividing by 1000 and appending "k" printed "$60000k" for large balances
// and rounded neighbouring ticks to the same label.
export function formatCompactUsd(value: number): string {
  return compactUsd.format(value)
}
