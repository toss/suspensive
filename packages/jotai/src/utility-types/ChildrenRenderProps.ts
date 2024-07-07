import type { ReactNode } from 'react'

export interface ChildrenRenderProps<TValue> {
  children: (value: TValue) => ReactNode
}

export type SetAtom<TArgs extends unknown[], TResult> = (...args: TArgs) => TResult
