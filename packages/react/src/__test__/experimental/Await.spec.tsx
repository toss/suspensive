import { act, render, screen, waitFor } from '@testing-library/react'
import { ErrorBoundary, Suspense } from '../..'
import { useAwait } from '../../experimental'
import { suspensiveCache } from '../../experimental/suspensiveCache'
import { ERROR_MESSAGE, FALLBACK, MS_100, TEXT } from '../utils'

const delay = (ms: number) => new Promise((resolve) => setTimeout(() => resolve('done'), ms))
const cacheFnSuccess = () => delay(MS_100).then(() => TEXT)
const cacheFnFailure = () =>
  delay(MS_100).then(() => {
    throw Error(ERROR_MESSAGE)
  })

const cacheKey = ['cacheKey'] as const

const AwaitCacheSuccess = () => {
  const cache = useAwait({
    key: cacheKey,
    fn: cacheFnSuccess,
  })

  return (
    <>
      {cache.data}
      <button onClick={cache.reset}>reset</button>
    </>
  )
}

const AwaitCacheFailure = () => {
  const cache = useAwait({
    key: cacheKey,
    fn: cacheFnFailure,
  })

  return <>{cache.data}</>
}

describe('useAwait', () => {
  beforeEach(() => suspensiveCache.reset())
  it('should return object containing data field with only success, and It will be cached', async () => {
    vi.useFakeTimers()
    const { unmount } = render(
      <Suspense fallback={FALLBACK}>
        <AwaitCacheSuccess />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())

    // success data cache test
    unmount()
    render(
      <Suspense fallback={FALLBACK}>
        <AwaitCacheSuccess />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should throw Error, and It will be cached', async () => {
    vi.useFakeTimers()
    const { unmount } = render(
      <ErrorBoundary fallback={(caught) => <>{caught.error.message}</>}>
        <Suspense fallback={FALLBACK}>
          <AwaitCacheFailure />
        </Suspense>
      </ErrorBoundary>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())

    // error cache test
    unmount()
    render(
      <ErrorBoundary fallback={(caught) => <>{caught.error.message}</>}>
        <Suspense fallback={FALLBACK}>
          <AwaitCacheFailure />
        </Suspense>
      </ErrorBoundary>
    )
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument()
  })

  it('should return object containing reset method to reset cache by key', async () => {
    vi.useFakeTimers()
    const { rerender } = render(
      <Suspense fallback={FALLBACK}>
        <AwaitCacheSuccess />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    const resetButton = await screen.findByRole('button', { name: 'reset' })
    resetButton.click()
    rerender(
      <Suspense fallback={FALLBACK}>
        <AwaitCacheSuccess />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
})
