import { CustomError, ERROR_MESSAGE, TEXT, Throw } from '@suspensive/utils'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { createElement } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { ErrorBoundaryGroup, useErrorBoundaryGroup } from './ErrorBoundaryGroup'
import {
  Message_useErrorBoundaryGroup_this_hook_should_be_called_in_ErrorBoundary_props_children,
  SuspensiveError,
} from './models/SuspensiveError'

const innerErrorBoundaryCount = 3
const resetButtonText = 'reset button'

describe('<ErrorBoundaryGroup/>', () => {
  beforeEach(() => Throw.reset())

  it('should reset all ErrorBoundaries in children', async () => {
    render(
      <ErrorBoundaryGroup>
        <ErrorBoundaryGroup.Consumer>
          {(group) => <button onClick={group.reset}>{resetButtonText}</button>}
        </ErrorBoundaryGroup.Consumer>
        {Array.from({ length: innerErrorBoundaryCount }).map((_, i) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key, @eslint-react/no-duplicate-key
          <ErrorBoundary key={i} fallback={(props) => <div>{props.error.message}</div>}>
            <Throw.Error message={ERROR_MESSAGE} after={ms('0.1s')}>
              <div>{TEXT}</div>
            </Throw.Error>
          </ErrorBoundary>
        ))}
      </ErrorBoundaryGroup>
    )

    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    await waitFor(() => expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(innerErrorBoundaryCount))

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
        {Array.from({ length: innerErrorBoundaryCount }).map((_, i) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key, @eslint-react/no-duplicate-key
          <ErrorBoundaryGroup key={i} blockOutside={i === innerErrorBoundaryCount - 1}>
            <ErrorBoundary fallback={(props) => <div>{props.error.message}</div>}>
              <Throw.Error message={ERROR_MESSAGE} after={ms('0.1s')}>
                <div>{TEXT}</div>
              </Throw.Error>
            </ErrorBoundary>
          </ErrorBoundaryGroup>
        ))}
      </ErrorBoundaryGroup>
    )

    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount)
    await waitFor(() => expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(innerErrorBoundaryCount))

    fireEvent.click(screen.getByRole('button', { name: resetButtonText }))
    expect(screen.getAllByText(TEXT).length).toBe(innerErrorBoundaryCount - 1)
    expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(1)
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
