import { type WritableAtom, useSetAtom, type useStore } from 'jotai'
import type { ChildrenRenderProps, SetAtom as TSetAtom } from './utility-types/ChildrenRenderProps'

type SetAtomOptions = Parameters<typeof useStore>[0]

type SetAtomProps<TValue, TArgs extends unknown[], TResult, TOptions = unknown> = {
  atom: WritableAtom<TValue, TArgs, TResult>
  options?: TOptions
}

/**
 * @experimental This is experimental feature.
 */
export function SetAtom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: SetAtomProps<TValue, TArgs, TResult, SetAtomOptions> & ChildrenRenderProps<TSetAtom<TArgs, TResult>>) {
  return <>{children(useSetAtom(atom, options))}</>
}
