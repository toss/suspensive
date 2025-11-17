import type { ReactNode } from 'react'

export type WrapperProps = {
  children: ReactNode
  toc?: Array<{ depth: number; value: string; id: string }>
  metadata?: any
  sourceCode?: string
}

export function Wrapper({ children }: WrapperProps) {
  return <>{children}</>
}
