import type { ComponentProps, ComponentType, SuspenseProps as ReactSuspenseProps } from 'react'
import { Suspense as ReactSuspense, createContext, useContext } from 'react'
import type { PropsWithDevMode, PropsWithoutDevMode } from './DevMode'
import { suspensiveDevMode } from './DevMode'
import { useDevModeObserve, useIsClient } from './hooks'
import type { PropsWithoutChildren } from './types'
import { noop } from './utils'
import { wrap } from './wrap'

export type SuspenseProps = PropsWithDevMode<SuspenseDevModeOptions, ReactSuspenseProps>

export const SuspenseContext = createContext<PropsWithoutChildren<PropsWithoutDevMode<SuspenseProps>>>({
  fallback: undefined,
})

const SuspenseContextFallback = () => useContext(SuspenseContext).fallback
const DefaultSuspense = ({ devMode, children, fallback = <SuspenseContextFallback /> }: SuspenseProps) => (
  <ReactSuspense fallback={fallback}>
    {process.env.NODE_ENV !== 'production' && devMode && <SuspenseDevMode {...devMode} />}
    {children}
  </ReactSuspense>
)
if (process.env.NODE_ENV !== 'production') {
  DefaultSuspense.displayName = 'Suspense'
}
const CSROnly = ({ devMode, children, fallback = <SuspenseContextFallback /> }: SuspenseProps) =>
  useIsClient() ? (
    <ReactSuspense fallback={fallback}>
      {process.env.NODE_ENV !== 'production' && devMode && <SuspenseDevMode {...devMode} />}
      {children}
    </ReactSuspense>
  ) : (
    <>{fallback}</>
  )
if (process.env.NODE_ENV !== 'production') {
  CSROnly.displayName = 'Suspense.CSROnly'
}

/**
 * This component is just wrapping React's Suspense. to use Suspense easily in Server-side rendering environment like Next.js
 * @see {@link https://suspensive.org/docs/react/Suspense}
 */
export const Suspense = Object.assign(DefaultSuspense, {
  /**
   * CSROnly make Suspense can be used in SSR framework like Next.js with React 17 or under
   * @see {@link https://suspensive.org/docs/react/Suspense}
   */
  CSROnly,
})

/**
 * @deprecated Use wrap.Suspense().on as alternatives
 */
export const withSuspense = Object.assign(
  <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
    component: ComponentType<TProps>,
    suspenseProps: PropsWithoutChildren<SuspenseProps> = {}
  ) => wrap.Suspense(suspenseProps).on(component),
  {
    /**
     * @deprecated Use wrap.Suspense.CSROnly().on as alternatives
     */
    CSROnly: <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
      component: ComponentType<TProps>,
      suspenseProps: PropsWithoutChildren<SuspenseProps> = {}
    ) => wrap.Suspense.CSROnly(suspenseProps).on(component),
  }
)

type SuspenseDevModeOptions = { showFallback?: boolean }
const SuspenseDevMode = ({ showFallback = false }: SuspenseDevModeOptions) => {
  useDevModeObserve()
  if (suspensiveDevMode.is && showFallback) {
    throw new Promise(noop)
  }
  return null
}
