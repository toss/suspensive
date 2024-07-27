import { ERROR_MESSAGE, FALLBACK, TEXT, sleep } from '@suspensive/utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { Suspense } from 'react'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { CacheStore } from './CacheStore'
import { CacheStoreProvider } from './CacheStoreProvider'
import { hashCacheKey } from './utils'

const errorCache = (id: number) =>
  cacheOptions({
    cacheKey: ['key', id] as const,
    cacheFn: () =>
      sleep(ms('0.1s')).then(() =>
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        Promise.reject(ERROR_MESSAGE)
      ),
  })

const successCache = (id: number) =>
  cacheOptions({
    cacheKey: ['key', id] as const,
    cacheFn: () => sleep(ms('0.1s')).then(() => Promise.resolve(TEXT)),
  })

describe('CacheStore', () => {
  let cacheStore: CacheStore

  beforeEach(() => {
    cacheStore = new CacheStore()
    cacheStore.reset()
  })

  describe('clearError', () => {
    it('should clear promise & error for all cached', async () => {
      expect(cacheStore.getError(errorCache(1))).toBeUndefined()
      expect(cacheStore.getError(errorCache(2))).toBeUndefined()
      try {
        cacheStore.suspend(errorCache(1))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      try {
        cacheStore.suspend(errorCache(2))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      expect(cacheStore.getError(errorCache(1))).toBe(ERROR_MESSAGE)
      expect(cacheStore.getError(errorCache(2))).toBe(ERROR_MESSAGE)

      cacheStore.clearError()
      expect(cacheStore.getError(errorCache(1))).toBeUndefined()
      expect(cacheStore.getError(errorCache(2))).toBeUndefined()
    })

    it('should clear promise & error for specific cached', async () => {
      expect(cacheStore.getError(errorCache(1))).toBeUndefined()
      expect(cacheStore.getError(errorCache(2))).toBeUndefined()
      try {
        cacheStore.suspend(errorCache(1))
      } catch (promiseToSuspense) {
        expect(await promiseToSuspense).toBeUndefined()
      }
      try {
        cacheStore.suspend(errorCache(1))
      } catch (error) {
        expect(error).toBe(ERROR_MESSAGE)
      }
      try {
        cacheStore.suspend(errorCache(2))
      } catch (promiseToSuspense) {
        expect(await promiseToSuspense).toBeUndefined()
      }
      try {
        cacheStore.suspend(errorCache(2))
      } catch (error) {
        expect(error).toBe(ERROR_MESSAGE)
      }
      expect(cacheStore.getError(errorCache(1))).toBe(ERROR_MESSAGE)
      expect(cacheStore.getError(errorCache(2))).toBe(ERROR_MESSAGE)

      cacheStore.clearError(errorCache(1))
      expect(cacheStore.getError(errorCache(1))).toBeUndefined()
      expect(cacheStore.getError(errorCache(2))).toBe(ERROR_MESSAGE)
      cacheStore.clearError(errorCache(2))
      expect(cacheStore.getError(errorCache(1))).toBeUndefined()
      expect(cacheStore.getError(errorCache(2))).toBeUndefined()
    })
  })

  describe('remove', () => {
    it('should remove specific cached', async () => {
      try {
        cacheStore.suspend(successCache(1))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      expect(cacheStore.getData(successCache(1))).toBe(TEXT)
      expect(() => {
        cacheStore.remove(successCache(1))
      }).not.throw()
      expect(cacheStore.getData(successCache(1))).toBeUndefined()
    })
  })

  describe('reset', () => {
    it('should delete all cached and notify to subscribers', async () => {
      const mockSync1 = vitest.fn()
      const mockSync2 = vitest.fn()
      cacheStore.subscribe(successCache(1), mockSync1)
      cacheStore.subscribe(successCache(2), mockSync2)
      try {
        cacheStore.suspend(successCache(1))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      try {
        cacheStore.suspend(successCache(2))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      expect(cacheStore.getData(successCache(1))).toBe(TEXT)
      expect(cacheStore.getData(successCache(2))).toBe(TEXT)
      expect(mockSync1).not.toHaveBeenCalled()
      expect(mockSync2).not.toHaveBeenCalled()
      cacheStore.reset()
      expect(cacheStore.getData(successCache(1))).toBeUndefined()
      expect(cacheStore.getData(successCache(2))).toBeUndefined()
      expect(mockSync1).toHaveBeenCalledOnce()
      expect(mockSync2).toHaveBeenCalledOnce()
    })

    it('should delete specific cached and notify to subscriber', async () => {
      const mockSync = vitest.fn()
      cacheStore.subscribe(successCache(1), mockSync)
      try {
        cacheStore.suspend(successCache(1))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      expect(cacheStore.getData(successCache(1))).toBe(TEXT)
      expect(mockSync).not.toHaveBeenCalled()
      cacheStore.reset(successCache(1))
      expect(cacheStore.getData(successCache(1))).toBeUndefined()
      expect(mockSync).toHaveBeenCalledOnce()
    })
  })

  describe('getData', () => {
    it('should get data of specific cached', async () => {
      render(
        <CacheStoreProvider store={cacheStore}>
          <Suspense fallback={FALLBACK}>
            <Cache {...errorCache(1)} cacheFn={() => sleep(ms('0.1s')).then(() => TEXT)}>
              {(cached) => <>{cached.data}</>}
            </Cache>
          </Suspense>
        </CacheStoreProvider>
      )

      expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
      expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
      expect(cacheStore.getData(errorCache(1))).toBeUndefined()
      await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
      expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
      expect(cacheStore.getData(errorCache(1))).toBe(TEXT)
    })
  })

  describe('unsubscribe', () => {
    it('should handle unsubscribe gracefully when no subscribers exist', () => {
      const mockSync = vi.fn()
      const cacheKey = ['nonexistent', 'key'] as const
      cacheStore.unsubscribe({ cacheKey }, mockSync)

      expect(cacheStore['syncsMap'].get(hashCacheKey(cacheKey))).toBeUndefined()
    })
  })
})
