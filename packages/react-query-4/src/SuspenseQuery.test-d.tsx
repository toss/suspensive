import { queryFn, queryKey } from '@suspensive/test-utils'
import type { ReactNode } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { SuspenseQuery } from './SuspenseQuery'
import type { UseSuspenseQueryResult } from './useSuspenseQuery'

describe('<SuspenseQuery/>', () => {
  it('type error', () => {
    ;() => (
      <SuspenseQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no suspense
        suspense={boolean}
      >
        {(query) => <>{query.data.text}</>}
      </SuspenseQuery>
    )
    ;() => (
      <SuspenseQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no useErrorBoundary
        useErrorBoundary={boolean}
      >
        {(query) => <>{query.data.text}</>}
      </SuspenseQuery>
    )
    ;() => (
      <SuspenseQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no enabled
        enabled={boolean}
      >
        {(query) => <>{query.data.text}</>}
      </SuspenseQuery>
    )
    ;() => (
      <SuspenseQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no placeholderData
        placeholderData="placeholder"
      >
        {(query) => <>{query.data.text}</>}
      </SuspenseQuery>
    )
    ;() => (
      <SuspenseQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no placeholderData
        placeholderData="placeholder"
      >
        {(query) => <>{query.data.text}</>}
      </SuspenseQuery>
    )
  })

  it('type check', () => {
    ;() => (
      <SuspenseQuery queryKey={queryKey} queryFn={queryFn}>
        {(query) => {
          expectTypeOf(query).toEqualTypeOf<UseSuspenseQueryResult<{ text: string }>>()
          expectTypeOf(query.data).toEqualTypeOf<{ text: string }>()
          expectTypeOf(query.status).toEqualTypeOf<'success'>()
          return <></>
        }}
      </SuspenseQuery>
    )
    ;() => (
      <SuspenseQuery queryKey={queryKey} queryFn={queryFn} select={(data) => data.text}>
        {(selectedQuery) => {
          expectTypeOf(selectedQuery).toEqualTypeOf<UseSuspenseQueryResult<string>>()
          expectTypeOf(selectedQuery.data).toEqualTypeOf<string>()
          expectTypeOf(selectedQuery.status).toEqualTypeOf<'success'>()
          return <></>
        }}
      </SuspenseQuery>
    )

    expectTypeOf(
      <SuspenseQuery queryKey={queryKey} queryFn={queryFn}>
        {() => <></>}
      </SuspenseQuery>
    ).toEqualTypeOf<JSX.Element>()
    expectTypeOf(
      <SuspenseQuery queryKey={queryKey} queryFn={queryFn}>
        {() => <></>}
      </SuspenseQuery>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
