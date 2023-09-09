import { act, render, screen, waitFor } from '@testing-library/react'
import { FALLBACK, MS_100, Suspend, TEXT } from './utils/toTest'
import { Suspense } from '.'

describe('Suspense', () => {
  beforeEach(Suspend.reset)

  it('should render the children if nothing to suspend', async () => {
    render(<Suspense fallback={FALLBACK}>{TEXT}</Suspense>)
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })
  it('should render the fallback if something to suspend in children', async () => {
    render(
      <Suspense fallback={FALLBACK}>
        <Suspend during={Infinity} toShow={TEXT} />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })
  it('should render the children after the suspense', async () => {
    vi.useFakeTimers()
    render(
      <Suspense>
        <Suspend during={MS_100} toShow={TEXT} />
      </Suspense>
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })

  it('.CSROnly should render the fallback during suspense', () => {
    render(
      <Suspense.CSROnly fallback={FALLBACK}>
        <Suspend during={Infinity} toShow={TEXT} />
      </Suspense.CSROnly>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })
  it('.CSROnly should render the children after the suspense', async () => {
    vi.useFakeTimers()
    render(
      <Suspense.CSROnly fallback={FALLBACK}>
        <Suspend during={MS_100} toShow={TEXT} />
      </Suspense.CSROnly>
    )
    vi.advanceTimersByTime(MS_100)
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })
  it('.CSROnly should render the children if nothing to suspend in children', async () => {
    render(<Suspense.CSROnly fallback={FALLBACK}>{TEXT}</Suspense.CSROnly>)
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
})
