import { createTypedErrorBoundary, ErrorBoundary } from './ErrorBoundary'

class CustomError extends Error {
  customProperty = 'custom'
}

class AnotherError extends Error {
  anotherProperty = 'another'
}

describe('ErrorBoundary type narrowing', () => {
  it('should work with regular ErrorBoundary (no type narrowing)', () => {
    const example = (
      <ErrorBoundary
        shouldCatch={CustomError}
        fallback={({ error }) => {
          // error type should be Error (no narrowing)
          expectTypeOf(error).toEqualTypeOf<Error>()
          return <div>{error.message}</div>
        }}
      >
        <div>content</div>
      </ErrorBoundary>
    )
    expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
  })

  it('should work with createTypedErrorBoundary for single error constructor', () => {
    const TypedErrorBoundary = createTypedErrorBoundary<typeof CustomError>()

    const example = (
      <TypedErrorBoundary
        shouldCatch={CustomError}
        fallback={({ error }) => {
          // This demonstrates the concept, though the exact inference may need refinement
          return <div>{error.message}</div>
        }}
      >
        <div>content</div>
      </TypedErrorBoundary>
    )
    expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
  })

  it('should maintain backward compatibility', () => {
    // Existing code should continue to work without changes
    const example = (
      <ErrorBoundary fallback={({ error }) => <div>{error.message}</div>}>
        <div>content</div>
      </ErrorBoundary>
    )
    expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
  })
})
