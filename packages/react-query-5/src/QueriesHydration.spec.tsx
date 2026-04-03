import {
  QueryClient,
  QueryClientProvider,
  defaultShouldDehydrateQuery,
  dehydrate,
  infiniteQueryOptions,
} from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ComponentProps, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { QueriesHydration } from './QueriesHydration'

// Mock the ClientOnly component
vi.mock('./components/ClientOnly', () => ({
  ClientOnly: ({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) => (
    <div data-testid="client-only">{fallback || children}</div>
  ),
}))

describe('<QueriesHydration/>', () => {
  it('should fetch queries and hydrate them successfully', async () => {
    const queryClient = new QueryClient()
    const mockQueryFn = vi.fn().mockResolvedValue({ data: 'test-data' })

    const queries = [
      {
        queryKey: ['test-query'],
        queryFn: mockQueryFn,
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)
    expect(result).toBeDefined()
    expect(result.type).toBeDefined()
  })

  it('should handle multiple queries', async () => {
    const queryClient = new QueryClient()
    const mockQueryFn1 = vi.fn().mockResolvedValue({ data: 'data-1' })
    const mockQueryFn2 = vi.fn().mockResolvedValue({ data: 'data-2' })

    const queries = [
      {
        queryKey: ['query-1'],
        queryFn: mockQueryFn1,
      },
      {
        queryKey: ['query-2'],
        queryFn: mockQueryFn2,
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn1).toHaveBeenCalledTimes(1)
    expect(mockQueryFn2).toHaveBeenCalledTimes(1)
    expect(result).toBeDefined()
  })

  it('should skip SSR and render ClientOnly when query fails and skipSsrOnError is true (default)', async () => {
    const queryClient = new QueryClient()
    const mockQueryFn = vi.fn().mockRejectedValue(new Error('Query failed'))

    const queries = [
      {
        queryKey: ['failing-query'],
        queryFn: mockQueryFn,
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)

    // Render the result to verify it's ClientOnly
    render(result as React.ReactElement)
    expect(screen.getByTestId('client-only')).toBeInTheDocument()
  })

  it('should skip SSR and render ClientOnly when query fails and skipSsrOnError is explicitly true', async () => {
    const queryClient = new QueryClient()
    const mockQueryFn = vi.fn().mockRejectedValue(new Error('Query failed'))

    const queries = [
      {
        queryKey: ['failing-query'],
        queryFn: mockQueryFn,
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      skipSsrOnError: true,
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)

    render(result as React.ReactElement)
    expect(screen.getByTestId('client-only')).toBeInTheDocument()
  })

  it('should show custom fallback when query fails and skipSsrOnError has fallback', async () => {
    const queryClient = new QueryClient()
    const mockQueryFn = vi.fn().mockRejectedValue(new Error('Query failed'))

    const queries = [
      {
        queryKey: ['failing-query'],
        queryFn: mockQueryFn,
      },
    ]

    const customFallback = <div>Custom Fallback</div>

    const result = await QueriesHydration({
      queries,
      queryClient,
      skipSsrOnError: { fallback: customFallback },
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)

    render(result as React.ReactElement)
    expect(screen.getByTestId('client-only')).toBeInTheDocument()
  })

  it('should proceed with SSR without hydration when query fails and skipSsrOnError is false', async () => {
    const queryClient = new QueryClient()
    const mockQueryFn = vi.fn().mockRejectedValue(new Error('Query failed'))

    const queries = [
      {
        queryKey: ['failing-query'],
        queryFn: mockQueryFn,
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      skipSsrOnError: false,
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)

    // When skipSsrOnError is false, it should still render HydrationBoundary
    // even though the query failed
    expect(result).toBeDefined()
    expect(result.type).toBeDefined()
  })

  it('should handle partial query failures when skipSsrOnError is false', async () => {
    const queryClient = new QueryClient()
    const mockSuccessQueryFn = vi.fn().mockResolvedValue({ data: 'success' })
    const mockFailQueryFn = vi.fn().mockRejectedValue(new Error('Query failed'))

    const queries = [
      {
        queryKey: ['success-query'],
        queryFn: mockSuccessQueryFn,
      },
      {
        queryKey: ['fail-query'],
        queryFn: mockFailQueryFn,
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      skipSsrOnError: false,
      children: <div>Test Children</div>,
    })

    // Promise.all rejects if any promise rejects
    expect(mockSuccessQueryFn).toHaveBeenCalledTimes(1)
    expect(mockFailQueryFn).toHaveBeenCalledTimes(1)
    expect(result).toBeDefined()
  })

  it('should use default QueryClient when queryClient prop is not provided', async () => {
    const mockQueryFn = vi.fn().mockResolvedValue({ data: 'test-data' })

    const queries = [
      {
        queryKey: ['test-query'],
        queryFn: mockQueryFn,
      },
    ]

    const result = await QueriesHydration({
      queries,
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)
    expect(result).toBeDefined()
  })

  it('should pass additional HydrationBoundary props through', async () => {
    const queryClient = new QueryClient()
    const mockQueryFn = vi.fn().mockResolvedValue({ data: 'test-data' })

    const queries = [
      {
        queryKey: ['test-query'],
        queryFn: mockQueryFn,
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      children: <div>Test Children</div>,
      // Additional props that should be passed to HydrationBoundary
    } as ComponentProps<typeof QueriesHydration>)

    expect(mockQueryFn).toHaveBeenCalledTimes(1)
    expect(result).toBeDefined()
  })

  it('should dehydrate query state correctly', async () => {
    const queryClient = new QueryClient()
    const mockData = { data: 'test-data' }
    const mockQueryFn = vi.fn().mockResolvedValue(mockData)

    const queries = [
      {
        queryKey: ['test-query'],
        queryFn: mockQueryFn,
      },
    ]

    await QueriesHydration({
      queries,
      queryClient,
      children: <div>Test Children</div>,
    })

    const dehydratedState = dehydrate(queryClient)
    expect(dehydratedState.queries).toHaveLength(1)
    expect(dehydratedState.queries[0].queryKey).toEqual(['test-query'])
    expect(dehydratedState.queries[0].state.data).toEqual(mockData)
  })

  it('should fetch infiniteQueryOptions and hydrate them successfully', async () => {
    const queryClient = new QueryClient()
    const mockInfiniteQueryFn = vi.fn().mockResolvedValue({ data: 'page-1' })

    const infiniteOptions = infiniteQueryOptions({
      queryKey: ['infinite-query'],
      queryFn: mockInfiniteQueryFn,
      initialPageParam: 0,
      getNextPageParam: () => null,
    })

    const result = await QueriesHydration({
      queries: [infiniteOptions],
      queryClient,
      children: <div>Test Children</div>,
    })

    expect(mockInfiniteQueryFn).toHaveBeenCalledTimes(1)
    expect(result).toBeDefined()
    expect(result.type).toBeDefined()
  })

  it('should handle mixed queries and infiniteQueryOptions', async () => {
    const queryClient = new QueryClient()
    const mockQueryFn = vi.fn().mockResolvedValue({ data: 'regular-data' })
    const mockInfiniteQueryFn = vi.fn().mockResolvedValue({ data: 'infinite-data' })

    const queries = [
      {
        queryKey: ['regular-query'],
        queryFn: mockQueryFn,
      },
      infiniteQueryOptions({
        queryKey: ['infinite-query'],
        queryFn: mockInfiniteQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => null,
      }),
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)
    expect(mockInfiniteQueryFn).toHaveBeenCalledTimes(1)
    expect(result).toBeDefined()
  })

  it('should skip SSR when infiniteQueryOptions fails and skipSsrOnError is true', async () => {
    const queryClient = new QueryClient()
    const mockInfiniteQueryFn = vi.fn().mockRejectedValue(new Error('Infinite query failed'))

    const infiniteOptions = infiniteQueryOptions({
      queryKey: ['failing-infinite-query'],
      queryFn: mockInfiniteQueryFn,
      initialPageParam: 0,
      getNextPageParam: () => null,
    })

    const result = await QueriesHydration({
      queries: [infiniteOptions],
      queryClient,
      children: <div>Test Children</div>,
    })

    expect(mockInfiniteQueryFn).toHaveBeenCalledTimes(1)

    render(result as React.ReactElement)
    expect(screen.getByTestId('client-only')).toBeInTheDocument()
  })

  it('should dehydrate infiniteQueryOptions state correctly', async () => {
    const queryClient = new QueryClient()
    const mockInfiniteQueryFn = vi.fn().mockResolvedValue({ data: 'page-1' })

    const infiniteOptions = infiniteQueryOptions({
      queryKey: ['infinite-query'],
      queryFn: mockInfiniteQueryFn,
      initialPageParam: 0,
      getNextPageParam: () => null,
    })

    await QueriesHydration({
      queries: [infiniteOptions],
      queryClient,
      children: <div>Test Children</div>,
    })

    const dehydratedState = dehydrate(queryClient)
    expect(dehydratedState.queries).toHaveLength(1)
    expect(dehydratedState.queries[0].queryKey).toEqual(['infinite-query'])
    expect(dehydratedState.queries[0].state.data).toEqual({
      pages: [{ data: 'page-1' }],
      pageParams: [0],
    })
  })

  it('should timeout when query takes longer than the timeout', async () => {
    const serverQueryClient = new QueryClient()
    const timeoutMs = 100
    const queryDelayMs = 200
    const mockQueryFn = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: 'test-data' }), queryDelayMs))
      )

    const queries = [
      {
        queryKey: ['test-query'],
        queryFn: mockQueryFn,
      },
    ]

    const ClientChild = () => {
      return <div>Client Child</div>
    }

    const result = await QueriesHydration({
      queries,
      queryClient: serverQueryClient,
      timeout: timeoutMs,
      children: <ClientChild />,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Client Child')).not.toBeInTheDocument()

    const clientQueryClient = new QueryClient()
    render(<QueryClientProvider client={clientQueryClient}>{result}</QueryClientProvider>)
    expect(screen.getByTestId('client-only')).toBeInTheDocument()
    expect(screen.getByText('Client Child')).toBeInTheDocument()
  })

  it('should cancel queries when timeout occurs', async () => {
    const queryClient = new QueryClient()
    const cancelQueriesSpy = vi.spyOn(queryClient, 'cancelQueries')
    const timeoutMs = 100
    const queryDelayMs = 200

    const queries = [
      {
        queryKey: ['slow-query-1'],
        queryFn: () => new Promise((resolve) => setTimeout(() => resolve({ data: '1' }), queryDelayMs)),
      },
      {
        queryKey: ['slow-query-2'],
        queryFn: () => new Promise((resolve) => setTimeout(() => resolve({ data: '2' }), queryDelayMs)),
      },
    ]

    await QueriesHydration({
      queries,
      queryClient,
      timeout: timeoutMs,
      children: <div>children</div>,
    })

    expect(cancelQueriesSpy).toHaveBeenCalledTimes(2)
    expect(cancelQueriesSpy).toHaveBeenCalledWith(queries[0])
    expect(cancelQueriesSpy).toHaveBeenCalledWith(queries[1])
  })

  it('should cancel queries when query fails without timeout', async () => {
    const queryClient = new QueryClient()
    const cancelQueriesSpy = vi.spyOn(queryClient, 'cancelQueries')

    const queries = [
      {
        queryKey: ['failing-query'],
        queryFn: () => Promise.reject(new Error('network error')),
      },
      {
        queryKey: ['slow-query'],
        queryFn: () => new Promise((resolve) => setTimeout(() => resolve({ data: 'slow' }), 200)),
      },
    ]

    await QueriesHydration({
      queries,
      queryClient,
      children: <div>children</div>,
    })

    expect(cancelQueriesSpy).toHaveBeenCalledTimes(2)
    expect(cancelQueriesSpy).toHaveBeenCalledWith(queries[0])
    expect(cancelQueriesSpy).toHaveBeenCalledWith(queries[1])
  })

  it('should not cancel queries on successful fetch', async () => {
    const queryClient = new QueryClient()
    const cancelQueriesSpy = vi.spyOn(queryClient, 'cancelQueries')

    const queries = [
      {
        queryKey: ['success-query'],
        queryFn: () => Promise.resolve({ data: 'ok' }),
      },
    ]

    await QueriesHydration({
      queries,
      queryClient,
      timeout: 5000,
      children: <div>children</div>,
    })

    expect(cancelQueriesSpy).not.toHaveBeenCalled()
  })

  it('should cancel all queries even when only some are slow enough to timeout', async () => {
    const queryClient = new QueryClient()
    const cancelQueriesSpy = vi.spyOn(queryClient, 'cancelQueries')
    const timeoutMs = 100

    const queries = [
      {
        queryKey: ['fast-query'],
        queryFn: () => Promise.resolve({ data: 'fast' }),
      },
      {
        queryKey: ['slow-query'],
        queryFn: () => new Promise((resolve) => setTimeout(() => resolve({ data: 'slow' }), 200)),
      },
    ]

    await QueriesHydration({
      queries,
      queryClient,
      timeout: timeoutMs,
      children: <div>children</div>,
    })

    // Promise.all waits for all, so timeout cancels all queries in the list
    expect(cancelQueriesSpy).toHaveBeenCalledTimes(2)
    expect(cancelQueriesSpy).toHaveBeenCalledWith(queries[0])
    expect(cancelQueriesSpy).toHaveBeenCalledWith(queries[1])
  })

  it('should still skip SSR on timeout when skipSsrOnError is true', async () => {
    const queryClient = new QueryClient()

    const queries = [
      {
        queryKey: ['slow-query'],
        queryFn: () => new Promise((resolve) => setTimeout(() => resolve({ data: 'slow' }), 200)),
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      timeout: 100,
      skipSsrOnError: true,
      children: <div>children</div>,
    })

    render(result as React.ReactElement)
    expect(screen.getByTestId('client-only')).toBeInTheDocument()
  })

  it('should cancel queries on timeout but proceed with SSR when skipSsrOnError is false', async () => {
    const queryClient = new QueryClient()
    const cancelQueriesSpy = vi.spyOn(queryClient, 'cancelQueries')

    const queries = [
      {
        queryKey: ['slow-query'],
        queryFn: () => new Promise((resolve) => setTimeout(() => resolve({ data: 'slow' }), 200)),
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      timeout: 100,
      skipSsrOnError: false,
      children: <div>children</div>,
    })

    expect(cancelQueriesSpy).toHaveBeenCalledTimes(1)
    expect(cancelQueriesSpy).toHaveBeenCalledWith(queries[0])
    // skipSsrOnError is false, so it should render HydrationBoundary, not ClientOnly
    expect(result.type).not.toEqual(expect.objectContaining({ name: 'ClientOnly' }))
  })

  describe('shouldDehydratePromise', () => {
    it('should start queries without awaiting and include pending queries in dehydrated state', async () => {
      const queryClient = new QueryClient()
      let resolveQuery!: (value: unknown) => void
      const mockQueryFn = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveQuery = resolve
          })
      )

      const queries = [
        {
          queryKey: ['pending-query'],
          queryFn: mockQueryFn,
        },
      ]

      const result = await QueriesHydration({
        queries,
        queryClient,
        shouldDehydratePromise: true,
        children: <div>Test Children</div>,
      })

      expect(mockQueryFn).toHaveBeenCalledTimes(1)
      expect(result).toBeDefined()

      // Query is still pending - dehydrated state should include the pending query
      const dehydratedState = dehydrate(queryClient, {
        shouldDehydrateQuery: (query) => query.state.status === 'pending',
      })
      expect(dehydratedState.queries).toHaveLength(1)
      expect(dehydratedState.queries[0].queryKey).toEqual(['pending-query'])

      // Cleanup - resolve the promise to avoid dangling promise
      resolveQuery({ data: 'resolved' })
    })

    it('should return HydrationBoundary without waiting for queries to resolve', async () => {
      const queryClient = new QueryClient()
      const queryDelayMs = 200
      const mockQueryFn = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve({ data: 'delayed' }), queryDelayMs))
        )

      const queries = [
        {
          queryKey: ['delayed-query'],
          queryFn: mockQueryFn,
        },
      ]

      const startTime = Date.now()
      const result = await QueriesHydration({
        queries,
        queryClient,
        shouldDehydratePromise: true,
        children: <div>Test Children</div>,
      })
      const elapsed = Date.now() - startTime

      // Should return immediately without waiting for the query
      expect(elapsed).toBeLessThan(queryDelayMs)
      expect(result).toBeDefined()
      expect(mockQueryFn).toHaveBeenCalledTimes(1)
    })

    it('should include successfully resolved queries in dehydrated state when shouldDehydratePromise is true', async () => {
      const queryClient = new QueryClient()
      const mockData = { data: 'resolved-data' }
      const mockQueryFn = vi.fn().mockResolvedValue(mockData)

      const queries = [
        {
          queryKey: ['resolved-query'],
          queryFn: mockQueryFn,
        },
      ]

      await QueriesHydration({
        queries,
        queryClient,
        shouldDehydratePromise: true,
        children: <div>Test Children</div>,
      })

      // Wait for the microtasks to settle so the query has time to resolve
      await Promise.resolve()

      const dehydratedState = dehydrate(queryClient)
      expect(dehydratedState.queries).toHaveLength(1)
      expect(dehydratedState.queries[0].queryKey).toEqual(['resolved-query'])
    })

    it('should not cancel queries when shouldDehydratePromise is true', async () => {
      const queryClient = new QueryClient()
      const cancelQueriesSpy = vi.spyOn(queryClient, 'cancelQueries')
      let resolveQuery!: (value: unknown) => void
      const mockQueryFn = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveQuery = resolve
          })
      )

      const queries = [
        {
          queryKey: ['pending-query'],
          queryFn: mockQueryFn,
        },
      ]

      await QueriesHydration({
        queries,
        queryClient,
        shouldDehydratePromise: true,
        children: <div>Test Children</div>,
      })

      expect(cancelQueriesSpy).not.toHaveBeenCalled()

      // Cleanup
      resolveQuery({ data: 'resolved' })
    })

    it('should handle infiniteQueryOptions with shouldDehydratePromise', async () => {
      const queryClient = new QueryClient()
      let resolveQuery!: (value: unknown) => void
      const mockInfiniteQueryFn = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveQuery = resolve
          })
      )

      const infiniteOptions = infiniteQueryOptions({
        queryKey: ['pending-infinite-query'],
        queryFn: mockInfiniteQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => null,
      })

      const result = await QueriesHydration({
        queries: [infiniteOptions],
        queryClient,
        shouldDehydratePromise: true,
        children: <div>Test Children</div>,
      })

      expect(mockInfiniteQueryFn).toHaveBeenCalledTimes(1)
      expect(result).toBeDefined()

      // Cleanup
      resolveQuery({ data: 'page-1' })
    })

    it('should include both resolved and pending queries in dehydrated state', async () => {
      const queryClient = new QueryClient()
      const resolvedData = { data: 'resolved' }
      let resolvePending!: (value: unknown) => void

      const queries = [
        {
          queryKey: ['resolved-query'],
          queryFn: vi.fn().mockResolvedValue(resolvedData),
        },
        {
          queryKey: ['pending-query'],
          queryFn: vi.fn().mockImplementation(
            () =>
              new Promise((resolve) => {
                resolvePending = resolve
              })
          ),
        },
      ]

      await QueriesHydration({
        queries,
        queryClient,
        shouldDehydratePromise: true,
        children: <div>Test Children</div>,
      })

      // Allow microtasks to settle so the resolved query updates its state
      await Promise.resolve()

      const dehydratedState = dehydrate(queryClient, {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      })
      expect(dehydratedState.queries).toHaveLength(2)
      const keys = dehydratedState.queries.map((q) => q.queryKey[0])
      expect(keys).toContain('resolved-query')
      expect(keys).toContain('pending-query')

      // Cleanup
      resolvePending({ data: 'done' })
    })
  })
})
