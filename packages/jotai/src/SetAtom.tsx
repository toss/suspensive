import { type ExtractAtomArgs, type ExtractAtomResult, type WritableAtom, useSetAtom } from 'jotai'
import type { ReactNode } from 'react'
import type { ChildrenRenderProps, SetAtom as TSetAtom } from './utility-types'

type UseSetAtomProps<TAtom> = {
  atom: TAtom
  options?: Parameters<typeof useSetAtom>[1]
}

/**
 * This component is wrapping `useSetAtom` of jotai.
 *
 * The SetAtom component provides an interface similar to Jotai's `useSetAtom` hook as props, allowing declarative usage.
 * @see {@link https://suspensive.org/docs/jotai/SetAtom Suspensive Docs}
 * @example
 * ```jsx
 * import { SetAtom } from '@suspensive/jotai'
 * import { atom } from "jotai";
 *
 * const switchAtom = atom(false)
 *
 * const Example = () => (
 *   <SetAtom atom={switchAtom}>
 *     {(setCount) => (
 *       <>
 *         <button onClick={() => setCount(true)}>Set True</button>
 *         <button onClick={() => setCount(false)}>Set False</button>
 *       </>
 *     )}
 *   </SetAtom>
 * )
 * ```
 */
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
