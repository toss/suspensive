import type { ComponentProps, FC } from 'react'
import { Suspense } from 'react'
import { useIsMounted } from './hooks'

export const SSRSafeSuspense: FC<ComponentProps<typeof Suspense>> = props => {
  const isMounted = useIsMounted()

  return isMounted ? <Suspense {...props} /> : <>{props.fallback}</>
}
