import { describe, it, expect } from 'vitest'
import { toCSV } from '@/lib/export'

describe('toCSV', () => {
  it('writes a header row from the object keys followed by one line per row', () => {
    expect(toCSV([{ month: 1, balance: 1000 }, { month: 2, balance: 900 }])).toBe('month,balance\r\n1,1000\r\n2,900')
  })

  it('returns an empty string for no rows', () => {
    expect(toCSV([])).toBe('')
  })

  it('quotes cells containing commas, quotes, or newlines', () => {
    expect(toCSV([{ label: 'a, b', note: 'say "hi"', text: 'line1\nline2' }]))
      .toBe('label,note,text\r\n"a, b","say ""hi""","line1\nline2"')
  })

  it('leaves blank cells for missing or empty values and unions keys across rows', () => {
    expect(toCSV([{ a: 1 }, { a: null, b: 2 }])).toBe('a,b\r\n1,\r\n,2')
  })

  it('escapes text that a spreadsheet would run as a formula', () => {
    expect(toCSV([{ name: '=SUM(A1)' }, { name: '@cmd' }, { name: '+1' }])).toBe("name\r\n'=SUM(A1)\r\n'@cmd\r\n'+1")
  })

  it('does not escape negative numbers', () => {
    expect(toCSV([{ change: -5 }])).toBe('change\r\n-5')
  })
})
