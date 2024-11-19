import type { ComponentProps, ComponentType } from 'react'
import { Delay } from './Delay'
import { ErrorBoundary } from './ErrorBoundary'
import { ErrorBoundaryGroup } from './ErrorBoundaryGroup'
import { Suspense } from './Suspense'
import type { OmitKeyof } from './utility-types'

type WrapperItem<
  TWrapperComponent extends typeof Suspense | typeof ErrorBoundary | typeof ErrorBoundaryGroup | typeof Delay,
> = [TWrapperComponent, OmitKeyof<ComponentProps<TWrapperComponent>, 'children'>]

class Wrap {
  constructor(
    private wrappers: (
      | WrapperItem<typeof Suspense>
      | WrapperItem<typeof ErrorBoundary>
      | WrapperItem<typeof ErrorBoundaryGroup>
      | WrapperItem<typeof Delay>
    )[]
  ) {}

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
      WrappedComponent.displayName = `wrap.${[...this.wrappers]
        .reverse()
        .map(([WrapperComponent]) => WrapperComponent.displayName)
        .join('.')}.on(${Component.displayName || Component.name || 'Component'})`
    }

    return WrappedComponent
  }
}

/**
 * A utility for wrapping components with Suspense, ErrorBoundary, ErrorBoundaryGroup, and Delay functionality.
 * Provides a chainable API to compose multiple wrapper components.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const WrappedComponent = wrap
 *   .ErrorBoundary({
 *     fallback: ({ error }) => <ErrorDisplay message={error.message} />
 *   })
 *   .Suspense({ fallback: <LoadingSpinner /> })
 *   .on(YourComponent)
 *
 * // With TypeScript props
 * const PostItem = wrap
 *   .ErrorBoundary({ fallback: ({ error }) => <div>{error.message}</div> })
 *   .Suspense({ fallback: <div>Loading...</div> })
 *   .on<{ id: number }>((props) => {
 *     // Component implementation
 *   })
 *
 * // With ErrorBoundaryGroup
 * const Page = wrap
 *   .ErrorBoundaryGroup({ blockOutside: true })
 *   .ErrorBoundary({ fallback: ({ error }) => <PageError error={error} /> })
 *   .Suspense({ fallback: <PageSkeleton /> })
 *   .on(() => {
 *     // Page implementation
 *   })
 * ```
 *
 * Each wrapper method returns a chainable instance that can be further composed
 * with additional wrappers before finalizing with .on()
 *
 * @see {@link Suspense}
 * @see {@link ErrorBoundary}
 * @see {@link ErrorBoundaryGroup}
 * @see {@link Delay}
 */
export const wrap = {
  Suspense: (props: OmitKeyof<ComponentProps<typeof Suspense>, 'children'> = {}) => new Wrap([[Suspense, props]]),
  ErrorBoundary: (props: OmitKeyof<ComponentProps<typeof ErrorBoundary>, 'children'>) =>
    new Wrap([[ErrorBoundary, props]]),
  ErrorBoundaryGroup: (props: OmitKeyof<ComponentProps<typeof ErrorBoundaryGroup>, 'children'>) =>
    new Wrap([[ErrorBoundaryGroup, props]]),
  Delay: (props: OmitKeyof<ComponentProps<typeof Delay>, 'children'> = {}) => new Wrap([[Delay, props]]),
}
