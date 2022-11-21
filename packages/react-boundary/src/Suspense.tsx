import { Suspense as BaseSuspense, SuspenseProps } from 'react'
import { useIsMounted } from './hooks'

const DefaultSuspense = (props: SuspenseProps) => <BaseSuspense {...props} />

const CSROnlySuspense = (props: SuspenseProps) => {
  const isMounted = useIsMounted()

  return isMounted ? <BaseSuspense {...props} /> : <>{props.fallback}</>
}

export const Suspense = DefaultSuspense as typeof DefaultSuspense & {
  CSROnly: typeof CSROnlySuspense
}
Suspense.CSROnly = CSROnlySuspense
