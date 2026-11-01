import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockGet, mockReplace } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockReplace: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: mockGet }),
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/financial/mortgage',
}))

import { useCalculatorUrl, listField } from '@/lib/hooks/use-calculator-url'

const SCHEMA = {
  price: { param: 'price', default: 300000, parse: Number, serialize: String },
  rate:  { param: 'rate',  default: 6.5,    parse: Number, serialize: String },
} as const

describe('useCalculatorUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGet.mockReturnValue(null)
  })

  it('returns defaults when no URL params are present', () => {
    const { result } = renderHook(() => useCalculatorUrl(SCHEMA))
    expect(result.current[0]).toEqual({ price: 300000, rate: 6.5 })
  })

  it('parses valid URL params and returns typed values', () => {
    mockGet.mockImplementation((key: string) =>
      key === 'price' ? '500000' : key === 'rate' ? '7.25' : null
    )
    const { result } = renderHook(() => useCalculatorUrl(SCHEMA))
    expect(result.current[0]).toEqual({ price: 500000, rate: 7.25 })
  })

  it('keeps an earlier patch when setValues is called again before the URL updates', () => {
    const { result } = renderHook(() => useCalculatorUrl(SCHEMA))
    act(() => {
      result.current[1]({ price: 400000 })
      result.current[1]({ rate: 7 })
    })
    expect(mockReplace).toHaveBeenLastCalledWith('/financial/mortgage?price=400000&rate=7', { scroll: false })
  })

  it('falls back to default when Number() returns NaN', () => {
    mockGet.mockReturnValue('not-a-number')
    const { result } = renderHook(() => useCalculatorUrl(SCHEMA))
    expect(result.current[0]).toEqual({ price: 300000, rate: 6.5 })
  })

  it('falls back to default when parse function throws', () => {
    const throwingSchema = {
      value: {
        param: 'v',
        default: 42,
        parse: (): number => { throw new Error('bad input') },
        serialize: String,
      },
    }
    mockGet.mockReturnValue('anything')
    const { result } = renderHook(() => useCalculatorUrl(throwingSchema))
    expect(result.current[0]).toEqual({ value: 42 })
  })

  it('calls router.replace with serialized non-default params', () => {
    const { result } = renderHook(() => useCalculatorUrl(SCHEMA))
    act(() => { result.current[1]({ price: 400000 }) })
    expect(mockReplace).toHaveBeenCalledWith(
      '/financial/mortgage?price=400000',
      { scroll: false }
    )
  })

  it('omits query string entirely when all values equal their defaults', () => {
    mockGet.mockImplementation((key: string) =>
      key === 'price' ? '400000' : null
    )
    const { result } = renderHook(() => useCalculatorUrl(SCHEMA))
    act(() => { result.current[1]({ price: 300000 }) })
    expect(mockReplace).toHaveBeenCalledWith('/financial/mortgage', { scroll: false })
  })

  it('omits a list param when an edited list equals the default by value', () => {
    const listSchema = { items: listField('items', [{ month: 12, amount: 500 }], i => [i.month, i.amount], ([month, amount]) => ({ month: Number(month), amount: Number(amount) })) }
    const { result } = renderHook(() => useCalculatorUrl(listSchema))
    act(() => { result.current[1]({ items: [{ month: 12, amount: 500 }] }) })
    expect(mockReplace).toHaveBeenCalledWith('/financial/mortgage', { scroll: false })
  })

  it('merges patch with existing URL values when only some fields change', () => {
    mockGet.mockImplementation((key: string) =>
      key === 'price' ? '400000' : null
    )
    const { result } = renderHook(() => useCalculatorUrl(SCHEMA))
    act(() => { result.current[1]({ rate: 7.0 }) })
    expect(mockReplace).toHaveBeenCalledWith(
      '/financial/mortgage?price=400000&rate=7',
      { scroll: false }
    )
  })
})

describe('listField', () => {
  const lumpSums = listField(
    'lump',
    [] as { month: number; amount: number }[],
    i => [i.month, i.amount],
    ([month, amount]) => ({ month: Number(month), amount: Number(amount) }),
  )
  const named = listField(
    'debts',
    [] as { name: string; balance: number }[],
    d => [d.name, d.balance],
    ([name, balance]) => ({ name, balance: Number(balance) }),
  )

  it('round-trips a list of numeric items', () => {
    const items = [{ month: 12, amount: 5000 }, { month: 24, amount: 2500.5 }]
    expect(lumpSums.serialize(items)).toBe('12~5000_24~2500.5')
    expect(lumpSums.parse(lumpSums.serialize(items))).toEqual(items)
  })

  it('round-trips names that contain the separators', () => {
    const items = [{ name: 'Visa_card ~ 2', balance: 100 }, { name: 'Car, loan', balance: 0 }]
    expect(named.parse(named.serialize(items))).toEqual(items)
  })

  it('parses an empty string as an empty list', () => {
    expect(lumpSums.parse('')).toEqual([])
  })

  it('throws on a non-numeric number field so the hook falls back to the default', () => {
    expect(() => lumpSums.parse('12~abc')).toThrow()
  })

  it('caps the number of items read from the URL', () => {
    const raw = Array.from({ length: 80 }, (_, i) => `${i}~1`).join('_')
    expect(lumpSums.parse(raw)).toHaveLength(50)
  })
})
