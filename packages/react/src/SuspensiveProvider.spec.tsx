import { act, render, screen, waitFor } from '@testing-library/react'
import { Delay } from './Delay'
import { Suspense } from './Suspense'
import { SuspensiveConfigs, SuspensiveProvider } from './SuspensiveProvider'
import { MS_100, TEXT, FALLBACK, Suspend } from './test-utils'

const FALLBACK_GLOBAL = 'FALLBACK_GLOBAL'

describe('SuspensiveProvider', () => {
  it('should provide default ms prop of Delay', async () => {
    jest.useFakeTimers()
    render(
      <SuspensiveProvider configs={new SuspensiveConfigs({ defaultOptions: { delay: { ms: MS_100 } } })}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => jest.advanceTimersByTime(MS_100))
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
      <SuspensiveProvider
        configs={new SuspensiveConfigs({ defaultOptions: { suspense: { fallback: FALLBACK_GLOBAL } } })}
      >
        <Suspense>
          <Suspend during={Infinity} />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).toBeInTheDocument()
  })
  it('should accept defaultOptions.suspense.fallback to setup default fallback of Suspense. If Suspense accepted local fallback, Suspense should ignore default fallback and show it', async () => {
    render(
      <SuspensiveProvider
        configs={new SuspensiveConfigs({ defaultOptions: { suspense: { fallback: FALLBACK_GLOBAL } } })}
      >
        <Suspense fallback={FALLBACK}>
          <Suspend during={Infinity} />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).not.toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
  })
  it('should accept defaultOptions.suspense.fallback to setup default fallback of Suspense. If Suspense accepted local fallback as null, Suspense should ignore default fallback. even though local fallback is nullish', async () => {
    render(
      <SuspensiveProvider
        configs={new SuspensiveConfigs({ defaultOptions: { suspense: { fallback: FALLBACK_GLOBAL } } })}
      >
        <Suspense fallback={null}>
          <Suspend during={Infinity} />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).not.toBeInTheDocument()
  })
})
