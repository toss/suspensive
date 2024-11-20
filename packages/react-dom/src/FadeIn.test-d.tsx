import type { CSSProperties, ComponentProps } from 'react'
import { FadeIn } from './FadeIn'
import type { OmitKeyof } from './utility-types'

const Example1 = ({}: { x: string }) => <></>
const Example2 = () => <></>

describe('<FadeIn/>', () => {
  it('type check', () => {
    // @ts-expect-error ts(2322)
    ;(() => <FadeIn as="div" href="https://example.com" />)()
    ;(() => <FadeIn as="a" href="https://example.com" />)()
    ;(() => <FadeIn />)()
    ;(() => <FadeIn as={Example1} x="string" />)()
    // @ts-expect-error ts(2322)
    ;(() => <FadeIn as={Example2} x="string" />)()

    expectTypeOf<keyof ComponentProps<typeof FadeIn<typeof Example2>>>().toEqualTypeOf<
      'root' | 'rootMargin' | 'threshold' | 'triggerOnce' | 'delay' | 'style' | 'as' | 'duration' | 'timingFunction'
    >()
    expectTypeOf<ComponentProps<typeof FadeIn<typeof Example2>>['style']>().toEqualTypeOf<
      OmitKeyof<CSSProperties, 'opacity' | 'willChange' | 'transition'> | undefined
    >()
  })
})
