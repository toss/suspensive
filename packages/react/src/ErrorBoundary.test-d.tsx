import { CustomError, CustomNotError } from '@suspensive/test-utils'
import type { ComponentProps } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import type { ConstructorType } from './utility-types'

describe('<ErrorBoundary/>', () => {
  it('should pass only boolean or ErrorConstructor or ShouldCatchCallback or ShouldCatch[]', () => {
    type ShouldCatchCallback = (error: Error) => boolean
    type ShouldCatch = ConstructorType<Error> | ShouldCatchCallback
    expectTypeOf<ComponentProps<typeof ErrorBoundary>['shouldCatch']>().toEqualTypeOf<
      undefined | boolean | ShouldCatch | [ShouldCatch, ...ShouldCatch[]]
    >()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const Example = () => (
      <ErrorBoundary
        shouldCatch={[
          // @ts-expect-error CustomNotError should be new (...args) => Error
          CustomNotError,
          CustomError,
          (error) => error instanceof CustomError,
        ]}
        fallback={({ error }) => <>{error.message} of Child</>}
      ></ErrorBoundary>
    )
  })
})
