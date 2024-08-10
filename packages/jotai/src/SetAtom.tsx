import { type ExtractAtomArgs, type ExtractAtomResult, type WritableAtom, useSetAtom } from 'jotai'
import type { ReactNode } from 'react'
import type { ChildrenRenderProps, SetAtom as TSetAtom } from './utility-types'

type UseSetAtomProps<TAtom> = {
  atom: TAtom
  options?: Parameters<typeof useSetAtom>[1]
}

export function SetAtom<TValue, TArgs extends unknown[], TResult>({
  atom,
  options,
}: UseSetAtomProps<WritableAtom<TValue, TArgs, TResult>> & ChildrenRenderProps<TSetAtom<TArgs, TResult>>): ReactNode

export function SetAtom<TAtom extends WritableAtom<unknown, never[], unknown>>({
  atom,
  options,
}: UseSetAtomProps<TAtom> & ChildrenRenderProps<TSetAtom<ExtractAtomArgs<TAtom>, ExtractAtomResult<TAtom>>>): ReactNode

export function SetAtom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: UseSetAtomProps<WritableAtom<TValue, TArgs, TResult>> & ChildrenRenderProps<TSetAtom<TArgs, TResult>>): ReactNode {
  return <>{children(useSetAtom(atom, options))}</>
}
