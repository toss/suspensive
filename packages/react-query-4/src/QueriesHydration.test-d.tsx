import { QueryClient, queryOptions } from '@tanstack/react-query'
import { describe, expectTypeOf, it } from 'vitest'
import { QueriesHydration } from './QueriesHydration'
import { queryFn, queryKey } from './test-utils'

describe('<QueriesHydration/>', () => {
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
      await QueriesHydration({
        queries: [
          {
            queryKey: queryKey,
            queryFn: queryFn,
          },
        ],
        children: <></>,
      }))()

    // Should accept multiple queries
    void (async () =>
      await QueriesHydration({
        queries: [options1, options2],
        children: <></>,
      }))()

    // Should accept skipSsrOnError as boolean
    void (async () =>
      await QueriesHydration({
        queries: [options1],
        skipSsrOnError: true,
        children: <></>,
      }))()

    // Should accept skipSsrOnError with fallback
    void (async () =>
      await QueriesHydration({
        queries: [options1],
        skipSsrOnError: { fallback: <div>Loading...</div> },
        children: <></>,
      }))()

    // Should accept undefined queryClient prop
    void (async () =>
      await QueriesHydration({
        queries: [options1],
        queryClient: undefined,
        children: <></>,
      }))()

    // Should accept QueryClient instance for queryClient prop
    void (async () =>
      await QueriesHydration({
        queries: [options1],
        queryClient: new QueryClient(),
        children: <></>,
      }))()

    // Return type should be JSX.Element (Promise<JSX.Element>)
    expectTypeOf(
      QueriesHydration({
        queries: [options1],
        children: <></>,
      })
    ).toEqualTypeOf<Promise<React.JSX.Element>>()
  })
})
