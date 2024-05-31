import type { ReactNode } from 'react'
import { Delay } from './Delay'

describe('<Delay/>', () => {
  it('type check', () => {
    expectTypeOf(
      <Delay>
        <></>
      </Delay>
    ).toEqualTypeOf<JSX.Element>()
    expectTypeOf(
      <Delay>
        <></>
      </Delay>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
