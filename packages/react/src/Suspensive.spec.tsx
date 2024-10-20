import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { createElement, useContext } from 'react'
import { DelayDefaultPropsContext, SuspenseDefaultPropsContext } from './contexts'
import { Delay, type DelayProps } from './Delay'
import { Message_DefaultProp_delay_ms_should_be_greater_than_0, SuspensiveError } from './models/SuspensiveError'
import { Suspense, type SuspenseProps } from './Suspense'
import { Suspensive, SuspensiveProvider } from './Suspensive'
import { CustomError, FALLBACK, Suspend, TEXT } from './test-utils'

const FALLBACK_GLOBAL = 'FALLBACK_GLOBAL'

describe('<SuspensiveProvider/>', () => {
  it('should provide default ms prop of Delay', async () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      <SuspensiveProvider value={new Suspensive({ defaultProps: { delay: { ms: ms('0.1s') } } })}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
  it('should accept suspensive value with nothing about Delay', () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      <SuspensiveProvider value={new Suspensive({ defaultProps: {} })}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
  it('should accept empty suspensive value', () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      <SuspensiveProvider value={new Suspensive({})}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
  it('should accept no suspensive value', () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      <SuspensiveProvider value={new Suspensive()}>
        <Delay>{TEXT}</Delay>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should accept defaultProps.suspense.fallback to setup default fallback of Suspense. If Suspense accepted no fallback, Suspense should use default fallback', () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      <SuspensiveProvider value={new Suspensive({ defaultProps: { suspense: { fallback: FALLBACK_GLOBAL } } })}>
        <Suspense>
          <Suspend during={Infinity} />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).toBeInTheDocument()
  })
  it('should accept defaultProps.suspense.fallback to setup default fallback of Suspense. If Suspense accepted local fallback, Suspense should ignore default fallback and show it', () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      <SuspensiveProvider value={new Suspensive({ defaultProps: { suspense: { fallback: FALLBACK_GLOBAL } } })}>
        <Suspense fallback={FALLBACK}>
          <Suspend during={Infinity} />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).not.toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
  })
  it('should accept defaultProps.suspense.fallback to setup default fallback of Suspense. If Suspense accepted local fallback as null, Suspense should ignore default fallback. even though local fallback is nullish', () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      <SuspensiveProvider value={new Suspensive({ defaultProps: { suspense: { fallback: FALLBACK_GLOBAL } } })}>
        <Suspense fallback={null}>
          <Suspend during={Infinity} />
        </Suspense>
      </SuspensiveProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).not.toBeInTheDocument()
  })

  it('should accept defaultProps.suspense.clientOnly to setup default clientOnly prop of Suspense. If Suspense accept no clientOnly, Suspense should use default fallback', () => {
    let clientOnly1: SuspenseProps['clientOnly'] = undefined
    render(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      <SuspensiveProvider value={new Suspensive({ defaultProps: { suspense: { clientOnly: true } } })}>
        {createElement(() => {
          clientOnly1 = useContext(SuspenseDefaultPropsContext).clientOnly
          return <></>
        })}
      </SuspensiveProvider>
    )
    expect(clientOnly1).toBe(true)

    let clientOnly2: SuspenseProps['clientOnly'] = undefined
    render(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      <SuspensiveProvider value={new Suspensive({ defaultProps: { suspense: { clientOnly: false } } })}>
        {createElement(() => {
          clientOnly2 = useContext(SuspenseDefaultPropsContext).clientOnly
          return <></>
        })}
      </SuspensiveProvider>
    )
    expect(clientOnly2).toBe(false)

    const clientOnly3: SuspenseProps['clientOnly'] = undefined
    render(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      <SuspensiveProvider value={new Suspensive({ defaultProps: { suspense: {} } })}>
        {createElement(() => {
          clientOnly2 = useContext(SuspenseDefaultPropsContext).clientOnly
          return <></>
        })}
      </SuspensiveProvider>
    )
    expect(clientOnly3).toBeUndefined()
  })

  it('should accept defaultOptions.delay.ms only positive number', () => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expect(() => new Suspensive({ defaultProps: { delay: { ms: 0 } } })).toThrow(
      Message_DefaultProp_delay_ms_should_be_greater_than_0
    )
    try {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      new Suspensive({ defaultProps: { delay: { ms: 0 } } })
    } catch (error) {
      expect(error).toBeInstanceOf(SuspensiveError)
      expect(error).toBeInstanceOf(Error)
      expect(error).not.toBeInstanceOf(CustomError)
    }

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expect(() => new Suspensive({ defaultProps: { delay: { ms: -1 } } })).toThrow(
      Message_DefaultProp_delay_ms_should_be_greater_than_0
    )
    try {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      new Suspensive({ defaultProps: { delay: { ms: -1 } } })
    } catch (error) {
      expect(error).toBeInstanceOf(SuspensiveError)
      expect(error).toBeInstanceOf(Error)
      expect(error).not.toBeInstanceOf(CustomError)
    }

    const defaultPropsMs = 100
    let ms: DelayProps['ms'] = undefined
    render(
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      <SuspensiveProvider value={new Suspensive({ defaultProps: { delay: { ms: defaultPropsMs } } })}>
        {createElement(() => {
          ms = useContext(DelayDefaultPropsContext).ms
          return <></>
        })}
      </SuspensiveProvider>
    )
    expect(ms).toBe(defaultPropsMs)
  })
})
