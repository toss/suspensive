import { type Atom, useAtomValue, type useStore } from 'jotai'
import type { AtomProps, WithChildren } from './types'

type AtomValueOptions = Parameters<typeof useStore>[0] & {
  delay?: number
}

/**
 * @experimental This is experimental feature.
 */
export function AtomValue<TValue>({
  children,
  atom,
  options,
}: AtomProps<Atom<TValue>, AtomValueOptions> & WithChildren<Awaited<TValue>>) {
  return <>{children(useAtomValue(atom, options))}</>
}
