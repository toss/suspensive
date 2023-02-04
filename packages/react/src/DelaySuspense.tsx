import { ComponentProps, ComponentType, useEffect, useState } from 'react'
import { Suspense } from './Suspense'
import { ComponentPropsWithoutChildren } from './types'

type DelaySuspenseProps = ComponentProps<typeof Suspense> & {
  ms?: number
}

const DefaultDelaySuspense = (props: DelaySuspenseProps) => (
  <Suspense {...props} fallback={<Delay ms={props.ms}>{props.fallback}</Delay>} />
)
if (process.env.NODE_ENV !== 'production') {
  DefaultDelaySuspense.displayName = 'DelaySuspense'
}
const CSROnlyDelaySuspense = (props: DelaySuspenseProps) => (
  <Suspense.CSROnly {...props} fallback={<Delay ms={props.ms}>{props.fallback}</Delay>} />
)
if (process.env.NODE_ENV !== 'production') {
  CSROnlyDelaySuspense.displayName = 'DelaySuspense.CSROnly'
}

const Delay = ({ ms = 0, children }: Pick<DelaySuspenseProps, 'ms'> & { children: DelaySuspenseProps['fallback'] }) => {
  const [isDelayed, setIsDelayed] = useState(ms === 0)

  useEffect(() => {
    const timerId = setTimeout(() => !isDelayed && setIsDelayed(true), ms)
    return () => clearTimeout(timerId)
  }, [])

  return <>{isDelayed ? children : null}</>
}

/**
 * This component can accept delay time(ms) as prop to prevent to show fallback directly when children is suspended
 * @experimental This component can be renamed itself or be merged to default Suspense of suspensive/react.
 */
export const DelaySuspense = DefaultDelaySuspense as typeof DefaultDelaySuspense & {
  /**
   * CSROnly mode make DelaySuspense can be used in SSR framework like Next.js with React 17 or under
   * @experimental This component can be renamed itself or be merged to default Suspense of suspensive/react.
   */
  CSROnly: typeof CSROnlyDelaySuspense
}
DelaySuspense.CSROnly = CSROnlyDelaySuspense

export function withDelaySuspense<Props extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<Props>,
  suspenseProps?: ComponentPropsWithoutChildren<typeof DelaySuspense>
) {
  const Wrapped = (props: Props) => (
    <DelaySuspense {...suspenseProps}>
      <Component {...props} />
    </DelaySuspense>
  )

  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withDelaySuspense(${name})`
  }

  return Wrapped
}

withDelaySuspense.CSROnly = function withDelaySuspenseCSROnly<
  Props extends Record<string, unknown> = Record<string, never>
>(Component: ComponentType<Props>, suspenseProps?: ComponentPropsWithoutChildren<typeof DelaySuspense.CSROnly>) {
  const Wrapped = (props: Props) => (
    <DelaySuspense.CSROnly {...suspenseProps}>
      <Component {...props} />
    </DelaySuspense.CSROnly>
  )

  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withDelaySuspense.CSROnly(${name})`
  }

  return Wrapped
}
