import { queryFn, queryKey } from '@suspensive/test-utils'
import type { InfiniteData } from '@tanstack/react-query'
import { describe, expectTypeOf, it } from 'vitest'
import { type UseSuspenseInfiniteQueryResult, useSuspenseInfiniteQuery } from '../dist'

describe('useSuspenseInfiniteQuery', () => {
  it('type error', () => {
    // @ts-expect-error no arg
    useSuspenseInfiniteQuery()

    useSuspenseInfiniteQuery({
      queryKey,
      queryFn,
      // @ts-expect-error no suspense
      suspense: boolean,
    })
    useSuspenseInfiniteQuery({
      queryKey,
      queryFn,
      // @ts-expect-error no useErrorBoundary
      useErrorBoundary: boolean,
    })
    useSuspenseInfiniteQuery({
      queryKey,
      queryFn,
      // @ts-expect-error no enabled
      enabled: boolean,
    })
    useSuspenseInfiniteQuery({
      queryKey,
      queryFn,
      // @ts-expect-error no placeholderData
      placeholderData: 'placeholder',
    })
    useSuspenseInfiniteQuery({
      queryKey,
      queryFn,
      // @ts-expect-error no isPlaceholderData
    }).isPlaceholderData
  })

  it('type check', () => {
    const infiniteQuery = useSuspenseInfiniteQuery({ queryKey, queryFn })
    expectTypeOf(infiniteQuery).toEqualTypeOf<UseSuspenseInfiniteQueryResult<{ text: string }>>()
    expectTypeOf(infiniteQuery.data).toEqualTypeOf<InfiniteData<{ text: string }>>()
    expectTypeOf(infiniteQuery.status).toEqualTypeOf<'success'>()

    const selectedInfiniteQuery = useSuspenseInfiniteQuery({
      queryKey,
      queryFn,
      select: (data) => ({
        pages: data.pages.map(({ text }) => text),
        pageParams: data.pageParams,
      }),
    })
    expectTypeOf(selectedInfiniteQuery).toEqualTypeOf<UseSuspenseInfiniteQueryResult<string>>()
    expectTypeOf(selectedInfiniteQuery.data).toEqualTypeOf<InfiniteData<string>>()
    expectTypeOf(selectedInfiniteQuery.status).toEqualTypeOf<'success'>()
  })
})
