import type { ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { CustomError } from './test-utils'

class CustomNotError {
  constructor(public message?: string) {
    console.log(message)
  }
}

describe('<ErrorBoundary/>', () => {
  it('should accept only valid shouldCatch types: boolean, Error constructor, callback function, or array of these', () => {
    assertType(() => (
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
    ))

    assertType(() => (
      <ErrorBoundary
        // @ts-expect-error CustomNotError should be new (...args) => Error
        shouldCatch={CustomNotError}
        fallback={({ error }) => <>{error.message} of Child</>}
      ></ErrorBoundary>
    ))
  })

  it('should render ErrorBoundary.Consumer with correct JSX element type', () => {
    expectTypeOf(<ErrorBoundary.Consumer>{() => <></>}</ErrorBoundary.Consumer>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<ErrorBoundary.Consumer>{() => <></>}</ErrorBoundary.Consumer>).not.toEqualTypeOf<ReactNode>()
  })

  describe('ErrorBoundary automatic error type inference from shouldCatch prop', () => {
    class CustomError extends Error {
      customProperty = 'custom' as const
    }

    class AnotherError extends Error {
      anotherProperty = 'another' as const
    }

    function isAnotherError(payload: unknown): payload is AnotherError {
      return payload instanceof AnotherError
    }

    it('should maintain backward compatibility - fallback error type defaults to Error when no shouldCatch is provided', () => {
      const example = (
        <ErrorBoundary
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<Error>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should automatically infer error type from single Error constructor in shouldCatch', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={CustomError}
          onError={(error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should provide type-safe access to custom error properties when using single Error constructor', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={CustomError}
          onError={(error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
            expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should automatically infer union error type from array of Error constructors and type guards in shouldCatch', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[CustomError, (e) => isAnotherError(e), isAnotherError, (e) => e instanceof AnotherError]}
          onError={(error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError>()
            if (error instanceof CustomError) {
              expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            }
            if (error instanceof AnotherError) {
              expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            }
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should fallback to generic Error type when shouldCatch is boolean true', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={true}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<Error>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })
  })
})
