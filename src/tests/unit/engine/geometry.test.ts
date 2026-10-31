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

describe('calculateGeometry: every shape', () => {
  it('circle returns only area and perimeter', () => {
    expect(Object.keys(calculateGeometry({ shape: 'circle', dimensions: { radius: 1 } })).sort()).toEqual(['area', 'perimeter'])
  })
  it('rectangle with zero width has zero area and a perimeter of 2h', () => {
    expect(calculateGeometry({ shape: 'rectangle', dimensions: { width: 0, height: 6 } })).toEqual({ area: 0, perimeter: 12 })
  })
  it('rectangle with no dimensions defaults to zeros', () => {
    expect(calculateGeometry({ shape: 'rectangle', dimensions: {} })).toEqual({ area: 0, perimeter: 0 })
  })
  it('triangle with all three sides returns area and perimeter', () => {
    const r = calculateGeometry({ shape: 'triangle', dimensions: { base: 3, height: 4, a: 3, b: 4, c: 5 } })
    expect(r).toEqual({ area: 6, perimeter: 12 })
  })
  it('triangle without sides returns only area', () => {
    const r = calculateGeometry({ shape: 'triangle', dimensions: { base: 10, height: 5 } })
    expect(r).toEqual({ area: 25 })
    expect(r).not.toHaveProperty('perimeter')
  })
  it('triangle with only two sides omits perimeter', () => {
    const r = calculateGeometry({ shape: 'triangle', dimensions: { base: 10, height: 5, a: 3, b: 4 } })
    expect(r).not.toHaveProperty('perimeter')
  })
  it('triangle sides of zero still count as given', () => {
    const r = calculateGeometry({ shape: 'triangle', dimensions: { base: 1, height: 1, a: 0, b: 0, c: 0 } })
    expect(r).toEqual({ area: 0.5, perimeter: 0 })
  })
  it('triangle with zero height has zero area', () => {
    expect(calculateGeometry({ shape: 'triangle', dimensions: { base: 3, height: 0 } }).area).toBe(0)
  })
  it('cylinder surface area = 2πrh + 2πr²', () => {
    const r = calculateGeometry({ shape: 'cylinder', dimensions: { radius: 2, height: 5 } })
    expect(r.surfaceArea).toBeCloseTo(2 * Math.PI * 2 * 5 + 2 * Math.PI * 4, 9)
    expect(Object.keys(r).sort()).toEqual(['surfaceArea', 'volume'])
  })
  it('cylinder with zero height is two discs', () => {
    const r = calculateGeometry({ shape: 'cylinder', dimensions: { radius: 1, height: 0 } })
    expect(r.volume).toBe(0)
    expect(r.surfaceArea).toBeCloseTo(2 * Math.PI, 9)
  })
  it('sphere surface area = 4πr²', () => {
    const r = calculateGeometry({ shape: 'sphere', dimensions: { radius: 3 } })
    expect(r.surfaceArea).toBeCloseTo(4 * Math.PI * 9, 9)
  })
  it('sphere with zero radius is zero', () => {
    expect(calculateGeometry({ shape: 'sphere', dimensions: { radius: 0 } })).toEqual({ volume: 0, surfaceArea: 0 })
  })
  it('cone surface area = πr(r + slant) with a 3-4-5 slant', () => {
    const r = calculateGeometry({ shape: 'cone', dimensions: { radius: 3, height: 4 } })
    expect(r.surfaceArea).toBeCloseTo(Math.PI * 3 * (3 + 5), 9)
  })
  it('cone is one third of the cylinder with the same radius and height', () => {
    const cone = calculateGeometry({ shape: 'cone', dimensions: { radius: 2.5, height: 7 } })
    const cylinder = calculateGeometry({ shape: 'cylinder', dimensions: { radius: 2.5, height: 7 } })
    expect(cone.volume! * 3).toBeCloseTo(cylinder.volume!, 9)
  })
  it('cone with zero height is a flat disc', () => {
    const r = calculateGeometry({ shape: 'cone', dimensions: { radius: 2, height: 0 } })
    expect(r.volume).toBe(0)
    expect(r.surfaceArea).toBeCloseTo(Math.PI * 2 * 4, 9)
  })
  it('cone with zero radius is zero', () => {
    expect(calculateGeometry({ shape: 'cone', dimensions: { radius: 0, height: 5 } })).toEqual({ volume: 0, surfaceArea: 0 })
  })
})
