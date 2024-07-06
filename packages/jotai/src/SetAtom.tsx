import { useSetAtom, type useStore } from 'jotai'
import type { ReactNode } from 'react'
import type { TWritableAtomProps } from './types'

type SetAtomOptions = Parameters<typeof useStore>[0]

export type SetAtomResult<TArgs extends unknown[], TResult> = (...args: TArgs) => TResult

/**
 * @experimental This is experimental feature.
 */
export function SetAtom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: TWritableAtomProps<TValue, TArgs, TResult, SetAtomOptions> & {
  children: (value: SetAtomResult<TArgs, TResult>) => ReactNode
}) {
  return <>{children(useSetAtom(atom, options))}</>
}
