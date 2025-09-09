import { infiniteQueryOptions } from './infiniteQueryOptions'
import { queryFn, queryKey } from './test-utils'
import { usePrefetchInfiniteQuery } from './usePrefetchInfiniteQuery'

describe('usePrefetchInfiniteQuery', () => {
  it('type check', () => {
    expectTypeOf(usePrefetchInfiniteQuery({ queryFn, queryKey }))
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      .toEqualTypeOf<void>()
    expectTypeOf(
      usePrefetchInfiniteQuery(
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        infiniteQueryOptions({ queryFn, queryKey })
      )
    )
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      .toEqualTypeOf<void>()
  })
})
