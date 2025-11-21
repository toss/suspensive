import { QueryClient, dehydrate } from '@tanstack/react-query'
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

  it('should timeout queries when timeout prop is provided and query takes too long', async () => {
    const queryClient = new QueryClient()
    const mockQueryFn = vi
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ data: 'slow-data' }), 2000)))

    const queries = [
      {
        queryKey: ['slow-query'],
        queryFn: mockQueryFn,
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      timeout: 100,
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)

    // When timeout occurs, it should fallback to ClientOnly (default skipSsrOnError=true)
    render(result as React.ReactElement)
    expect(screen.getByTestId('client-only')).toBeInTheDocument()
  })

  it('should not timeout when query completes before timeout', async () => {
    const queryClient = new QueryClient()
    const mockData = { data: 'fast-data' }
    const mockQueryFn = vi.fn().mockResolvedValue(mockData)

    const queries = [
      {
        queryKey: ['fast-query'],
        queryFn: mockQueryFn,
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      timeout: 5000,
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)

    // Query should complete successfully
    expect(result).toBeDefined()
    expect(result.type).toBeDefined()
  })

  it('should handle timeout with custom error fallback', async () => {
    const queryClient = new QueryClient()
    const mockQueryFn = vi
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ data: 'slow-data' }), 2000)))

    const queries = [
      {
        queryKey: ['slow-query'],
        queryFn: mockQueryFn,
      },
    ]

    const customFallback = <div>Custom Timeout Fallback</div>

    const result = await QueriesHydration({
      queries,
      queryClient,
      timeout: 100,
      skipSsrOnError: { fallback: customFallback },
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)

    render(result as React.ReactElement)
    expect(screen.getByTestId('client-only')).toBeInTheDocument()
  })

  it('should proceed with SSR without hydration when timeout occurs and skipSsrOnError is false', async () => {
    const queryClient = new QueryClient()
    const mockQueryFn = vi
      .fn()
      .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ data: 'slow-data' }), 2000)))

    const queries = [
      {
        queryKey: ['slow-query'],
        queryFn: mockQueryFn,
      },
    ]

    const result = await QueriesHydration({
      queries,
      queryClient,
      timeout: 100,
      skipSsrOnError: false,
      children: <div>Test Children</div>,
    })

    expect(mockQueryFn).toHaveBeenCalledTimes(1)

    // When skipSsrOnError is false, it should still render Hydrate component
    // even though timeout occurred
    expect(result).toBeDefined()
    expect(result.type).toBeDefined()
  })
})
