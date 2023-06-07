import { act, render, screen, waitFor } from '@testing-library/react'
import { Delay, withDelay } from './Delay'

const delayMs = 1000

const INNER_TEXT = 'Child Component'
const ChildComponent = () => <div>{INNER_TEXT}</div>

const TestComponent = () => (
  <Delay ms={delayMs}>
    <ChildComponent />
  </Delay>
)

describe('Delay', () => {
  it('renders the children after the delay', async () => {
    jest.useFakeTimers()

    render(<TestComponent />)

    expect(screen.queryByText(INNER_TEXT)).not.toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(delayMs)
    })

    await waitFor(() => {
      expect(screen.queryByText(INNER_TEXT)).toBeInTheDocument()
    })
  })
})

describe('withDelay', () => {
  it('renders the children after the delay with component', async () => {
    jest.useFakeTimers()

    const WrapperComponent = withDelay(() => <ChildComponent />, { ms: delayMs })

    render(<WrapperComponent />)

    expect(screen.queryByText(INNER_TEXT)).not.toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(delayMs)
    })

    await waitFor(() => {
      expect(screen.queryByText(INNER_TEXT)).toBeInTheDocument()
    })
  })
})
