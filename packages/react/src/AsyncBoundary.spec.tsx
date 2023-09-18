import { act, render, waitFor } from '@testing-library/react'
import { ComponentProps, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ERROR_MESSAGE, FALLBACK, MS_100, Suspend, TEXT, ThrowError } from './utils/toTest'
import { AsyncBoundary, withAsyncBoundary } from '.'

let container = document.createElement('div')
let root = createRoot(container)

const renderAsyncBoundary = (props: ComponentProps<typeof AsyncBoundary>) =>
  act(() => root.render(<AsyncBoundary {...props} />))

const renderAsyncBoundaryCSROnly = (props: ComponentProps<typeof AsyncBoundary.CSROnly>) =>
  act(() => root.render(<AsyncBoundary.CSROnly {...props} />))

describe('AsyncBoundary', () => {
  beforeEach(() => {
    container = document.createElement('div')
    root = createRoot(container)
    ThrowError.reset()
  })

  it('should render the children if nothing to suspend', () => {
    const onError = vi.fn()
    renderAsyncBoundary({
      pendingFallback: FALLBACK,
      rejectedFallback: ERROR_MESSAGE,
      onError,
      children: TEXT,
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(FALLBACK)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onError).toHaveBeenCalledTimes(0)
  })
  it('should render the pendingFallback if something to suspend in children', async () => {
    const onError = vi.fn()
    renderAsyncBoundary({
      pendingFallback: FALLBACK,
      rejectedFallback: ERROR_MESSAGE,
      onError,
      children: <Suspend during={Infinity} toShow={TEXT} />,
    })
    expect(container.textContent).toBe(FALLBACK)
    expect(container.textContent).not.toBe(TEXT)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onError).toHaveBeenCalledTimes(0)
  })
  it('should render rejectedFallback if error is caught in children', async () => {
    const onError = vi.fn()
    vi.useFakeTimers()
    renderAsyncBoundary({
      pendingFallback: FALLBACK,
      rejectedFallback: ERROR_MESSAGE,
      onError,
      children: (
        <ThrowError message={ERROR_MESSAGE} after={MS_100}>
          {TEXT}
        </ThrowError>
      ),
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(FALLBACK)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onError).toHaveBeenCalledTimes(0)
    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => {
      expect(container.textContent).toBe(ERROR_MESSAGE)
      expect(container.textContent).not.toBe(TEXT)
      expect(container.textContent).not.toBe(FALLBACK)
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })
})

describe('AsyncBoundary.CSROnly', () => {
  beforeEach(() => {
    container = document.createElement('div')
    root = createRoot(container)
    ThrowError.reset()
  })

  it('should render the children if nothing to suspend', () => {
    const onError = vi.fn()
    renderAsyncBoundaryCSROnly({
      pendingFallback: FALLBACK,
      rejectedFallback: ERROR_MESSAGE,
      onError,
      children: TEXT,
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(FALLBACK)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onError).toHaveBeenCalledTimes(0)
  })
  it('should render the pendingFallback if something to suspend in children', async () => {
    const onError = vi.fn()
    renderAsyncBoundaryCSROnly({
      pendingFallback: FALLBACK,
      rejectedFallback: ERROR_MESSAGE,
      onError,
      children: <Suspend during={Infinity} toShow={TEXT} />,
    })
    expect(container.textContent).toBe(FALLBACK)
    expect(container.textContent).not.toBe(TEXT)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onError).toHaveBeenCalledTimes(0)
  })
  it('should render rejectedFallback if error is caught in children', async () => {
    const onError = vi.fn()
    vi.useFakeTimers()
    renderAsyncBoundaryCSROnly({
      pendingFallback: FALLBACK,
      rejectedFallback: ERROR_MESSAGE,
      onError,
      children: (
        <ThrowError message={ERROR_MESSAGE} after={MS_100}>
          {TEXT}
        </ThrowError>
      ),
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(FALLBACK)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onError).toHaveBeenCalledTimes(0)
    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => {
      expect(container.textContent).toBe(ERROR_MESSAGE)
      expect(container.textContent).not.toBe(TEXT)
      expect(container.textContent).not.toBe(FALLBACK)
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })
})

describe('withAsyncBoundary', () => {
  it('should wrap component by AsyncBoundary', () => {
    const rendered = render(
      createElement(
        withAsyncBoundary(() => <>{TEXT}</>, {
          rejectedFallback: ERROR_MESSAGE,
        })
      )
    )
    expect(rendered.queryByText(TEXT)).toBeInTheDocument()
  })
})
describe('withAsyncBoundary.CSROnly', () => {
  it('should wrap component by AsyncBoundary.CSROnly', () => {
    const rendered = render(
      createElement(
        withAsyncBoundary.CSROnly(() => <>{TEXT}</>, {
          rejectedFallback: ERROR_MESSAGE,
        })
      )
    )
    expect(rendered.queryByText(TEXT)).toBeInTheDocument()
  })
})
