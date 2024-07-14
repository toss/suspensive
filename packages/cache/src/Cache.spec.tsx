import { ERROR_MESSAGE, FALLBACK, TEXT, sleep } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { Suspense } from 'react'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { CacheProvider } from './CacheProvider'
import { SuspenseCache } from './SuspenseCache'
import { hashCacheKey } from './utils'

const errorCacheOptions = (id: number) =>
  cacheOptions({
    cacheKey: ['key', id] as const,
    cacheFn: () =>
      sleep(ms('0.1s')).then(() =>
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        Promise.reject(ERROR_MESSAGE)
      ),
  })

describe('Cache', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
    cache.reset()
  })

  it("have clearError method without key should clear promise & error for all key's cached", async () => {
    expect(cache.getError(errorCacheOptions(1))).toBeUndefined()
    expect(cache.getError(errorCacheOptions(2))).toBeUndefined()
    try {
      cache.suspend(errorCacheOptions(1))
    } catch (promiseToSuspense) {
      await promiseToSuspense
    }
    try {
      cache.suspend(errorCacheOptions(2))
    } catch (promiseToSuspense) {
      await promiseToSuspense
    }
    expect(cache.getError(errorCacheOptions(1))).toBe(ERROR_MESSAGE)
    expect(cache.getError(errorCacheOptions(2))).toBe(ERROR_MESSAGE)

    cache.clearError()
    expect(cache.getError(errorCacheOptions(1))).toBeUndefined()
    expect(cache.getError(errorCacheOptions(2))).toBeUndefined()
  })

  it("have clearError method with key should clear promise & error for key's cached", async () => {
    expect(cache.getError(errorCacheOptions(1))).toBeUndefined()
    expect(cache.getError(errorCacheOptions(2))).toBeUndefined()
    try {
      cache.suspend(errorCacheOptions(1))
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      cache.suspend(errorCacheOptions(1))
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    try {
      cache.suspend(errorCacheOptions(2))
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      cache.suspend(errorCacheOptions(2))
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    expect(cache.getError(errorCacheOptions(1))).toBe(ERROR_MESSAGE)
    expect(cache.getError(errorCacheOptions(2))).toBe(ERROR_MESSAGE)

    cache.clearError(errorCacheOptions(1))
    expect(cache.getError(errorCacheOptions(1))).toBeUndefined()
    expect(cache.getError(errorCacheOptions(2))).toBe(ERROR_MESSAGE)
    cache.clearError(errorCacheOptions(2))
    expect(cache.getError(errorCacheOptions(1))).toBeUndefined()
    expect(cache.getError(errorCacheOptions(2))).toBeUndefined()
  })

  it("have getData method with key should get data of key's cached", async () => {
    render(
      <CacheProvider cache={cache}>
        <Suspense fallback={FALLBACK}>
          <SuspenseCache {...errorCacheOptions(1)} cacheFn={() => sleep(ms('0.1s')).then(() => TEXT)}>
            {(resolvedData) => <>{resolvedData.data}</>}
          </SuspenseCache>
        </Suspense>
      </CacheProvider>
    )

    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(cache.getData(errorCacheOptions(1))).toBeUndefined()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(cache.getData(errorCacheOptions(1))).toBe(TEXT)
  })

  it('should handle unsubscribe gracefully when no subscribers exist', () => {
    const mockSync = vi.fn()
    const cacheKey = ['nonexistent', 'key'] as const
    cache.unsubscribe({ cacheKey }, mockSync)

    expect(cache['syncsMap'].get(hashCacheKey(cacheKey))).toBeUndefined()
  })
})
