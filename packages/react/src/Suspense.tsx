import { Suspense as ReactSuspense, type SuspenseProps as ReactSuspenseProps, useContext } from 'react'
import { SuspenseDefaultOptionsContext, useDevModeObserve } from './contexts'
import { useIsClient } from './hooks'
import { type PropsWithDevMode } from './utility-types'
import { noop } from './utils'

export interface SuspenseProps extends PropsWithDevMode<SuspenseDevModeOptions>, ReactSuspenseProps {}

const SuspenseContextFallback = () => useContext(SuspenseDefaultOptionsContext).fallback
const DefaultSuspense = ({ devMode, children, fallback = <SuspenseContextFallback /> }: SuspenseProps) => (
  <ReactSuspense fallback={fallback}>
    {children}
    {process.env.NODE_ENV !== 'production' && devMode && <SuspenseDevMode {...devMode} />}
  </ReactSuspense>
)
if (process.env.NODE_ENV !== 'production') {
  DefaultSuspense.displayName = 'Suspense'
}
const CSROnly = ({ devMode, children, fallback = <SuspenseContextFallback /> }: SuspenseProps) =>
  useIsClient() ? (
    <ReactSuspense fallback={fallback}>
      {children}
      {process.env.NODE_ENV !== 'production' && devMode && <SuspenseDevMode {...devMode} />}
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

type SuspenseDevModeOptions = {
  /**
   * @experimental This is experimental feature.
   */
  showFallback?: boolean
}
const SuspenseDevMode = ({ showFallback = false }: SuspenseDevModeOptions) => {
  const devMode = useDevModeObserve()
  if (devMode?.is && showFallback) {
    throw new Promise(noop)
  }
  return null
}
