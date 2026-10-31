// Spreadsheet apps execute cells starting with these characters as formulas (CSV injection)
const FORMULA_PREFIX = /^[=+\-@\t\r]/

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  let text = String(value)
  if (typeof value === 'string' && FORMULA_PREFIX.test(text)) text = `'${text}`
  if (/[",\n\r]/.test(text)) text = `"${text.replace(/"/g, '""')}"`
  return text
}

export function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Array.from(new Set(rows.flatMap(row => Object.keys(row))))
  const lines = [
    headers.map(formatCell).join(','),
    ...rows.map(row => headers.map(header => formatCell(row[header])).join(',')),
  ]
  return lines.join('\r\n')
}

export function exportToCSV(rows: Record<string, unknown>[], filename: string): void {
  const blob = new Blob([toCSV(rows)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
