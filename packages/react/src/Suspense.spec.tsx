import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { createElement } from 'react'
import { DefaultProps, DefaultPropsProvider } from './DefaultProps'
import { Suspense } from './Suspense'
import { FALLBACK, Suspend, TEXT } from './test-utils'

describe('<Suspense/>', () => {
  beforeEach(() => Suspend.reset())

  it('should render the children if nothing to suspend', () => {
    render(<Suspense fallback={FALLBACK}>{TEXT}</Suspense>)
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })
  it('should render the fallback if something to suspend in children', () => {
    render(
      <Suspense fallback={FALLBACK}>
        <Suspend during={Infinity} toShow={TEXT} />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })
  it('should render the children after suspending', async () => {
    render(
      <Suspense>
        <Suspend during={ms('0.1s')} toShow={TEXT} />
      </Suspense>
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
})
describe('<Suspense clientOnly/>', () => {
  beforeEach(() => Suspend.reset())

  it('should render the fallback during suspending', () => {
    render(
      <Suspense clientOnly fallback={FALLBACK}>
        <Suspend during={Infinity} toShow={TEXT} />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })
  it('should render the children after the suspending', async () => {
    render(
      <Suspense clientOnly fallback={FALLBACK}>
        <Suspend during={ms('0.1s')} toShow={TEXT} />
      </Suspense>
    )
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })
  it('should render the children if nothing to suspend in children', () => {
    render(
      <Suspense clientOnly fallback={FALLBACK}>
        {TEXT}
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
  it('should use `defaultProps.fallback` if `fallback` is not provided', () => {
    const defaultProps = new DefaultProps({ Suspense: { fallback: 'defaultFallback' } })

    render(
      <DefaultPropsProvider defaultProps={defaultProps}>
        <Suspense clientOnly>
          <Suspend during={ms('0.1s')} toShow={TEXT} />
        </Suspense>
      </DefaultPropsProvider>
    )

    expect(screen.queryByText('defaultFallback')).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })
})
describe('Suspense.with', () => {
  beforeEach(() => Suspend.reset())

  it('should wrap component by Suspense', async () => {
    render(createElement(Suspense.with({ fallback: FALLBACK }, () => <Suspend during={ms('0.1s')} toShow={TEXT} />)))
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument())
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })

  it('should set displayName based on Component.displayName', () => {
    const Component = () => <></>
    Component.displayName = 'Custom'
    expect(Suspense.with({}, Component).displayName).toBe('Suspense.with(Custom)')
    expect(Suspense.with({}, () => <></>).displayName).toBe('Suspense.with(Component)')
  })
})
