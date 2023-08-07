import { act, render, screen, waitFor } from '@testing-library/react'
import { Delay } from '../Delay'
import { TEXT, MS_100 } from './utils'

describe('Delay', () => {
  it('should render the children after the delay', async () => {
    jest.useFakeTimers()
    render(<Delay ms={MS_100}>{TEXT}</Delay>)
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => jest.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
  it('should render the children directly if no ms prop', () => {
    render(<Delay>{TEXT}</Delay>)
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
})
