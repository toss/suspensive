import type { ComponentProps, ComponentType } from 'react'
import { Delay } from './Delay'
import { ErrorBoundary } from './ErrorBoundary'
import { ErrorBoundaryGroup } from './ErrorBoundaryGroup'
import { Suspense } from './Suspense'
import type { OmitKeyOf } from './utility-types'

type WrapperItem<
  TWrapperComponent extends typeof Suspense | typeof ErrorBoundary | typeof ErrorBoundaryGroup | typeof Delay,
> = [TWrapperComponent, OmitKeyOf<ComponentProps<TWrapperComponent>, 'children'>]

type Wrapper =
  | WrapperItem<typeof Suspense>
  | WrapperItem<typeof ErrorBoundary>
  | WrapperItem<typeof ErrorBoundaryGroup>
  | WrapperItem<typeof Delay>

class Wrap {
  constructor(private wrappers: Wrapper[]) {}
  Suspense = (props: OmitKeyOf<ComponentProps<typeof Suspense>, 'children'> = {}) => {
    this.wrappers.unshift([Suspense, props])
    return this
  }
  ErrorBoundary = (props: OmitKeyOf<ComponentProps<typeof ErrorBoundary>, 'children'>) => {
    this.wrappers.unshift([ErrorBoundary, props])
    return this
  }
  ErrorBoundaryGroup = (props: OmitKeyOf<ComponentProps<typeof ErrorBoundaryGroup>, 'children'> = {}) => {
    this.wrappers.unshift([ErrorBoundaryGroup, props])
    return this
  }
  Delay = (props: OmitKeyOf<ComponentProps<typeof Delay>, 'children'> = {}) => {
    this.wrappers.unshift([Delay, props])
    return this
  }

  on = <TProps extends ComponentProps<ComponentType>>(Component: ComponentType<TProps>) => {
    const WrappedComponent = (props: TProps) =>
      this.wrappers.reduce(
        (acc, [WrapperComponent, wrapperProps]) => (
          <WrapperComponent {...(wrapperProps as any)}>{acc}</WrapperComponent>
        ),
        <Component {...props} />
      )

    if (process.env.NODE_ENV !== 'production') {
      WrappedComponent.displayName = this.wrappers.reduce(
        (acc, [WrapperComponent]) => `with${WrapperComponent.displayName}(${acc})`,
        Component.displayName || Component.name || 'Component'
      )
    }

    return WrappedComponent
  }
}

const createWrap = () => new Wrap([])

const wrapSuspense = (props: OmitKeyOf<ComponentProps<typeof Suspense>, 'children'> = {}) =>
  createWrap().Suspense(props)
const wrapErrorBoundary = (props: OmitKeyOf<ComponentProps<typeof ErrorBoundary>, 'children'>) =>
  createWrap().ErrorBoundary(props)
const wrapErrorBoundaryGroup = (props: OmitKeyOf<ComponentProps<typeof ErrorBoundaryGroup>, 'children'>) =>
  createWrap().ErrorBoundaryGroup(props)
const wrapDelay = (props: OmitKeyOf<ComponentProps<typeof Delay>, 'children'> = {}) => createWrap().Delay(props)

export const wrap = {
  Suspense: wrapSuspense,
  ErrorBoundary: wrapErrorBoundary,
  ErrorBoundaryGroup: wrapErrorBoundaryGroup,
  Delay: wrapDelay,
}
