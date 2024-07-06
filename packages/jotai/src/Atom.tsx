import { useAtom, type useAtomValue } from 'jotai'
import type { ReactNode } from 'react'
import type { TAtomProps } from './types'

type AtomOptions = Parameters<typeof useAtomValue>[1]

type AtomResult<TValue, TSetter = never> = [Awaited<TValue>, TSetter]

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue>({
  children,
  ...options
}: TAtomProps<TValue, AtomOptions> & {
  children: (value: AtomResult<TValue>) => ReactNode
}) {
  return <>{children(useAtom(options.atom, options.options))}</>
}
