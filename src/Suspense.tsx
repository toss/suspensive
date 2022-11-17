import { SSRSafeSuspense } from './components'
import { ComponentProps, FC, Suspense as BaseSuspense } from 'react'

const SelectableSuspense: FC<ComponentProps<typeof BaseSuspense> & { ssrSafe?: boolean }> = ({
  ssrSafe = false,
  ...props
}) => {
  return ssrSafe ? <SSRSafeSuspense {...props} /> : <BaseSuspense {...props} />
}

export const Suspense = SelectableSuspense as typeof SelectableSuspense & {
  CSROnly: typeof BaseSuspense
  SSRSafe: typeof SSRSafeSuspense
}

Suspense.CSROnly = BaseSuspense
Suspense.SSRSafe = SSRSafeSuspense
