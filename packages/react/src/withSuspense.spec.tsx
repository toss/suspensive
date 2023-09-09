import { render, screen, waitFor } from '@testing-library/react'
import { FALLBACK, MS_100, Suspend, TEXT } from './utils.spec'
import { withSuspense } from '.'

const SuspendDuring100msToShowTEXTInSuspense = withSuspense(() => <Suspend during={MS_100} toShow={TEXT} />, {
  fallback: FALLBACK,
})
const SuspendDuring100msToShowTEXTInSuspenseCSROnly = withSuspense.CSROnly(
  () => <Suspend during={MS_100} toShow={TEXT} />,
  { fallback: FALLBACK }
)

describe('withSuspense', () => {
  beforeEach(Suspend.reset)

  it('should wrap component by Suspense', async () => {
    vi.useFakeTimers()
    render(<SuspendDuring100msToShowTEXTInSuspense />)
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    vi.advanceTimersByTime(MS_100)
    await waitFor(() => expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument())
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })

  it('.CSROnly should wrap component by Suspense.CSROnly', async () => {
    vi.useFakeTimers()
    render(<SuspendDuring100msToShowTEXTInSuspenseCSROnly />)
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    vi.advanceTimersByTime(MS_100)
    await waitFor(() => expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument())
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })
})
