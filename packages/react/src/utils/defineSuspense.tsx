import { Suspense, type SuspenseProps } from 'react'
import { ClientOnly } from '../components/ClientOnly'

export const SuspenseClientOnly = (props: SuspenseProps) => (
  <ClientOnly fallback={props.fallback}>
    <Suspense {...props} />
  </ClientOnly>
)

export const defineSuspense = ({
  defaultPropsClientOnly,
  componentPropsClientOnly,
}: {
  defaultPropsClientOnly?: boolean
  componentPropsClientOnly?: boolean
}) => (componentPropsClientOnly ?? defaultPropsClientOnly ? SuspenseClientOnly : Suspense)
