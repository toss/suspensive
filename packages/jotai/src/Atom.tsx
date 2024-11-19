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
import type { ChildrenRenderProps, SetAtom } from './utility-types'

type UseAtomProps<TAtom extends Parameters<typeof useAtom>[0]> = {
  atom: TAtom
  options?: Parameters<typeof useAtom>[1]
}

/**
 * This component is wrapping `useAtom` of jotai.
 *
 * The Atom component provides an interface similar to Jotai's `useAtom` hook as props, allowing declarative usage.
 * @see {@link https://suspensive.org/docs/jotai/Atom Suspensive Docs}
 * @example
 * ```jsx
 * import { Atom } from '@suspensive/jotai'
 * import { atom } from "jotai";
 *
 * const countAtom = atom(1);
 *
 * const Example = () => (
 *   <Atom atom={countAtom}>
 *     {([count, setCount]) => (
 *       <>
 *         <div>count: {count}</div>
 *         <button onClick={() => setCount(count + 1)}>+1</button>
 *       </>
 *     )}
 *   </Atom>
 * )
 * ```
 */
export function Atom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: UseAtomProps<WritableAtom<TValue, TArgs, TResult>> &
  ChildrenRenderProps<[Awaited<TValue>, SetAtom<TArgs, TResult>]>): ReactNode

export function Atom<TValue>({
  children,
  atom,
  options,
}: UseAtomProps<PrimitiveAtom<TValue>> &
  ChildrenRenderProps<[Awaited<TValue>, SetAtom<[SetStateAction<TValue>], void>]>): ReactNode

export function Atom<TValue>({
  children,
  atom,
  options,
}: UseAtomProps<JotaiAtom<TValue>> & ChildrenRenderProps<[Awaited<TValue>, never]>): ReactNode

export function Atom<TAtom extends WritableAtom<unknown, never[], unknown>>({
  children,
  atom,
  options,
}: UseAtomProps<TAtom> &
  ChildrenRenderProps<
    [Awaited<ExtractAtomValue<TAtom>>, SetAtom<ExtractAtomArgs<TAtom>, ExtractAtomResult<TAtom>>]
  >): ReactNode

export function Atom<TAtom extends JotaiAtom<unknown>>({
  children,
  atom,
  options,
}: UseAtomProps<TAtom> & ChildrenRenderProps<[Awaited<ExtractAtomValue<TAtom>>, never]>): ReactNode

export function Atom<TValue, TArgs extends unknown[], TResult>({
  children,
  atom,
  options,
}: UseAtomProps<JotaiAtom<TValue> | WritableAtom<TValue, TArgs, TResult>> &
  ChildrenRenderProps<ReturnType<typeof useAtom>>): ReactNode {
  return (
    <>
      {children([
        useAtomValue(atom, options),
        useSetAtom(atom as WritableAtom<TValue, TArgs, TResult>, options) as never,
      ])}
    </>
  )
}
