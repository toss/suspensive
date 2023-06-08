import { act, render, screen, waitFor } from '@testing-library/react'
import { Delay } from './Delay'

const ms = 1000
const TEXT = 'Child'

describe('Delay', () => {
  it('should render the children after the delay', async () => {
    jest.useFakeTimers()
    render(<Delay ms={ms}>{TEXT}</Delay>)
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => jest.advanceTimersByTime(ms))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })

  it('should render the children directly if no ms prop', () => {
    render(<Delay>{TEXT}</Delay>)
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
})
