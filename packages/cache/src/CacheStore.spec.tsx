import { ERROR_MESSAGE, FALLBACK, TEXT, sleep } from '@suspensive/utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { Suspense } from 'react'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { CacheProvider } from './CacheProvider'
import { Read } from './Read'

const errorCache = (id: number) =>
  cacheOptions({
    cacheKey: ['key', id] as const,
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    cacheFn: () => sleep(ms('0.1s')).then(() => Promise.reject(ERROR_MESSAGE)),
  })

const successCache = (id: number) =>
  cacheOptions({
    cacheKey: ['key', id] as const,
    cacheFn: () => sleep(ms('0.1s')).then(() => Promise.resolve(TEXT)),
  })

describe('Cache', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
    cache.reset()
  })

  describe('clearError', () => {
    it('should clear promise & error for all cached', async () => {
      expect(cache.getError(errorCache(1))).toBeUndefined()
      expect(cache.getError(errorCache(2))).toBeUndefined()
      try {
        cache.suspend(errorCache(1))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      try {
        cache.suspend(errorCache(2))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      expect(cache.getError(errorCache(1))).toBe(ERROR_MESSAGE)
      expect(cache.getError(errorCache(2))).toBe(ERROR_MESSAGE)

      cache.clearError()
      expect(cache.getError(errorCache(1))).toBeUndefined()
      expect(cache.getError(errorCache(2))).toBeUndefined()
    })

    it('should clear promise & error for specific cached', async () => {
      expect(cache.getError(errorCache(1))).toBeUndefined()
      expect(cache.getError(errorCache(2))).toBeUndefined()
      try {
        cache.suspend(errorCache(1))
      } catch (promiseToSuspense) {
        expect(await promiseToSuspense).toBeUndefined()
      }
      try {
        cache.suspend(errorCache(1))
      } catch (error) {
        expect(error).toBe(ERROR_MESSAGE)
      }
      try {
        cache.suspend(errorCache(2))
      } catch (promiseToSuspense) {
        expect(await promiseToSuspense).toBeUndefined()
      }
      try {
        cache.suspend(errorCache(2))
      } catch (error) {
        expect(error).toBe(ERROR_MESSAGE)
      }
      expect(cache.getError(errorCache(1))).toBe(ERROR_MESSAGE)
      expect(cache.getError(errorCache(2))).toBe(ERROR_MESSAGE)

      cache.clearError(errorCache(1))
      expect(cache.getError(errorCache(1))).toBeUndefined()
      expect(cache.getError(errorCache(2))).toBe(ERROR_MESSAGE)
      cache.clearError(errorCache(2))
      expect(cache.getError(errorCache(1))).toBeUndefined()
      expect(cache.getError(errorCache(2))).toBeUndefined()
    })
  })

  describe('remove', () => {
    it('should remove specific cached', async () => {
      try {
        cache.suspend(successCache(1))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      expect(cache.getData(successCache(1))).toBe(TEXT)
      expect(() => {
        cache.remove(successCache(1))
      }).not.throw()
      expect(cache.getData(successCache(1))).toBeUndefined()
    })
  })

  describe('reset', () => {
    it('should delete all cached and notify to subscribers', async () => {
      const mockListener1 = vitest.fn()
      const mockListener2 = vitest.fn()
      cache.subscribe(mockListener1)
      cache.subscribe(mockListener2)
      try {
        cache.suspend(successCache(1))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      try {
        cache.suspend(successCache(2))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      expect(cache.getData(successCache(1))).toBe(TEXT)
      expect(cache.getData(successCache(2))).toBe(TEXT)
      expect(mockListener1).not.toHaveBeenCalled()
      expect(mockListener2).not.toHaveBeenCalled()
      cache.reset()
      expect(cache.getData(successCache(1))).toBeUndefined()
      expect(cache.getData(successCache(2))).toBeUndefined()
      expect(mockListener1).toHaveBeenCalledOnce()
      expect(mockListener2).toHaveBeenCalledOnce()
    })

    it('should delete specific cached and notify to subscriber', async () => {
      const mockListener = vitest.fn()
      cache.subscribe(mockListener)
      try {
        cache.suspend(successCache(1))
      } catch (promiseToSuspense) {
        await promiseToSuspense
      }
      expect(cache.getData(successCache(1))).toBe(TEXT)
      expect(mockListener).not.toHaveBeenCalled()
      cache.reset(successCache(1))
      expect(cache.getData(successCache(1))).toBeUndefined()
      expect(mockListener).toHaveBeenCalledOnce()
    })
  })

  describe('getData', () => {
    it('should get data of specific cached', async () => {
      render(
        <CacheProvider cache={cache}>
          <Suspense fallback={FALLBACK}>
            <Read {...errorCache(1)} cacheFn={() => sleep(ms('0.1s')).then(() => TEXT)}>
              {(cached) => <>{cached.data}</>}
            </Read>
          </Suspense>
        </CacheProvider>
      )

      expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
      expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
      expect(cache.getData(errorCache(1))).toBeUndefined()
      await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
      expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
      expect(cache.getData(errorCache(1))).toBe(TEXT)
    })
  })
})
