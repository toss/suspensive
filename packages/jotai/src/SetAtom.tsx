import { type WritableAtom, useSetAtom } from 'jotai'
import type { ChildrenRenderProps } from './utility-types'

type UseSetAtomProps<TValue, TArgs extends unknown[], TResult> = {
  atom: WritableAtom<TValue, TArgs, TResult>
  options?: Parameters<typeof useSetAtom>[1]
}

/**
 * @experimental This is experimental feature.
 */
export function SetAtom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: UseSetAtomProps<TValue, TArgs, TResult> & ChildrenRenderProps<(...args: TArgs) => TResult>) {
  return <>{children(useSetAtom(atom, options))}</>
}
