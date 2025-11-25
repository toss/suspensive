import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock isServer from @tanstack/react-query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    isServer: false,
  }
})

describe('getQueryClient', () => {
  beforeEach(() => {
    // Reset modules to clear the browserQueryClient singleton
    vi.resetModules()
  })

  it('should return a QueryClient instance', async () => {
    const { getQueryClient } = await import('./getQueryClient')
    const queryClient = getQueryClient()
    expect(queryClient).toBeInstanceOf(QueryClient)
  })

  it('should return the same QueryClient instance on multiple calls in browser environment', async () => {
    const { getQueryClient } = await import('./getQueryClient')
    const queryClient1 = getQueryClient()
    const queryClient2 = getQueryClient()
    expect(queryClient1).toBe(queryClient2)
  })

  it('should apply config when creating initial QueryClient', async () => {
    const { getQueryClient } = await import('./getQueryClient')
    const config = {
      defaultOptions: {
        queries: {
          staleTime: 5000,
          retry: 3,
        },
      },
    }
    const queryClient = getQueryClient(config)
    expect(queryClient).toBeInstanceOf(QueryClient)
    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(5000)
    expect(queryClient.getDefaultOptions().queries?.retry).toBe(3)
  })

  it('should ignore config on subsequent calls (singleton behavior)', async () => {
    const { getQueryClient } = await import('./getQueryClient')
    const firstConfig = {
      defaultOptions: {
        queries: {
          staleTime: 5000,
        },
      },
    }
    const secondConfig = {
      defaultOptions: {
        queries: {
          staleTime: 10000,
        },
      },
    }
    const queryClient1 = getQueryClient(firstConfig)
    const queryClient2 = getQueryClient(secondConfig)

    // Should return the same instance with the first config
    expect(queryClient1).toBe(queryClient2)
    expect(queryClient2.getDefaultOptions().queries?.staleTime).toBe(5000)
  })
})

describe('getQueryClient (server environment)', () => {
  beforeEach(() => {
    vi.resetModules()
    // Mock isServer as true for server tests
    vi.doMock('@tanstack/react-query', async () => {
      const actual = await vi.importActual('@tanstack/react-query')
      return {
        ...actual,
        isServer: true,
      }
    })
  })

  it('should return new QueryClient instance on each call in server environment', async () => {
    const { getQueryClient } = await import('./getQueryClient')
    const queryClient1 = getQueryClient()
    const queryClient2 = getQueryClient()
    expect(queryClient1).toBeInstanceOf(QueryClient)
    expect(queryClient2).toBeInstanceOf(QueryClient)
    expect(queryClient1).not.toBe(queryClient2)
  })

  it('should apply config to each new QueryClient in server environment', async () => {
    const { getQueryClient } = await import('./getQueryClient')
    const config1 = {
      defaultOptions: {
        queries: {
          staleTime: 5000,
        },
      },
    }
    const config2 = {
      defaultOptions: {
        queries: {
          staleTime: 10000,
        },
      },
    }
    const queryClient1 = getQueryClient(config1)
    const queryClient2 = getQueryClient(config2)

    expect(queryClient1.getDefaultOptions().queries?.staleTime).toBe(5000)
    expect(queryClient2.getDefaultOptions().queries?.staleTime).toBe(10000)
  })
})
