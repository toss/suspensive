import { act, render, screen, waitFor } from '@testing-library/react'
import { MS_100, TEXT } from './utils/toTest'
import { Delay } from '.'

describe('Delay', () => {
  it('should render the children after the delay', async () => {
    vi.useFakeTimers()
    render(<Delay ms={MS_100}>{TEXT}</Delay>)
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
  it('should render the children directly if no ms prop', () => {
    render(<Delay>{TEXT}</Delay>)
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
})
