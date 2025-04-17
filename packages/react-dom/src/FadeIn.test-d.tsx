import type { ComponentProps } from 'react'
import type { FadeIn } from './FadeIn'

describe('<FadeIn/>', () => {
  it('type check', () => {
    type A = keyof ComponentProps<typeof FadeIn>
    expectTypeOf<A>().toEqualTypeOf<
      | 'root'
      | 'rootMargin'
      | 'threshold'
      | 'triggerOnce'
      | 'delay'
      | 'children'
      | 'duration'
      | 'timingFunction'
      | 'onInView'
      | 'onInViewEnd'
    >()
  })
})
