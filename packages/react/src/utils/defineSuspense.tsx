import { Suspense, type SuspenseProps } from 'react'
import { ClientOnly } from '../components/ClientOnly'

interface DefineSuspenseProps {
  defaultPropsClientOnly?: boolean
  componentPropsClientOnly?: boolean
}

export const SuspenseClientOnly = (props: SuspenseProps) => (
  <ClientOnly fallback={props.fallback}>
    <Suspense {...props} />
  </ClientOnly>
)

export const defineSuspense = ({ defaultPropsClientOnly, componentPropsClientOnly }: DefineSuspenseProps) => {
  return componentPropsClientOnly ?? defaultPropsClientOnly ? SuspenseClientOnly : Suspense
}
