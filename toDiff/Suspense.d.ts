import * as react_jsx_runtime from 'react/jsx-runtime'
import * as react from 'react'
import { SuspenseProps as SuspenseProps$1, ComponentType } from 'react'
import { P as PropsWithoutChildren } from './PropsWithoutChildren-l3xNTJvW.js'

type SuspenseProps = SuspenseProps$1
declare const SuspenseContext: react.Context<PropsWithoutChildren<SuspenseProps$1>>
/**
 * This component is just wrapping React's Suspense. to use Suspense easily in Server-side rendering environment like Next.js
 * @see {@link https://suspensive.org/docs/react/Suspense}
 */
declare const Suspense: {
  (props: SuspenseProps): react_jsx_runtime.JSX.Element
  displayName: string
} & {
  /**
   * CSROnly make Suspense can be used in SSR framework like Next.js with React 17 or under
   * @see {@link https://suspensive.org/docs/react/Suspense}
   */
  CSROnly: {
    (props: SuspenseProps): react_jsx_runtime.JSX.Element
    displayName: string
  }
}
/**
 * @deprecated Use wrap.Suspense().on as alternatives
 */
declare const withSuspense: (<TProps extends {} = Record<string, never>>(
  component: ComponentType<TProps>,
  suspenseProps?: PropsWithoutChildren<SuspenseProps>
) => {
  (props: TProps): react_jsx_runtime.JSX.Element
  displayName: string
}) & {
  /**
   * @deprecated Use wrap.Suspense.CSROnly().on as alternatives
   */
  CSROnly: <TProps_1 extends {} = Record<string, never>>(
    component: ComponentType<TProps_1>,
    suspenseProps?: PropsWithoutChildren<SuspenseProps>
  ) => {
    (props: TProps_1): react_jsx_runtime.JSX.Element
    displayName: string
  }
}

export { Suspense, SuspenseContext, type SuspenseProps, withSuspense }
