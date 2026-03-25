import { QueryClient, infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { describe, expectTypeOf, it } from 'vitest'
import { Hydrate } from './Hydrate'
import { queryFn, queryKey } from './test-utils'

describe('<Hydrate/>', () => {
  it('type check', () => {
    const options1 = queryOptions({
      queryKey: ['query1'],
      queryFn: queryFn,
    })
    const options2 = queryOptions({
      queryKey: ['query2'],
      queryFn: queryFn,
    })

    // Should accept queries array with queryKey
    void (async () =>
      await Hydrate({
        queries: [{ queryKey, queryFn }],
        children: <></>,
      }))()

    // Should accept multiple queries
    void (async () =>
      await Hydrate({
        queries: [options1, options2],
        children: <></>,
      }))()

    // Should accept skipSsrOnError as boolean
    void (async () =>
      await Hydrate({
        queries: [options1],
        skipSsrOnError: true,
        children: <></>,
      }))()

    // Should accept skipSsrOnError with fallback
    void (async () =>
      await Hydrate({
        queries: [options1],
        skipSsrOnError: { fallback: <div>Loading...</div> },
        children: <></>,
      }))()

    // Should accept undefined queryClient prop
    void (async () =>
      await Hydrate({
        queries: [options1],
        queryClient: undefined,
        children: <></>,
      }))()

    // Should accept QueryClient instance for queryClient prop
    void (async () =>
      await Hydrate({
        queries: [options1],
        queryClient: new QueryClient(),
        children: <></>,
      }))()

    // Should accept infiniteQueryOptions
    const infiniteOptions = infiniteQueryOptions({
      queryKey: ['infinite'],
      queryFn: queryFn,
      getNextPageParam: () => null,
    })
    void (async () =>
      await Hydrate({
        queries: [infiniteOptions],
        children: <></>,
      }))()

    // Should accept mixed queries and infiniteQueryOptions
    void (async () =>
      await Hydrate({
        queries: [options1, infiniteOptions],
        children: <></>,
      }))()

    // Return type should be JSX.Element (Promise<JSX.Element>)
    expectTypeOf(
      Hydrate({
        queries: [options1],
        children: <></>,
      })
    ).toEqualTypeOf<Promise<React.JSX.Element>>()
  })
})
