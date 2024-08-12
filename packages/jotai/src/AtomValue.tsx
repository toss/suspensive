import { type ExtractAtomValue, type Atom as JotaiAtom, useAtomValue } from 'jotai'
import type { ReactNode } from 'react'
import type { ChildrenRenderProps } from './utility-types'

type UseAtomValueProps<TAtom extends Parameters<typeof useAtomValue>[0]> = {
  atom: TAtom
  options?: Parameters<typeof useAtomValue>[1]
}

export function AtomValue<TValue>({
  children,
  atom,
  options,
}: UseAtomValueProps<JotaiAtom<TValue>> & ChildrenRenderProps<Awaited<TValue>>): ReactNode

export function AtomValue<TAtom extends JotaiAtom<unknown>>({
  children,
  atom,
  options,
}: UseAtomValueProps<TAtom> & ChildrenRenderProps<Awaited<ExtractAtomValue<TAtom>>>): ReactNode

export function AtomValue<TValue>({
  children,
  atom,
  options,
}: UseAtomValueProps<JotaiAtom<TValue>> & ChildrenRenderProps<ReturnType<typeof useAtomValue>>): ReactNode {
  return <>{children(useAtomValue(atom, options))}</>
}
