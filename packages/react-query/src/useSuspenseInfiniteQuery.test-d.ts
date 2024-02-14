/* eslint-disable react-hooks/rules-of-hooks */
import { sleep } from '@suspensive/test-utils'
import type { InfiniteData } from '@tanstack/react-query'
import { describe, expectTypeOf, it } from 'vitest'
import { useSuspenseInfiniteQuery } from '../dist'

const queryKey = ['key'] as const
const queryFn = () => sleep(10).then(() => ({ text: 'response' }) as const)
const boolean = Math.random() > 0.5

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
useSuspenseInfiniteQuery({ queryKey, queryFn, placeholderData: boolean })
// @ts-expect-error no placeholderData
useSuspenseInfiniteQuery(queryKey, { queryFn, placeholderData: boolean })
// @ts-expect-error no placeholderData
useSuspenseInfiniteQuery(queryKey, queryFn, { placeholderData: boolean })

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
