import { act } from '@testing-library/react'
import { createRoot } from 'react-dom/client'
import { ComponentProps, createRef, ComponentRef } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { TEXT, MS_100, ThrowError, ERROR_MESSAGE, FALLBACK } from './test-utils'

let container = document.createElement('div')
let root = createRoot(container)
const errorBoundaryRef = createRef<ComponentRef<typeof ErrorBoundary>>()

describe('ErrorBoundary', () => {
  beforeEach(() => {
    container = document.createElement('div')
    root = createRoot(container)
    ThrowError.reset()
  })

  const renderErrorBoundary = (props: Partial<ComponentProps<typeof ErrorBoundary>>) =>
    act(() =>
      root.render(
        <ErrorBoundary ref={errorBoundaryRef} fallback={(caught) => <>{caught.error.message}</>} {...props} />
      )
    )

  it('should show children if no error but if error in children, catch it and show fallback and call onError', () => {
    const onError = jest.fn()
    jest.useFakeTimers()
    renderErrorBoundary({
      onError,
      fallback: <>{FALLBACK}</>,
      children: (
        <ThrowError message={ERROR_MESSAGE} after={MS_100}>
          {TEXT}
        </ThrowError>
      ),
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(FALLBACK)
    expect(onError).toHaveBeenCalledTimes(0)
    act(() => jest.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(FALLBACK)
    expect(container.textContent).not.toBe(TEXT)
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('should show children if no error but if error in children, catch it and show fallback component', () => {
    jest.useFakeTimers()
    renderErrorBoundary({
      fallback: (caught) => <>{caught.error.message}</>,
      children: (
        <ThrowError message={ERROR_MESSAGE} after={MS_100}>
          {TEXT}
        </ThrowError>
      ),
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    act(() => jest.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(ERROR_MESSAGE)
    expect(container.textContent).not.toBe(TEXT)
  })

  it('should be reset by items of resetKeys, and call onReset', () => {
    const onReset = jest.fn()
    jest.useFakeTimers()
    // reset by resetKeys[0]
    renderErrorBoundary({
      resetKeys: [0],
      children: (
        <ThrowError message={ERROR_MESSAGE} after={MS_100}>
          {TEXT}
        </ThrowError>
      ),
      onReset,
    })
    act(() => jest.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(ERROR_MESSAGE)
    expect(container.textContent).not.toBe(TEXT)
    expect(onReset).toHaveBeenCalledTimes(0)
    renderErrorBoundary({
      resetKeys: [1],
      children: TEXT,
      onReset,
    })
    expect(container.textContent).toBe(TEXT)
    expect(onReset).toHaveBeenCalledTimes(1)

    // reset by resetKeys.length
    renderErrorBoundary({
      resetKeys: [0],
      children: (
        <ThrowError message={ERROR_MESSAGE} after={MS_100}>
          {TEXT}
        </ThrowError>
      ),
      onReset,
    })
    act(() => jest.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(ERROR_MESSAGE)
    expect(container.textContent).not.toBe(TEXT)

    renderErrorBoundary({
      resetKeys: [0, 1],
      children: TEXT,
      onReset,
    })
    expect(container.textContent).toBe(TEXT)
    expect(onReset).toHaveBeenCalledTimes(2)
  })

  it('should be reset by ref.reset(), and call onReset', () => {
    const onReset = jest.fn()
    jest.useFakeTimers()
    renderErrorBoundary({
      children: (
        <ThrowError message={ERROR_MESSAGE} after={MS_100}>
          {TEXT}
        </ThrowError>
      ),
      onReset,
    })
    act(() => jest.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(ERROR_MESSAGE)
    expect(container.textContent).not.toBe(TEXT)
    expect(onReset).toHaveBeenCalledTimes(0)

    act(() => {
      errorBoundaryRef.current?.reset()
      ThrowError.reset()
    })
    renderErrorBoundary({
      children: (
        <ThrowError message={ERROR_MESSAGE} after={Infinity}>
          {TEXT}
        </ThrowError>
      ),
      onReset,
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
