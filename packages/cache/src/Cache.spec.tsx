import { ERROR_MESSAGE, FALLBACK, TEXT, sleep } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { Suspense } from 'react'
import { Cache } from './Cache'
import { CacheProvider } from './CacheProvider'
import { SuspenseCache } from './SuspenseCache'
import { hashKey } from './utils'

const key = (id: number) => ['key', id] as const

// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
const asyncErrorFn = () => new Promise((_, reject) => reject(ERROR_MESSAGE))
describe('cache', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
    cache.reset()
  })

  it("have clearError method without key should clear promise & error for all key's cacheState", async () => {
    expect(cache.getError(key(1))).toBeUndefined()
    expect(cache.getError(key(2))).toBeUndefined()
    try {
      cache.suspend({ cacheKey: key(1), cacheFn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      cache.suspend({ cacheKey: key(1), cacheFn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    try {
      cache.suspend({ cacheKey: key(2), cacheFn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      cache.suspend({ cacheKey: key(2), cacheFn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    expect(cache.getError(key(1))).toBe(ERROR_MESSAGE)
    expect(cache.getError(key(2))).toBe(ERROR_MESSAGE)

    cache.clearError()
    expect(cache.getError(key(1))).toBeUndefined()
    expect(cache.getError(key(2))).toBeUndefined()
  })

  it("have clearError method with key should clear promise & error for key's cacheState", async () => {
    expect(cache.getError(key(1))).toBeUndefined()
    expect(cache.getError(key(2))).toBeUndefined()
    try {
      cache.suspend({ cacheKey: key(1), cacheFn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      cache.suspend({ cacheKey: key(1), cacheFn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    try {
      cache.suspend({ cacheKey: key(2), cacheFn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      cache.suspend({ cacheKey: key(2), cacheFn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    expect(cache.getError(key(1))).toBe(ERROR_MESSAGE)
    expect(cache.getError(key(2))).toBe(ERROR_MESSAGE)

    cache.clearError(key(1))
    expect(cache.getError(key(1))).toBeUndefined()
    expect(cache.getError(key(2))).toBe(ERROR_MESSAGE)
    cache.clearError(key(2))
    expect(cache.getError(key(1))).toBeUndefined()
    expect(cache.getError(key(2))).toBeUndefined()
  })

  it("have getData method with key should get data of key's cacheState", async () => {
    render(
      <CacheProvider cache={cache}>
        <Suspense fallback={FALLBACK}>
          <SuspenseCache options={{ cacheKey: key(1), cacheFn: () => sleep(ms('0.1s')).then(() => TEXT) }}>
            {(resolvedData) => <>{resolvedData.data}</>}
          </SuspenseCache>
        </Suspense>
      </CacheProvider>
    )

    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(cache.getData(key(1))).toBeUndefined()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(cache.getData(key(1))).toBe(TEXT)
  })

  it('should handle unsubscribe gracefully when no subscribers exist', () => {
    const mockSync = vi.fn()
    const key = ['nonexistent', 'key'] as const
    cache.unsubscribe(key, mockSync)

    expect(cache['syncsMap'].get(hashKey(key))).toBeUndefined()
  })
})
