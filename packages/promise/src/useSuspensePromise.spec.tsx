import { ErrorBoundary, Suspense } from '@suspensive/react'
import { ERROR_MESSAGE, FALLBACK, TEXT, sleep } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { PromiseCache } from './PromiseCache'
import { PromiseCacheProvider } from './PromiseCacheProvider'
import { useSuspensePromise } from './useSuspensePromise'

const key = (id: number) => ['key', id] as const

const SuspensePromiseSuccess = () => {
  const resolvedData = useSuspensePromise({ promiseKey: key(1), promiseFn: () => sleep(ms('0.1s')).then(() => TEXT) })

  return (
    <>
      {resolvedData.data}
      <button onClick={resolvedData.reset}>Try again</button>
    </>
  )
}

const SuspensePromiseFailure = () => {
  const resolvedData = useSuspensePromise({
    promiseKey: key(1),
    promiseFn: () => sleep(ms('0.1s')).then(() => Promise.reject(new Error(ERROR_MESSAGE))),
  })

  return <>{resolvedData.data}</>
}

describe('useSuspensePromise', () => {
  let promiseCache: PromiseCache

  beforeEach(() => {
    promiseCache = new PromiseCache()
    promiseCache.reset()
  })

  it('should return object containing data field with only success, and It will be cached', async () => {
    const { unmount } = render(
      <PromiseCacheProvider cache={promiseCache}>
        <Suspense fallback={FALLBACK}>
          <SuspensePromiseSuccess />
        </Suspense>
      </PromiseCacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())

    // success data cache test
    unmount()
    render(
      <PromiseCacheProvider cache={promiseCache}>
        <Suspense fallback={FALLBACK}>
          <SuspensePromiseSuccess />
        </Suspense>
      </PromiseCacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should throw Error, and It will be cached', async () => {
    const { unmount } = render(
      <PromiseCacheProvider cache={promiseCache}>
        <ErrorBoundary fallback={(props) => <>{props.error.message}</>}>
          <Suspense fallback={FALLBACK}>
            <SuspensePromiseFailure />
          </Suspense>
        </ErrorBoundary>
      </PromiseCacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())

    // error cache test
    unmount()
    render(
      <PromiseCacheProvider cache={promiseCache}>
        <ErrorBoundary fallback={(props) => <>{props.error.message}</>}>
          <Suspense fallback={FALLBACK}>
            <SuspensePromiseFailure />
          </Suspense>
        </ErrorBoundary>
      </PromiseCacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument()
  })

  it('should return object containing reset method to reset cache by key', async () => {
    const { rerender } = render(
      <PromiseCacheProvider cache={promiseCache}>
        <Suspense fallback={FALLBACK}>
          <SuspensePromiseSuccess />
        </Suspense>
      </PromiseCacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    const resetButton = await screen.findByRole('button', { name: 'Try again' })
    resetButton.click()
    rerender(
      <PromiseCacheProvider cache={promiseCache}>
        <Suspense fallback={FALLBACK}>
          <SuspensePromiseSuccess />
        </Suspense>
      </PromiseCacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
})
