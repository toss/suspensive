import { ErrorBoundary, Suspense } from '@suspensive/react'
import { ERROR_MESSAGE, FALLBACK, TEXT, sleep } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { CacheProvider } from './CacheProvider'
import { useCache } from './useCache'
import { useSuspenseCache } from './useSuspenseCache'

const key = (id: number) => ['key', id] as const

const successCacheOptions = cacheOptions({ cacheKey: key(1), cacheFn: () => sleep(ms('0.1s')).then(() => TEXT) })
const failureCacheOptions = cacheOptions({
  cacheKey: key(1),
  // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
  cacheFn: () => sleep(ms('0.1s')).then(() => Promise.reject(ERROR_MESSAGE)),
})

const SuspenseCacheSuccess = () => {
  const resolvedData = useSuspenseCache(successCacheOptions)
  const cache = useCache()

  return (
    <>
      {resolvedData.data}
      <button onClick={() => cache.reset(successCacheOptions)}>Try again</button>
    </>
  )
}

const SuspenseCacheFailure = () => {
  const resolvedData = useSuspenseCache(failureCacheOptions)

  return <>{resolvedData.data}</>
}

describe('useSuspenseCache', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
    cache.reset()
  })

  it('should return object containing data field with only success, and It will be cached', async () => {
    const { unmount } = render(
      <CacheProvider cache={cache}>
        <Suspense fallback={FALLBACK}>
          <SuspenseCacheSuccess />
        </Suspense>
      </CacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())

    // success data cache test
    unmount()
    render(
      <CacheProvider cache={cache}>
        <Suspense fallback={FALLBACK}>
          <SuspenseCacheSuccess />
        </Suspense>
      </CacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should throw Error, and It will be cached', async () => {
    const { unmount } = render(
      <CacheProvider cache={cache}>
        <ErrorBoundary fallback={(props) => <>{props.error}</>}>
          <Suspense fallback={FALLBACK}>
            <SuspenseCacheFailure />
          </Suspense>
        </ErrorBoundary>
      </CacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())

    // error cache test
    unmount()
    render(
      <CacheProvider cache={cache}>
        <ErrorBoundary fallback={(props) => <>{props.error}</>}>
          <Suspense fallback={FALLBACK}>
            <SuspenseCacheFailure />
          </Suspense>
        </ErrorBoundary>
      </CacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument()
  })

  it('should return object containing reset method to reset cache by key', async () => {
    const { rerender } = render(
      <CacheProvider cache={cache}>
        <Suspense fallback={FALLBACK}>
          <SuspenseCacheSuccess />
        </Suspense>
      </CacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    const resetButton = await screen.findByRole('button', { name: 'Try again' })
    resetButton.click()
    rerender(
      <CacheProvider cache={cache}>
        <Suspense fallback={FALLBACK}>
          <SuspenseCacheSuccess />
        </Suspense>
      </CacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
})
