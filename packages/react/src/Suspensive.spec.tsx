import { FALLBACK, Suspend, TEXT } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { createElement, useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { SuspenseDefaultPropsContext } from './contexts'
import { Delay } from './Delay'
import { Suspense, type SuspenseProps } from './Suspense'
import { Suspensive, SuspensiveProvider } from './Suspensive'

const FALLBACK_GLOBAL = 'FALLBACK_GLOBAL'

describe('<SuspensiveProvider/>', () => {
  it('should provide default ms prop of Delay', async () => {
    render(
      <SuspensiveProvider value={new Suspensive({ defaultOptions: { delay: { ms: ms('0.1s') } } })}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
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

  it('should accept defaultOptions.suspense.fallback to setup default fallback of Suspense. If Suspense accepted no fallback, Suspense should use default fallback', () => {
    render(
      <SuspensiveProvider value={new Suspensive({ defaultOptions: { suspense: { fallback: FALLBACK_GLOBAL } } })}>
        <Suspense>
          <Suspend during={Infinity} />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).toBeInTheDocument()
  })
  it('should accept defaultOptions.suspense.fallback to setup default fallback of Suspense. If Suspense accepted local fallback, Suspense should ignore default fallback and show it', () => {
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
  it('should accept defaultOptions.suspense.fallback to setup default fallback of Suspense. If Suspense accepted local fallback as null, Suspense should ignore default fallback. even though local fallback is nullish', () => {
    render(
      <SuspensiveProvider value={new Suspensive({ defaultOptions: { suspense: { fallback: FALLBACK_GLOBAL } } })}>
        <Suspense fallback={null}>
          <Suspend during={Infinity} />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).not.toBeInTheDocument()
  })

  it('should accept defaultOptions.suspense.clientOnly to setup default clientOnly prop of Suspense. If Suspense accept no clientOnly, Suspense should use default fallback', () => {
    let clientOnly1: SuspenseProps['clientOnly'] = undefined
    render(
      <SuspensiveProvider value={new Suspensive({ defaultOptions: { suspense: { clientOnly: true } } })}>
        {createElement(() => {
          clientOnly1 = useContext(SuspenseDefaultPropsContext).clientOnly
          return <></>
        })}
      </SuspensiveProvider>
    )
    expect(clientOnly1).toBe(true)

    let clientOnly2: SuspenseProps['clientOnly'] = undefined
    render(
      <SuspensiveProvider value={new Suspensive({ defaultOptions: { suspense: { clientOnly: false } } })}>
        {createElement(() => {
          clientOnly2 = useContext(SuspenseDefaultPropsContext).clientOnly
          return <></>
        })}
      </SuspensiveProvider>
    )
    expect(clientOnly2).toBe(false)

    const clientOnly3: SuspenseProps['clientOnly'] = undefined
    render(
      <SuspensiveProvider value={new Suspensive({ defaultOptions: { suspense: {} } })}>
        {createElement(() => {
          clientOnly2 = useContext(SuspenseDefaultPropsContext).clientOnly
          return <></>
        })}
      </SuspensiveProvider>
    )
    expect(clientOnly3).toBeUndefined()
  })
})
