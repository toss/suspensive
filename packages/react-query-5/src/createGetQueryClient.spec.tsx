import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createGetQueryClient } from './createGetQueryClient'

const mock = { isServer: false }

vi.mock(import('@tanstack/react-query'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    get isServer() {
      return mock.isServer
    },
  }
})

describe('getQueryClient (browser environment)', () => {
  beforeEach(() => {
    mock.isServer = false
  })

  it('should return the same QueryClient instance on multiple calls', () => {
    const { getQueryClient } = createGetQueryClient()
    expect(getQueryClient()).toBe(getQueryClient())
  })

  it('should apply config', () => {
    const { getQueryClient } = createGetQueryClient({
      defaultOptions: { queries: { staleTime: 5000, retry: 3 } },
    })
    const queryClient = getQueryClient()
    expect(queryClient).toBeInstanceOf(QueryClient)
    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(5000)
    expect(queryClient.getDefaultOptions().queries?.retry).toBe(3)
  })

  it('should not set gcTime to Infinity', () => {
    const { getQueryClient } = createGetQueryClient({
      defaultOptions: { queries: { gcTime: 5000 } },
    })
    expect(getQueryClient().getDefaultOptions().queries?.gcTime).toBe(5000)
  })
})

describe('getQueryClient (server environment)', () => {
  beforeEach(() => {
    mock.isServer = true
  })

  it('should return new QueryClient instance on each call', () => {
    const { getQueryClient } = createGetQueryClient()
    expect(getQueryClient()).not.toBe(getQueryClient())
  })

  it('should set gcTime to Infinity to prevent OOM', () => {
    const { getQueryClient } = createGetQueryClient()
    expect(getQueryClient().getDefaultOptions().queries?.gcTime).toBe(Infinity)
  })

  it('should override gcTime to Infinity even if config provides different value', () => {
    const { getQueryClient } = createGetQueryClient({
      defaultOptions: { queries: { gcTime: 5000 } },
    })
    expect(getQueryClient().getDefaultOptions().queries?.gcTime).toBe(Infinity)
  })
})
