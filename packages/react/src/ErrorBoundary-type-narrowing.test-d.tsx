import type { ErrorBoundaryFallbackProps } from './ErrorBoundary'
import { ErrorBoundary } from './ErrorBoundary'

class CustomError extends Error {
  customProperty = 'custom'
}

class AnotherError extends Error {
  anotherProperty = 'another'
}

describe('<ErrorBoundary/> type narrowing', () => {
  it('should narrow error type for single constructor', () => {
    // Test that error type is narrowed to CustomError when shouldCatch is CustomError
    const example = (
      <ErrorBoundary
        shouldCatch={CustomError}
        fallback={({ error }: ErrorBoundaryFallbackProps<CustomError>) => {
          // @ts-expect-error Access customProperty to verify error is narrowed
          expectTypeOf(error.customProperty).toEqualTypeOf<string>()
          return <div>{error.message}</div>
        }}
      >
        <div>content</div>
      </ErrorBoundary>
    )
    expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
  })

  it('should narrow error type for array of constructors', () => {
    // Test that error type is union of CustomError | AnotherError
    const example = (
      <ErrorBoundary
        shouldCatch={[CustomError, AnotherError]}
        fallback={({ error }: ErrorBoundaryFallbackProps<CustomError | AnotherError>) => {
          // Both error types should be accessible
          if (error instanceof CustomError) {
            expectTypeOf(error.customProperty).toEqualTypeOf<string>()
          }
          if (error instanceof AnotherError) {
            expectTypeOf(error.anotherProperty).toEqualTypeOf<string>()
          }
          return <div>{error.message}</div>
        }}
      >
        <div>content</div>
      </ErrorBoundary>
    )
    expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
  })

  it('should fallback to Error for boolean shouldCatch', () => {
    // Test that error remains Error when shouldCatch is boolean
    const example = (
      <ErrorBoundary
        shouldCatch={true}
        fallback={({ error }: ErrorBoundaryFallbackProps<Error>) => {
          expectTypeOf(error).toEqualTypeOf<Error>()
          return <div>{error.message}</div>
        }}
      >
        <div>content</div>
      </ErrorBoundary>
    )
    expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
  })

  it('should fallback to Error for function shouldCatch', () => {
    // Test that error remains Error when shouldCatch is a function
    const example = (
      <ErrorBoundary
        shouldCatch={(error) => error instanceof CustomError}
        fallback={({ error }: ErrorBoundaryFallbackProps<Error>) => {
          expectTypeOf(error).toEqualTypeOf<Error>()
          return <div>{error.message}</div>
        }}
      >
        <div>content</div>
      </ErrorBoundary>
    )
    expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
  })

  it('should fallback to Error for mixed array', () => {
    // Test that error remains Error when array contains non-constructor values
    const example = (
      <ErrorBoundary
        shouldCatch={[CustomError, true, (error) => error instanceof AnotherError]}
        fallback={({ error }: ErrorBoundaryFallbackProps<Error>) => {
          expectTypeOf(error).toEqualTypeOf<Error>()
          return <div>{error.message}</div>
        }}
      >
        <div>content</div>
      </ErrorBoundary>
    )
    expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
  })

  it('should use Error as default when shouldCatch is undefined', () => {
    // Test default behavior
    const example = (
      <ErrorBoundary
        fallback={({ error }: ErrorBoundaryFallbackProps<Error>) => {
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
