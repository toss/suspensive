import type { ComponentProps, ComponentType } from 'react'
import { AsyncBoundary } from './AsyncBoundary'
import { Delay } from './Delay'
import { ErrorBoundary } from './ErrorBoundary'
import { ErrorBoundaryGroup } from './ErrorBoundaryGroup'
import { Suspense } from './Suspense'
import type { OmitKeyof } from './utility-types'
import type { AsyncBoundaryProps, DelayProps, ErrorBoundaryGroupProps, ErrorBoundaryProps, SuspenseProps } from '.'

type WrapperItem<
  TWrapperComponent extends
    | typeof Suspense
    | typeof Suspense.CSROnly
    | typeof ErrorBoundary
    | typeof ErrorBoundaryGroup
    | typeof Delay,
> = [TWrapperComponent, OmitKeyof<ComponentProps<TWrapperComponent>, 'children'>]

type Wrapper =
  | WrapperItem<typeof Suspense>
  | WrapperItem<typeof Suspense.CSROnly>
  | WrapperItem<typeof ErrorBoundary>
  | WrapperItem<typeof ErrorBoundaryGroup>
  | WrapperItem<typeof Delay>

class WrapWithoutCSROnly {
  constructor(private wrappers: Wrapper[]) {}
  Suspense = (props: OmitKeyof<ComponentProps<typeof Suspense>, 'children'> = {}) => {
    this.wrappers.unshift([Suspense, props])
    return this
  }
  ErrorBoundary = (props: OmitKeyof<ComponentProps<typeof ErrorBoundary>, 'children'>) => {
    this.wrappers.unshift([ErrorBoundary, props])
    return this
  }
  ErrorBoundaryGroup = (props: OmitKeyof<ComponentProps<typeof ErrorBoundaryGroup>, 'children'> = {}) => {
    this.wrappers.unshift([ErrorBoundaryGroup, props])
    return this
  }
  Delay = (props: OmitKeyof<ComponentProps<typeof Delay>, 'children'> = {}) => {
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

    if (process.env.NODE_ENV === 'development') {
      WrappedComponent.displayName = this.wrappers.reduce(
        (acc, [WrapperComponent]) => `with${WrapperComponent.displayName}(${acc})`,
        Component.displayName || Component.name || 'Component'
      )
    }

    return WrappedComponent
  }
}

type Wrap = WrapWithoutCSROnly & {
  Suspense: WrapWithoutCSROnly['Suspense'] & {
    /**
     * @deprecated Use wrap.Suspense({ clientOnly: true }).on instead
     */
    CSROnly: (props?: OmitKeyof<ComponentProps<typeof Suspense.CSROnly>, 'children'>) => Wrap
  }
}

const createWrap = () => {
  const wrappers: Wrapper[] = []
  const wrap = new WrapWithoutCSROnly(wrappers) as Wrap
  wrap.Suspense.CSROnly = (props: OmitKeyof<ComponentProps<typeof Suspense.CSROnly>, 'children'> = {}) => {
    wrappers.unshift([Suspense.CSROnly, props])
    return wrap
  }
  return wrap
}

const wrapSuspense = (props: OmitKeyof<ComponentProps<typeof Suspense>, 'children'> = {}) =>
  createWrap().Suspense(props)
wrapSuspense.CSROnly = (props: OmitKeyof<ComponentProps<typeof Suspense.CSROnly>, 'children'> = {}) =>
  createWrap().Suspense.CSROnly(props)
const wrapErrorBoundary = (props: OmitKeyof<ComponentProps<typeof ErrorBoundary>, 'children'>) =>
  createWrap().ErrorBoundary(props)
const wrapErrorBoundaryGroup = (props: OmitKeyof<ComponentProps<typeof ErrorBoundaryGroup>, 'children'>) =>
  createWrap().ErrorBoundaryGroup(props)
const wrapDelay = (props: OmitKeyof<ComponentProps<typeof Delay>, 'children'> = {}) => createWrap().Delay(props)

export const wrap = {
  Suspense: wrapSuspense,
  ErrorBoundary: wrapErrorBoundary,
  ErrorBoundaryGroup: wrapErrorBoundaryGroup,
  Delay: wrapDelay,
}

/**
 * @deprecated Use wrap.Suspense().on instead
 */
export const withSuspense = Object.assign(
  <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
    component: ComponentType<TProps>,
    suspenseProps: OmitKeyof<SuspenseProps, 'children'> = {}
  ) => wrap.Suspense(suspenseProps).on(component),
  {
    /**
     * @deprecated Use wrap.Suspense({ clientOnly: true }).on instead
     */
    CSROnly: <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
      component: ComponentType<TProps>,
      suspenseProps: OmitKeyof<SuspenseProps, 'children'> = {}
    ) => wrap.Suspense.CSROnly(suspenseProps).on(component),
  }
)

/**
 * @deprecated Use wrap.ErrorBoundary().on instead
 */
export const withErrorBoundary = <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
  component: ComponentType<TProps>,
  errorBoundaryProps: OmitKeyof<ErrorBoundaryProps, 'children'>
) => wrap.ErrorBoundary(errorBoundaryProps).on(component)

/**
 * @deprecated Use wrap.Delay().on instead
 */
export const withDelay = <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
  component: ComponentType<TProps>,
  delayProps: OmitKeyof<DelayProps, 'children'> = {}
) => wrap.Delay(delayProps).on(component)

/**
 * @deprecated Use wrap.ErrorBoundaryGroup().on instead
 */
export const withErrorBoundaryGroup = <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
  component: ComponentType<TProps>,
  errorBoundaryGroupProps: OmitKeyof<ErrorBoundaryGroupProps, 'children'> = {}
) => wrap.ErrorBoundaryGroup(errorBoundaryGroupProps).on(component)

/**
 * @deprecated Use wrap.ErrorBoundary().Suspense().on instead
 */
export const withAsyncBoundary = Object.assign(
  <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
    Component: ComponentType<TProps>,
    asyncBoundaryProps: OmitKeyof<AsyncBoundaryProps, 'children'>
  ) => {
    const Wrapped = (props: TProps) => (
      <AsyncBoundary {...asyncBoundaryProps}>
        <Component {...props} />
      </AsyncBoundary>
    )

    if (process.env.NODE_ENV === 'development') {
      const name = Component.displayName || Component.name || 'Component'
      Wrapped.displayName = `withAsyncBoundary(${name})`
    }

    return Wrapped
  },
  {
    /**
     * @deprecated Use wrap.ErrorBoundary().Suspense({ clientOnly: true }).on instead
     */
    CSROnly: <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
      Component: ComponentType<TProps>,
      asyncBoundaryProps: OmitKeyof<AsyncBoundaryProps, 'clientOnly' | 'children'>
    ) => {
      const Wrapped = (props: TProps) => (
        <AsyncBoundary {...asyncBoundaryProps} clientOnly>
          <Component {...props} />
        </AsyncBoundary>
      )

      if (process.env.NODE_ENV === 'development') {
        const name = Component.displayName || Component.name || 'Component'
        Wrapped.displayName = `withAsyncBoundary.CSROnly(${name})`
      }

      return Wrapped
    },
  }
)
