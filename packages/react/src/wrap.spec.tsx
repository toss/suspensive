import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { createElement } from 'react'
import { useErrorBoundaryGroup } from './ErrorBoundaryGroup'
import { ERROR_MESSAGE, FALLBACK, Suspend, TEXT, Throw } from './test-utils'
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
    expect(wrap.Suspense().on(Component).displayName).toBe('wrap.Suspense.on(Custom)')
    expect(wrap.Suspense().on(() => <></>).displayName).toBe('wrap.Suspense.on(Component)')
  })
})
describe('wrap.Suspense({ clientOnly: true }).on', () => {
  beforeEach(() => Suspend.reset())

  it('should wrap component by Suspense clientOnly', async () => {
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
    ).toBe('wrap.Suspense.on(Custom)')
    expect(
      wrap
        .Suspense({
          clientOnly: true,
        })
        .on(() => <></>).displayName
    ).toBe('wrap.Suspense.on(Component)')
  })
})

describe('wrap.ErrorBoundary().on', () => {
  beforeEach(() => Throw.reset())

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
            <Throw.Error message={ERROR_MESSAGE} after={ms('0.1s')}>
              {TEXT}
            </Throw.Error>
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
    ).toBe('wrap.ErrorBoundary.on(Custom)')
    expect(
      wrap
        .ErrorBoundary({
          fallback: () => <></>,
        })
        .on(() => <></>).displayName
    ).toBe('wrap.ErrorBoundary.on(Component)')
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
    expect(wrap.ErrorBoundaryGroup({}).on(Component).displayName).toBe('wrap.ErrorBoundaryGroup.on(Custom)')
    expect(wrap.ErrorBoundaryGroup({}).on(() => <></>).displayName).toBe('wrap.ErrorBoundaryGroup.on(Component)')
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
    expect(wrap.Delay({}).on(Component).displayName).toBe('wrap.Delay.on(Custom)')
    expect(wrap.Delay({}).on(() => <></>).displayName).toBe('wrap.Delay.on(Component)')
  })
})

describe('Wrap class method chaining', () => {
  it('should maintain the same instance across method chaining', () => {
    const suspenseInstance = wrap.Suspense({})
    const methodChainingInstance = suspenseInstance
      .ErrorBoundary({ fallback: FALLBACK })
      .ErrorBoundaryGroup({})
      .Delay({})
      .Suspense({})

    expect(suspenseInstance).toBe(methodChainingInstance)
  })
})
