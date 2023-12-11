import * as react_jsx_runtime from 'react/jsx-runtime'
import { ComponentProps, ComponentType } from 'react'
import { P as PropsWithoutChildren } from './PropsWithoutChildren-l3xNTJvW.js'
import { Delay } from './Delay.js'
import { Suspense } from './Suspense.js'
import { ErrorBoundary } from './ErrorBoundary.js'
import { ErrorBoundaryGroup } from './ErrorBoundaryGroup.js'

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
declare class WrapWithoutCSROnly {
  private wrappers
  constructor(wrappers: Wrapper[])
  Suspense: (props?: PropsWithoutChildren<ComponentProps<typeof Suspense>>) => this
  ErrorBoundary: (props: PropsWithoutChildren<ComponentProps<typeof ErrorBoundary>>) => this
  ErrorBoundaryGroup: (props?: PropsWithoutChildren<ComponentProps<typeof ErrorBoundaryGroup>>) => this
  Delay: (props?: PropsWithoutChildren<ComponentProps<typeof Delay>>) => this
  on: <TProps extends {}>(
    Component: ComponentType<TProps>
  ) => {
    (props: TProps): react_jsx_runtime.JSX.Element
    displayName: string
  }
}
type Wrap = WrapWithoutCSROnly & {
  Suspense: WrapWithoutCSROnly['Suspense'] & {
    CSROnly: (props?: PropsWithoutChildren<ComponentProps<typeof Suspense.CSROnly>>) => Wrap
  }
}
declare const wrap: {
  Suspense: {
    (props?: PropsWithoutChildren<ComponentProps<typeof Suspense>>): Wrap
    CSROnly(props?: PropsWithoutChildren<ComponentProps<typeof Suspense.CSROnly>>): Wrap
  }
  ErrorBoundary: (props: PropsWithoutChildren<ComponentProps<typeof ErrorBoundary>>) => Wrap
  ErrorBoundaryGroup: (props: PropsWithoutChildren<ComponentProps<typeof ErrorBoundaryGroup>>) => Wrap
  Delay: (props?: PropsWithoutChildren<ComponentProps<typeof Delay>>) => Wrap
}

export { wrap }
