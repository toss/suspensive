import { Suspense } from 'react'
import { SuspenseClientOnly, defineSuspense } from './defineSuspense'

describe('defineSuspense', () => {
  it('should return SuspenseClientOnly when componentPropsClientOnly is true', () => {
    expect(defineSuspense({ componentPropsClientOnly: true })).toBe(SuspenseClientOnly)
    expect(defineSuspense({ componentPropsClientOnly: true, defaultPropsClientOnly: undefined })).toBe(
      SuspenseClientOnly
    )
  })
  it('should return SuspenseClientOnly when defaultPropsClientOnly is true and componentPropsClientOnly is undefined', () => {
    expect(defineSuspense({ defaultPropsClientOnly: true })).toBe(SuspenseClientOnly)
    expect(defineSuspense({ componentPropsClientOnly: undefined, defaultPropsClientOnly: true })).toBe(
      SuspenseClientOnly
    )
  })
  it('should return SuspenseClientOnly when defaultPropsClientOnly is false and componentPropsClientOnly is true', () => {
    expect(defineSuspense({ defaultPropsClientOnly: false, componentPropsClientOnly: true })).toBe(SuspenseClientOnly)
  })
  it('should return Suspense when both defaultPropsClientOnly and componentPropsClientOnly are false', () => {
    expect(defineSuspense({ defaultPropsClientOnly: false, componentPropsClientOnly: false })).toBe(Suspense)
  })
  it('should return Suspense when defaultPropsClientOnly is true and componentPropsClientOnly is false', () => {
    expect(defineSuspense({ defaultPropsClientOnly: true, componentPropsClientOnly: false })).toBe(Suspense)
  })
  it('should return Suspense when both defaultPropsClientOnly and componentPropsClientOnly are undefined', () => {
    expect(defineSuspense({})).toBe(Suspense)
    expect(defineSuspense({})).toBe(Suspense)
  })
})
