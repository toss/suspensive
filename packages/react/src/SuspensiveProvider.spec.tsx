import { render, screen, waitFor } from '@testing-library/react'
import { Delay } from './Delay'
import { Suspense } from './Suspense'
import { SuspensiveConfigs, SuspensiveProvider } from './SuspensiveProvider'

const ms = 1000
const TEXT = 'Child'
const FALLBACK = 'Fallback'

const Throw = () => {
  throw new Promise((resolve) => resolve('resolved'))
}

describe('SuspensiveProvider', () => {
  it('should provide default ms prop of Delay', async () => {
    jest.useFakeTimers()
    render(
      <SuspensiveProvider configs={new SuspensiveConfigs({ defaultOptions: { delay: { ms } } })}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    jest.advanceTimersByTime(ms)
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

  it('should accept defaultOptions.suspense.fallback to setup default fallback of Suspense. If Suspense accepted no fallback, Suspense should use default fallback', async () => {
    render(
      <SuspensiveProvider configs={new SuspensiveConfigs({ defaultOptions: { suspense: { fallback: FALLBACK } } })}>
        <Suspense>
          <Throw />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
  })
  it('should accept defaultOptions.suspense.fallback to setup default fallback of Suspense. If Suspense accepted local fallback, Suspense should ignore default fallback and show it', async () => {
    const LOCAL_FALLBACK = 'LOCAL_FALLBACK'
    render(
      <SuspensiveProvider configs={new SuspensiveConfigs({ defaultOptions: { suspense: { fallback: FALLBACK } } })}>
        <Suspense fallback={LOCAL_FALLBACK}>
          <Throw />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(LOCAL_FALLBACK)).toBeInTheDocument()
  })
  it('should accept defaultOptions.suspense.fallback to setup default fallback of Suspense. If Suspense accepted local fallback as null, Suspense should ignore default fallback. even though local fallback is nullish', async () => {
    render(
      <SuspensiveProvider configs={new SuspensiveConfigs({ defaultOptions: { suspense: { fallback: FALLBACK } } })}>
        <Suspense fallback={null}>
          <Throw />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })
})
