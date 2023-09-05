import { act, render, screen, waitFor } from '@testing-library/react'
import { withDelay } from '..'
import { MS_100, TEXT } from './utils'

const TEXTAfterDelay100ms = withDelay(() => <>{TEXT}</>, { ms: MS_100 })

describe('withDelay', () => {
  it('renders the children after the delay with component', async () => {
    vi.useFakeTimers()
    render(<TEXTAfterDelay100ms />)
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
})
