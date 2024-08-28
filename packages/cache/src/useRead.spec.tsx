import { ErrorBoundary, Suspense } from '@suspensive/react'
import { ERROR_MESSAGE, FALLBACK, TEXT, sleep } from '@suspensive/utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { CacheProvider } from './CacheProvider'
import { useCache } from './useCache'
import { useRead } from './useRead'

const key = (id: string) => ['key', id] as const

const successCache = () =>
  cacheOptions({
    cacheKey: key('success'),
    cacheFn: () => sleep(ms('0.1s')).then(() => TEXT),
  })
const failureCache = () =>
  cacheOptions({
    cacheKey: key('failure'),
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    cacheFn: () => sleep(ms('0.1s')).then(() => Promise.reject(ERROR_MESSAGE)),
  })

const ReadSuccess = () => {
  const cached = useRead(successCache())
  const cache = useCache()

  return (
    <>
      {cached.data}
      <button onClick={() => cache.reset(successCache())}>Try again</button>
    </>
  )
}

const ReadFailure = () => {
  const cached = useRead(failureCache())

  return <>{cached.data}</>
}

describe('useRead', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
    cache.reset()
  })

  it('should return object containing data field with only success, and It will be cached', async () => {
    const { unmount } = render(
      <CacheProvider cache={cache}>
        <Suspense fallback={FALLBACK}>
          <ReadSuccess />
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
          <ReadSuccess />
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
            <ReadFailure />
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
            <ReadFailure />
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
          <ReadSuccess />
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
          <ReadSuccess />
        </Suspense>
      </CacheProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
})
