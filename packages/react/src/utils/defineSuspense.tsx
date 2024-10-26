import { Suspense, type SuspenseProps } from 'react'
import { ClientOnly } from '../ClientOnly'

export const SuspenseClientOnly = (props: SuspenseProps) => (
  <ClientOnly fallback={props.fallback}>
    <Suspense {...props} />
  </ClientOnly>
)

export function defineSuspense(
  options:
    | {
        componentPropsClientOnly: true
        defaultPropsClientOnly?: boolean
      }
    | {
        componentPropsClientOnly?: undefined
        defaultPropsClientOnly: true
      }
): typeof SuspenseClientOnly

export function defineSuspense(options: {
  componentPropsClientOnly?: boolean
  defaultPropsClientOnly?: boolean
}): typeof Suspense

export function defineSuspense({
  defaultPropsClientOnly,
  componentPropsClientOnly,
}: {
  defaultPropsClientOnly?: boolean
  componentPropsClientOnly?: boolean
}): typeof SuspenseClientOnly | typeof Suspense {
  return (componentPropsClientOnly ?? defaultPropsClientOnly) ? SuspenseClientOnly : Suspense
}
