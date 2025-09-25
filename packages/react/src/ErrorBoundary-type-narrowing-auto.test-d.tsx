import { ErrorBoundary, withErrorBoundary } from './ErrorBoundary'

class CustomError extends Error {
  customProperty = 'custom'
}

class AnotherError extends Error {
  anotherProperty = 'another'
}

describe('ErrorBoundary automatic type narrowing', () => {
  it('should narrow error type for single constructor using withErrorBoundary', () => {
    const example = withErrorBoundary({
      shouldCatch: CustomError,
      fallback: ({ error }) => {
        // error should be typed as CustomError
        expectTypeOf(error).toEqualTypeOf<CustomError>()
        expectTypeOf(error.customProperty).toEqualTypeOf<string>()
        return <div>{error.message}</div>
      },
      children: <div>content</div>
    })
    expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
  })

  it('should narrow error type for array of constructors using withErrorBoundary', () => {
    const example = withErrorBoundary({
      shouldCatch: [CustomError, AnotherError],
      fallback: ({ error }) => {
        // This is what @manudeli requested - error should be CustomError | AnotherError automatically
        expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError>()
        if (error instanceof CustomError) {
          expectTypeOf(error.customProperty).toEqualTypeOf<string>()
        }
        if (error instanceof AnotherError) {
          expectTypeOf(error.anotherProperty).toEqualTypeOf<string>()
        }
        return <div>{error.message}</div>
      },
      children: <div>content</div>
    })
    expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
  })

  it('should fallback to Error for boolean shouldCatch with withErrorBoundary', () => {
    const example = withErrorBoundary({
      shouldCatch: true,
      fallback: ({ error }) => {
        expectTypeOf(error).toEqualTypeOf<Error>()
        return <div>{error.message}</div>
      },
      children: <div>content</div>
    })
    expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
  })

  it('should maintain backward compatibility with regular ErrorBoundary', () => {
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

  it('should work with regular ErrorBoundary and specific error constructors', () => {
    // This shows existing behavior - no automatic narrowing
    const example = (
      <ErrorBoundary
        shouldCatch={CustomError}
        fallback={({ error }) => {
          // error remains as Error type without narrowing
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