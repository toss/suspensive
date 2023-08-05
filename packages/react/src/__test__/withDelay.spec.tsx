import { render, act, screen, waitFor } from '@testing-library/react'
import { withDelay } from '../withDelay'
import { MS_100, TEXT } from './utils'

const TEXTAfterDelay100ms = withDelay(() => <>{TEXT}</>, { ms: MS_100 })

describe('withDelay', () => {
  it('renders the children after the delay with component', async () => {
    jest.useFakeTimers()
    render(<TEXTAfterDelay100ms />)
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => jest.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
})
