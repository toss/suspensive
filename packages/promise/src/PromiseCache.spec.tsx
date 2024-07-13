import { ERROR_MESSAGE, FALLBACK, TEXT, sleep } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { Suspense } from 'react'
import { PromiseCache } from './PromiseCache'
import { PromiseCacheProvider } from './PromiseCacheProvider'
import { SuspensePromise } from './SuspensePromise'
import { hashKey } from './utils'

const key = (id: number) => ['key', id] as const

// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
const asyncErrorFn = () => new Promise((_, reject) => reject(ERROR_MESSAGE))
describe('promiseCache', () => {
  let promiseCache: PromiseCache

  beforeEach(() => {
    promiseCache = new PromiseCache()
    promiseCache.reset()
  })

  it("have clearError method without key should clear promise & error for all key's promiseCacheState", async () => {
    expect(promiseCache.getError(key(1))).toBeUndefined()
    expect(promiseCache.getError(key(2))).toBeUndefined()
    try {
      promiseCache.suspend({ promiseKey: key(1), promiseFn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      promiseCache.suspend({ promiseKey: key(1), promiseFn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    try {
      promiseCache.suspend({ promiseKey: key(2), promiseFn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      promiseCache.suspend({ promiseKey: key(2), promiseFn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    expect(promiseCache.getError(key(1))).toBe(ERROR_MESSAGE)
    expect(promiseCache.getError(key(2))).toBe(ERROR_MESSAGE)

    promiseCache.clearError()
    expect(promiseCache.getError(key(1))).toBeUndefined()
    expect(promiseCache.getError(key(2))).toBeUndefined()
  })

  it("have clearError method with key should clear promise & error for key's promiseCacheState", async () => {
    expect(promiseCache.getError(key(1))).toBeUndefined()
    expect(promiseCache.getError(key(2))).toBeUndefined()
    try {
      promiseCache.suspend({ promiseKey: key(1), promiseFn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      promiseCache.suspend({ promiseKey: key(1), promiseFn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    try {
      promiseCache.suspend({ promiseKey: key(2), promiseFn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      promiseCache.suspend({ promiseKey: key(2), promiseFn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    expect(promiseCache.getError(key(1))).toBe(ERROR_MESSAGE)
    expect(promiseCache.getError(key(2))).toBe(ERROR_MESSAGE)

    promiseCache.clearError(key(1))
    expect(promiseCache.getError(key(1))).toBeUndefined()
    expect(promiseCache.getError(key(2))).toBe(ERROR_MESSAGE)
    promiseCache.clearError(key(2))
    expect(promiseCache.getError(key(1))).toBeUndefined()
    expect(promiseCache.getError(key(2))).toBeUndefined()
  })

  it("have getData method with key should get data of key's promiseCacheState", async () => {
    render(
      <PromiseCacheProvider cache={promiseCache}>
        <Suspense fallback={FALLBACK}>
          <SuspensePromise options={{ promiseKey: key(1), promiseFn: () => sleep(ms('0.1s')).then(() => TEXT) }}>
            {(resolvedData) => <>{resolvedData.data}</>}
          </SuspensePromise>
        </Suspense>
      </PromiseCacheProvider>
    )

    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(promiseCache.getData(key(1))).toBeUndefined()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(promiseCache.getData(key(1))).toBe(TEXT)
  })

  it('should handle unsubscribe gracefully when no subscribers exist', () => {
    const mockSync = vi.fn()
    const key = ['nonexistent', 'key'] as const
    promiseCache.unsubscribe(key, mockSync)

    expect(promiseCache['syncsMap'].get(hashKey(key))).toBeUndefined()
  })
})
