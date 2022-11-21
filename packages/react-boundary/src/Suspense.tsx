import { CSROnlySuspense } from './components'
import { Suspense as BaseSuspense, SuspenseProps } from 'react'

const DefaultSuspense = (props: SuspenseProps) => <BaseSuspense {...props} />

export const Suspense = DefaultSuspense as typeof DefaultSuspense & {
  CSROnly: typeof CSROnlySuspense
}
Suspense.CSROnly = CSROnlySuspense
