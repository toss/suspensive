/* eslint-disable @typescript-eslint/unified-signatures */
import {
  type ExtractAtomArgs,
  type ExtractAtomResult,
  type ExtractAtomValue,
  type Atom as JotaiAtom,
  type PrimitiveAtom,
  type SetStateAction,
  type WritableAtom,
  useAtomValue,
  useSetAtom,
} from 'jotai'
import type { ReactNode } from 'react'
import type { AtomProps, AtomResult, SetAtom, WithChildren } from './types'

type AtomOptions = Parameters<typeof useAtomValue>[1]

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: AtomProps<WritableAtom<TValue, TArgs, TResult>, AtomOptions> &
  WithChildren<AtomResult<Awaited<TValue>, SetAtom<TArgs, TResult>>>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue>({
  children,
  atom,
  options,
}: AtomProps<PrimitiveAtom<TValue>, AtomOptions> &
  WithChildren<AtomResult<Awaited<TValue>, SetAtom<[SetStateAction<TValue>], void>>>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue>({
  children,
  atom,
  options,
}: AtomProps<JotaiAtom<TValue>, AtomOptions> & WithChildren<AtomResult<Awaited<TValue>>>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TAtom extends WritableAtom<unknown, never[], unknown>>({
  children,
  atom,
  options,
}: AtomProps<TAtom, AtomOptions> &
  WithChildren<
    AtomResult<Awaited<ExtractAtomValue<TAtom>>, SetAtom<ExtractAtomArgs<TAtom>, ExtractAtomResult<TAtom>>>
  >): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TAtom extends JotaiAtom<unknown>>({
  children,
  atom,
  options,
}: AtomProps<TAtom, AtomOptions> & WithChildren<AtomResult<Awaited<ExtractAtomValue<TAtom>>>>): ReactNode

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: AtomProps<JotaiAtom<TValue> | WritableAtom<TValue, TArgs, TResult>, AtomOptions> &
  WithChildren<AtomResult<Awaited<TValue>, SetAtom<TArgs, TResult>>>): ReactNode {
  return (
    <>{children([useAtomValue(atom, options), useSetAtom(atom as WritableAtom<TValue, TArgs, TResult>, options)])}</>
  )
}
