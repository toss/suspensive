import { Suspense as BaseSuspense, SuspenseProps } from 'react'
import { useIsMounted } from './hooks'

type Props = SuspenseProps
const DefaultSuspense = (props: Props) => <BaseSuspense {...props} />
const CSROnlySuspense = (props: Props) => (useIsMounted() ? <BaseSuspense {...props} /> : <>{props.fallback}</>)

/**
 * This component is just wrapping React's Suspense. to use Suspense easily in Server-side rendering environment like Next.js
 * @see {@link https://docs.suspensive.org/docs/react/src/Suspense.i18n Suspensive Official Docs}
 */
export const Suspense = DefaultSuspense as typeof DefaultSuspense & {
  /**
   * CSROnly mode make Suspense can be used in SSR framework like Next.js with React 17 or under
   * @see {@link https://docs.suspensive.org/docs/react/src/Suspense.i18n Suspensive Official Docs}
   */
  CSROnly: typeof CSROnlySuspense
}
Suspense.CSROnly = CSROnlySuspense
