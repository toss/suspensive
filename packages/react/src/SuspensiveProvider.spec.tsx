import { act, render, screen, waitFor } from '@testing-library/react'
import { Delay } from './Delay'
import { SuspensiveConfigs, SuspensiveProvider } from './SuspensiveProvider'

const ms = 1000
const TEXT = 'Child'

describe('SuspensiveProvider', () => {
  it('should provide default ms prop of Delay', async () => {
    jest.useFakeTimers()
    render(
      <SuspensiveProvider configs={new SuspensiveConfigs({ defaultOptions: { delay: { ms } } })}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => jest.advanceTimersByTime(ms))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
  it('should accept configs with nothing about Delay', () => {
    render(
      <SuspensiveProvider configs={new SuspensiveConfigs({ defaultOptions: {} })}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
  it('should accept empty configs', () => {
    render(
      <SuspensiveProvider configs={new SuspensiveConfigs({})}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
  it('should accept no configs', () => {
    render(
      <SuspensiveProvider configs={new SuspensiveConfigs()}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
})
