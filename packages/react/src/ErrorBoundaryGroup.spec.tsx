import { CustomError, ERROR_MESSAGE, TEXT, ThrowError } from '@suspensive/test-utils'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import { ErrorBoundaryGroup, useErrorBoundaryGroup } from './ErrorBoundaryGroup'
import {
  SuspensiveError,
  useErrorBoundaryGroup_this_hook_should_be_called_in_ErrorBoundary_props_children,
} from './models/SuspensiveError'

const innerErrorBoundaryCount = 3
const resetButtonText = 'reset button'

describe('<ErrorBoundaryGroup/>', () => {
  it('should reset all ErrorBoundaries in children', async () => {
    render(
      <ErrorBoundaryGroup>
        <ErrorBoundaryGroup.Consumer>
          {(group) => <button onClick={group.reset}>{resetButtonText}</button>}
        </ErrorBoundaryGroup.Consumer>
        {Array.from({ length: innerErrorBoundaryCount }).map((_, key) => (
          <ErrorBoundary key={key} fallback={(props) => <div>{props.error.message}</div>}>
            <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
              <div>{TEXT}</div>
            </ThrowError>
          </ErrorBoundary>
        ))}
      </ErrorBoundaryGroup>
    )

    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    await waitFor(() => expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(innerErrorBoundaryCount))
    ThrowError.reset()

    fireEvent.click(screen.getByRole('button', { name: resetButtonText }))
    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
  })

  it('should reset all ErrorBoundaries in children by <ErrorBoundaryGroup.Reset/> too yet', async () => {
    render(
      <ErrorBoundaryGroup>
        <ErrorBoundaryGroup.Reset trigger={(group) => <button onClick={group.reset}>{resetButtonText}</button>} />
        {Array.from({ length: innerErrorBoundaryCount }).map((_, key) => (
          <ErrorBoundary key={key} fallback={(props) => <div>{props.error.message}</div>}>
            <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
              <div>{TEXT}</div>
            </ThrowError>
          </ErrorBoundary>
        ))}
      </ErrorBoundaryGroup>
    )

    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    await waitFor(() => expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(innerErrorBoundaryCount))
    ThrowError.reset()

    fireEvent.click(screen.getByRole('button', { name: resetButtonText }))
    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
  })

  it('should reset all ErrorBoundaries in children even if it is nested, but if use blockOutside, can block reset by outside', async () => {
    render(
      <ErrorBoundaryGroup>
        <ErrorBoundaryGroup.Consumer>
          {(group) => <button onClick={group.reset}>{resetButtonText}</button>}
        </ErrorBoundaryGroup.Consumer>
        {Array.from({ length: innerErrorBoundaryCount }).map((_, index) => (
          <ErrorBoundaryGroup key={index} blockOutside={index === innerErrorBoundaryCount - 1}>
            <ErrorBoundary fallback={(props) => <div>{props.error.message}</div>}>
              <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
                <div>{TEXT}</div>
              </ThrowError>
            </ErrorBoundary>
          </ErrorBoundaryGroup>
        ))}
      </ErrorBoundaryGroup>
    )

    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    await waitFor(() => expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(innerErrorBoundaryCount))
    ThrowError.reset()

    fireEvent.click(screen.getByRole('button', { name: resetButtonText }))
    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount - 1)
    expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(1)
  })
})

describe('useErrorBoundaryGroup', () => {
  it('should throw error without ErrorBoundaryGroup in parent', () => {
    expect(() =>
      render(
        createElement(() => {
          useErrorBoundaryGroup()
          return <></>
        })
      )
    ).toThrow(useErrorBoundaryGroup_this_hook_should_be_called_in_ErrorBoundary_props_children)
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
