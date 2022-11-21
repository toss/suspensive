import { CSROnlySuspense } from './components'
import { Suspense as BaseSuspense } from 'react'

export const Suspense = BaseSuspense as typeof BaseSuspense & {
  CSROnly: typeof CSROnlySuspense
}

Suspense.CSROnly = CSROnlySuspense
