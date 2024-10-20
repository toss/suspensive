import type { ReactNode } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { queryOptions } from './queryOptions'
import { SuspenseQueries } from './SuspenseQueries'
import { queryFn, queryKey } from './test-utils'
import type { UseSuspenseQueryResult } from './useSuspenseQuery'

describe('<SuspenseQueries/>', () => {
  it('type check', () => {
    ;(() => (
      <SuspenseQueries queries={[{ queryKey, queryFn }]}>
        {([
          query1,
          // @ts-expect-error Tuple type '[UseSuspenseQueryResult<{ text: string; }, unknown>]' of length '1' has no element at index '1'.
          query2,
          // @ts-expect-error Tuple type '[UseSuspenseQueryResult<{ text: string; }, unknown>]' of length '1' has no element at index '2'.
          query3,
        ]) => {
          expectTypeOf(query1).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
          expectTypeOf(query2).toEqualTypeOf<undefined>()
          expectTypeOf(query3).toEqualTypeOf<undefined>()
          return <></>
        }}
      </SuspenseQueries>
    ))()
    ;(() => (
      <SuspenseQueries queries={[{ queryKey, queryFn }, queryOptions({ queryKey, queryFn })]}>
        {([
          query1,

          query2,
          // @ts-expect-error Tuple type '[UseSuspenseQueryResult<{ text: string; }, unknown>]' of length '1' has no element at index '2'.
          query3,
        ]) => {
          expectTypeOf(query1).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
          expectTypeOf(query2).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
          expectTypeOf(query3).toEqualTypeOf<undefined>()
          return <></>
        }}
      </SuspenseQueries>
    ))()

    expectTypeOf(
      <SuspenseQueries queries={[{ queryKey, queryFn }]}>{() => <></>}</SuspenseQueries>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <SuspenseQueries queries={[{ queryKey, queryFn }]}>{() => <></>}</SuspenseQueries>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
