import type { ComponentProps, ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { CustomError, CustomNotError } from './test-utils'
import type { ConstructorType } from './utility-types'

describe('<ErrorBoundary/>', () => {
  it('should pass only boolean or ErrorConstructor or ShouldCatchCallback or ShouldCatch[]', () => {
    type ShouldCatchCallback = (error: Error) => boolean
    type ShouldCatch = boolean | ConstructorType<Error> | ShouldCatchCallback
    expectTypeOf<ComponentProps<typeof ErrorBoundary>['shouldCatch']>().toEqualTypeOf<
      undefined | ShouldCatch | [ShouldCatch, ...ShouldCatch[]]
    >()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ShouldCatchByMany = () => (
      <ErrorBoundary
        shouldCatch={[
          // @ts-expect-error CustomNotError should be new (...args) => Error
          CustomNotError,
          CustomError,
          (error) => error instanceof CustomError,
          Math.random() > 0.5,
        ]}
        fallback={({ error }) => <>{error.message} of Child</>}
      ></ErrorBoundary>
    )

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ShouldCatchByOne = () => (
      <ErrorBoundary
        // @ts-expect-error CustomNotError should be new (...args) => Error
        shouldCatch={CustomNotError}
        fallback={({ error }) => <>{error.message} of Child</>}
      ></ErrorBoundary>
    )
  })

  it('type check', () => {
    expectTypeOf(<ErrorBoundary.Consumer>{() => <></>}</ErrorBoundary.Consumer>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<ErrorBoundary.Consumer>{() => <></>}</ErrorBoundary.Consumer>).not.toEqualTypeOf<ReactNode>()
  })
})
