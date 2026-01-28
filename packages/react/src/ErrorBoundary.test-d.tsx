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
  it('should not accept empty array', () => {
    assertType(() => (
      <ErrorBoundary
        // @ts-expect-error shouldCatch should be ErrorMatcher | [ErrorMatcher, ...ErrorMatcher[]]
        shouldCatch={[]}
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

    class ThirdError extends Error {
      thirdProperty = 'third' as const
    }

    class FourthError extends Error {
      fourthProperty = 'fourth' as const
    }

    class FifthError<T> extends Error {
      fifthProperty = 'fifth' as const
      constructor(public data: T) {
        super(`FifthError with data: ${data}`)
      }
    }

    function isAnotherError(payload: unknown): payload is AnotherError {
      return payload instanceof AnotherError
    }

    function isThirdError(payload: unknown): payload is ThirdError {
      return payload instanceof ThirdError
    }

    function isFourthError(payload: unknown): payload is FourthError {
      return payload instanceof FourthError
    }

    // Type guard functions with different signatures
    function isAnotherErrorWithErrorParam(error: Error): error is AnotherError {
      return error instanceof AnotherError
    }

    // Callback functions (non-type-guards)
    const customErrorCallback = (error: Error) => error instanceof CustomError

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
          onCatch={(error) => {
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
          onCatch={(error) => {
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
          onCatch={(error) => {
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

    // Single Error Constructor Tests
    it('should infer error type from single Error constructor (AnotherError)', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={AnotherError}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
            expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should infer error type from single Error constructor (ThirdError)', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={ThirdError}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<ThirdError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<ThirdError>()
            expectTypeOf(error.thirdProperty).toEqualTypeOf<'third'>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should infer error type from single generic Error constructor (FifthError)', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={FifthError<string>}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<FifthError<string>>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<FifthError<string>>()
            expectTypeOf(error.fifthProperty).toEqualTypeOf<'fifth'>()
            expectTypeOf(error.data).toEqualTypeOf<string>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Type Guard Function Tests
    it('should infer error type from single type guard function (unknown param)', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={isAnotherError}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should infer error type from single type guard function (Error param)', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={isAnotherErrorWithErrorParam}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should infer error type from single type guard function (ThirdError)', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={isThirdError}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<ThirdError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<ThirdError>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Callback Function Tests (should fallback to Error)
    it('should fallback to generic Error type for callback functions', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={customErrorCallback}
          onCatch={(error) => {
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

    // Array Tests - Two Error Constructors
    it('should infer union error type from array of two Error constructors', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[CustomError, AnotherError]}
          onCatch={(error) => {
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

    it('should infer union error type from array of three Error constructors', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[CustomError, AnotherError, ThirdError]}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError | ThirdError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError | ThirdError>()
            if (error instanceof CustomError) {
              expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            }
            if (error instanceof AnotherError) {
              expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            }
            if (error instanceof ThirdError) {
              expectTypeOf(error.thirdProperty).toEqualTypeOf<'third'>()
            }
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Array Tests - Mixed Type Guards
    it('should infer union error type from array of Error constructor and type guard', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[CustomError, isAnotherError]}
          onCatch={(error) => {
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

    it('should infer union error type from array of multiple type guards', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[isAnotherError, isThirdError, isFourthError]}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError | ThirdError | FourthError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError | ThirdError | FourthError>()
            if (error instanceof AnotherError) {
              expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            }
            if (error instanceof ThirdError) {
              expectTypeOf(error.thirdProperty).toEqualTypeOf<'third'>()
            }
            if (error instanceof FourthError) {
              expectTypeOf(error.fourthProperty).toEqualTypeOf<'fourth'>()
            }
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Array Tests - Mixed with Callbacks (should fallback to Error)
    it('should fallback to generic Error type for arrays containing callback functions', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[CustomError, customErrorCallback]}
          onCatch={(error) => {
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

    it('should fallback to generic Error type for arrays containing boolean values', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[CustomError, true]}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | Error>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | Error>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Boolean Tests
    it('should fallback to generic Error type when shouldCatch is boolean false', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={false}
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

    // Complex Array Tests
    it('should infer union error type from complex array with constructors and type guards', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[CustomError, AnotherError, isThirdError, isFourthError]}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError | ThirdError | FourthError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError | ThirdError | FourthError>()
            if (error instanceof CustomError) {
              expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            }
            if (error instanceof AnotherError) {
              expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            }
            if (error instanceof ThirdError) {
              expectTypeOf(error.thirdProperty).toEqualTypeOf<'third'>()
            }
            if (error instanceof FourthError) {
              expectTypeOf(error.fourthProperty).toEqualTypeOf<'fourth'>()
            }
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Edge Cases
    it('should handle undefined shouldCatch', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={undefined}
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

    it('should handle single element array with Error constructor', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[CustomError]}
          onCatch={(error) => {
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

    it('should handle single element array with type guard', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[isAnotherError]}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
            expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Built-in Error Constructor
    it('should handle built-in Error constructor', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={Error}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<Error>()
          }}
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

    it('should handle array with built-in Error constructor and custom constructors', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[Error, CustomError, AnotherError]}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<Error | CustomError | AnotherError>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<Error | CustomError | AnotherError>()
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

    it('should handle array with generic Error constructor and other constructors', () => {
      const example = (
        <ErrorBoundary
          shouldCatch={[CustomError, FifthError<number>]}
          onCatch={(error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | FifthError<number>>()
          }}
          fallback={({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | FifthError<number>>()
            if (error instanceof CustomError) {
              expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            }
            if (error instanceof FifthError) {
              expectTypeOf(error.fifthProperty).toEqualTypeOf<'fifth'>()
              expectTypeOf(error.data).toEqualTypeOf<number>()
            }
            return <div>{error.message}</div>
          }}
        >
          <div>content</div>
        </ErrorBoundary>
      )
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })
  })

  describe('ErrorBoundary.with automatic error type inference from shouldCatch prop', () => {
    class CustomError extends Error {
      customProperty = 'custom' as const
    }

    class AnotherError extends Error {
      anotherProperty = 'another' as const
    }

    class ThirdError extends Error {
      thirdProperty = 'third' as const
    }

    class FourthError extends Error {
      fourthProperty = 'fourth' as const
    }

    class FifthError<T> extends Error {
      fifthProperty = 'fifth' as const
      constructor(public data: T) {
        super(`FifthError with data: ${data}`)
      }
    }

    function isAnotherError(payload: unknown): payload is AnotherError {
      return payload instanceof AnotherError
    }

    function isThirdError(payload: unknown): payload is ThirdError {
      return payload instanceof ThirdError
    }

    function isFourthError(payload: unknown): payload is FourthError {
      return payload instanceof FourthError
    }

    // Type guard functions with different signatures
    function isAnotherErrorWithErrorParam(error: Error): error is AnotherError {
      return error instanceof AnotherError
    }

    // Callback functions (non-type-guards)
    const customErrorCallback = (error: Error) => error instanceof CustomError

    // Test component
    const TestComponent = ({ message }: { message: string }) => <div>{message}</div>

    it('should maintain backward compatibility - fallback error type defaults to Error when no shouldCatch is provided', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<Error>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should automatically infer error type from single Error constructor in shouldCatch', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: CustomError,
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should provide type-safe access to custom error properties when using single Error constructor', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: CustomError,
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
            expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should automatically infer union error type from array of Error constructors and type guards in shouldCatch', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [CustomError, (e) => isAnotherError(e), isAnotherError, (e) => e instanceof AnotherError],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError>()
            if (error instanceof CustomError) {
              expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            }
            if (error instanceof AnotherError) {
              expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            }
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should fallback to generic Error type when shouldCatch is boolean true', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: true,
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<Error>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Single Error Constructor Tests
    it('should infer error type from single Error constructor (AnotherError)', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: AnotherError,
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
            expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should infer error type from single Error constructor (ThirdError)', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: ThirdError,
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<ThirdError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<ThirdError>()
            expectTypeOf(error.thirdProperty).toEqualTypeOf<'third'>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should infer error type from single generic Error constructor (FifthError)', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: FifthError<string>,
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<FifthError<string>>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<FifthError<string>>()
            expectTypeOf(error.fifthProperty).toEqualTypeOf<'fifth'>()
            expectTypeOf(error.data).toEqualTypeOf<string>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Type Guard Function Tests
    it('should infer error type from single type guard function (unknown param)', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: isAnotherError,
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should infer error type from single type guard function (Error param)', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: isAnotherErrorWithErrorParam,
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should infer error type from single type guard function (ThirdError)', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: isThirdError,
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<ThirdError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<ThirdError>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Callback Function Tests (should fallback to Error)
    it('should fallback to generic Error type for callback functions', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: customErrorCallback,
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Array Tests - Two Error Constructors
    it('should infer union error type from array of two Error constructors', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [CustomError, AnotherError],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError>()
            if (error instanceof CustomError) {
              expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            }
            if (error instanceof AnotherError) {
              expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            }
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should infer union error type from array of three Error constructors', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [CustomError, AnotherError, ThirdError],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError | ThirdError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError | ThirdError>()
            if (error instanceof CustomError) {
              expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            }
            if (error instanceof AnotherError) {
              expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            }
            if (error instanceof ThirdError) {
              expectTypeOf(error.thirdProperty).toEqualTypeOf<'third'>()
            }
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Array Tests - Mixed Type Guards
    it('should infer union error type from array of Error constructor and type guard', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [CustomError, isAnotherError],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError>()
            if (error instanceof CustomError) {
              expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            }
            if (error instanceof AnotherError) {
              expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            }
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should infer union error type from array of multiple type guards', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [isAnotherError, isThirdError, isFourthError],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError | ThirdError | FourthError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError | ThirdError | FourthError>()
            if (error instanceof AnotherError) {
              expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            }
            if (error instanceof ThirdError) {
              expectTypeOf(error.thirdProperty).toEqualTypeOf<'third'>()
            }
            if (error instanceof FourthError) {
              expectTypeOf(error.fourthProperty).toEqualTypeOf<'fourth'>()
            }
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Array Tests - Mixed with Callbacks (should fallback to Error)
    it('should fallback to generic Error type for arrays containing callback functions', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [CustomError, customErrorCallback],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should fallback to generic Error type for arrays containing boolean values', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [CustomError, true],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | Error>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | Error>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Boolean Tests
    it('should fallback to generic Error type when shouldCatch is boolean false', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: false,
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<Error>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Complex Array Tests
    it('should infer union error type from complex array with constructors and type guards', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [CustomError, AnotherError, isThirdError, isFourthError],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError | ThirdError | FourthError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | AnotherError | ThirdError | FourthError>()
            if (error instanceof CustomError) {
              expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            }
            if (error instanceof AnotherError) {
              expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            }
            if (error instanceof ThirdError) {
              expectTypeOf(error.thirdProperty).toEqualTypeOf<'third'>()
            }
            if (error instanceof FourthError) {
              expectTypeOf(error.fourthProperty).toEqualTypeOf<'fourth'>()
            }
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Edge Cases
    it('should handle undefined shouldCatch', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: undefined,
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<Error>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should handle single element array with Error constructor', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [CustomError],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError>()
            expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should handle single element array with type guard', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [isAnotherError],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<AnotherError>()
            expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    // Built-in Error Constructor
    it('should handle built-in Error constructor', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: Error,
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<Error>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<Error>()
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should handle array with built-in Error constructor and custom constructors', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [Error, CustomError, AnotherError],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<Error | CustomError | AnotherError>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<Error | CustomError | AnotherError>()
            if (error instanceof CustomError) {
              expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            }
            if (error instanceof AnotherError) {
              expectTypeOf(error.anotherProperty).toEqualTypeOf<'another'>()
            }
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })

    it('should handle array with generic Error constructor and other constructors', () => {
      const WrappedComponent = ErrorBoundary.with(
        {
          shouldCatch: [CustomError, FifthError<number>],
          onCatch: (error) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | FifthError<number>>()
          },
          fallback: ({ error }) => {
            expectTypeOf(error).toEqualTypeOf<CustomError | FifthError<number>>()
            if (error instanceof CustomError) {
              expectTypeOf(error.customProperty).toEqualTypeOf<'custom'>()
            }
            if (error instanceof FifthError) {
              expectTypeOf(error.fifthProperty).toEqualTypeOf<'fifth'>()
              expectTypeOf(error.data).toEqualTypeOf<number>()
            }
            return <div>{error.message}</div>
          },
        },
        TestComponent
      )

      const example = <WrappedComponent message="test" />
      expectTypeOf(example).toEqualTypeOf<React.JSX.Element>()
    })
  })
})
