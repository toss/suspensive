import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

describe('ErrorBoundary with non-Error objects thrown', () => {
  it('should convert null to Error', () => {
    const fallbackFn = vi.fn<[{ error: Error }], JSX.Element>()
    fallbackFn.mockImplementation(({ error }) => <div>error: {error instanceof Error ? 'Error' : typeof error}</div>)

    render(
      <ErrorBoundary fallback={fallbackFn}>
        {createElement(() => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw null
        })}
      </ErrorBoundary>
    )

    expect(fallbackFn).toHaveBeenCalled()
    const error = fallbackFn.mock.calls[0][0].error
    console.log('null thrown - error:', error, 'instanceof Error:', error instanceof Error)
  })

  it('should convert string to Error', () => {
    const fallbackFn = vi.fn<[{ error: Error }], JSX.Element>()
    fallbackFn.mockImplementation(({ error }) => <div>error: {error instanceof Error ? 'Error' : typeof error}</div>)

    render(
      <ErrorBoundary fallback={fallbackFn}>
        {createElement(() => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw 'string error'
        })}
      </ErrorBoundary>
    )

    expect(fallbackFn).toHaveBeenCalled()
    const error = fallbackFn.mock.calls[0][0].error
    console.log('string thrown - error:', error, 'instanceof Error:', error instanceof Error)
  })

  it('should convert number to Error', () => {
    const fallbackFn = vi.fn<[{ error: Error }], JSX.Element>()
    fallbackFn.mockImplementation(({ error }) => <div>error: {error instanceof Error ? 'Error' : typeof error}</div>)

    render(
      <ErrorBoundary fallback={fallbackFn}>
        {createElement(() => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw 42
        })}
      </ErrorBoundary>
    )

    expect(fallbackFn).toHaveBeenCalled()
    const error = fallbackFn.mock.calls[0][0].error
    console.log('number thrown - error:', error, 'instanceof Error:', error instanceof Error)
  })

  it('should convert object to Error', () => {
    const fallbackFn = vi.fn<[{ error: Error }], JSX.Element>()
    fallbackFn.mockImplementation(({ error }) => <div>error: {error instanceof Error ? 'Error' : typeof error}</div>)

    render(
      <ErrorBoundary fallback={fallbackFn}>
        {createElement(() => {
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw { message: 'object error' }
        })}
      </ErrorBoundary>
    )

    expect(fallbackFn).toHaveBeenCalled()
    const error = fallbackFn.mock.calls[0][0].error
    console.log('object thrown - error:', error, 'instanceof Error:', error instanceof Error)
  })
})
