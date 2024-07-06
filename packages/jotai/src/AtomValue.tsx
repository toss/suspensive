import { useAtomValue, type useStore } from 'jotai'
import type { ReactNode } from 'react'
import type { TAtomProps } from './types'

type TOptions = Parameters<typeof useStore>[0] & {
  delay?: number
}

/**
 * @experimental This is experimental feature.
 */
export function AtomValue<TValue>({
  children,
  atom,
  options,
}: TAtomProps<TValue, TOptions> & {
  children: (value: Awaited<TValue>) => ReactNode
}) {
  return <>{children(useAtomValue(atom, options))}</>
}
