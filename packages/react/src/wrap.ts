import { createElement } from 'react'
import type { ComponentProps, ComponentType } from 'react'
import type { PropsWithoutChildren } from './types'
import { Delay, ErrorBoundary, ErrorBoundaryGroup, Suspense } from '.'

type WrapperItem<
  TWrapperComponent extends
    | typeof Suspense
    | typeof Suspense.CSROnly
    | typeof ErrorBoundary
    | typeof ErrorBoundaryGroup
    | typeof Delay,
> = [TWrapperComponent, PropsWithoutChildren<ComponentProps<TWrapperComponent>>]

type Wrapper =
  | WrapperItem<typeof Suspense>
  | WrapperItem<typeof Suspense.CSROnly>
  | WrapperItem<typeof ErrorBoundary>
  | WrapperItem<typeof ErrorBoundaryGroup>
  | WrapperItem<typeof Delay>

class WrapWithoutCSROnly {
  constructor(private wrappers: Wrapper[]) {}
  Suspense = (props: PropsWithoutChildren<ComponentProps<typeof Suspense>> = {}) => {
    this.wrappers.unshift([Suspense, props])
    return this
  }
  ErrorBoundary = (props: PropsWithoutChildren<ComponentProps<typeof ErrorBoundary>>) => {
    this.wrappers.unshift([ErrorBoundary, props])
    return this
  }
  ErrorBoundaryGroup = (props: PropsWithoutChildren<ComponentProps<typeof ErrorBoundaryGroup>> = {}) => {
    this.wrappers.unshift([ErrorBoundaryGroup, props])
    return this
  }
  Delay = (props: PropsWithoutChildren<ComponentProps<typeof Delay>> = {}) => {
    this.wrappers.unshift([Delay, props])
    return this
  }

  on = <TProps extends ComponentProps<ComponentType>>(component: ComponentType<TProps>) => {
    const wrappedComponent = (props: TProps) =>
      this.wrappers.reduce(
        (acc, [wrapperComponent, wrapperProps]) => createElement(wrapperComponent as any, wrapperProps as any, acc),
        createElement(component, props)
      )

    if (process.env.NODE_ENV !== 'production') {
      wrappedComponent.displayName = this.wrappers.reduce(
        (acc, [wrapperComponent]) => `with${wrapperComponent.displayName}(${acc})`,
        component.displayName || component.name || 'Component'
      )
    }

    return wrappedComponent
  }
}

type Wrap = WrapWithoutCSROnly & {
  Suspense: WrapWithoutCSROnly['Suspense'] & {
    CSROnly: (props?: PropsWithoutChildren<ComponentProps<typeof Suspense.CSROnly>>) => Wrap
  }
}

const createWrap = () => {
  const wrappers: Wrapper[] = []
  const wrap = new WrapWithoutCSROnly(wrappers) as Wrap
  wrap.Suspense.CSROnly = (props: PropsWithoutChildren<ComponentProps<typeof Suspense.CSROnly>> = {}) => {
    wrappers.unshift([Suspense.CSROnly, props])
    return wrap
  }
  return wrap
}

const wrapSuspense = (props: PropsWithoutChildren<ComponentProps<typeof Suspense>> = {}) => createWrap().Suspense(props)
wrapSuspense.CSROnly = (props: PropsWithoutChildren<ComponentProps<typeof Suspense.CSROnly>> = {}) =>
  createWrap().Suspense.CSROnly(props)
const wrapErrorBoundary = (props: PropsWithoutChildren<ComponentProps<typeof ErrorBoundary>>) =>
  createWrap().ErrorBoundary(props)
const wrapErrorBoundaryGroup = (props: PropsWithoutChildren<ComponentProps<typeof ErrorBoundaryGroup>>) =>
  createWrap().ErrorBoundaryGroup(props)
const wrapDelay = (props: PropsWithoutChildren<ComponentProps<typeof Delay>> = {}) => createWrap().Delay(props)

/**
 * @experimental This is experimental feature.
 */
export const wrap = {
  Suspense: wrapSuspense,
  ErrorBoundary: wrapErrorBoundary,
  ErrorBoundaryGroup: wrapErrorBoundaryGroup,
  Delay: wrapDelay,
}
