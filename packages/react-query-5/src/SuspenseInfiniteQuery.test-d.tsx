import type { InfiniteData, UseSuspenseInfiniteQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { SuspenseInfiniteQuery } from './SuspenseInfiniteQuery'
import { queryFn, queryKey } from './test-utils'

describe('<SuspenseInfiniteQuery/>', () => {
  it('type check', () => {
    ;(() => (
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no suspense
        suspense={boolean}
        getNextPageParam={(lastPage) => lastPage.text}
        initialPageParam="initialPageParam"
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
        getNextPageParam={(lastPage) => lastPage.text}
        initialPageParam="initialPageParam"
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
        getNextPageParam={(lastPage) => lastPage.text}
        initialPageParam="initialPageParam"
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
        getNextPageParam={(lastPage) => lastPage.text}
        initialPageParam="initialPageParam"
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
        getNextPageParam={(lastPage) => lastPage.text}
        initialPageParam="initialPageParam"
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
        getNextPageParam={(lastPage) => lastPage.text}
        initialPageParam="initialPageParam"
      >
        {(query) => {
          expectTypeOf(query).toEqualTypeOf<UseSuspenseInfiniteQueryResult<InfiniteData<{ text: string }>>>()
          expectTypeOf(query.data).toEqualTypeOf<InfiniteData<{ text: string }>>()
          expectTypeOf(query.status).toEqualTypeOf<'error' | 'success'>()
          return (
            <>
              {query.data.pages
                .filter(({ text }) => text)
                .map((item, index) => (
                  <div key={index}>{item.text}</div>
                ))}
            </>
          )
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
        getNextPageParam={(lastPage) => lastPage.text}
        initialPageParam="initialPageParam"
      >
        {(selectedQuery) => {
          expectTypeOf(selectedQuery).toEqualTypeOf<UseSuspenseInfiniteQueryResult<InfiniteData<string, string>>>()
          expectTypeOf(selectedQuery.data).toEqualTypeOf<InfiniteData<string, string>>()
          expectTypeOf(selectedQuery.status).toEqualTypeOf<'error' | 'success'>()
          return (
            <>
              {selectedQuery.data.pages
                .filter((text) => text)
                .map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
            </>
          )
        }}
      </SuspenseInfiniteQuery>
    ))()

    expectTypeOf(
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        getNextPageParam={(lastPage) => lastPage.text}
        initialPageParam="initialPageParam"
      >
        {() => <></>}
      </SuspenseInfiniteQuery>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <SuspenseInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        getNextPageParam={(lastPage) => lastPage.text}
        initialPageParam="initialPageParam"
      >
        {() => <></>}
      </SuspenseInfiniteQuery>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
