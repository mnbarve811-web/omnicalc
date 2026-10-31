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

describe('calculateQuadratic edge cases', () => {
  it('orders roots by the formula when a is negative', () => {
    const r = calculateQuadratic({ a: -1, b: 0, c: 4 })
    expect(r.discriminant).toBe(16)
    expect(r.roots).toEqual([-2, 2])
    expect(r.rootsDisplay).toBe('x₁ = -2, x₂ = 2')
  })
  it('finds a repeated root when a is negative', () => {
    const r = calculateQuadratic({ a: -1, b: 4, c: -4 })
    expect(r.roots).toEqual([2])
    expect(r.rootsDisplay).toBe('x = 2')
  })
  it('reports no real roots for a downward parabola below the axis', () => {
    const r = calculateQuadratic({ a: -1, b: 0, c: -4 })
    expect(r.discriminant).toBe(-16)
    expect(r.roots).toEqual([])
    expect(r.rootsDisplay).toBe('No real roots')
  })
  it('solves the projectile example from the guide', () => {
    const r = calculateQuadratic({ a: -4.9, b: 20, c: 1.5 })
    expect(r.discriminant).toBeCloseTo(429.4, 10)
    expect(r.rootsDisplay).toBe('x₁ = -0.0736703, x₂ = 4.1553')
  })
  it('handles large coefficients that share a scale', () => {
    const r = calculateQuadratic({ a: 1e6, b: -3e6, c: 2e6 })
    expect(r.roots).toEqual([2, 1])
    expect(r.discriminant).toBe(1e12)
  })
  it('treats a tiny discriminant relative to large coefficients as zero', () => {
    const r = calculateQuadratic({ a: 1e8, b: -2e8, c: 1e8 })
    expect(r.discriminant).toBe(0)
    expect(r.roots).toEqual([1])
  })
  it('solves equations with b = 0 or c = 0', () => {
    expect(calculateQuadratic({ a: 1, b: 0, c: -9 }).roots).toEqual([3, -3])
    expect(calculateQuadratic({ a: 1, b: -4, c: 0 }).roots).toEqual([4, 0])
    const origin = calculateQuadratic({ a: 3, b: 0, c: 0 })
    expect(origin.roots).toHaveLength(1)
    expect(origin.roots[0]).toBeCloseTo(0, 12)
    expect(origin.rootsDisplay).toBe('x = 0')
  })
  it('rounds irrational roots to six significant digits in the display', () => {
    const r = calculateQuadratic({ a: 1, b: 0, c: -2 })
    expect(r.roots[0]).toBeCloseTo(Math.SQRT2, 12)
    expect(r.rootsDisplay).toBe('x₁ = 1.41421, x₂ = -1.41421')
  })
  it('still reports the discriminant when a = 0', () => {
    const r = calculateQuadratic({ a: 0, b: 3, c: 5 })
    expect(r.discriminant).toBe(9)
    expect(r.rootsDisplay).toBe('Not a quadratic equation (a = 0)')
  })
  it('keeps the small root accurate when b is much larger than a and c', () => {
    const r = calculateQuadratic({ a: 1, b: -1e8, c: 1 })
    expect(r.roots[0]).toBeCloseTo(1e8, 0)
    expect(r.roots[1]! / 1e-8).toBeCloseTo(1, 6)
  })
})
