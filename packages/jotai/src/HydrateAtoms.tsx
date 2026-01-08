import type { INTERNAL_InferAtomTuples as InferAtomTuples } from 'jotai/react/utils/useHydrateAtoms'
import { useHydrateAtoms } from 'jotai/utils'
import type { WritableAtom } from 'jotai/vanilla'
import type { ReactNode } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWritableAtom = WritableAtom<any, any[], any>

type UseHydrateAtomsProps<TValues> = {
  children: ReactNode
  values: TValues
  options?: Parameters<typeof useHydrateAtoms>[1]
}

/**
 * This component is wrapping `useHydrateAtoms` of jotai/utils.
 * The HydrateAtoms component hydrates initial values from SSR into Jotai atoms, preventing state mismatch between server and client.
 *
 * @experimental This component is experimental and may be changed or removed in the future.
 *
 * @see {@link https://suspensive.org/docs/jotai/HydrateAtoms Suspensive Docs}
 *
 * @example
 * ```jsx
 * import { HydrateAtoms } from '@suspensive/jotai'
 * import { atom } from 'jotai'
 *
 * const countAtom = atom(0)
 * const nameAtom = atom('')
 *
 * const Example = () => (
 *   <HydrateAtoms values={[[countAtom, 10], [nameAtom, 'test']]}>
 *     <App />
 *   </HydrateAtoms>
 * )
 * ```
 */
export function HydrateAtoms<T extends (readonly [AnyWritableAtom, ...unknown[]])[]>({
  children,
  values,
  options,
}: UseHydrateAtomsProps<InferAtomTuples<T>>): ReactNode

export function HydrateAtoms<T extends Map<AnyWritableAtom, unknown>>({
  children,
  values,
  options,
}: UseHydrateAtomsProps<T>): ReactNode

// eslint-disable-next-line @typescript-eslint/unified-signatures
export function HydrateAtoms<T extends Iterable<readonly [AnyWritableAtom, ...unknown[]]>>({
  children,
  values,
  options,
}: UseHydrateAtomsProps<InferAtomTuples<T>>): ReactNode

export function HydrateAtoms<T extends Iterable<readonly [AnyWritableAtom, ...unknown[]]>>({
  children,
  values,
  options,
}: UseHydrateAtomsProps<T>): ReactNode {
  useHydrateAtoms(values as Parameters<typeof useHydrateAtoms>[0], options)

  return <>{children}</>
}
