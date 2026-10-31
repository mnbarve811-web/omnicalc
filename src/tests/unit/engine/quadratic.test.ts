import { describe, it, expect } from 'vitest'
import { calculateQuadratic } from '@/lib/engine'

describe('calculateQuadratic', () => {
  it('x² - 5x + 6 = 0 has roots 2 and 3', () => {
    const r = calculateQuadratic({ a: 1, b: -5, c: 6 })
    expect(r.roots).toHaveLength(2)
    expect(r.roots).toEqual(expect.arrayContaining([2, 3]))
  })
  it('x² - 2x + 1 = 0 has one repeated root', () => {
    const r = calculateQuadratic({ a: 1, b: -2, c: 1 })
    expect(r.roots).toHaveLength(1)
    expect(r.roots[0]).toBeCloseTo(1, 5)
  })
  it('x² + 1 = 0 has no real roots', () => {
    const r = calculateQuadratic({ a: 1, b: 0, c: 1 })
    expect(r.roots).toHaveLength(0)
  })
  it('discriminant = b² - 4ac', () => {
    const r = calculateQuadratic({ a: 1, b: -5, c: 6 })
    expect(r.discriminant).toBeCloseTo((-5)**2 - 4*1*6, 5)
  })
  it('rootsDisplay is a non-empty string', () => {
    const r = calculateQuadratic({ a: 1, b: -5, c: 6 })
    expect(typeof r.rootsDisplay).toBe('string')
    expect(r.rootsDisplay.length).toBeGreaterThan(0)
  })
  it('a=0 returns empty roots with descriptive display', () => {
    const r = calculateQuadratic({ a: 0, b: 2, c: 1 })
    expect(r.roots).toHaveLength(0)
    expect(r.rootsDisplay).toContain('a = 0')
  })
  it('treats a discriminant lost to floating-point error as a repeated root', () => {
    const r = calculateQuadratic({ a: 1, b: -1.4, c: 0.49 })
    expect(r.roots).toHaveLength(1)
    expect(r.roots[0]).toBeCloseTo(0.7, 10)
    expect(r.discriminant).toBe(0)
  })
  it('does not split a repeated decimal root into two', () => {
    const r = calculateQuadratic({ a: 1, b: -0.2, c: 0.01 })
    expect(r.roots).toHaveLength(1)
  })
})
