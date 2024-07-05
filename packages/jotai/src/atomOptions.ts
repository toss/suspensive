import { type Atom } from 'jotai'

export type TAtomOptions<TValue, TOptions = unknown> = {
  atom: Atom<TValue>
  options?: TOptions
}

/**
 * @experimental This is experimental feature.
 */
export function atomOptions<TValue, TOptions>({ atom, options }: TAtomOptions<TValue, TOptions>) {
  return {
    atom,
    options,
  }
}
