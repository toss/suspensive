import { type ComponentProps, type ComponentType, createElement } from 'react'
import type { PropsWithoutChildren } from './types'
import { AsyncBoundary, Delay, ErrorBoundary, ErrorBoundaryGroup, Suspense } from '.'
import type { AsyncBoundaryProps, DelayProps, ErrorBoundaryGroupProps, ErrorBoundaryProps, SuspenseProps } from '.'

type Wrapper =
  | { component: typeof Suspense; props: PropsWithoutChildren<SuspenseProps> }
  | { component: typeof Suspense.CSROnly; props: PropsWithoutChildren<SuspenseProps> }
  | { component: typeof ErrorBoundary; props: PropsWithoutChildren<ErrorBoundaryProps> }
  | { component: typeof ErrorBoundaryGroup; props: PropsWithoutChildren<ErrorBoundaryGroupProps> }
  | { component: typeof AsyncBoundary; props: PropsWithoutChildren<AsyncBoundaryProps> }
  | { component: typeof AsyncBoundary.CSROnly; props: PropsWithoutChildren<AsyncBoundaryProps> }
  | { component: typeof Delay; props: PropsWithoutChildren<DelayProps> }

class WrapBuilder {
  constructor(private wrappers: Wrapper[]) {}
  Suspense = (props: PropsWithoutChildren<SuspenseProps> = {}) => {
    this.wrappers.unshift({ component: Suspense, props })
    return this
  }
  ErrorBoundary = (props: PropsWithoutChildren<ErrorBoundaryProps>) => {
    this.wrappers.unshift({ component: ErrorBoundary, props })
    return this
  }
  ErrorBoundaryGroup = (props: PropsWithoutChildren<ErrorBoundaryGroupProps> = {}) => {
    this.wrappers.unshift({ component: ErrorBoundaryGroup, props })
    return this
  }
  AsyncBoundary = (props: PropsWithoutChildren<AsyncBoundaryProps>) => {
    this.wrappers.unshift({ component: AsyncBoundary, props })
    return this
  }
  Delay = (props: PropsWithoutChildren<DelayProps> = {}) => {
    this.wrappers.unshift({ component: Delay, props })
    return this
  }

  on = <TProps extends ComponentProps<ComponentType>>(component: ComponentType<TProps>) => {
    const wrapped = (props: TProps) =>
      this.wrappers.reduce(
        (acc, wrapper) => createElement(wrapper.component as any, wrapper.props as any, acc),
        createElement(component, props)
      )

    if (process.env.NODE_ENV !== 'production') {
      wrapped.displayName = this.wrappers.reduce(
        (acc, wrapper) => `with${wrapper.component.displayName}(${acc})`,
        component.displayName || component.name || 'Component'
      )
    }

    return wrapped
  }
}

type WrapBuilderWithCSROnly = WrapBuilder & {
  Suspense: WrapBuilder['Suspense'] & {
    CSROnly: (props?: PropsWithoutChildren<SuspenseProps>) => WrapBuilder
  }
  AsyncBoundary: WrapBuilder['AsyncBoundary'] & {
    CSROnly: (props: PropsWithoutChildren<AsyncBoundaryProps>) => WrapBuilder
  }
}

const injectCSROnly = (builder: WrapBuilderWithCSROnly, wrappers: Wrapper[]) => {
  builder.Suspense.CSROnly = (props: PropsWithoutChildren<SuspenseProps> = {}) => {
    wrappers.unshift({ component: Suspense.CSROnly, props })
    return builder
  }
  builder.AsyncBoundary.CSROnly = (props: PropsWithoutChildren<AsyncBoundaryProps>) => {
    wrappers.unshift({ component: AsyncBoundary.CSROnly, props })
    return builder
  }
}

const createBuilder = (initialWrapper: Wrapper) => {
  const wrappers: Wrapper[] = [initialWrapper]
  const builder = new WrapBuilder(wrappers) as WrapBuilderWithCSROnly
  injectCSROnly(builder, wrappers)
  return builder
}

const buildSuspense = (props: PropsWithoutChildren<SuspenseProps> = {}) => createBuilder({ component: Suspense, props })
buildSuspense.CSROnly = (props: PropsWithoutChildren<SuspenseProps> = {}) =>
  createBuilder({ component: Suspense.CSROnly, props })
const buildErrorBoundary = (props: PropsWithoutChildren<ErrorBoundaryProps>) =>
  createBuilder({ component: ErrorBoundary, props })
const buildErrorBoundaryGroup = (props: PropsWithoutChildren<ErrorBoundaryGroupProps> = {}) =>
  createBuilder({ component: ErrorBoundaryGroup, props })
const buildAsyncBoundary = (props: PropsWithoutChildren<AsyncBoundaryProps>) =>
  createBuilder({ component: AsyncBoundary, props })
buildAsyncBoundary.CSROnly = (props: PropsWithoutChildren<AsyncBoundaryProps>) =>
  createBuilder({ component: AsyncBoundary.CSROnly, props })
const buildDelay = (props: PropsWithoutChildren<DelayProps> = {}) => createBuilder({ component: Delay, props })

/**
 * @experimental This is experimental feature.
 */
export const wrap = {
  Suspense: buildSuspense,
  ErrorBoundary: buildErrorBoundary,
  ErrorBoundaryGroup: buildErrorBoundaryGroup,
  AsyncBoundary: buildAsyncBoundary,
  Delay: buildDelay,
}
