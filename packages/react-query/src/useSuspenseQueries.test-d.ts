/* eslint-disable react-hooks/rules-of-hooks */
import { queryFn, queryKey, select } from '@suspensive/test-utils'
import { describe, expectTypeOf, it } from 'vitest'
import { useSuspenseQueries } from './useSuspenseQueries'
import type { UseSuspenseQueryResult } from './useSuspenseQuery'

describe('useSuspenseQueries', () => {
  it('type error', () => {
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
          select,
        },
      ] as const,
    })
    // @ts-expect-error if no items
    useSuspenseQueries({})
    // @ts-expect-error if no items
    useSuspenseQueries()
  })

  it('type check', () => {
    const [query, selectedQuery] = useSuspenseQueries({
      queries: [
        { queryKey: [...queryKey, 5] as const, queryFn },
        { queryKey: [...queryKey, 6] as const, queryFn, select },
      ] as const,
    })

    expectTypeOf(query).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
    expectTypeOf(query.status).toEqualTypeOf<`success`>()
    expectTypeOf(query.data).toEqualTypeOf<{ text: string }>()

    expectTypeOf(selectedQuery).toEqualTypeOf<UseSuspenseQueryResult<string>>()
    expectTypeOf(selectedQuery.status).toEqualTypeOf<`success`>()
    expectTypeOf(selectedQuery.data).toEqualTypeOf<string>()
  })
})
