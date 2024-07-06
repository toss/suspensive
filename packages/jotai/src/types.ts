import type { Atom, WritableAtom } from 'jotai'

export type TAtomProps<TValue, TOptions = unknown> = {
  atom: Atom<TValue>
  options?: TOptions
}

export type TWritableAtomProps<TValue, TArgs extends unknown[], TResult, TOptions = unknown> = {
  atom: WritableAtom<TValue, TArgs, TResult>
  options?: TOptions
}
