/* eslint-disable @typescript-eslint/unified-signatures */
import type {
  ExtractAtomArgs,
  ExtractAtomResult,
  ExtractAtomValue,
  Atom as JotaiAtom,
  PrimitiveAtom,
  SetStateAction,
  WritableAtom,
  useAtomValue,
} from 'jotai'
import type { ReactNode } from 'react'
import type { ChildrenRenderProps, SetAtom } from './utility-types/ChildrenRenderProps'

type AtomResult<TValue, TSetter> = [TValue, TSetter]

type AtomOptions = Parameters<typeof useAtomValue>[1]

type AtomProps<TAtom, TOptions = unknown> = {
  atom: TAtom
  options?: TOptions
}

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: AtomProps<WritableAtom<TValue, TArgs, TResult>, AtomOptions> &
  ChildrenRenderProps<AtomResult<Awaited<TValue>, SetAtom<TArgs, TResult>>>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue>({
  children,
  atom,
  options,
}: AtomProps<PrimitiveAtom<TValue>, AtomOptions> &
  ChildrenRenderProps<AtomResult<Awaited<TValue>, SetAtom<[SetStateAction<TValue>], void>>>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue>({
  children,
  atom,
  options,
}: AtomProps<JotaiAtom<TValue>, AtomOptions> & ChildrenRenderProps<AtomResult<Awaited<TValue>, never>>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TAtom extends WritableAtom<unknown, never[], unknown>>({
  children,
  atom,
  options,
}: AtomProps<TAtom, AtomOptions> &
  ChildrenRenderProps<
    AtomResult<Awaited<ExtractAtomValue<TAtom>>, SetAtom<ExtractAtomArgs<TAtom>, ExtractAtomResult<TAtom>>>
  >): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TAtom extends JotaiAtom<unknown>>({
  children,
  atom,
  options,
}: AtomProps<TAtom, AtomOptions> & ChildrenRenderProps<AtomResult<Awaited<ExtractAtomValue<TAtom>>, never>>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom(props: unknown) {
  return props
}
