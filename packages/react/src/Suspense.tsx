import type { SuspenseProps as ReactSuspenseProps } from 'react'
import { Suspense as ReactSuspense, useContext } from 'react'
import { SuspenseDefaultOptionsContext } from './contexts'
import type { PropsWithDevMode } from './DevMode'
import { suspensiveDevMode } from './DevMode'
import { useDevModeObserve, useIsClient } from './hooks'
import { noop } from './utils'

export interface SuspenseProps extends PropsWithDevMode<SuspenseDevModeOptions>, ReactSuspenseProps {}

const SuspenseContextFallback = () => useContext(SuspenseDefaultOptionsContext).fallback
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

type SuspenseDevModeOptions = {
  /**
   * @experimental This is experimental feature.
   */
  showFallback?: boolean
}
const SuspenseDevMode = ({ showFallback = false }: SuspenseDevModeOptions) => {
  useDevModeObserve()
  if (suspensiveDevMode.is && showFallback) {
    throw new Promise(noop)
  }
  return null
}
