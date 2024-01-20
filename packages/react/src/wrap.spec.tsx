import { ERROR_MESSAGE, FALLBACK, Suspend, TEXT, ThrowError } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { createElement } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useErrorBoundaryGroup } from './ErrorBoundaryGroup'
import { wrap } from './wrap'

describe('wrap.Suspense().on', () => {
  beforeEach(() => Suspend.reset())

  it('should wrap component by Suspense', async () => {
    render(
      createElement(
        wrap
          .Suspense({
            fallback: FALLBACK,
          })
          .on(() => <Suspend during={ms('0.1s')} toShow={TEXT} />)
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
    expect(wrap.Suspense().on(Component).displayName).toBe('withSuspense(Custom)')
    expect(wrap.Suspense().on(() => <></>).displayName).toBe('withSuspense(Component)')
  })
})
describe('wrap.Suspense({ clientOnly: true }).on', () => {
  beforeEach(() => Suspend.reset())

  it('should wrap component by Suspense.CSROnly', async () => {
    render(
      createElement(
        wrap
          .Suspense({
            clientOnly: true,
            fallback: FALLBACK,
          })
          .on(() => <Suspend during={ms('0.1s')} toShow={TEXT} />)
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
    expect(
      wrap
        .Suspense({
          clientOnly: true,
        })
        .on(Component).displayName
    ).toBe('withSuspense.CSROnly(Custom)')
    expect(
      wrap
        .Suspense({
          clientOnly: true,
        })
        .on(() => <></>).displayName
    ).toBe('withSuspense.CSROnly(Component)')
  })
})

describe('wrap.ErrorBoundary().on', () => {
  beforeEach(() => ThrowError.reset())

  it("should render the wrapped component when there's no error", () => {
    render(
      createElement(
        wrap
          .ErrorBoundary({
            fallback: (props) => <>{props.error.message}</>,
          })
          .on(() => <>{TEXT}</>)
      )
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })

  it('should render the fallback when there`s an error in the wrapped component', async () => {
    render(
      createElement(
        wrap
          .ErrorBoundary({
            fallback: (props) => <>{props.error.message}</>,
          })
          .on(() => (
            <ThrowError message={ERROR_MESSAGE} after={ms('0.1s')}>
              {TEXT}
            </ThrowError>
          ))
      )
    )
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(ERROR_MESSAGE)).toBeInTheDocument())
  })

  it('should set displayName based on Component.displayName', () => {
    const Component = () => <></>
    Component.displayName = 'Custom'
    expect(
      wrap
        .ErrorBoundary({
          fallback: () => <></>,
        })
        .on(Component).displayName
    ).toBe('withErrorBoundary(Custom)')
    expect(
      wrap
        .ErrorBoundary({
          fallback: () => <></>,
        })
        .on(() => <></>).displayName
    ).toBe('withErrorBoundary(Component)')
  })
})

describe('warp.ErrorBoundaryGroup().on', () => {
  it('should wrap component. we can check by useErrorBoundaryGroup', () => {
    const rendered = render(
      createElement(
        wrap.ErrorBoundaryGroup({}).on(() => {
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
    expect(wrap.ErrorBoundaryGroup({}).on(Component).displayName).toBe('withErrorBoundaryGroup(Custom)')
    expect(wrap.ErrorBoundaryGroup({}).on(() => <></>).displayName).toBe('withErrorBoundaryGroup(Component)')
  })
})

describe('wrap.Delay().on', () => {
  it('renders the children after the delay with component', async () => {
    render(
      createElement(
        wrap
          .Delay({
            ms: ms('0.1s'),
          })
          .on(() => <>{TEXT}</>)
      )
    )
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })

  it('should set displayName based on Component.displayName', () => {
    const Component = () => <></>
    Component.displayName = 'Custom'
    expect(wrap.Delay({}).on(Component).displayName).toBe('withDelay(Custom)')
    expect(wrap.Delay({}).on(() => <></>).displayName).toBe('withDelay(Component)')
  })
})
