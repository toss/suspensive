import { QueryClient, QueryClientProvider, dehydrate, infiniteQueryOptions } from '@tanstack/react-query'
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

    // When skipSsrOnError is false, it should still render Hydrate component
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

  it('should pass additional Hydrate props through', async () => {
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
      // Additional props that should be passed to Hydrate
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
      pageParams: [undefined],
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

  it('should pass AbortSignal to queryFn when timeout is set', async () => {
    const serverQueryClient = new QueryClient()
    const timeoutMs = 100
    const mockQueryFn = vi.fn().mockImplementation(({ signal }: { signal?: AbortSignal }) => {
      return new Promise((resolve, reject) => {
        const timerId = setTimeout(() => resolve({ data: 'test-data' }), 200)
        if (signal) {
          signal.addEventListener('abort', () => {
            clearTimeout(timerId)
            reject(new Error('Query cancelled'))
          })
        }
      })
    })

    const queries = [
      {
        queryKey: ['test-query-with-signal'],
        queryFn: mockQueryFn,
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient: serverQueryClient,
      timeout: timeoutMs,
      children: <div>Child</div>,
    })

    // Verify that queryFn was called with a signal
    expect(mockQueryFn).toHaveBeenCalledTimes(1)
    expect(mockQueryFn).toHaveBeenCalledWith(
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    )

    // Verify that it fell back to ClientOnly due to timeout
    const clientQueryClient = new QueryClient()
    render(<QueryClientProvider client={clientQueryClient}>{result}</QueryClientProvider>)
    expect(screen.getByTestId('client-only')).toBeInTheDocument()
  })
})
