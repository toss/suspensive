import { FALLBACK, Suspend, TEXT } from '@suspensive/test-utils'
import { act, render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { createElement } from 'react'
import { vi } from 'vitest'
import { Suspense, withSuspense } from '.'

describe('<Suspense/>', () => {
  beforeEach(Suspend.reset)

  it('should render the children if nothing to suspend', async () => {
    render(<Suspense fallback={FALLBACK}>{TEXT}</Suspense>)
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })
  it('should render the fallback if something to suspend in children', async () => {
    render(
      <Suspense fallback={FALLBACK}>
        <Suspend during={Infinity} toShow={TEXT} />
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })
  it('should render the children after suspending', async () => {
    vi.useFakeTimers()
    render(
      <Suspense>
        <Suspend during={ms('0.1s')} toShow={TEXT} />
      </Suspense>
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(ms('0.1s')))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
})
describe('<Suspense.CSROnly/>', () => {
  beforeEach(Suspend.reset)

  it('should render the fallback during suspending', () => {
    render(
      <Suspense.CSROnly fallback={FALLBACK}>
        <Suspend during={Infinity} toShow={TEXT} />
      </Suspense.CSROnly>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })
  it('should render the children after the suspending', async () => {
    vi.useFakeTimers()
    render(
      <Suspense.CSROnly fallback={FALLBACK}>
        <Suspend during={ms('0.1s')} toShow={TEXT} />
      </Suspense.CSROnly>
    )
    vi.advanceTimersByTime(ms('0.1s'))
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })
  it('should render the children if nothing to suspend in children', async () => {
    render(<Suspense.CSROnly fallback={FALLBACK}>{TEXT}</Suspense.CSROnly>)
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
})

describe('withSuspense', () => {
  beforeEach(Suspend.reset)

  it('should wrap component by Suspense', async () => {
    vi.useFakeTimers()
    render(
      createElement(
        withSuspense(() => <Suspend during={ms('0.1s')} toShow={TEXT} />, {
          fallback: FALLBACK,
        })
      )
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    vi.advanceTimersByTime(ms('0.1s'))
    await waitFor(() => expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument())
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })

  it('should set displayName based on Component.displayName', () => {
    const TestComponentWithDisplayName = () => <>{TEXT}</>
    TestComponentWithDisplayName.displayName = 'TestDisplayName'
    expect(withSuspense(TestComponentWithDisplayName).displayName).toBe('withSuspense(TestDisplayName)')
    expect(withSuspense(() => <>{TEXT}</>).displayName).toBe('withSuspense(Component)')
  })
})
describe('withSuspense.CSROnly', () => {
  beforeEach(Suspend.reset)

  it('should wrap component by Suspense.CSROnly', async () => {
    vi.useFakeTimers()
    render(
      createElement(
        withSuspense.CSROnly(() => <Suspend during={ms('0.1s')} toShow={TEXT} />, {
          fallback: FALLBACK,
        })
      )
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    vi.advanceTimersByTime(ms('0.1s'))
    await waitFor(() => expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument())
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })

  it('should set displayName based on Component.displayName', () => {
    const TestComponentWithDisplayName = () => <>{TEXT}</>
    TestComponentWithDisplayName.displayName = 'TestDisplayName'
    expect(withSuspense.CSROnly(TestComponentWithDisplayName).displayName).toBe('withSuspense.CSROnly(TestDisplayName)')
    expect(withSuspense.CSROnly(() => <>{TEXT}</>).displayName).toBe('withSuspense.CSROnly(Component)')
  })
})
