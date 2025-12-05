import { useHydrateAtoms } from 'jotai/utils'
import type { WritableAtom } from 'jotai/vanilla'
import type { ReactNode } from 'react'

/**
 * @see https://github.com/pmndrs/jotai/blob/main/src/react/utils/useHydrateAtoms.ts
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWritableAtom = WritableAtom<any, any[], any>

/**
 * @see https://github.com/pmndrs/jotai/blob/main/src/react/utils/useHydrateAtoms.ts
 */
type InferAtomTuples<T> = {
  [K in keyof T]: T[K] extends readonly [infer A, ...infer Rest]
    ? A extends WritableAtom<unknown, infer Args, unknown>
      ? Rest extends Args
        ? readonly [A, ...Rest]
        : never
      : T[K]
    : never
}

type UseHydrateAtomsProps<TAtomValues> = {
  children: ReactNode
  atomValues: TAtomValues
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
 *   <HydrateAtoms atomValues={[[countAtom, 10], [nameAtom, 'test']]}>
 *     <App />
 *   </HydrateAtoms>
 * )
 * ```
 */
export function HydrateAtoms<T extends (readonly [AnyWritableAtom, ...unknown[]])[]>({
  children,
  atomValues,
  options,
}: UseHydrateAtomsProps<InferAtomTuples<T>>): ReactNode

export function HydrateAtoms<T extends Map<AnyWritableAtom, unknown>>({
  children,
  atomValues,
  options,
}: UseHydrateAtomsProps<T>): ReactNode

// eslint-disable-next-line @typescript-eslint/unified-signatures
export function HydrateAtoms<T extends Iterable<readonly [AnyWritableAtom, ...unknown[]]>>({
  children,
  atomValues,
  options,
}: UseHydrateAtomsProps<InferAtomTuples<T>>): ReactNode

export function HydrateAtoms<T extends Iterable<readonly [AnyWritableAtom, ...unknown[]]>>({
  children,
  atomValues,
  options,
}: UseHydrateAtomsProps<T>): ReactNode {
  useHydrateAtoms(atomValues as Parameters<typeof useHydrateAtoms>[0], options)

  return <>{children}</>
}
