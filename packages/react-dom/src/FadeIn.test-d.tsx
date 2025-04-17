import type { ComponentProps } from 'react'
import type { FadeIn } from './FadeIn'

describe('<FadeIn/>', () => {
  it('type check', () => {
    expectTypeOf<keyof ComponentProps<typeof FadeIn>>().toEqualTypeOf<
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
