import { describe, it, expect } from 'vitest'
import { calculateGeometry } from '@/lib/engine'

describe('calculateGeometry', () => {
  it('circle area = π*r²', () => {
    const r = calculateGeometry({ shape: 'circle', dimensions: { radius: 5 } })
    expect(r.area).toBeCloseTo(Math.PI * 25, 4)
  })
  it('circle perimeter = 2*π*r', () => {
    const r = calculateGeometry({ shape: 'circle', dimensions: { radius: 5 } })
    expect(r.perimeter).toBeCloseTo(2 * Math.PI * 5, 4)
  })
  it('rectangle area = width * height', () => {
    const r = calculateGeometry({ shape: 'rectangle', dimensions: { width: 4, height: 6 } })
    expect(r.area).toBeCloseTo(24, 4)
    expect(r.perimeter).toBeCloseTo(20, 4)
  })
  it('sphere volume = (4/3)*π*r³', () => {
    const r = calculateGeometry({ shape: 'sphere', dimensions: { radius: 3 } })
    expect(r.volume).toBeCloseTo((4/3) * Math.PI * 27, 4)
  })
  it('cylinder volume = π*r²*h', () => {
    const r = calculateGeometry({ shape: 'cylinder', dimensions: { radius: 2, height: 5 } })
    expect(r.volume).toBeCloseTo(Math.PI * 4 * 5, 4)
  })
  it('zero radius returns zero area', () => {
    const r = calculateGeometry({ shape: 'circle', dimensions: { radius: 0 } })
    expect(r.area).toBe(0)
  })
  it('cone volume = (1/3)*π*r²*h', () => {
    const r = calculateGeometry({ shape: 'cone', dimensions: { radius: 3, height: 4 } })
    expect(r.volume).toBeCloseTo((1/3) * Math.PI * 9 * 4, 4)
  })
})
