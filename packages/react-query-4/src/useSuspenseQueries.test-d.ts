import { type UseSuspenseQueryResult, queryOptions, useSuspenseQueries } from '@tanstack/react-query'
import { describe, expectTypeOf, it } from 'vitest'
import { queryFn, queryKey, select } from './test-utils'

describe('useSuspenseQueries', () => {
  it('type check', () => {
    useSuspenseQueries({
      queries: [
        {
          queryKey: [...queryKey, 1] as const,
          queryFn,
          // @ts-expect-error no suspense
          suspense: false,
        },
        {
          queryKey: [...queryKey, 2] as const,
          queryFn,
          select,
          // @ts-expect-error no suspense
          suspense: true,
        },
        {
          queryKey: [...queryKey, 3] as const,
          queryFn,
          // @ts-expect-error no enabled
          enabled: true,
        },
        {
          queryKey: [...queryKey, 4] as const,
          queryFn,
          // @ts-expect-error no enabled
          enabled: true,
          select,
        },
        {
          queryKey: [...queryKey, 4] as const,
          queryFn,
          // @ts-expect-error no networkMode
          networkMode: 'always',
          select,
        },
        queryOptions({
          queryKey: [...queryKey, 4] as const,
          queryFn: () => Promise.resolve({ field: 'success' }),
          select: (data) => data.field,
        }),
      ] as const,
    })
    // @ts-expect-error if no items
    useSuspenseQueries({})
    // @ts-expect-error if no items
    useSuspenseQueries()

    const [query, selectedQuery, selectedQueryByQueryOptions] = useSuspenseQueries({
      queries: [
        { queryKey: [...queryKey, 5] as const, queryFn },
        { queryKey: [...queryKey, 6] as const, queryFn, select },
        queryOptions({
          queryKey: [...queryKey, 4] as const,
          queryFn: () => Promise.resolve({ field: 'success' }),
          select: (data) => data.field,
        }),
      ] as const,
    })

    expectTypeOf(query).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
    expectTypeOf(query.status).toEqualTypeOf<'error' | 'success'>()
    expectTypeOf(query.data).toEqualTypeOf<{ text: string }>()

    expectTypeOf(selectedQuery).toEqualTypeOf<UseSuspenseQueryResult<string>>()
    expectTypeOf(selectedQuery.status).toEqualTypeOf<'error' | 'success'>()
    expectTypeOf(selectedQuery.data).toEqualTypeOf<string>()

    expectTypeOf(selectedQueryByQueryOptions).toEqualTypeOf<UseSuspenseQueryResult<string>>()
    expectTypeOf(selectedQueryByQueryOptions.status).toEqualTypeOf<'error' | 'success'>()
    expectTypeOf(selectedQueryByQueryOptions.data).toEqualTypeOf<string>()
  })
})
