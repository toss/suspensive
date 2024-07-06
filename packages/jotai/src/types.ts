import type { WritableAtom } from 'jotai'
import type { ReactNode } from 'react'

export interface WithChildren<TValue> {
  children: (value: TValue) => ReactNode
}

export type AtomProps<TAtom, TOptions = unknown> = {
  atom: TAtom
  options?: TOptions
}

export type WritableAtomProps<TValue, TArgs extends unknown[], TResult, TOptions = unknown> = {
  atom: WritableAtom<TValue, TArgs, TResult>
  options?: TOptions
}

export type AtomResult<TValue, TSetter = unknown> = [TValue, TSetter]

export type SetAtom<TArgs extends unknown[], TResult> = (...args: TArgs) => TResult
