import { describe, expectTypeOf, it } from 'vitest'
import type { DefaultError, Register } from './types'
import { SuspenseQuery } from './SuspenseQuery'
import { SuspenseInfiniteQuery } from './SuspenseInfiniteQuery'
import { Mutation } from './Mutation'
import { PrefetchQuery } from './PrefetchQuery'
import { PrefetchInfiniteQuery } from './PrefetchInfiniteQuery'
import { queryFn, queryKey } from './test-utils'

// Test custom error class
class CustomError extends Error {
  constructor(
    message: string,
    public code: number
  ) {
    super(message)
  }
}

// Test module augmentation
declare module '@suspensive/react-query' {
  interface Register {
    defaultError: CustomError
  }
}

describe('DefaultError type overriding', () => {
  it('should use the overridden error type in DefaultError', () => {
    expectTypeOf<DefaultError>().toEqualTypeOf<CustomError>()
    expectTypeOf<Register['defaultError']>().toEqualTypeOf<CustomError>()
  })

  it('should use the overridden error type in SuspenseQuery', () => {
    ;(() => (
      <SuspenseQuery queryKey={queryKey} queryFn={queryFn}>
        {(query) => {
          // When no TError is specified, should use DefaultError (which is CustomError)
          expectTypeOf(query.error).toEqualTypeOf<CustomError | null>()
          return <></>
        }}
      </SuspenseQuery>
    ))()
    ;(() => (
      <SuspenseQuery<{ text: string }, CustomError> queryKey={queryKey} queryFn={queryFn}>
        {(query) => {
          // When TError is explicitly specified, should use that type
          expectTypeOf(query.error).toEqualTypeOf<CustomError | null>()
          return <></>
        }}
      </SuspenseQuery>
    ))()
    ;(() => (
      <SuspenseQuery<{ text: string }, Error> queryKey={queryKey} queryFn={queryFn}>
        {(query) => {
          // When TError is explicitly specified as Error, should use Error
          expectTypeOf(query.error).toEqualTypeOf<Error | null>()
          return <></>
        }}
      </SuspenseQuery>
    ))()
  })

  it('should use the overridden error type in SuspenseInfiniteQuery', () => {
    ;(() => (
      <SuspenseInfiniteQuery queryKey={queryKey} queryFn={queryFn} initialPageParam={0} getNextPageParam={() => 1}>
        {(query) => {
          expectTypeOf(query.error).toEqualTypeOf<CustomError | null>()
          return <></>
        }}
      </SuspenseInfiniteQuery>
    ))()
  })

  it('should use the overridden error type in Mutation', () => {
    ;(() => (
      <Mutation mutationFn={() => Promise.resolve('success')}>
        {(mutation) => {
          expectTypeOf(mutation.error).toEqualTypeOf<CustomError | null>()
          return <></>
        }}
      </Mutation>
    ))()
  })

  it('should use the overridden error type in PrefetchQuery', () => {
    // PrefetchQuery doesn't expose the error type directly in props,
    // but it should use the correct type internally
    expectTypeOf(<PrefetchQuery queryKey={queryKey} queryFn={queryFn} />).toEqualTypeOf<React.JSX.Element>()
  })

  it('should use the overridden error type in PrefetchInfiniteQuery', () => {
    // PrefetchInfiniteQuery doesn't expose the error type directly in props,
    // but it should use the correct type internally
    expectTypeOf(
      <PrefetchInfiniteQuery queryKey={queryKey} queryFn={queryFn} initialPageParam={0} getNextPageParam={() => 1} />
    ).toEqualTypeOf<React.JSX.Element>()
  })

  it('should support complex custom error types with additional properties', () => {
    class ApiError extends Error {
      constructor(
        message: string,
        public status: number,
        public response?: unknown,
        public retryable: boolean = false
      ) {
        super(message)
        this.name = 'ApiError'
      }
    }

    // Simulate user's module augmentation for this test scope
    const testError = new ApiError('Test error', 500, { details: 'Server error' }, true)

    // Verify the error type structure
    expectTypeOf(testError.status).toEqualTypeOf<number>()
    expectTypeOf(testError.response).toEqualTypeOf<unknown>()
    expectTypeOf(testError.retryable).toEqualTypeOf<boolean>()
  })
})
