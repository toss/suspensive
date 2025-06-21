import { act, fireEvent, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { ErrorBoundaryGroup, useErrorBoundaryGroup } from './ErrorBoundaryGroup'
import {
  Message_useErrorBoundaryGroup_this_hook_should_be_called_in_ErrorBoundary_props_children,
  SuspensiveError,
} from './models/SuspensiveError'
import { CustomError, ERROR_MESSAGE, TEXT, Throw } from './test-utils'

const innerErrorBoundaryCount = 3
const resetButtonText = 'reset button'

describe('<ErrorBoundaryGroup/>', () => {
  beforeEach(() => Throw.reset())

  it('should reset all ErrorBoundaries in children', async () => {
    vi.useFakeTimers()

    render(
      <ErrorBoundaryGroup>
        <ErrorBoundaryGroup.Consumer>
          {(group) => (
            <button type="button" onClick={group.reset}>
              {resetButtonText}
            </button>
          )}
        </ErrorBoundaryGroup.Consumer>
        {Array.from({ length: innerErrorBoundaryCount }).map((_, i) => (
          <ErrorBoundary key={i} fallback={(props) => <div>{props.error.message}</div>}>
            <Throw.Error message={ERROR_MESSAGE} after={100}>
              <div>{TEXT}</div>
            </Throw.Error>
          </ErrorBoundary>
        ))}
      </ErrorBoundaryGroup>
    )

    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    await act(() => vi.advanceTimersByTime(100))
    expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(innerErrorBoundaryCount)
    fireEvent.click(screen.getByRole('button', { name: resetButtonText }))
    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()

    vi.useRealTimers()
  })

  it('should reset all ErrorBoundaries in children even if it is nested, but if use blockOutside, can block reset by outside', async () => {
    vi.useFakeTimers()

    render(
      <ErrorBoundaryGroup>
        <ErrorBoundaryGroup.Consumer>
          {(group) => (
            <button type="button" onClick={group.reset}>
              {resetButtonText}
            </button>
          )}
        </ErrorBoundaryGroup.Consumer>
        {Array.from({ length: innerErrorBoundaryCount }).map((_, i) => (
          <ErrorBoundaryGroup key={i} blockOutside={i === innerErrorBoundaryCount - 1}>
            <ErrorBoundary fallback={(props) => <div>{props.error.message}</div>}>
              <Throw.Error message={ERROR_MESSAGE} after={100}>
                <div>{TEXT}</div>
              </Throw.Error>
            </ErrorBoundary>
          </ErrorBoundaryGroup>
        ))}
      </ErrorBoundaryGroup>
    )

    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    await act(() => vi.advanceTimersByTime(100))
    expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(innerErrorBoundaryCount)
    fireEvent.click(screen.getByRole('button', { name: resetButtonText }))
    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount - 1)
    expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(1)

    vi.useRealTimers()
  })
})

describe('useErrorBoundaryGroup', () => {
  it('should guarantee hook calling position is in children of ErrorBoundaryGroup', () => {
    expect(
      render(
        <ErrorBoundaryGroup>
          {createElement(() => {
            useErrorBoundaryGroup()
            return <></>
          })}
          <ErrorBoundary fallback={ERROR_MESSAGE}>
            <>{TEXT}</>
          </ErrorBoundary>
        </ErrorBoundaryGroup>
      ).getByText(TEXT)
    ).toBeInTheDocument()

    expect(() =>
      render(
        createElement(() => {
          useErrorBoundaryGroup()
          return <></>
        })
      )
    ).toThrow(Message_useErrorBoundaryGroup_this_hook_should_be_called_in_ErrorBoundary_props_children)

    try {
      render(
        createElement(() => {
          useErrorBoundaryGroup()
          return <></>
        })
      )
    } catch (error) {
      expect(error).toBeInstanceOf(SuspensiveError)
      expect(error).toBeInstanceOf(Error)
      expect(error).not.toBeInstanceOf(CustomError)
    }
  })
})

describe('ErrorBoundaryGroup.with', () => {
  it('should wrap component. we can check by useErrorBoundaryGroup', () => {
    const rendered = render(
      createElement(
        ErrorBoundaryGroup.with({}, () => {
          useErrorBoundaryGroup()
          return <>{TEXT}</>
        })
      )
    )

    expect(rendered.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should use default errorBoundaryGroupProps when undefined is provided', () => {
    const rendered = render(
      createElement(
        ErrorBoundaryGroup.with(undefined, () => {
          useErrorBoundaryGroup()
          return <>{TEXT}</>
        })
      )
    )

    expect(rendered.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should set displayName based on Component.displayName', () => {
    const Component = () => <></>
    Component.displayName = 'Custom'

    expect(ErrorBoundaryGroup.with({}, Component).displayName).toBe('ErrorBoundaryGroup.with(Custom)')
    expect(ErrorBoundaryGroup.with({}, () => <></>).displayName).toBe('ErrorBoundaryGroup.with(Component)')
  })
})
