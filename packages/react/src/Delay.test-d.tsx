import type { ReactNode } from 'react'
import { Delay } from './Delay'

describe('<Delay/>', () => {
  it('type check', () => {
    expectTypeOf(
      <Delay>
        <></>
      </Delay>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <Delay>
        <></>
      </Delay>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <Delay>
        {({ isDelayed }) => {
          expectTypeOf(isDelayed).toEqualTypeOf<boolean>()
          return <></>
        }}
      </Delay>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <Delay>
        {({ isDelayed }) => {
          expectTypeOf(isDelayed).toEqualTypeOf<boolean>()
          return <></>
        }}
      </Delay>
    ).not.toEqualTypeOf<ReactNode>()

    expectTypeOf(
      // @ts-expect-error no fallback prop with function children of Delay
      <Delay fallback="delaying">
        {({}) => {
          return <></>
        }}
      </Delay>
    ).toEqualTypeOf<React.JSX.Element>()
  })
})
