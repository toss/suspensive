import { type WritableAtom, atom, createStore } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import type { ReactNode } from 'react'
import { HydrateAtoms } from './HydrateAtoms'

const countAtom = atom(0)
const nameAtom = atom('')
const booleanAtom = atom(true)
const writeOnlySingleArgAtom: WritableAtom<number, [number], void> = atom(
  (get) => get(countAtom),
  (_get, set, value: number) => set(countAtom, value)
)
const writeOnlyDoubleArgAtom: WritableAtom<number, [number, number], void> = atom(
  (get) => get(countAtom),
  (_get, set, first: number, second: number) => set(countAtom, first + second)
)
const store = createStore()

describe('<HydrateAtoms />', () => {
  it('type check', () => {
    ;(() => {
      const atomValues = [[countAtom, 10]] as const
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(atomValues)
      return (
        <HydrateAtoms atomValues={atomValues}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => {
      const atomValues = [
        [countAtom, 10],
        [nameAtom, 'test'],
      ] as const
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(atomValues)
      return (
        <HydrateAtoms atomValues={atomValues}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => {
      const atomValues = new Map<typeof countAtom | typeof nameAtom, number | string>([
        [countAtom, 10],
        [nameAtom, 'test'],
      ])
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(atomValues)
      return (
        <HydrateAtoms atomValues={atomValues}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => {
      function* generateAtomValues() {
        yield [countAtom, 10] as const
        yield [nameAtom, 'test'] as const
      }
      const atomValues = [...generateAtomValues()]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(atomValues)
      return (
        <HydrateAtoms atomValues={atomValues}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => (
      <HydrateAtoms atomValues={[[booleanAtom, false]]}>
        <></>
      </HydrateAtoms>
    ))()
    ;(() => (
      <HydrateAtoms atomValues={[[writeOnlySingleArgAtom, 10]]}>
        <></>
      </HydrateAtoms>
    ))()
    ;(() => (
      <HydrateAtoms atomValues={[[writeOnlyDoubleArgAtom, 10, 20]]}>
        <></>
      </HydrateAtoms>
    ))()
    ;(() => {
      const atomValues = [[countAtom, 10]] as const
      const options = { store }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(atomValues, options)
      return (
        <HydrateAtoms atomValues={atomValues} options={options}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => {
      const atomValues = [[countAtom, 10]] as const
      const options = { dangerouslyForceHydrate: true }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(atomValues, options)
      return (
        <HydrateAtoms atomValues={atomValues} options={options}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => {
      const atomValues = [[countAtom, 10]] as const
      const options = { store, dangerouslyForceHydrate: true }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(atomValues, options)
      return (
        <HydrateAtoms atomValues={atomValues} options={options}>
          <></>
        </HydrateAtoms>
      )
    })()

    expectTypeOf(
      <HydrateAtoms atomValues={[[countAtom, 10]]}>
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms atomValues={[[countAtom, 10]]}>
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <HydrateAtoms
        atomValues={[
          [countAtom, 10],
          [nameAtom, 'test'],
        ]}
      >
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms
        atomValues={[
          [countAtom, 10],
          [nameAtom, 'test'],
        ]}
      >
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <HydrateAtoms atomValues={new Map([[countAtom, 10]])}>
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms atomValues={new Map([[countAtom, 10]])}>
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <HydrateAtoms atomValues={[[countAtom, 10]]} options={{ store }}>
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms atomValues={[[countAtom, 10]]} options={{ store }}>
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <HydrateAtoms atomValues={[[countAtom, 10]]} options={{ dangerouslyForceHydrate: true }}>
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms atomValues={[[countAtom, 10]]} options={{ dangerouslyForceHydrate: true }}>
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <HydrateAtoms atomValues={[[countAtom, 10]]} options={{ store, dangerouslyForceHydrate: true }}>
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms atomValues={[[countAtom, 10]]} options={{ store, dangerouslyForceHydrate: true }}>
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
