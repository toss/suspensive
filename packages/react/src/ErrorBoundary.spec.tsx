import { ERROR_MESSAGE, FALLBACK, MS_100, TEXT, ThrowError, ThrowNull } from '@suspensive/test-utils'
import { act, render } from '@testing-library/react'
import type { ComponentProps, ComponentRef } from 'react'
import { createElement, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { vi } from 'vitest'
import { useTimeout } from './hooks'
import { assert } from './utils'
import { ErrorBoundary, useErrorBoundary, useErrorBoundaryFallbackProps, withErrorBoundary } from '.'

let container = document.createElement('div')
let root = createRoot(container)
const errorBoundaryRef = createRef<ComponentRef<typeof ErrorBoundary>>()

describe('<ErrorBoundary/>', () => {
  beforeEach(() => {
    container = document.createElement('div')
    root = createRoot(container)
    ThrowError.reset()
  })

  const renderErrorBoundary = (props: Partial<ComponentProps<typeof ErrorBoundary>>) =>
    act(() =>
      root.render(
        <ErrorBoundary
          ref={errorBoundaryRef}
          fallback={(errorBoundaryFallbackProps) => <>{errorBoundaryFallbackProps.error.message}</>}
          {...props}
        />
      )
    )

  it('should show children if no error but if error in children, catch it and show fallback and call onError', () => {
    const onError = vi.fn()
    vi.useFakeTimers()
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
    act(() => vi.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(FALLBACK)
    expect(container.textContent).not.toBe(TEXT)
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('should show children if no error but if error in children, catch it and show fallback component', () => {
    vi.useFakeTimers()
    renderErrorBoundary({
      fallback: (props) => <>{props.error.message}</>,
      children: (
        <ThrowError message={ERROR_MESSAGE} after={MS_100}>
          {TEXT}
        </ThrowError>
      ),
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(ERROR_MESSAGE)
    expect(container.textContent).not.toBe(TEXT)
  })

  it('should catch it even if thrown null', () => {
    const onError = vi.fn()
    vi.useFakeTimers()
    renderErrorBoundary({
      onError,
      fallback: <>{FALLBACK}</>,
      children: <ThrowNull after={MS_100}>{TEXT}</ThrowNull>,
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(FALLBACK)
    expect(onError).toHaveBeenCalledTimes(0)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(FALLBACK)
    expect(container.textContent).not.toBe(TEXT)
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('should be reset by items of resetKeys, and call onReset', () => {
    const onReset = vi.fn()
    vi.useFakeTimers()
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
    act(() => vi.advanceTimersByTime(MS_100))
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
    act(() => vi.advanceTimersByTime(MS_100))
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

  it('should be reset by render prop reset(), and call onReset', () => {
    const onReset = vi.fn()
    const fallbackFn = vi.fn()
    act(() =>
      root.render(
        <ErrorBoundary ref={errorBoundaryRef} fallback={fallbackFn} onReset={onReset}>
          <ThrowError message={ERROR_MESSAGE} after={MS_100}>
            {TEXT}
          </ThrowError>
        </ErrorBoundary>
      )
    )
    act(() => vi.advanceTimersByTime(MS_100))
    expect(fallbackFn).toHaveBeenCalled()
    fallbackFn.mock.calls[0][0].reset()
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('should be reset by ref.reset(), and call onReset', () => {
    const onReset = vi.fn()
    vi.useFakeTimers()
    renderErrorBoundary({
      children: (
        <ThrowError message={ERROR_MESSAGE} after={MS_100}>
          {TEXT}
        </ThrowError>
      ),
      onReset,
    })
    act(() => vi.advanceTimersByTime(MS_100))
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

describe('withErrorBoundary', () => {
  beforeEach(() => {
    container = document.createElement('div')
    root = createRoot(container)
    ThrowError.reset()
  })

  it("should render the wrapped component when there's no error", () => {
    const WrappedComponent = withErrorBoundary(() => <>{TEXT}</>, {
      fallback: (props) => <>{props.error.message}</>,
    })

    act(() => root.render(<WrappedComponent />))
    expect(container.textContent).toBe(TEXT)
  })

  it('should render the fallback when there`s an error in the wrapped component', () => {
    vi.useFakeTimers()

    const WrappedComponentWithError = withErrorBoundary(
      () => (
        <ThrowError message={ERROR_MESSAGE} after={MS_100}>
          {TEXT}
        </ThrowError>
      ),
      {
        fallback: (props) => <>{props.error.message}</>,
      }
    )

    act(() => root.render(<WrappedComponentWithError />))
    expect(container.textContent).toBe(TEXT)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(ERROR_MESSAGE)
  })

  it('should set displayName based on Component.displayName', () => {
    const TestComponentWithDisplayName = () => <>{TEXT}</>
    TestComponentWithDisplayName.displayName = 'TestDisplayName'
    expect(withErrorBoundary(TestComponentWithDisplayName, { fallback: () => <></> }).displayName).toBe(
      'withErrorBoundary(TestDisplayName)'
    )
    expect(withErrorBoundary(() => <>{TEXT}</>, { fallback: () => <></> }).displayName).toBe(
      'withErrorBoundary(Component)'
    )
  })
})

describe('useErrorBoundary', () => {
  beforeEach(() => {
    container = document.createElement('div')
    root = createRoot(container)
    ThrowError.reset()
  })
  const renderErrorBoundary = (props: Partial<ComponentProps<typeof ErrorBoundary>>) =>
    act(() =>
      root.render(
        <ErrorBoundary
          ref={errorBoundaryRef}
          fallback={(errorBoundaryFallbackProps) => <>{errorBoundaryFallbackProps.error.message}</>}
          {...props}
        />
      )
    )

  it('should supply setError to set Error of ErrorBoundary manually', () => {
    const onError = vi.fn()
    vi.useFakeTimers()
    renderErrorBoundary({
      onError,
      fallback: function ErrorBoundaryFallback() {
        const props = useErrorBoundaryFallbackProps()
        useTimeout(props.reset, MS_100)
        return <>{props.error.message}</>
      },
      children: createElement(() => {
        const errorBoundary = useErrorBoundary()
        useTimeout(() => errorBoundary.setError(new Error(ERROR_MESSAGE)), MS_100)
        return <>{TEXT}</>
      }),
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onError).toHaveBeenCalledTimes(0)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(ERROR_MESSAGE)
    expect(container.textContent).not.toBe(TEXT)
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('should guarantee hook calling position is in children of ErrorBoundary', () => {
    expect(
      render(
        <ErrorBoundary fallback={ERROR_MESSAGE}>
          {createElement(() => {
            useErrorBoundary()
            return <>{TEXT}</>
          })}
        </ErrorBoundary>
      ).getByText(TEXT)
    ).toBeInTheDocument()

    expect(() =>
      render(
        <ErrorBoundary
          fallback={() => {
            useErrorBoundary()
            return <></>
          }}
        >
          <ThrowError message={ERROR_MESSAGE} after={0} />
        </ErrorBoundary>
      )
    ).toThrow(assert.message.useErrorBoundary.onlyInChildrenOfErrorBoundary)
  })
})

describe('useErrorBoundaryFallbackProps', () => {
  beforeEach(() => {
    container = document.createElement('div')
    root = createRoot(container)
    ThrowError.reset()
  })
  const renderErrorBoundary = (props: Partial<ComponentProps<typeof ErrorBoundary>>) =>
    act(() =>
      root.render(<ErrorBoundary ref={errorBoundaryRef} fallback={(props) => <>{props.error.message}</>} {...props} />)
    )

  it('should supply reset function and error to reset in fallback of ErrorBoundary', () => {
    const onReset = vi.fn()
    vi.useFakeTimers()
    renderErrorBoundary({
      onReset,
      fallback: function ErrorBoundaryFallback() {
        const props = useErrorBoundaryFallbackProps()
        useTimeout(props.reset, MS_100)

        return <>{props.error.message}</>
      },
      children: (
        <ThrowError message={ERROR_MESSAGE} after={MS_100}>
          {TEXT}
        </ThrowError>
      ),
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onReset).toHaveBeenCalledTimes(0)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(ERROR_MESSAGE)
    expect(container.textContent).not.toBe(TEXT)
    expect(onReset).toHaveBeenCalledTimes(0)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('should guarantee hook calling position is in fallback of ErrorBoundary', () => {
    expect(
      render(
        <ErrorBoundary fallback={(props) => <>{props.error.message}</>}>
          {createElement(() => {
            useErrorBoundaryFallbackProps()
            return <>{TEXT}</>
          })}
        </ErrorBoundary>
      ).getByText(assert.message.useErrorBoundaryFallbackProps.onlyInFallbackOfErrorBoundary)
    ).toBeInTheDocument()
  })

  it('should be prevented to be called outside fallback of ErrorBoundary', () => {
    expect(() =>
      render(
        createElement(() => {
          useErrorBoundaryFallbackProps()
          return <>{TEXT}</>
        })
      )
    ).toThrow(assert.message.useErrorBoundaryFallbackProps.onlyInFallbackOfErrorBoundary)
  })

  it('should be prevented to be called in children of ErrorBoundary', () => {
    expect(
      render(
        <ErrorBoundary fallback={(props) => <>{props.error.message}</>}>
          {createElement(() => {
            useErrorBoundaryFallbackProps()
            return <>{TEXT}</>
          })}
        </ErrorBoundary>
      ).getByText(assert.message.useErrorBoundaryFallbackProps.onlyInFallbackOfErrorBoundary)
    ).toBeInTheDocument()
  })
})
