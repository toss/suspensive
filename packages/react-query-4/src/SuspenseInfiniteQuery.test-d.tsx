import type { InfiniteData } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { infiniteQueryOptions } from './infiniteQueryOptions'
import { SuspenseInfiniteQuery } from './SuspenseInfiniteQuery'
import { queryFn, queryKey } from './test-utils'
import type { UseSuspenseInfiniteQueryResult } from './useSuspenseInfiniteQuery'

describe('<SuspenseInfiniteQuery/>', () => {
  it('type check', () => {
    ;(() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no suspense
        suspense={boolean}
      >
        {(query) => (
          <>
            {query.data.pages
              .filter(({ text }) => text)
              .map((item, index) => (
                <div key={index}>{item.text}</div>
              ))}
          </>
        )}
      </SuspenseInfiniteQuery>
    ))()
    ;(() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no useErrorBoundary
        useErrorBoundary={boolean}
      >
        {(query) => (
          <>
            {query.data.pages
              .filter(({ text }) => text)
              .map((item, index) => (
                <div key={index}>{item.text}</div>
              ))}
          </>
        )}
      </SuspenseInfiniteQuery>
    ))()
    ;(() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no enabled
        enabled={boolean}
      >
        {(query) => (
          <>
            {query.data.pages
              .filter(({ text }) => text)
              .map((item, index) => (
                <div key={index}>{item.text}</div>
              ))}
          </>
        )}
      </SuspenseInfiniteQuery>
    ))()
    ;(() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no placeholderData
        placeholderData="placeholder"
      >
        {(query) => (
          <>
            {query.data.pages
              .filter(({ text }) => text)
              .map((item, index) => (
                <div key={index}>{item.text}</div>
              ))}
          </>
        )}
      </SuspenseInfiniteQuery>
    ))()
    ;(() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no placeholderData
        placeholderData="placeholder"
      >
        {(query) => (
          <>
            {query.data.pages
              .filter(({ text }) => text)
              .map((item, index) => (
                <div key={index}>{item.text}</div>
              ))}
          </>
        )}
      </SuspenseInfiniteQuery>
    ))()
    ;(() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no networkMode
        networkMode="always"
      >
        {(query) => (
          <>
            {query.data.pages
              .filter(({ text }) => text)
              .map((item, index) => (
                <div key={index}>{item.text}</div>
              ))}
          </>
        )}
      </SuspenseInfiniteQuery>
    ))()
    ;(() => (
      <SuspenseInfiniteQuery queryKey={queryKey} queryFn={queryFn}>
        {(query) => {
          expectTypeOf(query).toEqualTypeOf<UseSuspenseInfiniteQueryResult<{ text: string }>>()
          expectTypeOf(query.data).toEqualTypeOf<InfiniteData<{ text: string }>>()
          expectTypeOf(query.status).toEqualTypeOf<'success'>()
          return <></>
        }}
      </SuspenseInfiniteQuery>
    ))()
    ;(() => (
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
    ))()

    const options = infiniteQueryOptions({ queryKey, queryFn })

    ;(() => (
      <SuspenseInfiniteQuery {...options}>
        {(query) => {
          expectTypeOf(query).toEqualTypeOf<UseSuspenseInfiniteQueryResult<{ text: string }>>()
          expectTypeOf(query.data).toEqualTypeOf<InfiniteData<{ text: string }>>()
          expectTypeOf(query.status).toEqualTypeOf<'success'>()
          return <></>
        }}
      </SuspenseInfiniteQuery>
    ))()
    ;(() => (
      <SuspenseInfiniteQuery
        {...options}
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
    ))()

    expectTypeOf(
      <SuspenseInfiniteQuery queryKey={queryKey} queryFn={queryFn}>
        {() => <></>}
      </SuspenseInfiniteQuery>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <SuspenseInfiniteQuery queryKey={queryKey} queryFn={queryFn}>
        {() => <></>}
      </SuspenseInfiniteQuery>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <SuspenseInfiniteQuery {...options}>{() => <></>}</SuspenseInfiniteQuery>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <SuspenseInfiniteQuery {...options}>{() => <></>}</SuspenseInfiniteQuery>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
