import { queryOptions } from '@tanstack/react-query'
import type { ReactNode } from 'react'
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
    ;(async () =>
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
    ;(async () =>
      await QueriesHydration({
        queries: [options1, options2],
        children: <></>,
      }))()

    // Should accept skipSsrOnError as boolean
    ;(async () =>
      await QueriesHydration({
        queries: [options1],
        skipSsrOnError: true,
        children: <></>,
      }))()

    // Should accept skipSsrOnError with fallback
    ;(async () =>
      await QueriesHydration({
        queries: [options1],
        skipSsrOnError: { fallback: <div>Loading...</div> },
        children: <></>,
      }))()

    // Should accept queryClient prop
    ;(async () =>
      await QueriesHydration({
        queries: [options1],
        queryClient: undefined,
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
