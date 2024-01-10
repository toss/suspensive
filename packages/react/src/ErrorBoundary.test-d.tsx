import { CustomError, CustomNotError } from '@suspensive/test-utils'
import type { ComponentProps } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import type { ConstructorType } from './utility-types'

describe('<ErrorBoundary/>', () => {
  it('should pass only boolean or ErrorConstructor or EnabledCallback or Enabled[]', () => {
    type EnabledCallback = (error: Error) => boolean
    type Enabled = ConstructorType<Error> | EnabledCallback
    expectTypeOf<ComponentProps<typeof ErrorBoundary>['enabled']>().toEqualTypeOf<
      undefined | boolean | Enabled | [Enabled, ...Enabled[]]
    >()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const Example = () => (
      <ErrorBoundary
        // @ts-expect-error CustomNotError should be new (...args) => Error
        enabled={[CustomNotError, CustomError, (error) => error instanceof CustomError]}
        fallback={({ error }) => <>{error.message} of Child</>}
      ></ErrorBoundary>
    )
  })
})
