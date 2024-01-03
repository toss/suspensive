import { ERROR_MESSAGE, FALLBACK, Suspend, TEXT, ThrowError } from '@suspensive/test-utils'
import { act, render, waitFor } from '@testing-library/react'
import ms from 'ms'
import { type ComponentProps, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AsyncBoundary, withAsyncBoundary } from '.'

let container = document.createElement('div')
let root = createRoot(container)

const renderAsyncBoundary = (props: ComponentProps<typeof AsyncBoundary>) =>
  act(() => root.render(<AsyncBoundary {...props} />))

const renderAsyncBoundaryCSROnly = (props: ComponentProps<typeof AsyncBoundary.CSROnly>) =>
  act(() => root.render(<AsyncBoundary.CSROnly {...props} />))

const resetBeforeEach = () =>
  beforeEach(() => {
    container = document.createElement('div')
    root = createRoot(container)
    ThrowError.reset()
    Suspend.reset()
  })

describe('<AsyncBoundary/>', () => {
  resetBeforeEach()

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
  it('should render the pendingFallback if something to suspend in children', () => {
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
    renderAsyncBoundary({
      pendingFallback: FALLBACK,
      rejectedFallback: ERROR_MESSAGE,
      onError,
      children: (
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      ),
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(FALLBACK)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onError).toHaveBeenCalledTimes(0)
    await waitFor(() => {
      expect(container.textContent).toBe(ERROR_MESSAGE)
      expect(container.textContent).not.toBe(TEXT)
      expect(container.textContent).not.toBe(FALLBACK)
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })
})

describe('<AsyncBoundary.CSROnly/>', () => {
  resetBeforeEach()

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
  it('should render the pendingFallback if something to suspend in children', () => {
    const onError = vi.fn()
    renderAsyncBoundaryCSROnly({
      pendingFallback: FALLBACK,
      rejectedFallback: ERROR_MESSAGE,
      onError,
      children: <Suspend during={ms('4s')} toShow={TEXT} />,
    })
    expect(container.textContent).toBe(FALLBACK)
    expect(container.textContent).not.toBe(TEXT)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onError).toHaveBeenCalledTimes(0)
  })
  it('should render rejectedFallback if error is caught in children', async () => {
    const onError = vi.fn()
    renderAsyncBoundaryCSROnly({
      pendingFallback: FALLBACK,
      rejectedFallback: ERROR_MESSAGE,
      onError,
      children: (
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      ),
    })
    expect(container.textContent).toBe(TEXT)
    expect(container.textContent).not.toBe(FALLBACK)
    expect(container.textContent).not.toBe(ERROR_MESSAGE)
    expect(onError).toHaveBeenCalledTimes(0)
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

  it('should set displayName based on Component.displayName', () => {
    const TestComponentWithDisplayName = () => <>{TEXT}</>
    TestComponentWithDisplayName.displayName = 'TestDisplayName'
    expect(withAsyncBoundary(TestComponentWithDisplayName, { rejectedFallback: () => <></> }).displayName).toBe(
      'withAsyncBoundary(TestDisplayName)'
    )
    expect(withAsyncBoundary(() => <>{TEXT}</>, { rejectedFallback: () => <></> }).displayName).toBe(
      'withAsyncBoundary(Component)'
    )
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

  it('should set displayName based on Component.displayName', () => {
    const TestComponentWithDisplayName = () => <>{TEXT}</>
    TestComponentWithDisplayName.displayName = 'TestDisplayName'
    expect(withAsyncBoundary.CSROnly(TestComponentWithDisplayName, { rejectedFallback: () => <></> }).displayName).toBe(
      'withAsyncBoundary.CSROnly(TestDisplayName)'
    )
    expect(withAsyncBoundary.CSROnly(() => <>{TEXT}</>, { rejectedFallback: () => <></> }).displayName).toBe(
      'withAsyncBoundary.CSROnly(Component)'
    )
  })
})
