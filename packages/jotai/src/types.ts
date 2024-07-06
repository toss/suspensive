import { type Atom } from 'jotai'

export type TAtomProps<TValue, TOptions = unknown> = {
  atom: Atom<TValue>
  options?: TOptions
}
