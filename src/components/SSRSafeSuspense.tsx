import { ComponentProps, FC } from 'react'
import { Suspense as BaseSuspense } from 'react'
import { useIsMounted } from '../hooks'

export const SSRSafeSuspense: FC<ComponentProps<typeof BaseSuspense>> = props => {
  const isMounted = useIsMounted()

  return isMounted ? <BaseSuspense {...props} /> : <>{props.fallback}</>
}
