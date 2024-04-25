import { ERROR_MESSAGE, FALLBACK, Suspend, TEXT, ThrowError } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { AsyncBoundary } from './AsyncBoundary'

describe('<AsyncBoundary/>', () => {
  beforeEach(() => {
    ThrowError.reset()
    Suspend.reset()
  })

  it('should render the children if nothing to suspend', () => {
    const onError = vi.fn()
    render(
      <AsyncBoundary pendingFallback={FALLBACK} rejectedFallback={ERROR_MESSAGE} onError={onError}>
        {TEXT}
      </AsyncBoundary>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(0)
  })
  it('should render the pendingFallback if something to suspend in children', () => {
    const onError = vi.fn()
    render(
      <AsyncBoundary pendingFallback={FALLBACK} rejectedFallback={ERROR_MESSAGE} onError={onError}>
        <Suspend during={Infinity} toShow={TEXT} />
      </AsyncBoundary>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(0)
  })
  it('should render rejectedFallback if error is caught in children', async () => {
    const onError = vi.fn()
    render(
      <AsyncBoundary pendingFallback={FALLBACK} rejectedFallback={ERROR_MESSAGE} onError={onError}>
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      </AsyncBoundary>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(0)
    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(1)
  })
})

describe('<AsyncBoundary.CSROnly/>', () => {
  beforeEach(() => {
    ThrowError.reset()
    Suspend.reset()
  })

  it('should render the children if nothing to suspend', () => {
    const onError = vi.fn()
    render(
      <AsyncBoundary.CSROnly pendingFallback={FALLBACK} rejectedFallback={ERROR_MESSAGE} onError={onError}>
        {TEXT}
      </AsyncBoundary.CSROnly>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(0)
  })
  it('should render the pendingFallback if something to suspend in children', () => {
    const onError = vi.fn()
    render(
      <AsyncBoundary.CSROnly pendingFallback={FALLBACK} rejectedFallback={ERROR_MESSAGE} onError={onError}>
        <Suspend during={Infinity} toShow={TEXT} />
      </AsyncBoundary.CSROnly>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(0)
  })
  it('should render rejectedFallback if error is caught in children', async () => {
    const onError = vi.fn()
    render(
      <AsyncBoundary.CSROnly pendingFallback={FALLBACK} rejectedFallback={ERROR_MESSAGE} onError={onError}>
        <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
          {TEXT}
        </ThrowError>
      </AsyncBoundary.CSROnly>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(0)
    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(onError).toHaveBeenCalledTimes(1)
  })
})
