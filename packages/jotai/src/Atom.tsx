/* eslint-disable @typescript-eslint/unified-signatures */
import {
  type ExtractAtomArgs,
  type ExtractAtomResult,
  type ExtractAtomValue,
  type Atom as JotaiAtom,
  type PrimitiveAtom,
  type SetStateAction,
  type WritableAtom,
  type useAtom,
  useAtomValue,
  useSetAtom,
} from 'jotai'
import type { ReactNode } from 'react'
import type { ChildrenRenderProps } from './utility-types'
type UseAtomProps<TAtom extends JotaiAtom<unknown>> = {
  atom: TAtom
  options?: Parameters<typeof useAtom>[1]
}

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: UseAtomProps<WritableAtom<TValue, TArgs, TResult>> &
  ChildrenRenderProps<[Awaited<TValue>, (...args: TArgs) => TResult]>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue>({
  children,
  atom,
  options,
}: UseAtomProps<PrimitiveAtom<TValue>> &
  ChildrenRenderProps<[Awaited<TValue>, (...args: [SetStateAction<TValue>]) => void]>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue>({
  children,
  atom,
  options,
}: UseAtomProps<JotaiAtom<TValue>> & ChildrenRenderProps<[Awaited<TValue>, never]>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TAtom extends WritableAtom<unknown, never[], unknown>>({
  children,
  atom,
  options,
}: UseAtomProps<TAtom> &
  ChildrenRenderProps<
    [Awaited<ExtractAtomValue<TAtom>>, (...args: ExtractAtomArgs<TAtom>) => ExtractAtomResult<TAtom>]
  >): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TAtom extends JotaiAtom<unknown>>({
  children,
  atom,
  options,
}: UseAtomProps<TAtom> & ChildrenRenderProps<[Awaited<ExtractAtomValue<TAtom>>, never]>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: UseAtomProps<JotaiAtom<unknown>> & ChildrenRenderProps<any>): ReactNode {
  return (
    <>{children([useAtomValue(atom, options), useSetAtom(atom as WritableAtom<TValue, TArgs, TResult>, options)])}</>
  )
}
