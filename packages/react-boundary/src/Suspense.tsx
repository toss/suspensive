import { Suspense as BaseSuspense, SuspenseProps } from 'react'
import { useIsMounted } from './hooks'

type Props = SuspenseProps
const DefaultSuspense = (props: Props) => <BaseSuspense {...props} />
const CSROnlySuspense = (props: Props) => (useIsMounted() ? <BaseSuspense {...props} /> : <>{props.fallback}</>)

export const Suspense = DefaultSuspense as typeof DefaultSuspense & {
  CSROnly: typeof CSROnlySuspense
}
Suspense.CSROnly = CSROnlySuspense
