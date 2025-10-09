import { type ComponentProps, type ReactNode, useState } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { CustomError } from './test-utils'
import type { ConstructorType } from './utility-types/ConstructorType'

class CustomNotError {
  constructor(public message?: string) {
    console.log(message)
  }
}

describe('<ErrorBoundary/>', () => {
  it('should pass only boolean or ErrorConstructor or ShouldCatchCallback or ShouldCatch[]', () => {
    type ShouldCatchCallback = (error: Error) => boolean
    type ShouldCatch = boolean | ConstructorType<Error> | ShouldCatchCallback
    expectTypeOf<ComponentProps<typeof ErrorBoundary>['shouldCatch']>().toEqualTypeOf<
      undefined | ShouldCatch | [ShouldCatch, ...ShouldCatch[]]
    >()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ShouldCatchByMany = () => {
      const [randomNumber] = useState(() => Math.random())

      return (
        <ErrorBoundary
          shouldCatch={[
            // @ts-expect-error CustomNotError should be new (...args) => Error
            CustomNotError,
            CustomError,
            (error) => error instanceof CustomError,
            randomNumber > 0.5,
          ]}
          fallback={({ error }) => <>{error.message} of Child</>}
        ></ErrorBoundary>
      )
    }

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
    expectTypeOf(<ErrorBoundary.Consumer>{() => <></>}</ErrorBoundary.Consumer>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<ErrorBoundary.Consumer>{() => <></>}</ErrorBoundary.Consumer>).not.toEqualTypeOf<ReactNode>()
  })
})
