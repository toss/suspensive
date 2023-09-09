import { act, render, screen } from '@testing-library/react'
import { ERROR_MESSAGE, MS_100, TEXT, ThrowError } from './utils.spec'
import { ErrorBoundary, ErrorBoundaryGroup, useErrorBoundaryGroup } from '.'

const innerErrorBoundaryCount = 3
const resetButtonText = 'reset button'

describe('ErrorBoundaryGroup', () => {
  it('should reset all ErrorBoundaries in children', () => {
    vi.useFakeTimers()
    render(
      <ErrorBoundaryGroup>
        <ErrorBoundaryGroup.Reset trigger={(group) => <button onClick={group.reset}>{resetButtonText}</button>} />
        {Array.from({ length: innerErrorBoundaryCount }).map((_, key) => (
          <ErrorBoundary key={key} fallback={(caught) => <div>{caught.error.message}</div>}>
            <ThrowError message={ERROR_MESSAGE} after={MS_100}>
              <div>{TEXT}</div>
            </ThrowError>
          </ErrorBoundary>
        ))}
      </ErrorBoundaryGroup>
    )

    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(innerErrorBoundaryCount)

    const resetButton = screen.getByRole('button', { name: resetButtonText })
    act(() => {
      ThrowError.reset()
      resetButton.click()
    })
    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
  })

  it('should reset all ErrorBoundaries in children even if it is nested, but if use blockOutside, can block reset by outside', () => {
    vi.useFakeTimers()
    render(
      <ErrorBoundaryGroup>
        <ErrorBoundaryGroup.Reset trigger={(group) => <button onClick={group.reset}>{resetButtonText}</button>} />
        {Array.from({ length: innerErrorBoundaryCount }).map((_, index) => (
          <ErrorBoundaryGroup key={index} blockOutside={index === innerErrorBoundaryCount - 1}>
            <ErrorBoundary fallback={(caught) => <div>{caught.error.message}</div>}>
              <ThrowError message={ERROR_MESSAGE} after={MS_100}>
                <div>{TEXT}</div>
              </ThrowError>
            </ErrorBoundary>
          </ErrorBoundaryGroup>
        ))}
      </ErrorBoundaryGroup>
    )

    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(innerErrorBoundaryCount)

    const resetButton = screen.getByRole('button', { name: resetButtonText })
    act(() => {
      ThrowError.reset()
      resetButton.click()
    })
    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount - 1)
    expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(1)
  })
})

describe('useErrorBoundaryGroup', () => {
  it('should throw error without ErrorBoundaryGroup in parent', () => {
    const WithoutErrorBoundaryGroup = () => {
      useErrorBoundaryGroup()
      return <></>
    }
    expect(() => render(<WithoutErrorBoundaryGroup />)).toThrow(
      'useErrorBoundaryGroup: ErrorBoundaryGroup is required in parent'
    )
  })
})
