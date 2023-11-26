/* eslint-disable react-hooks/rules-of-hooks */
import type { InfiniteData } from '@tanstack/react-query'
import { expectError } from 'tsd'
import { describe, expectTypeOf, it } from 'vitest'
import { useSuspenseInfiniteQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = async () => 'response' as const
const boolean = Math.random() > 0.5

// no arg
expectError(useSuspenseInfiniteQuery())
// no suspense
expectError(useSuspenseInfiniteQuery({ queryKey, queryFn, suspense: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, { queryFn, suspense: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, queryFn, { suspense: boolean }))
// no useErrorBoundary
expectError(useSuspenseInfiniteQuery({ queryKey, queryFn, useErrorBoundary: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, { queryFn, useErrorBoundary: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, queryFn, { useErrorBoundary: boolean }))
// no enabled
expectError(useSuspenseInfiniteQuery({ queryKey, queryFn, enabled: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, { queryFn, enabled: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, queryFn, { enabled: boolean }))
// no placeholderData
expectError(useSuspenseInfiniteQuery({ queryKey, queryFn, placeholderData: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, { queryFn, placeholderData: boolean }))
expectError(useSuspenseInfiniteQuery(queryKey, queryFn, { placeholderData: boolean }))

// Result
// no isPlaceholderData
expectError(useSuspenseInfiniteQuery(queryKey, queryFn).isPlaceholderData)
expectError(useSuspenseInfiniteQuery(queryKey, queryFn, {}).isPlaceholderData)
expectError(useSuspenseInfiniteQuery(queryKey, { queryFn }).isPlaceholderData)
expectError(useSuspenseInfiniteQuery({ queryKey, queryFn }).isPlaceholderData)

describe('useSuspenseInfiniteQuery', () => {
  it("'s type check", () => {
    // data is always defined
    expectTypeOf(useSuspenseInfiniteQuery(queryKey, queryFn).data).toEqualTypeOf<
      InfiniteData<Awaited<ReturnType<typeof queryFn>>>
    >()
    expectTypeOf(useSuspenseInfiniteQuery(queryKey, queryFn, {}).data).toEqualTypeOf<
      InfiniteData<Awaited<ReturnType<typeof queryFn>>>
    >()
    expectTypeOf(useSuspenseInfiniteQuery(queryKey, { queryFn }).data).toEqualTypeOf<
      InfiniteData<Awaited<ReturnType<typeof queryFn>>>
    >()
    expectTypeOf(useSuspenseInfiniteQuery({ queryKey, queryFn }).data).toEqualTypeOf<
      InfiniteData<Awaited<ReturnType<typeof queryFn>>>
    >()

    // status is always 'success'
    expectTypeOf(useSuspenseInfiniteQuery(queryKey, queryFn).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseInfiniteQuery(queryKey, queryFn, {}).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseInfiniteQuery(queryKey, { queryFn }).status).toEqualTypeOf<'success'>()
    expectTypeOf(useSuspenseInfiniteQuery({ queryKey, queryFn }).status).toEqualTypeOf<'success'>()
  })
})
