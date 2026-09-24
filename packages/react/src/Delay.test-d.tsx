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

  describe('Delay.with', () => {
    it('should accept the React-reserved key attribute on components wrapped without props', () => {
      const Wrapped = Delay.with({ ms: 1000 }, () => <></>)

      expectTypeOf([<Wrapped key="a" />, <Wrapped key="b" />]).toEqualTypeOf<Array<React.JSX.Element>>()

      assertType(
        // @ts-expect-error arbitrary props should still be rejected
        <Wrapped foo="bar" />
      )
    })

    it('should accept the key attribute along with inferred props', () => {
      const Wrapped = Delay.with({ ms: 1000 }, ({ text }: { text: string }) => <>{text}</>)

      expectTypeOf(<Wrapped key="a" text="text" />).toEqualTypeOf<React.JSX.Element>()
    })
  })
})
