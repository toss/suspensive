import { useAtomValue, type useStore } from 'jotai'
import type { ReactNode } from 'react'
import type { TAtomProps } from './types'

type AtomValueOptions = Parameters<typeof useStore>[0] & {
  delay?: number
}

type AtomValueResult<TValue> = Awaited<TValue>

/**
 * @experimental This is experimental feature.
 */
export function AtomValue<TValue>({
  children,
  atom,
  options,
}: TAtomProps<TValue, AtomValueOptions> & {
  children: (value: AtomValueResult<TValue>) => ReactNode
}) {
  return <>{children(useAtomValue(atom, options))}</>
}
