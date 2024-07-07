import { type Atom, useAtomValue, type useStore } from 'jotai'
import type { ChildrenRenderProps } from './utility-types/ChildrenRenderProps'

type AtomValueOptions = Parameters<typeof useStore>[0] & {
  delay?: number
}

type AtomValueProps<TAtom, TOptions = unknown> = {
  atom: TAtom
  options?: TOptions
}

/**
 * @experimental This is experimental feature.
 */
export function AtomValue<TValue>({
  children,
  atom,
  options,
}: AtomValueProps<Atom<TValue>, AtomValueOptions> & ChildrenRenderProps<Awaited<TValue>>) {
  return <>{children(useAtomValue(atom, options))}</>
}
