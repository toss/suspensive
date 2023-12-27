import { Suspense as ReactSuspense, type SuspenseProps as ReactSuspenseProps, useContext } from 'react'
import { SuspenseDefaultOptionsContext, useDevModeObserve } from './contexts'
import { useIsClient } from './hooks'
import { type PropsWithDevMode } from './utility-types'
import { noop } from './utils'

export interface SuspenseProps extends PropsWithDevMode<SuspenseDevModeOptions>, ReactSuspenseProps {
  csrOnly?: boolean
}

const SuspenseContextFallback = () => useContext(SuspenseDefaultOptionsContext).fallback

/**
 * This component is just wrapping React's Suspense. to use Suspense easily in Server-side rendering environment like Next.js
 * @see {@link https://suspensive.org/docs/react/Suspense}
 */
export const Suspense = Object.assign(
  (() => {
    const SuspenseCSROnly = (props: ReactSuspenseProps) =>
      useIsClient() ? <ReactSuspense {...props} /> : <>{props.fallback}</>

    const Suspense = ({ csrOnly, devMode, children, fallback = <SuspenseContextFallback /> }: SuspenseProps) => {
      const DefinedSuspense = csrOnly ? SuspenseCSROnly : ReactSuspense
      return (
        <DefinedSuspense fallback={fallback}>
          {children}
          {process.env.NODE_ENV !== 'production' && devMode && <SuspenseDevMode {...devMode} />}
        </DefinedSuspense>
      )
    }
    if (process.env.NODE_ENV !== 'production') {
      Suspense.displayName = 'Suspense'
    }

    return Suspense
  })(),
  {
    /**
     * @deprecated Use <Suspense csrOnly /> instead
     */
    CSROnly: (() => {
      const CSROnly = ({
        devMode,
        children,
        fallback = <SuspenseContextFallback />,
      }: Omit<SuspenseProps, 'csrOnly'>) =>
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
      return CSROnly
    })(),
  }
)

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
