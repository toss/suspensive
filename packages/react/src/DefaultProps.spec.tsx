import { CustomError, FALLBACK, Suspend, TEXT } from '@suspensive/utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { createElement, useContext } from 'react'
import { DelayDefaultPropsContext, SuspenseDefaultPropsContext } from './contexts'
import { DefaultProps, DefaultPropsProvider } from './DefaultProps'
import { Delay, type DelayProps } from './Delay'
import { Message_DefaultProp_delay_ms_should_be_greater_than_0, SuspensiveError } from './models/SuspensiveError'
import { Suspense, type SuspenseProps } from './Suspense'

const FALLBACK_GLOBAL = 'FALLBACK_GLOBAL'

describe('<DefaultPropsProvider/>', () => {
  it('should provide default ms prop of Delay', async () => {
    render(
      <DefaultPropsProvider defaultProps={new DefaultProps({ delay: { ms: ms('0.1s') } })}>
        <Delay>{TEXT}</Delay>
      </DefaultPropsProvider>
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
  it('should accept defaultProps with nothing about Delay', () => {
    render(
      <DefaultPropsProvider defaultProps={new DefaultProps({})}>
        <Delay>{TEXT}</Delay>
      </DefaultPropsProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
  it('should accept empty defaultProps', () => {
    render(
      <DefaultPropsProvider defaultProps={new DefaultProps({})}>
        <Delay>{TEXT}</Delay>
      </DefaultPropsProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
  it('should accept no defaultProps', () => {
    render(
      <DefaultPropsProvider defaultProps={new DefaultProps()}>
        <Delay>{TEXT}</Delay>
      </DefaultPropsProvider>
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should accept defaultProps.suspense.fallback to setup default fallback of Suspense. If Suspense accepted no fallback, Suspense should use default fallback', () => {
    render(
      <DefaultPropsProvider defaultProps={new DefaultProps({ suspense: { fallback: FALLBACK_GLOBAL } })}>
        <Suspense>
          <Suspend during={Infinity} />
        </Suspense>
      </DefaultPropsProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).toBeInTheDocument()
  })
  it('should accept defaultProps.suspense.fallback to setup default fallback of Suspense. If Suspense accepted local fallback, Suspense should ignore default fallback and show it', () => {
    render(
      <DefaultPropsProvider defaultProps={new DefaultProps({ suspense: { fallback: FALLBACK_GLOBAL } })}>
        <Suspense fallback={FALLBACK}>
          <Suspend during={Infinity} />
        </Suspense>
      </DefaultPropsProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).not.toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
  })
  it('should accept defaultProps.suspense.fallback to setup default fallback of Suspense. If Suspense accepted local fallback as null, Suspense should ignore default fallback. even though local fallback is nullish', () => {
    render(
      <DefaultPropsProvider defaultProps={new DefaultProps({ suspense: { fallback: FALLBACK_GLOBAL } })}>
        <Suspense fallback={null}>
          <Suspend during={Infinity} />
        </Suspense>
      </DefaultPropsProvider>
    )
    expect(screen.queryByText(FALLBACK_GLOBAL)).not.toBeInTheDocument()
  })

  it('should accept defaultProps.suspense.clientOnly to setup default clientOnly prop of Suspense. If Suspense accept no clientOnly, Suspense should use default fallback', () => {
    let clientOnly1: SuspenseProps['clientOnly'] = undefined
    render(
      <DefaultPropsProvider defaultProps={new DefaultProps({ suspense: { clientOnly: true } })}>
        {createElement(() => {
          clientOnly1 = useContext(SuspenseDefaultPropsContext).clientOnly
          return <></>
        })}
      </DefaultPropsProvider>
    )
    expect(clientOnly1).toBe(true)

    let clientOnly2: SuspenseProps['clientOnly'] = undefined
    render(
      <DefaultPropsProvider defaultProps={new DefaultProps({ suspense: { clientOnly: false } })}>
        {createElement(() => {
          clientOnly2 = useContext(SuspenseDefaultPropsContext).clientOnly
          return <></>
        })}
      </DefaultPropsProvider>
    )
    expect(clientOnly2).toBe(false)

    const clientOnly3: SuspenseProps['clientOnly'] = undefined
    render(
      <DefaultPropsProvider defaultProps={new DefaultProps({ suspense: {} })}>
        {createElement(() => {
          clientOnly2 = useContext(SuspenseDefaultPropsContext).clientOnly
          return <></>
        })}
      </DefaultPropsProvider>
    )
    expect(clientOnly3).toBeUndefined()
  })

  it('should accept defaultOptions.delay.ms only positive number', () => {
    expect(() => new DefaultProps({ delay: { ms: 0 } })).toThrow(Message_DefaultProp_delay_ms_should_be_greater_than_0)
    try {
      new DefaultProps({ delay: { ms: 0 } })
    } catch (error) {
      expect(error).toBeInstanceOf(SuspensiveError)
      expect(error).toBeInstanceOf(Error)
      expect(error).not.toBeInstanceOf(CustomError)
    }

    expect(() => new DefaultProps({ delay: { ms: -1 } })).toThrow(Message_DefaultProp_delay_ms_should_be_greater_than_0)
    try {
      new DefaultProps({ delay: { ms: -1 } })
    } catch (error) {
      expect(error).toBeInstanceOf(SuspensiveError)
      expect(error).toBeInstanceOf(Error)
      expect(error).not.toBeInstanceOf(CustomError)
    }

    const defaultPropsMs = 100
    let ms: DelayProps['ms'] = undefined
    render(
      <DefaultPropsProvider defaultProps={new DefaultProps({ delay: { ms: defaultPropsMs } })}>
        {createElement(() => {
          ms = useContext(DelayDefaultPropsContext).ms
          return <></>
        })}
      </DefaultPropsProvider>
    )
    expect(ms).toBe(defaultPropsMs)
  })
})
