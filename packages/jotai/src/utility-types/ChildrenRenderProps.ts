import type { ReactNode } from 'react'

export interface ChildrenRenderProps<TValue> {
  children: (value: TValue) => ReactNode
}
