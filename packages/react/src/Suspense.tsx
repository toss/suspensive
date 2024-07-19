import { type SuspenseProps as ReactSuspenseProps, useContext } from 'react'
import { SuspenseDefaultPropsContext, syncDevMode } from './contexts'
import type { PropsWithDevMode } from './utility-types'
import { defineSuspense } from './utils'

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
  const DefinedSuspense = defineSuspense({
    defaultPropsClientOnly: defaultProps.clientOnly,
    componentPropsClientOnly: clientOnly,
  })

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
  showFallback?: boolean
}
const SuspenseDevMode = syncDevMode<SuspenseDevModeProp>(({ devMode, showFallback }) => {
  if (devMode.is && showFallback) {
    throw devMode.promise
  }
  return null
})
