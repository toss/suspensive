import type { ReactNode } from 'react'

export interface ChildrenRenderProps<TArgument> {
  children: (arg: TArgument) => ReactNode
}
