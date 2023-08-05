import { withSuspense } from '../withSuspense'
import { render, screen, waitFor } from '@testing-library/react'
import { Suspend, TEXT, FALLBACK, MS_100 } from './utils'

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
    jest.useFakeTimers()
    render(<SuspendDuring100msToShowTEXTInSuspense />)
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    jest.advanceTimersByTime(MS_100)
    await waitFor(() => expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument())
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })

  it('.CSROnly should wrap component by Suspense.CSROnly', async () => {
    jest.useFakeTimers()
    render(<SuspendDuring100msToShowTEXTInSuspenseCSROnly />)
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    jest.advanceTimersByTime(MS_100)
    await waitFor(() => expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument())
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })
})
