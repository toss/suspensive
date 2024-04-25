import { ERROR_MESSAGE, FALLBACK, Suspend, TEXT, ThrowError } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { createElement } from 'react'
import { useErrorBoundaryGroup } from './ErrorBoundaryGroup'
import { withAsyncBoundary, withDelay, withErrorBoundary, withErrorBoundaryGroup, withSuspense } from './wrap'

describe('withSuspense', () => {
  beforeEach(() => Suspend.reset())

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
    const Component = () => <></>
    Component.displayName = 'Custom'
    expect(withSuspense(Component).displayName).toBe('withSuspense(Custom)')
    expect(withSuspense(() => <></>).displayName).toBe('withSuspense(Component)')
  })
})
describe('withSuspense.CSROnly', () => {
  beforeEach(() => Suspend.reset())

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
    const Component = () => <></>
    Component.displayName = 'Custom'
    expect(withSuspense.CSROnly(Component).displayName).toBe('withSuspense.CSROnly(Custom)')
    expect(withSuspense.CSROnly(() => <></>).displayName).toBe('withSuspense.CSROnly(Component)')
  })
})

describe('withErrorBoundary', () => {
  beforeEach(() => ThrowError.reset())

  it("should render the wrapped component when there's no error", () => {
    render(
      createElement(
        withErrorBoundary(() => <>{TEXT}</>, {
          fallback: (props) => <>{props.error.message}</>,
        })
      )
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should render the fallback when there`s an error in the wrapped component', async () => {
    render(
      createElement(
        withErrorBoundary(
          () => (
            <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
              {TEXT}
            </ThrowError>
          ),
          { fallback: (props) => <>{props.error.message}</> }
        )
      )
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())
  })

  it('should set displayName based on Component.displayName', () => {
    const Component = () => <></>
    Component.displayName = 'Custom'
    expect(withErrorBoundary(Component, { fallback: () => <></> }).displayName).toBe('withErrorBoundary(Custom)')
    expect(withErrorBoundary(() => <></>, { fallback: () => <></> }).displayName).toBe('withErrorBoundary(Component)')
  })
})

describe('withAsyncBoundary', () => {
  it('should wrap component by AsyncBoundary', () => {
    const rendered = render(
      createElement(
        withAsyncBoundary(() => <>{TEXT}</>, {
          rejectedFallback: ERROR_MESSAGE,
        })
      )
    )
    expect(rendered.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should set displayName based on Component.displayName', () => {
    const TestComponentWithDisplayName = () => <>{TEXT}</>
    TestComponentWithDisplayName.displayName = 'TestDisplayName'
    expect(withAsyncBoundary(TestComponentWithDisplayName, { rejectedFallback: () => <></> }).displayName).toBe(
      'withAsyncBoundary(TestDisplayName)'
    )
    expect(withAsyncBoundary(() => <>{TEXT}</>, { rejectedFallback: () => <></> }).displayName).toBe(
      'withAsyncBoundary(Component)'
    )
  })
})
describe('withAsyncBoundary.CSROnly', () => {
  it('should wrap component by AsyncBoundary.CSROnly', () => {
    const rendered = render(
      createElement(
        withAsyncBoundary.CSROnly(() => <>{TEXT}</>, {
          rejectedFallback: ERROR_MESSAGE,
        })
      )
    )
    expect(rendered.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should set displayName based on Component.displayName', () => {
    const TestComponentWithDisplayName = () => <>{TEXT}</>
    TestComponentWithDisplayName.displayName = 'TestDisplayName'
    expect(withAsyncBoundary.CSROnly(TestComponentWithDisplayName, { rejectedFallback: () => <></> }).displayName).toBe(
      'withAsyncBoundary.CSROnly(TestDisplayName)'
    )
    expect(withAsyncBoundary.CSROnly(() => <>{TEXT}</>, { rejectedFallback: () => <></> }).displayName).toBe(
      'withAsyncBoundary.CSROnly(Component)'
    )
  })
})

describe('withErrorBoundaryGroup', () => {
  it('should wrap component. we can check by useErrorBoundaryGroup', () => {
    const rendered = render(
      createElement(
        withErrorBoundaryGroup(() => {
          useErrorBoundaryGroup()
          return <>{TEXT}</>
        })
      )
    )
    expect(rendered.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should set displayName based on Component.displayName', () => {
    const Component = () => <></>
    Component.displayName = 'Custom'
    expect(withErrorBoundaryGroup(Component).displayName).toBe('withErrorBoundaryGroup(Custom)')
    expect(withErrorBoundaryGroup(() => <></>).displayName).toBe('withErrorBoundaryGroup(Component)')
  })
})

describe('withDelay', () => {
  it('renders the children after the delay with component', async () => {
    render(createElement(withDelay(() => <>{TEXT}</>, { ms: ms('0.1s') })))
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })

  it('should set displayName based on Component.displayName', () => {
    const Component = () => <></>
    Component.displayName = 'Custom'
    expect(withDelay(Component).displayName).toBe('withDelay(Custom)')
    expect(withDelay(() => <></>).displayName).toBe('withDelay(Component)')
  })
})
