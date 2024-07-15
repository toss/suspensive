import { ErrorBoundary, Suspense } from '@suspensive/react'
import { ERROR_MESSAGE, FALLBACK, TEXT, sleep } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { cacheOptions } from './cacheOptions'
import { CacheStore } from './CacheStore'
import { CacheStoreProvider } from './CacheStoreProvider'
import { useCache } from './useCache'
import { useCacheStore } from './useCacheStore'

const key = (id: number) => ['key', id] as const

const successCache = () => cacheOptions({ cacheKey: key(1), cacheFn: () => sleep(ms('0.1s')).then(() => TEXT) })
const failureCache = () =>
  cacheOptions({
    cacheKey: key(1),
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    cacheFn: () => sleep(ms('0.1s')).then(() => Promise.reject(ERROR_MESSAGE)),
  })

const CacheSuccess = () => {
  const cached = useCache(successCache())
  const cacheStore = useCacheStore()

  return (
    <>
      {cached.data}
      <button onClick={() => cacheStore.reset(successCache())}>Try again</button>
    </>
  )
}

const CacheFailure = () => {
  const cached = useCache(failureCache())

  return <>{cached.data}</>
}

describe('useCache', () => {
  let cacheStore: CacheStore

  beforeEach(() => {
    cacheStore = new CacheStore()
    cacheStore.reset()
  })

  it('should return object containing data field with only success, and It will be cached', async () => {
    const { unmount } = render(
      <CacheStoreProvider store={cacheStore}>
        <Suspense fallback={FALLBACK}>
          <CacheSuccess />
        </Suspense>
      </CacheStoreProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())

    // success data cache test
    unmount()
    render(
      <CacheStoreProvider store={cacheStore}>
        <Suspense fallback={FALLBACK}>
          <CacheSuccess />
        </Suspense>
      </CacheStoreProvider>
    )
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should throw Error, and It will be cached', async () => {
    const { unmount } = render(
      <CacheStoreProvider store={cacheStore}>
        <ErrorBoundary fallback={(props) => <>{props.error}</>}>
          <Suspense fallback={FALLBACK}>
            <CacheFailure />
          </Suspense>
        </ErrorBoundary>
      </CacheStoreProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())

    // error cache test
    unmount()
    render(
      <CacheStoreProvider store={cacheStore}>
        <ErrorBoundary fallback={(props) => <>{props.error}</>}>
          <Suspense fallback={FALLBACK}>
            <CacheFailure />
          </Suspense>
        </ErrorBoundary>
      </CacheStoreProvider>
    )
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument()
  })

  it('should return object containing reset method to reset cache by key', async () => {
    const { rerender } = render(
      <CacheStoreProvider store={cacheStore}>
        <Suspense fallback={FALLBACK}>
          <CacheSuccess />
        </Suspense>
      </CacheStoreProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    const resetButton = await screen.findByRole('button', { name: 'Try again' })
    resetButton.click()
    rerender(
      <CacheStoreProvider store={cacheStore}>
        <Suspense fallback={FALLBACK}>
          <CacheSuccess />
        </Suspense>
      </CacheStoreProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
})
