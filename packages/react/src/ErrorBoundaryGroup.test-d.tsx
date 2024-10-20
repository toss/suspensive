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
})
