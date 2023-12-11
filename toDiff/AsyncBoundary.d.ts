import * as react_jsx_runtime from 'react/jsx-runtime'
import * as react from 'react'
import { SuspenseProps, ComponentType } from 'react'
import { ErrorBoundaryProps } from './ErrorBoundary.js'
import { P as PropsWithoutChildren } from './PropsWithoutChildren-l3xNTJvW.js'

/**
 * @deprecated Use SuspenseProps and ErrorBoundaryProps as alternatives
 */
type AsyncBoundaryProps = Omit<SuspenseProps, 'fallback'> &
  Omit<ErrorBoundaryProps, 'fallback'> & {
    pendingFallback?: SuspenseProps['fallback']
    rejectedFallback: ErrorBoundaryProps['fallback']
  }
/**
 * @deprecated Use `<Suspense/>` and `<ErrorBoundary/>` as alternatives
 */
declare const AsyncBoundary: react.ForwardRefExoticComponent<
  Omit<SuspenseProps, 'fallback'> &
    Omit<ErrorBoundaryProps, 'fallback'> & {
      pendingFallback?: SuspenseProps['fallback']
      rejectedFallback: ErrorBoundaryProps['fallback']
    } & react.RefAttributes<{
      reset(): void
    }>
> & {
  /**
   * @deprecated Use `<Suspense/>` and `<ErrorBoundary/>` as alternatives
   */
  CSROnly: react.ForwardRefExoticComponent<
    Omit<SuspenseProps, 'fallback'> &
      Omit<ErrorBoundaryProps, 'fallback'> & {
        pendingFallback?: SuspenseProps['fallback']
        rejectedFallback: ErrorBoundaryProps['fallback']
      } & react.RefAttributes<{
        reset(): void
      }>
  >
}
/**
 * @deprecated Use wrap.ErrorBoundary().Suspense().on as alternatives
 */
declare const withAsyncBoundary: (<TProps extends {} = Record<string, never>>(
  Component: ComponentType<TProps>,
  asyncBoundaryProps: PropsWithoutChildren<AsyncBoundaryProps>
) => {
  (props: TProps): react_jsx_runtime.JSX.Element
  displayName: string
}) & {
  /**
   * @deprecated Use wrap.ErrorBoundary().Suspense.CSROnly().on as alternatives
   */
  CSROnly: <TProps_1 extends {} = Record<string, never>>(
    Component: ComponentType<TProps_1>,
    asyncBoundaryProps: PropsWithoutChildren<AsyncBoundaryProps>
  ) => {
    (props: TProps_1): react_jsx_runtime.JSX.Element
    displayName: string
  }
}

export { AsyncBoundary, type AsyncBoundaryProps, withAsyncBoundary }
