import { Suspense, type SuspenseProps } from 'react'
import { ClientOnly } from '../ClientOnly'

export const SuspenseClientOnly = (props: SuspenseProps) => (
  <ClientOnly fallback={props.fallback}>
    <Suspense {...props} />
  </ClientOnly>
)

/* eslint-disable @typescript-eslint/unified-signatures */
export function defineSuspense(options: { componentPropsClientOnly: true }): typeof SuspenseClientOnly
export function defineSuspense(options: { defaultPropsClientOnly: true }): typeof SuspenseClientOnly
export function defineSuspense(options: {
  componentPropsClientOnly: true
  defaultPropsClientOnly: undefined
}): typeof SuspenseClientOnly
export function defineSuspense(options: {
  componentPropsClientOnly: undefined
  defaultPropsClientOnly: true
}): typeof SuspenseClientOnly
export function defineSuspense(options: {
  componentPropsClientOnly: true
  defaultPropsClientOnly: true
}): typeof SuspenseClientOnly
export function defineSuspense(options: {
  componentPropsClientOnly: true
  defaultPropsClientOnly: false
}): typeof SuspenseClientOnly
export function defineSuspense(options: {
  componentPropsClientOnly: false
  defaultPropsClientOnly: true
}): typeof SuspenseClientOnly
export function defineSuspense(options: {
  componentPropsClientOnly: false
  defaultPropsClientOnly: false
}): typeof Suspense
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function defineSuspense(options: {}): typeof Suspense
export function defineSuspense({
  defaultPropsClientOnly,
  componentPropsClientOnly,
}: {
  defaultPropsClientOnly?: boolean
  componentPropsClientOnly?: boolean
}): typeof SuspenseClientOnly | typeof Suspense {
  return (componentPropsClientOnly ?? defaultPropsClientOnly) ? SuspenseClientOnly : Suspense
}
