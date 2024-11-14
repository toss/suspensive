import { queryOptions } from './queryOptions'
import { queryFn, queryKey } from './test-utils'
import { usePrefetchQuery } from './usePrefetchQuery'

describe('usePrefetchQuery', () => {
  it('type check', () => {
    expectTypeOf(usePrefetchQuery({ queryFn, queryKey }))
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      .toEqualTypeOf<void>()
    expectTypeOf(usePrefetchQuery(queryOptions({ queryFn, queryKey })))
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      .toEqualTypeOf<void>()
  })
})
