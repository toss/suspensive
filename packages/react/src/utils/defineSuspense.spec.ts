import { Suspense } from 'react'
import { SuspenseClientOnly, defineSuspense } from './defineSuspense'

describe('defineSuspense', () => {
  it('should return SuspenseClientOnly when componentPropsClientOnly is true', () => {
    const Component = defineSuspense({ componentPropsClientOnly: true })
    expect(Component).toBe(SuspenseClientOnly)
  })

  it('should return SuspenseClientOnly when defaultPropsClientOnly is true and componentPropsClientOnly is undefined', () => {
    const Component = defineSuspense({ defaultPropsClientOnly: true })
    expect(Component).toBe(SuspenseClientOnly)
  })

  it('should return SuspenseClientOnly when defaultPropsClientOnly is false and componentPropsClientOnly is true', () => {
    const Component = defineSuspense({ defaultPropsClientOnly: false, componentPropsClientOnly: true })
    expect(Component).toBe(SuspenseClientOnly)
  })

  it('should return Suspense when both defaultPropsClientOnly and componentPropsClientOnly are false', () => {
    const Component = defineSuspense({ defaultPropsClientOnly: false, componentPropsClientOnly: false })
    expect(Component).toBe(Suspense)
  })

  it('should return Suspense when defaultPropsClientOnly is true and componentPropsClientOnly is false', () => {
    const Component = defineSuspense({ defaultPropsClientOnly: true, componentPropsClientOnly: false })
    expect(Component).toBe(Suspense)
  })

  it('should return Suspense when both defaultPropsClientOnly and componentPropsClientOnly are undefined', () => {
    const Component = defineSuspense({})
    expect(Component).toBe(Suspense)
  })
})
