import type { InfiniteData } from '@tanstack/react-query'
import { infiniteQueryOptions } from './infiniteQueryOptions'
import { queryFn, queryKey } from './test-utils'
import { type UseSuspenseInfiniteQueryResult, useSuspenseInfiniteQuery } from './useSuspenseInfiniteQuery'

describe('useSuspenseInfiniteQuery', () => {
  it('type check', () => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    useSuspenseInfiniteQuery({
      queryKey,
      queryFn,
      // @ts-expect-error no isPlaceholderData
    }).isPlaceholderData

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

    const options = infiniteQueryOptions({
      queryKey,
      queryFn,
    })

    const infiniteQueryWithOptions = useSuspenseInfiniteQuery(options)
    expectTypeOf(infiniteQueryWithOptions).toEqualTypeOf<UseSuspenseInfiniteQueryResult<{ text: string }>>()
    expectTypeOf(infiniteQueryWithOptions.data).toEqualTypeOf<InfiniteData<{ text: string }>>()
    expectTypeOf(infiniteQueryWithOptions.status).toEqualTypeOf<'success'>()

    const selectedInfiniteQueryWithOptions = useSuspenseInfiniteQuery({
      ...options,
      select: (data) => ({
        pages: data.pages.map(({ text }) => text),
        pageParams: data.pageParams,
      }),
    })
    expectTypeOf(selectedInfiniteQueryWithOptions).toEqualTypeOf<UseSuspenseInfiniteQueryResult<string>>()
    expectTypeOf(selectedInfiniteQueryWithOptions.data).toEqualTypeOf<InfiniteData<string>>()
    expectTypeOf(selectedInfiniteQueryWithOptions.status).toEqualTypeOf<'success'>()
  })
})
