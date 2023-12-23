import type { SuspenseProps as ReactSuspenseProps } from 'react'
import { Suspense as ReactSuspense, useContext } from 'react'
import { SuspenseDefaultOptionsContext } from './contexts'
import { useIsClient } from './hooks'

export type SuspenseProps = ReactSuspenseProps

const useDefaultFallbackIfNo = (overridingFallback: SuspenseProps['fallback']) => {
  const suspenseDefaultOptions = useContext(SuspenseDefaultOptionsContext)
  return overridingFallback === null ? null : overridingFallback ?? suspenseDefaultOptions.fallback
}

const DefaultSuspense = (props: SuspenseProps) => {
  const fallback = useDefaultFallbackIfNo(props.fallback)

  return <ReactSuspense {...props} fallback={fallback} />
}
if (process.env.NODE_ENV !== 'production') {
  DefaultSuspense.displayName = 'Suspense'
}
const CSROnly = (props: SuspenseProps) => {
  const isClient = useIsClient()
  const fallback = useDefaultFallbackIfNo(props.fallback)
  return isClient ? <ReactSuspense {...props} fallback={fallback} /> : <>{fallback}</>
}
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
