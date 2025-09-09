import { infiniteQueryOptions } from '@tanstack/react-query'
import { queryFn, queryKey } from './test-utils'
import { usePrefetchInfiniteQuery } from './usePrefetchInfiniteQuery'

describe('usePrefetchInfiniteQuery', () => {
  it('type check', () => {
    expectTypeOf(usePrefetchInfiniteQuery({ queryFn, queryKey }))
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      .toEqualTypeOf<void>()
    expectTypeOf(usePrefetchInfiniteQuery(infiniteQueryOptions({ queryFn, queryKey })))
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      .toEqualTypeOf<void>()
  })
})
