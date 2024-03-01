/* eslint-disable react-hooks/rules-of-hooks */
import { boolean, queryFn, queryKey } from '@suspensive/test-utils'
import type { InfiniteData } from '@tanstack/react-query'
import { describe, expectTypeOf, it } from 'vitest'
import { useSuspenseInfiniteQuery } from '../dist'

// @ts-expect-error no arg
useSuspenseInfiniteQuery()

// @ts-expect-error no suspense
useSuspenseInfiniteQuery({ queryKey, queryFn, suspense: boolean })
// @ts-expect-error no suspense
useSuspenseInfiniteQuery(queryKey, { queryFn, suspense: boolean })
// @ts-expect-error no suspense
useSuspenseInfiniteQuery(queryKey, queryFn, { suspense: boolean })

// @ts-expect-error no useErrorBoundary
useSuspenseInfiniteQuery({ queryKey, queryFn, useErrorBoundary: boolean })
// @ts-expect-error no useErrorBoundary
useSuspenseInfiniteQuery(queryKey, { queryFn, useErrorBoundary: boolean })
// @ts-expect-error no useErrorBoundary
useSuspenseInfiniteQuery(queryKey, queryFn, { useErrorBoundary: boolean })

// @ts-expect-error no enabled
useSuspenseInfiniteQuery({ queryKey, queryFn, enabled: boolean })
// @ts-expect-error no enabled
useSuspenseInfiniteQuery(queryKey, { queryFn, enabled: boolean })
// @ts-expect-error no enabled
useSuspenseInfiniteQuery(queryKey, queryFn, { enabled: boolean })

// @ts-expect-error no placeholderData
useSuspenseInfiniteQuery({ queryKey, queryFn, placeholderData: 'placeholder' })
// @ts-expect-error no placeholderData
useSuspenseInfiniteQuery(queryKey, { queryFn, placeholderData: 'placeholder' })
// @ts-expect-error no placeholderData
useSuspenseInfiniteQuery(queryKey, queryFn, { placeholderData: 'placeholder' })

// @ts-expect-error no isPlaceholderData
useSuspenseInfiniteQuery(queryKey, queryFn).isPlaceholderData
// @ts-expect-error no isPlaceholderData
useSuspenseInfiniteQuery(queryKey, queryFn, {}).isPlaceholderData
// @ts-expect-error no isPlaceholderData
useSuspenseInfiniteQuery(queryKey, { queryFn }).isPlaceholderData
// @ts-expect-error no isPlaceholderData
useSuspenseInfiniteQuery({ queryKey, queryFn }).isPlaceholderData

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
