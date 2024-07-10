import { Suspense } from 'react'
import { SuspenseClientOnly, defineSuspense } from './defineSuspense'

describe('defineSuspense', () => {
  it('should return SuspenseClientOnly when componentPropsClientOnly is true', () => {
    const DefinedSuspense = defineSuspense({ componentPropsClientOnly: true })
    expect(DefinedSuspense).toBe(SuspenseClientOnly)
  })

  it('should return SuspenseClientOnly when defaultPropsClientOnly is true and componentPropsClientOnly is undefined', () => {
    const DefinedSuspense = defineSuspense({ defaultPropsClientOnly: true })
    expect(DefinedSuspense).toBe(SuspenseClientOnly)
  })

  it('should return SuspenseClientOnly when defaultPropsClientOnly is false and componentPropsClientOnly is true', () => {
    const DefinedSuspense = defineSuspense({ defaultPropsClientOnly: false, componentPropsClientOnly: true })
    expect(DefinedSuspense).toBe(SuspenseClientOnly)
  })

  it('should return Suspense when both defaultPropsClientOnly and componentPropsClientOnly are false', () => {
    const DefinedSuspense = defineSuspense({ defaultPropsClientOnly: false, componentPropsClientOnly: false })
    expect(DefinedSuspense).toBe(Suspense)
  })

  it('should return Suspense when defaultPropsClientOnly is true and componentPropsClientOnly is false', () => {
    const DefinedSuspense = defineSuspense({ defaultPropsClientOnly: true, componentPropsClientOnly: false })
    expect(DefinedSuspense).toBe(Suspense)
  })

  it('should return Suspense when both defaultPropsClientOnly and componentPropsClientOnly are undefined', () => {
    const DefinedSuspense = defineSuspense({})
    expect(DefinedSuspense).toBe(Suspense)
  })
})
