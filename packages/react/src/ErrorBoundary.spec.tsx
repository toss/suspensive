import { CustomError, ERROR_MESSAGE, FALLBACK, TEXT, ThrowError, ThrowNull } from '@suspensive/test-utils'
import { act, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import ms from 'ms'
import { type ComponentRef, createElement, createRef } from 'react'
import {
  ErrorBoundary,
  type ErrorBoundaryFallbackProps,
  useErrorBoundary,
  useErrorBoundaryFallbackProps,
} from './ErrorBoundary'
import { useTimeout } from './hooks'
import { SuspensiveError } from './models/SuspensiveError'

describe('<ErrorBoundary/>', () => {
  beforeEach(() => ThrowError.reset())

  it('should show children if no error but if error in children, catch it and show fallback and call onError', async () => {
    const onError = vi.fn()
    render(
      <ErrorBoundary onError={onError} fallback={<>{FALLBACK}</>}>
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      </ErrorBoundary>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(0)
    await waitFor(() => expect(screen.queryByText(FALLBACK)).toBeInTheDocument())
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('should show children if no error but if error in children, catch it and show fallback component', async () => {
    render(
      <ErrorBoundary fallback={(props) => <>{props.error.message}</>}>
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      </ErrorBoundary>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })

  it('requires fallback is set, if fallback is undefined, ErrorBoundary will rethrow error', () => {
    expect(() =>
      render(
        <ErrorBoundary fallback={undefined}>
          <ThrowError message={ERROR_MESSAGE} after={0} />
        </ErrorBoundary>
      )
    ).toThrow(ERROR_MESSAGE)
  })

  it('should catch it even if thrown null', async () => {
    const onError = vi.fn()
    render(
      <ErrorBoundary onError={onError} fallback={<>{FALLBACK}</>}>
        <ThrowNull after={ms('0.1s')}>{TEXT}</ThrowNull>
      </ErrorBoundary>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(0)
    await waitFor(() => expect(screen.queryByText(FALLBACK)).toBeInTheDocument())
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('should be reset by items of resetKeys, and call onReset', async () => {
    const onReset = vi.fn()
    const { rerender } = render(
      <ErrorBoundary resetKeys={[0]} fallback={(props) => props.error.message} onReset={onReset}>
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      </ErrorBoundary>
    )
    expect(onReset).toHaveBeenCalledTimes(0)
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(onReset).toHaveBeenCalledTimes(0)
    rerender(
      <ErrorBoundary resetKeys={[1]} fallback={(props) => props.error.message} onReset={onReset}>
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      </ErrorBoundary>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(onReset).toHaveBeenCalledTimes(1)

    // reset by resetKeys.length
  })

  it('should be reset by length of resetKeys, and call onReset', async () => {
    const onReset = vi.fn()
    const { rerender } = render(
      <ErrorBoundary resetKeys={[0]} fallback={(props) => props.error.message} onReset={onReset}>
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      </ErrorBoundary>
    )
    expect(onReset).toHaveBeenCalledTimes(0)
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(onReset).toHaveBeenCalledTimes(0)
    rerender(
      <ErrorBoundary resetKeys={[0, 1]} fallback={(props) => props.error.message} onReset={onReset}>
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      </ErrorBoundary>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('should be reset by render prop reset(), and call onReset', async () => {
    const onReset = vi.fn()
    const fallbackFn = vi.fn<(props: ErrorBoundaryFallbackProps) => undefined>()
    render(
      <ErrorBoundary fallback={fallbackFn} onReset={onReset}>
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      </ErrorBoundary>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).not.toBeInTheDocument())
    expect(onReset).toHaveBeenCalledTimes(0)
    expect(fallbackFn).toHaveBeenCalled()
    act(() => fallbackFn.mock.calls[0][0].reset())
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('should be reset by ref.reset(), and call onReset', async () => {
    const onReset = vi.fn()
    const ref = createRef<ComponentRef<typeof ErrorBoundary>>()
    render(
      <ErrorBoundary ref={ref} fallback={(props) => <>{props.error.message}</>} onReset={onReset}>
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      </ErrorBoundary>
    )

    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).not.toBeInTheDocument())
    expect(onReset).toHaveBeenCalledTimes(0)
    act(() => ref.current?.reset())
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('should catch Error by many criteria', async () => {
    const onErrorParent = vi.fn()
    const onErrorChild = vi.fn()

    render(
      <ErrorBoundary fallback={({ error }) => <>{error.message} of Parent</>} onError={onErrorParent}>
        <ErrorBoundary
          shouldCatch={[CustomError, (error) => error instanceof CustomError]}
          fallback={({ error }) => <>{error.message} of Child</>}
          onError={onErrorChild}
        >
          {createElement(() => {
            throw new Error(ERROR_MESSAGE)
          })}
        </ErrorBoundary>
      </ErrorBoundary>
    )

    expect(onErrorChild).toBeCalledTimes(0)
    expect(onErrorParent).toBeCalledTimes(1)
    await waitFor(() => expect(screen.queryByText(`${ERROR_MESSAGE} of Parent`)).toBeInTheDocument())
  })

  it('should catch Error by one criteria(ErrorConstructor)', async () => {
    const onErrorParent = vi.fn()
    const onErrorChild = vi.fn()

    render(
      <ErrorBoundary fallback={({ error }) => <>{error.message} of Parent</>} onError={onErrorParent}>
        <ErrorBoundary
          shouldCatch={CustomError}
          fallback={({ error }) => <>{error.message} of Child</>}
          onError={onErrorChild}
        >
          {createElement(() => {
            throw new Error(ERROR_MESSAGE)
          })}
        </ErrorBoundary>
      </ErrorBoundary>
    )

    expect(onErrorChild).toBeCalledTimes(0)
    expect(onErrorParent).toBeCalledTimes(1)
    await waitFor(() => expect(screen.queryByText(`${ERROR_MESSAGE} of Parent`)).toBeInTheDocument())
  })

  it('should catch Error by one criteria(ShouldCatchCallback)', async () => {
    const onErrorParent = vi.fn()
    const onErrorChild = vi.fn()

    render(
      <ErrorBoundary fallback={({ error }) => <>{error.message} of Parent</>} onError={onErrorParent}>
        <ErrorBoundary
          shouldCatch={(error) => error instanceof CustomError}
          fallback={({ error }) => <>{error.message} of Child</>}
          onError={onErrorChild}
        >
          {createElement(() => {
            throw new Error(ERROR_MESSAGE)
          })}
        </ErrorBoundary>
      </ErrorBoundary>
    )

    expect(onErrorChild).toBeCalledTimes(0)
    expect(onErrorParent).toBeCalledTimes(1)
    await waitFor(() => expect(screen.queryByText(`${ERROR_MESSAGE} of Parent`)).toBeInTheDocument())
  })

  it('should catch Error by one criteria(boolean)', async () => {
    const onErrorParent = vi.fn()
    const onErrorChild = vi.fn()

    render(
      <ErrorBoundary fallback={({ error }) => <>{error.message} of Parent</>} onError={onErrorParent}>
        <ErrorBoundary
          shouldCatch={false}
          fallback={({ error }) => <>{error.message} of Child</>}
          onError={onErrorChild}
        >
          {createElement(() => {
            throw new Error(ERROR_MESSAGE)
          })}
        </ErrorBoundary>
      </ErrorBoundary>
    )

    expect(onErrorChild).toBeCalledTimes(0)
    expect(onErrorParent).toBeCalledTimes(1)
    await waitFor(() => expect(screen.queryByText(`${ERROR_MESSAGE} of Parent`)).toBeInTheDocument())
  })
})

describe('<ErrorBoundary.Consumer/>', () => {
  it('should consume ErrorBoundaryContext like useErrorBoundary', async () => {
    const user = userEvent.setup()
    render(
      <ErrorBoundary fallback={({ error }) => <div>{error.message}</div>}>
        <ErrorBoundary.Consumer>
          {(errorBoundary) => (
            <button onClick={() => errorBoundary.setError(new Error(ERROR_MESSAGE))}>error maker</button>
          )}
        </ErrorBoundary.Consumer>
      </ErrorBoundary>
    )
    user.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument())
  })
})

describe('useErrorBoundary', () => {
  beforeEach(() => ThrowError.reset())

  it('should supply setError to set Error of ErrorBoundary manually', async () => {
    const onError = vi.fn()
    render(
      <ErrorBoundary
        onError={onError}
        fallback={function ErrorBoundaryFallback() {
          const props = useErrorBoundaryFallbackProps()
          useTimeout(props.reset, ms('0.1s'))
          return <>{props.error.message}</>
        }}
      >
        {createElement(() => {
          const errorBoundary = useErrorBoundary()
          useTimeout(() => errorBoundary.setError(new Error(ERROR_MESSAGE)), ms('0.1s'))
          return <>{TEXT}</>
        })}
      </ErrorBoundary>
    )

    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(0)

    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
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
    ).toThrow(SuspensiveError)
  })
})

describe('useErrorBoundaryFallbackProps', () => {
  beforeEach(() => ThrowError.reset())

  it('should supply reset function and error to reset in fallback of ErrorBoundary', async () => {
    const onReset = vi.fn()
    render(
      <ErrorBoundary
        onReset={onReset}
        fallback={function ErrorBoundaryFallback() {
          const props = useErrorBoundaryFallbackProps()
          useTimeout(props.reset, ms('0.1s'))

          return <>{props.error.message}</>
        }}
      >
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      </ErrorBoundary>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    expect(onReset).toHaveBeenCalledTimes(0)

    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(onReset).toHaveBeenCalledTimes(0)

    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('should guarantee hook calling position is in fallback of ErrorBoundary', () => {
    expect(() =>
      render(
        <ErrorBoundary fallback={(props) => <>{props.error.message}</>}>
          {createElement(() => {
            useErrorBoundaryFallbackProps()
            return <></>
          })}
        </ErrorBoundary>
      )
    ).toThrow(SuspensiveError)
  })
  it('should be prevented to be called outside fallback of ErrorBoundary', () => {
    expect(() =>
      render(
        createElement(() => {
          useErrorBoundaryFallbackProps()
          return <></>
        })
      )
    ).toThrow(SuspensiveError)
  })
  it("should be prevented to be called in children of ErrorBoundary (ErrorBoundary shouldn't catch SuspensiveError)", () => {
    expect(() =>
      render(
        <ErrorBoundary fallback={(props) => <>{props.error.message}</>}>
          {createElement(() => {
            useErrorBoundaryFallbackProps()
            return <></>
          })}
        </ErrorBoundary>
      )
    ).toThrow(SuspensiveError)
  })
})
