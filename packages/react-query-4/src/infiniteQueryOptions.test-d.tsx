import { type InfiniteData, type UseInfiniteQueryResult, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { describe, expectTypeOf, it } from 'vitest'
import { infiniteQueryOptions } from './infiniteQueryOptions'
import { SuspenseInfiniteQuery } from './SuspenseInfiniteQuery'
import { queryKey } from './test-utils'
import { usePrefetchInfiniteQuery } from './usePrefetchInfiniteQuery'
import { type UseSuspenseInfiniteQueryResult, useSuspenseInfiniteQuery } from './useSuspenseInfiniteQuery'

const infiniteQuery = {
  options1: () =>
    infiniteQueryOptions({
      queryKey: [...queryKey, 1] as const,
      queryFn: () => Promise.resolve({ field: 'success' }),
    }),
  options2: () =>
    infiniteQueryOptions({
      queryKey: [...queryKey, 2] as const,
      queryFn: () => Promise.resolve({ field: 'success' }),
    }),
}

describe('infiniteQueryOptions', () => {
  it('should be used with useInfiniteQuery', () => {
    const keyFn1Query = useInfiniteQuery(infiniteQuery.options1())
    expectTypeOf(keyFn1Query).toEqualTypeOf<UseInfiniteQueryResult<{ field: string }>>()
    expectTypeOf(keyFn1Query.data).toEqualTypeOf<InfiniteData<{ field: string }> | undefined>()
    const keyFn1Query_Select = useInfiniteQuery({
      ...infiniteQuery.options1(),
      select: (data) => ({
        pages: data.pages.map(({ field }) => field),
        pageParams: data.pageParams,
      }),
    })
    expectTypeOf(keyFn1Query_Select).toEqualTypeOf<UseInfiniteQueryResult<string>>()
    expectTypeOf(keyFn1Query_Select.data).toEqualTypeOf<InfiniteData<string> | undefined>()
  })
  it('should be used with useSuspenseInfiniteQuery', () => {
    const keyFn1SuspenseQuery = useSuspenseInfiniteQuery(infiniteQuery.options1())
    expectTypeOf(keyFn1SuspenseQuery).toEqualTypeOf<UseSuspenseInfiniteQueryResult<{ field: string }>>()
    expectTypeOf(keyFn1SuspenseQuery.data).toEqualTypeOf<InfiniteData<{ field: string }>>()
    const keyFn1SuspenseQuery_Select = useSuspenseInfiniteQuery({
      ...infiniteQuery.options1(),
      select: (data) => ({
        pages: data.pages.map(({ field }) => field),
        pageParams: data.pageParams,
      }),
    })
    expectTypeOf(keyFn1SuspenseQuery_Select).toEqualTypeOf<UseSuspenseInfiniteQueryResult<string>>()
    expectTypeOf(keyFn1SuspenseQuery_Select.data).toEqualTypeOf<InfiniteData<string>>()
  })
  it('should be used with <SuspenseInfiniteQuery/>', () => {
    ;(() => (
      <SuspenseInfiniteQuery {...infiniteQuery.options1()}>
        {(keyFn1SuspenseQuery) => {
          expectTypeOf(keyFn1SuspenseQuery).toEqualTypeOf<UseSuspenseInfiniteQueryResult<{ field: string }>>()
          expectTypeOf(keyFn1SuspenseQuery.data).toEqualTypeOf<
            InfiniteData<{
              field: string
            }>
          >()
          return <></>
        }}
      </SuspenseInfiniteQuery>
    ))()
    ;(() => (
      <SuspenseInfiniteQuery
        {...infiniteQuery.options1()}
        select={(data) => ({
          pages: data.pages.map(({ field }) => field),
          pageParams: data.pageParams,
        })}
      >
        {(keyFn1SuspenseQuery_Select) => {
          expectTypeOf(keyFn1SuspenseQuery_Select).toEqualTypeOf<UseSuspenseInfiniteQueryResult<string>>()
          expectTypeOf(keyFn1SuspenseQuery_Select.data).toEqualTypeOf<InfiniteData<string>>()
          return <></>
        }}
      </SuspenseInfiniteQuery>
    ))()
  })
  it('should be used with usePrefetchInfiniteQuery', () => {
    expectTypeOf(usePrefetchInfiniteQuery(infiniteQuery.options1())).toBeVoid()
    expectTypeOf(usePrefetchInfiniteQuery({ ...infiniteQuery.options1() })).toBeVoid()
  })
  it('should be used with useQueryClient', async () => {
    const queryClient = useQueryClient()

    queryClient.invalidateQueries(infiniteQuery.options1())
    queryClient.resetQueries(infiniteQuery.options1())
    queryClient.removeQueries(infiniteQuery.options1())
    queryClient.cancelQueries(infiniteQuery.options1())
    queryClient.prefetchQuery(infiniteQuery.options1())
    queryClient.refetchQueries(infiniteQuery.options1())

    const query1 = await queryClient.fetchQuery(infiniteQuery.options1())
    expectTypeOf(query1).toEqualTypeOf<{ field: string }>()
  })
})
