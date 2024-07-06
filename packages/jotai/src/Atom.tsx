import { useAtom, type useAtomValue } from 'jotai'
import type { ReactNode } from 'react'
import type { TAtomProps } from './types'

type TOptions = Parameters<typeof useAtomValue>[1]

/**
 * @experimental This is experimental feature.
 */
export function Atom<TValue>({
  children,
  ...options
}: TAtomProps<TValue, TOptions> & {
  children: (value: [Awaited<TValue>, never]) => ReactNode
}) {
  return <>{children(useAtom(options.atom, options.options))}</>
}
