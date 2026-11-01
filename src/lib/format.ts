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

// Axis ticks on round steps (1, 2, 2.5 or 5 × a power of ten) from zero past the data maximum,
// so a chart reads $0 / $5K / $10K instead of the library's $6.5K / $13K
export function niceTicks(max: number, targetCount = 4): number[] {
  if (!(max > 0)) return [0]
  const rough = max / targetCount
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((multiple) => multiple * magnitude).find((candidate) => candidate >= rough)!
  const count = Math.ceil(max / step)
  return Array.from({ length: count + 1 }, (_, index) => index * step)
}
