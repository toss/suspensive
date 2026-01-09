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
      const values = [[countAtom, 10]] as const
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(values)
      return (
        <HydrateAtoms values={values}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => {
      const values = [
        [countAtom, 10],
        [nameAtom, 'test'],
      ] as const
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(values)
      return (
        <HydrateAtoms values={values}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => {
      const values = new Map<typeof countAtom | typeof nameAtom, number | string>([
        [countAtom, 10],
        [nameAtom, 'test'],
      ])
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(values)
      return (
        <HydrateAtoms values={values}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => {
      function* generateAtomValues() {
        yield [countAtom, 10] as const
        yield [nameAtom, 'test'] as const
      }
      const values = [...generateAtomValues()]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(values)
      return (
        <HydrateAtoms values={values}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => (
      <HydrateAtoms values={[[booleanAtom, false]]}>
        <></>
      </HydrateAtoms>
    ))()
    ;(() => (
      <HydrateAtoms values={[[writeOnlySingleArgAtom, 10]]}>
        <></>
      </HydrateAtoms>
    ))()
    ;(() => (
      <HydrateAtoms values={[[writeOnlyDoubleArgAtom, 10, 20]]}>
        <></>
      </HydrateAtoms>
    ))()
    ;(() => {
      const values = [[countAtom, 10]] as const
      const options = { store }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(values, options)
      return (
        <HydrateAtoms values={values} options={options}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => {
      const values = [[countAtom, 10]] as const
      const options = { dangerouslyForceHydrate: true }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(values, options)
      return (
        <HydrateAtoms values={values} options={options}>
          <></>
        </HydrateAtoms>
      )
    })()
    ;(() => {
      const values = [[countAtom, 10]] as const
      const options = { store, dangerouslyForceHydrate: true }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _hydrateAtoms = useHydrateAtoms(values, options)
      return (
        <HydrateAtoms values={values} options={options}>
          <></>
        </HydrateAtoms>
      )
    })()

    expectTypeOf(
      <HydrateAtoms values={[[countAtom, 10]]}>
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms values={[[countAtom, 10]]}>
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <HydrateAtoms
        values={[
          [countAtom, 10],
          [nameAtom, 'test'],
        ]}
      >
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms
        values={[
          [countAtom, 10],
          [nameAtom, 'test'],
        ]}
      >
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <HydrateAtoms values={new Map([[countAtom, 10]])}>
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms values={new Map([[countAtom, 10]])}>
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <HydrateAtoms values={[[countAtom, 10]]} options={{ store }}>
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms values={[[countAtom, 10]]} options={{ store }}>
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <HydrateAtoms values={[[countAtom, 10]]} options={{ dangerouslyForceHydrate: true }}>
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms values={[[countAtom, 10]]} options={{ dangerouslyForceHydrate: true }}>
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <HydrateAtoms values={[[countAtom, 10]]} options={{ store, dangerouslyForceHydrate: true }}>
        <></>
      </HydrateAtoms>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <HydrateAtoms values={[[countAtom, 10]]} options={{ store, dangerouslyForceHydrate: true }}>
        <></>
      </HydrateAtoms>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
