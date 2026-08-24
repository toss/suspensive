import type { ReactNode } from 'react'
import { ErrorBoundaryGroup } from './ErrorBoundaryGroup'

describe('ErrorBoundaryGroup', () => {
  it('type check', () => {
    expectTypeOf(
      <ErrorBoundaryGroup.Consumer>{() => <></>}</ErrorBoundaryGroup.Consumer>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <ErrorBoundaryGroup.Consumer>{() => <></>}</ErrorBoundaryGroup.Consumer>
    ).not.toEqualTypeOf<ReactNode>()
  })

  describe('ErrorBoundaryGroup.with', () => {
    it('should accept the React-reserved key attribute on components wrapped without props', () => {
      const Wrapped = ErrorBoundaryGroup.with({}, () => <></>)

      expectTypeOf([<Wrapped key="a" />, <Wrapped key="b" />]).toEqualTypeOf<Array<React.JSX.Element>>()

      assertType(
        // @ts-expect-error arbitrary props should still be rejected
        <Wrapped foo="bar" />
      )
    })

    it('should accept the key attribute along with inferred props', () => {
      const Wrapped = ErrorBoundaryGroup.with({}, ({ text }: { text: string }) => <>{text}</>)

      expectTypeOf(<Wrapped key="a" text="text" />).toEqualTypeOf<React.JSX.Element>()
    })
  })
})
