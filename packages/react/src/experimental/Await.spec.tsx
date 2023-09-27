import { act, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { ErrorBoundary, Suspense } from '..'
import { ERROR_MESSAGE, FALLBACK, MS_100, TEXT, delay } from '../utils/toTest'
import { Await, awaitClient, useAwait } from '.'

const key = ['key'] as const

const AwaitSuccess = () => {
  const awaited = useAwait({ key, fn: () => delay(MS_100).then(() => TEXT) })

  return (
    <>
      {awaited.data}
      <button onClick={awaited.reset}>reset</button>
    </>
  )
}

const AwaitFailure = () => {
  const awaited = useAwait({ key, fn: () => delay(MS_100).then(() => Promise.reject(new Error(ERROR_MESSAGE))) })

  return <>{awaited.data}</>
}

describe('<Await />', () => {
  it('should render child component with data from useAwait hook', async () => {
    render(
      <Suspense fallback="Loading...">
        <Await options={{ key, fn: () => Promise.resolve(TEXT) }}>{({ data }) => <>{data}</>}</Await>
      </Suspense>
    )

    expect(await screen.findByText(TEXT)).toBeInTheDocument()
  })
})

describe('useAwait', () => {
  beforeEach(() => awaitClient.reset())
  it('should return object containing data field with only success, and It will be cached', async () => {
    vi.useFakeTimers()
    const { unmount } = render(
      <Suspense fallback={FALLBACK}>
        <AwaitSuccess />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())

    // success data cache test
    unmount()
    render(
      <Suspense fallback={FALLBACK}>
        <AwaitSuccess />
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
          <AwaitFailure />
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
          <AwaitFailure />
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
        <AwaitSuccess />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    const resetButton = await screen.findByRole('button', { name: 'reset' })
    resetButton.click()
    rerender(
      <Suspense fallback={FALLBACK}>
        <AwaitSuccess />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
})

describe('awaitClient', () => {
  beforeEach(() => awaitClient.reset())

  it('should have clearError method to clear promise & error for all cache without key', async () => {
    try {
      await awaitClient.suspend({ key, fn: () => Promise.reject(new Error(ERROR_MESSAGE)) })
    } catch {
      // Expected an error
    }

    awaitClient.clearError()
    expect(awaitClient.getData(key)).toBeUndefined()
  })
})
