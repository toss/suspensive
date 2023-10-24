import { FALLBACK, MS_100, Suspend, TEXT } from '@suspensive/test-utils'
import { act, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { Delay, Suspense, Suspensive, SuspensiveProvider } from '.'

const FALLBACK_GLOBAL = 'FALLBACK_GLOBAL'

describe('<SuspensiveProvider/>', () => {
  it('should provide default ms prop of Delay', async () => {
    vi.useFakeTimers()
    render(
      <SuspensiveProvider value={new Suspensive({ defaultOptions: { delay: { ms: MS_100 } } })}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(MS_100))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
  it('should accept suspensive value with nothing about Delay', () => {
    render(
      <SuspensiveProvider value={new Suspensive({ defaultOptions: {} })}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
  it('should accept empty suspensive value', () => {
    render(
      <SuspensiveProvider value={new Suspensive({})}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
  it('should accept no suspensive value', () => {
    render(
      <SuspensiveProvider value={new Suspensive()}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should accept defaultOptions.suspense.fallback to setup default fallback of Suspense. If Suspense accepted no fallback, Suspense should use default fallback', async () => {
    render(
      <SuspensiveProvider value={new Suspensive({ defaultOptions: { suspense: { fallback: FALLBACK_GLOBAL } } })}>
        <Suspense>
          <Suspend during={Infinity} />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).toBeInTheDocument()
  })
  it('should accept defaultOptions.suspense.fallback to setup default fallback of Suspense. If Suspense accepted local fallback, Suspense should ignore default fallback and show it', async () => {
    render(
      <SuspensiveProvider value={new Suspensive({ defaultOptions: { suspense: { fallback: FALLBACK_GLOBAL } } })}>
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
      <SuspensiveProvider value={new Suspensive({ defaultOptions: { suspense: { fallback: FALLBACK_GLOBAL } } })}>
        <Suspense fallback={null}>
          <Suspend during={Infinity} />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).not.toBeInTheDocument()
  })
})
