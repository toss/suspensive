import { useSetAtom, type useStore } from 'jotai'
import type { SetAtom as TSetAtom, WithChildren, WritableAtomProps } from './types'

type SetAtomOptions = Parameters<typeof useStore>[0]

/**
 * @experimental This is experimental feature.
 */
export function SetAtom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: WritableAtomProps<TValue, TArgs, TResult, SetAtomOptions> & WithChildren<TSetAtom<TArgs, TResult>>) {
  return <>{children(useSetAtom(atom, options))}</>
}
