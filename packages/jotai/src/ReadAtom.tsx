import { type ExtractReadAtom, type Atom as JotaiAtom, useReadAtom } from 'jotai'
import type { ReactNode } from 'react'
import type { ChildrenRenderProps } from './utility-types'

type UseReadAtomProps<TAtom extends Parameters<typeof useReadAtom>[0]> = {
  atom: TAtom
  options?: Parameters<typeof useReadAtom>[1]
}

/**
 * This component is wrapping `useReadAtom` of jotai.
 *
 * The ReadAtom component provides an interface similar to Jotai's `useReadAtom` hook as props, allowing declarative usage.
 * @see {@link https://suspensive.org/docs/jotai/ReadAtom Suspensive Docs}
 * @example
 * ```jsx
 * import { ReadAtom } from '@suspensive/jotai'
 * import { atom } from "jotai";
 *
 * const countAtom = atom(1);
 *
 * const Example = () => (
 *   <ReadAtom atom={countAtom}>
 *     {(count) => (
 *       <>count: {count}</>
 *     )}
 *   </ReadAtom>
 * )
 * ```
 */
export function ReadAtom<TValue>({
  children,
  atom,
  options,
}: UseReadAtomProps<JotaiAtom<TValue>> & ChildrenRenderProps<Awaited<TValue>>): ReactNode

export function ReadAtom<TAtom extends JotaiAtom<unknown>>({
  children,
  atom,
  options,
}: UseReadAtomProps<TAtom> & ChildrenRenderProps<Awaited<ExtractReadAtom<TAtom>>>): ReactNode

export function ReadAtom<TValue>({
  children,
  atom,
  options,
}: UseReadAtomProps<JotaiAtom<TValue>> & ChildrenRenderProps<ReturnType<typeof useReadAtom>>): ReactNode {
  return <>{children(useReadAtom(atom, options))}</>
}
