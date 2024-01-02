import { FALLBACK, Suspend, TEXT } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { createElement } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { Suspense, withSuspense } from '.'

const resetBeforeEach = () => beforeEach(() => Suspend.reset())

describe('<Suspense/>', () => {
  resetBeforeEach()

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
describe('<Suspense.CSROnly/>', () => {
  resetBeforeEach()

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
    render(
      <Suspense.CSROnly fallback={FALLBACK}>
        <Suspend during={ms('0.1s')} toShow={TEXT} />
      </Suspense.CSROnly>
    )
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })
  it('should render the children if nothing to suspend in children', () => {
    render(<Suspense.CSROnly fallback={FALLBACK}>{TEXT}</Suspense.CSROnly>)
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
})

describe('withSuspense', () => {
  resetBeforeEach()

  it('should wrap component by Suspense', async () => {
    render(
      createElement(
        withSuspense(() => <Suspend during={ms('0.1s')} toShow={TEXT} />, {
          fallback: FALLBACK,
        })
      )
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
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
  resetBeforeEach()

  it('should wrap component by Suspense.CSROnly', async () => {
    render(
      createElement(
        withSuspense.CSROnly(() => <Suspend during={ms('0.1s')} toShow={TEXT} />, {
          fallback: FALLBACK,
        })
      )
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
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

// TODO: remvoe below
/* eslint-disable vitest/no-commented-out-tests */
// describe('devMode', () => {
//   beforeEach(() => devMode.off())

//   it('should make <Suspense devMode={{ showFallback: true }} /> show fallback to develop loading or skeleton easily', async () => {
//     devMode.on()
//     render(
//       <Suspense fallback={FALLBACK} devMode={{ showFallback: true }}>
//         {TEXT}
//       </Suspense>
//     )
//     expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
//     expect(screen.queryByText(TEXT)).not.toBeInTheDocument()

//     await waitFor(() => expect(screen.queryByText(FALLBACK)).toBeInTheDocument())
//     expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
//     expect(screen.queryByText(FALLBACK)).toBeInTheDocument()

//     await waitFor(() => expect(screen.queryByText(FALLBACK)).toBeInTheDocument())
//     expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
//   })

//   it(".off should make <Suspense devMode={{ showFallback: true }} />'s devMode off", () => {
//     const { rerender } = render(
//       <Suspense fallback={FALLBACK} devMode={{ showFallback: true }}>
//         {TEXT}
//       </Suspense>
//     )
//     expect(screen.queryByText(TEXT)).toBeInTheDocument()
//     expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()

//     devMode.on()
//     rerender(
//       <Suspense fallback={FALLBACK} devMode={{ showFallback: true }}>
//         {TEXT}
//       </Suspense>
//     )
//     expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
//     expect(screen.queryByText(TEXT)).not.toBeInTheDocument()

//     devMode.off()
//     rerender(
//       <Suspense fallback={FALLBACK} devMode={{ showFallback: true }}>
//         {TEXT}
//       </Suspense>
//     )
//     expect(screen.queryByText(TEXT)).toBeInTheDocument()
//     expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
//   })
// })
