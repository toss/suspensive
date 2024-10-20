import type { UseSuspenseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { SuspenseQueries } from './SuspenseQueries'
import { queryFn, queryKey } from './test-utils'

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
      <SuspenseQueries
        queries={[
          { queryKey, queryFn },
          { queryKey, queryFn },
        ]}
      >
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
    ;(() => (
      <SuspenseQueries
        queries={[
          { queryKey, queryFn },
          { queryKey, queryFn },
        ]}
        combine={([query1, query2]) => ({
          query1Text: query1.data.text,
          query2Text: query2.data.text,
        })}
      >
        {(result) => {
          expectTypeOf(result).toEqualTypeOf<{ query1Text: string; query2Text: string }>()
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
