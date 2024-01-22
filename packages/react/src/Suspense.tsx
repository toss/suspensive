import { Suspense as ReactSuspense, type SuspenseProps as ReactSuspenseProps, useContext } from 'react'
import { SuspenseDefaultPropsContext, syncDevMode } from './contexts'
import { useIsClient } from './hooks'
import type { PropsWithDevMode } from './utility-types'

const SuspenseClientOnly = (props: ReactSuspenseProps) =>
  useIsClient() ? <ReactSuspense {...props} /> : <>{props.fallback}</>

export interface SuspenseProps extends PropsWithDevMode<ReactSuspenseProps, SuspenseDevModeProp> {
  /**
   * With clientOnly prop, `<Suspense/>` will return fallback in server but after mount return children in client. Since mount only happens on the client, `<Suspense/>` can be avoid server-side rendering.
   * @see https://suspensive.org/docs/react/Suspense#avoid-server-side-rendering-clientonly
   */
  clientOnly?: boolean
}

/**
 * This component is just wrapping React's Suspense. to use Suspense easily in Server-side rendering environment like Next.js
 * @see {@link https://suspensive.org/docs/react/Suspense}
 */
export const Suspense = ({ clientOnly, devMode, children, fallback }: SuspenseProps) => {
  const defaultProps = useContext(SuspenseDefaultPropsContext)
  const DefinedSuspense = defaultProps.clientOnly ?? clientOnly ? SuspenseClientOnly : ReactSuspense
  return (
    <DefinedSuspense fallback={typeof fallback === 'undefined' ? defaultProps.fallback : fallback}>
      {children}
      <SuspenseDevMode {...devMode} />
    </DefinedSuspense>
  )
}
if (process.env.NODE_ENV === 'development') {
  Suspense.displayName = 'Suspense'
}

type SuspenseDevModeProp = {
  /**
   * @experimental This is experimental feature.
   */
  showFallback?: boolean
}
const SuspenseDevMode = syncDevMode<SuspenseDevModeProp>(({ devMode, showFallback }) => {
  if (devMode.is && showFallback) {
    throw devMode.promise
  }
  return null
})
