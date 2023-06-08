import { render, act, screen, waitFor } from '@testing-library/react'
import { withDelay } from './withDelay'

const ms = 1000
const TEXT = 'Child'

describe('withDelay', () => {
  it('renders the children after the delay with component', async () => {
    jest.useFakeTimers()
    const Wrapped = withDelay(() => <>{TEXT}</>, { ms })
    render(<Wrapped />)
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => jest.advanceTimersByTime(ms))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
})
