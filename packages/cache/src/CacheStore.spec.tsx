import { ERROR_MESSAGE, FALLBACK, TEXT, sleep } from '@suspensive/utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { Suspense } from 'react'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { CacheStore } from './CacheStore'
import { CacheStoreProvider } from './CacheStoreProvider'
import { hashCacheKey } from './utils'

const caches = {
  errorCache: (id: number) =>
    cacheOptions({
      cacheKey: ['key', id] as const,
      cacheFn: () =>
        sleep(ms('0.1s')).then(() =>
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          Promise.reject(ERROR_MESSAGE)
        ),
    }),
  successCache: (id: number) =>
    cacheOptions({
      cacheKey: ['key', id] as const,
      cacheFn: () =>
        sleep(ms('0.1s')).then(() =>
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          Promise.resolve(TEXT)
        ),
    }),
}

describe('CacheStore', () => {
  let cacheStore: CacheStore

  beforeEach(() => {
    cacheStore = new CacheStore()
    cacheStore.reset()
  })

  it("have clearError method without key should clear promise & error for all key's cached", async () => {
    expect(cacheStore.getError(caches.errorCache(1))).toBeUndefined()
    expect(cacheStore.getError(caches.errorCache(2))).toBeUndefined()
    try {
      cacheStore.suspend(caches.errorCache(1))
    } catch (promiseToSuspense) {
      await promiseToSuspense
    }
    try {
      cacheStore.suspend(caches.errorCache(2))
    } catch (promiseToSuspense) {
      await promiseToSuspense
    }
    expect(cacheStore.getError(caches.errorCache(1))).toBe(ERROR_MESSAGE)
    expect(cacheStore.getError(caches.errorCache(2))).toBe(ERROR_MESSAGE)

    cacheStore.clearError()
    expect(cacheStore.getError(caches.errorCache(1))).toBeUndefined()
    expect(cacheStore.getError(caches.errorCache(2))).toBeUndefined()
  })

  it("have clearError method with key should clear promise & error for key's cached", async () => {
    expect(cacheStore.getError(caches.errorCache(1))).toBeUndefined()
    expect(cacheStore.getError(caches.errorCache(2))).toBeUndefined()
    try {
      cacheStore.suspend(caches.errorCache(1))
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      cacheStore.suspend(caches.errorCache(1))
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    try {
      cacheStore.suspend(caches.errorCache(2))
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      cacheStore.suspend(caches.errorCache(2))
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    expect(cacheStore.getError(caches.errorCache(1))).toBe(ERROR_MESSAGE)
    expect(cacheStore.getError(caches.errorCache(2))).toBe(ERROR_MESSAGE)

    cacheStore.clearError(caches.errorCache(1))
    expect(cacheStore.getError(caches.errorCache(1))).toBeUndefined()
    expect(cacheStore.getError(caches.errorCache(2))).toBe(ERROR_MESSAGE)
    cacheStore.clearError(caches.errorCache(2))
    expect(cacheStore.getError(caches.errorCache(1))).toBeUndefined()
    expect(cacheStore.getError(caches.errorCache(2))).toBeUndefined()
  })

  it('should take a key and remove the cached data for that key', async () => {
    try {
      cacheStore.suspend(caches.successCache(1))
    } catch (promiseToSuspense) {
      await promiseToSuspense
    }
    expect(cacheStore.getData(caches.successCache(1))).toBeTruthy()
    expect(() => {
      cacheStore.remove(caches.successCache(1))
    }).not.throw()
    expect(cacheStore.getData(caches.successCache(1))).toBeFalsy()
  })

  it("have getData method with key should get data of key's cached", async () => {
    render(
      <CacheStoreProvider store={cacheStore}>
        <Suspense fallback={FALLBACK}>
          <Cache {...caches.errorCache(1)} cacheFn={() => sleep(ms('0.1s')).then(() => TEXT)}>
            {(cached) => <>{cached.data}</>}
          </Cache>
        </Suspense>
      </CacheStoreProvider>
    )

    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(cacheStore.getData(caches.errorCache(1))).toBeUndefined()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(cacheStore.getData(caches.errorCache(1))).toBe(TEXT)
  })

  it('should handle unsubscribe gracefully when no subscribers exist', () => {
    const mockSync = vi.fn()
    const cacheKey = ['nonexistent', 'key'] as const
    cacheStore.unsubscribe({ cacheKey }, mockSync)

    expect(cacheStore['syncsMap'].get(hashCacheKey(cacheKey))).toBeUndefined()
  })
})
