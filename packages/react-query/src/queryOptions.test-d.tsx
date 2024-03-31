import { type UseQueryResult, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { describe, expectTypeOf, it } from 'vitest'
import { queryOptions } from './queryOptions'
import { SuspenseQuery } from './SuspenseQuery'
import { useSuspenseQueries } from './useSuspenseQueries'
import { type UseSuspenseQueryResult, useSuspenseQuery } from './useSuspenseQuery'

const query = {
  keyFn1: () =>
    queryOptions({
      queryKey: ['keyFn1'] as const,
      queryFn: () => Promise.resolve({ field: 'success' }),
    }),
  keyFn2: () =>
    queryOptions({
      queryKey: ['keyFn2'] as const,
      queryFn: () => Promise.resolve({ field: 'success' }),
    }),
}

describe('queryOptions', () => {
  it('should be used with useQuery', () => {
    const keyFn1Query = useQuery(query.keyFn1())
    expectTypeOf(keyFn1Query).toEqualTypeOf<UseQueryResult<{ field: string }>>()
    expectTypeOf(keyFn1Query.data).toEqualTypeOf<{ field: string } | undefined>()
    const keyFn1Query_Select = useQuery({ ...query.keyFn1(), select: (data) => data.field })
    expectTypeOf(keyFn1Query_Select).toEqualTypeOf<UseQueryResult<string>>()
    expectTypeOf(keyFn1Query_Select.data).toEqualTypeOf<string | undefined>()
  })
  it('should be used with useSuspenseQuery', () => {
    const keyFn1SuspenseQuery = useSuspenseQuery(query.keyFn1())
    expectTypeOf(keyFn1SuspenseQuery).toEqualTypeOf<UseSuspenseQueryResult<{ field: string }>>()
    expectTypeOf(keyFn1SuspenseQuery.data).toEqualTypeOf<{ field: string }>()
    const keyFn1SuspenseQuery_Select = useSuspenseQuery({ ...query.keyFn1(), select: (data) => data.field })
    expectTypeOf(keyFn1SuspenseQuery_Select).toEqualTypeOf<UseSuspenseQueryResult<string>>()
    expectTypeOf(keyFn1SuspenseQuery_Select.data).toEqualTypeOf<string>()
  })
  it('should be used with <SuspenseQuery/>', () => {
    ;(() => (
      <SuspenseQuery {...query.keyFn1()}>
        {(keyFn1SuspenseQuery) => {
          expectTypeOf(keyFn1SuspenseQuery).toEqualTypeOf<UseSuspenseQueryResult<{ field: string }>>()
          expectTypeOf(keyFn1SuspenseQuery.data).toEqualTypeOf<{ field: string }>()
          return <></>
        }}
      </SuspenseQuery>
    ))()
    ;(() => (
      <SuspenseQuery {...query.keyFn1()} select={(data) => data.field}>
        {(keyFn1SuspenseQuery_Select) => {
          expectTypeOf(keyFn1SuspenseQuery_Select).toEqualTypeOf<UseSuspenseQueryResult<string>>()
          expectTypeOf(keyFn1SuspenseQuery_Select.data).toEqualTypeOf<string>()
          return <></>
        }}
      </SuspenseQuery>
    ))()
  })

  it('should be used with useQueries', () => {
    const [keyFn1Query, keyFn2Query] = useQueries({
      queries: [query.keyFn1(), { ...query.keyFn2() }],
    })
    expectTypeOf(keyFn1Query).toEqualTypeOf<UseQueryResult<{ field: string }>>()
    expectTypeOf(keyFn1Query.data).toEqualTypeOf<{ field: string } | undefined>()
    expectTypeOf(keyFn2Query).toEqualTypeOf<UseQueryResult<{ field: string }>>()
    expectTypeOf(keyFn2Query.data).toEqualTypeOf<{ field: string } | undefined>()
  })
  it('should be used with useSuspenseQueries', () => {
    const [keyFn1SuspenseQuery, keyFn2SuspenseQuery] = useSuspenseQueries({
      queries: [query.keyFn1(), { ...query.keyFn2() }],
    })

    expectTypeOf(keyFn1SuspenseQuery).toEqualTypeOf<UseSuspenseQueryResult<{ field: string }>>()
    expectTypeOf(keyFn1SuspenseQuery.data).toEqualTypeOf<{ field: string }>()
    expectTypeOf(keyFn2SuspenseQuery).toEqualTypeOf<UseSuspenseQueryResult<{ field: string }>>()
    expectTypeOf(keyFn2SuspenseQuery.data).toEqualTypeOf<{ field: string }>()
  })

  it('should be used with useQueryClient', async () => {
    const queryClient = useQueryClient()

    queryClient.invalidateQueries(query.keyFn1())
    queryClient.resetQueries(query.keyFn1())
    queryClient.removeQueries(query.keyFn1())
    queryClient.cancelQueries(query.keyFn1())
    queryClient.prefetchQuery(query.keyFn1())
    queryClient.refetchQueries(query.keyFn1())

    const query1 = await queryClient.fetchQuery(query.keyFn1())
    expectTypeOf(query1).toEqualTypeOf<{ field: string }>()
  })
})
