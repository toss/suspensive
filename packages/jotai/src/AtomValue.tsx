import { type Atom as JotaiAtom, useAtomValue } from 'jotai'
import type { ChildrenRenderProps } from './utility-types'

type UseAtomValueProps<TValue> = {
  atom: JotaiAtom<TValue>
  options?: Parameters<typeof useAtomValue>[1]
}

export function AtomValue<TValue>({
  children,
  atom,
  options,
}: UseAtomValueProps<TValue> & ChildrenRenderProps<Awaited<TValue>>) {
  return <>{children(useAtomValue(atom, options))}</>
}
