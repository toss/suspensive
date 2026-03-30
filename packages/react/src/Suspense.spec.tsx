import { act, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { DefaultProps, DefaultPropsProvider } from './DefaultProps'
import { Suspense } from './Suspense'
import { FALLBACK, Suspend, TEXT } from './test-utils'

describe('<Suspense/>', () => {
  beforeEach(() => vi.useFakeTimers())

  afterEach(() => {
    vi.useRealTimers()
    Suspend.reset()
  })

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
        <Suspend during={100} toShow={TEXT} />
      </Suspense>
    )

    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    await act(() => vi.advanceTimersByTime(100))
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
})

describe('<Suspense clientOnly/>', () => {
  beforeEach(() => vi.useFakeTimers())

  afterEach(() => {
    vi.useRealTimers()
    Suspend.reset()
  })

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
        <Suspend during={100} toShow={TEXT} />
      </Suspense>
    )

    await act(() => vi.advanceTimersByTime(100))
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
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
          <Suspend during={100} toShow={TEXT} />
        </Suspense>
      </DefaultPropsProvider>
    )

    expect(screen.queryByText('defaultFallback')).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })
})

describe('Suspense.with', () => {
  beforeEach(() => vi.useFakeTimers())

  afterEach(() => {
    vi.useRealTimers()
    Suspend.reset()
  })

  it('should wrap component by Suspense', async () => {
    render(createElement(Suspense.with({ fallback: FALLBACK }, () => <Suspend during={100} toShow={TEXT} />)))

    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    await act(() => vi.advanceTimersByTime(100))
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })

  it('should use default suspenseProps when {} is provided', () => {
    const Component = () => <div>{TEXT}</div>
    const Wrapped = Suspense.with({}, Component)

    render(<Wrapped />)

    expect(screen.getByText(TEXT)).toBeInTheDocument()
  })

  it('should set displayName based on Component.displayName', () => {
    const Component = () => <></>
    Component.displayName = 'Custom'

    expect(Suspense.with({}, Component).displayName).toBe('Suspense.with(Custom)')
    expect(Suspense.with({}, () => <></>).displayName).toBe('Suspense.with(Component)')
  })
})
