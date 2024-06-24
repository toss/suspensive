import { queryFn, queryKey } from '@suspensive/test-utils'
import type { InfiniteData } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { SuspenseInfiniteQuery } from './SuspenseInfiniteQuery'
import type { UseSuspenseInfiniteQueryResult } from './useSuspenseInfiniteQuery'

describe('<SuspenseInfiniteQuery/>', () => {
  it('type error', () => {
    ;() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no suspense
        suspense={boolean}
      >
        {(query) => <>{query.data.pages.filter(({ text }) => text)}</>}
      </SuspenseInfiniteQuery>
    )
    ;() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no useErrorBoundary
        useErrorBoundary={boolean}
      >
        {(query) => <>{query.data.pages.filter(({ text }) => text)}</>}
      </SuspenseInfiniteQuery>
    )
    ;() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no enabled
        enabled={boolean}
      >
        {(query) => <>{query.data.pages.filter(({ text }) => text)}</>}
      </SuspenseInfiniteQuery>
    )
    ;() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no placeholderData
        placeholderData="placeholder"
      >
        {(query) => <>{query.data.pages.filter(({ text }) => text)}</>}
      </SuspenseInfiniteQuery>
    )
    ;() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no placeholderData
        placeholderData="placeholder"
      >
        {(query) => <>{query.data.pages.filter(({ text }) => text)}</>}
      </SuspenseInfiniteQuery>
    )
  })

  it('type check', () => {
    ;() => (
      <SuspenseInfiniteQuery queryKey={queryKey} queryFn={queryFn}>
        {(query) => {
          expectTypeOf(query).toEqualTypeOf<UseSuspenseInfiniteQueryResult<{ text: string }>>()
          expectTypeOf(query.data).toEqualTypeOf<InfiniteData<{ text: string }>>()
          expectTypeOf(query.status).toEqualTypeOf<'success'>()
          return <></>
        }}
      </SuspenseInfiniteQuery>
    )
    ;() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        select={(data) => ({
          pages: data.pages.map(({ text }) => text),
          pageParams: data.pageParams,
        })}
      >
        {(selectedQuery) => {
          expectTypeOf(selectedQuery).toEqualTypeOf<UseSuspenseInfiniteQueryResult<string>>()
          expectTypeOf(selectedQuery.data).toEqualTypeOf<InfiniteData<string>>()
          expectTypeOf(selectedQuery.status).toEqualTypeOf<'success'>()
          return <></>
        }}
      </SuspenseInfiniteQuery>
    )

    expectTypeOf(
      <SuspenseInfiniteQuery queryKey={queryKey} queryFn={queryFn}>
        {() => <></>}
      </SuspenseInfiniteQuery>
    ).toEqualTypeOf<JSX.Element>()
    expectTypeOf(
      <SuspenseInfiniteQuery queryKey={queryKey} queryFn={queryFn}>
        {() => <></>}
      </SuspenseInfiniteQuery>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
