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

import { useCalculatorUrl } from '@/lib/hooks/use-calculator-url'

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

  it('passes the latest pending values to an updater called again before the URL updates', () => {
    const { result } = renderHook(() => useCalculatorUrl(SCHEMA))
    act(() => {
      result.current[1]((current) => ({ price: current.price + 1000 }))
      result.current[1]((current) => ({ price: current.price + 1000 }))
    })
    expect(mockReplace).toHaveBeenLastCalledWith('/financial/mortgage?price=302000', { scroll: false })
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
