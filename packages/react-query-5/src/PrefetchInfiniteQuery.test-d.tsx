import { infiniteQueryOptions } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { PrefetchInfiniteQuery } from './PrefetchInfiniteQuery'
import { queryFn, queryKey } from './test-utils'

describe('<PrefetchInfiniteQuery/>', () => {
  it('type check', () => {
    ;(() => (
      <PrefetchInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no suspense
        suspense={boolean}
      />
    ))()
    ;(() => (
      <PrefetchInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no useErrorBoundary
        useErrorBoundary={boolean}
      />
    ))()
    ;(() => (
      <PrefetchInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no enabled
        enabled={boolean}
      />
    ))()
    ;(() => (
      <PrefetchInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no placeholderData
        placeholderData="placeholder"
      />
    ))()
    ;(() => (
      <PrefetchInfiniteQuery
        queryKey={queryKey}
        queryFn={queryFn}
        //@ts-expect-error no placeholderData
        placeholderData="placeholder"
      />
    ))()
    ;(() => <PrefetchInfiniteQuery queryKey={queryKey} queryFn={queryFn} initialPageParam="initialPageParam" />)()
    const options = infiniteQueryOptions({
      queryKey,
      queryFn,
      initialPageParam: 'initialPageParam',
      getNextPageParam: () => null,
    })
    ;(() => <PrefetchInfiniteQuery {...options} />)()
    expectTypeOf(
      <PrefetchInfiniteQuery queryKey={queryKey} queryFn={queryFn} initialPageParam="initialPageParam" />
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <PrefetchInfiniteQuery queryKey={queryKey} queryFn={queryFn} initialPageParam="initialPageParam" />
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <PrefetchInfiniteQuery {...options}>{() => <></>}</PrefetchInfiniteQuery>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <PrefetchInfiniteQuery {...options}>{() => <></>}</PrefetchInfiniteQuery>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
