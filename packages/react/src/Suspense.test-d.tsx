import { Suspense } from './Suspense'

describe('<Suspense/>', () => {
  describe('Suspense.with', () => {
    it('should accept the React-reserved key attribute on components wrapped without props', () => {
      const Wrapped = Suspense.with({ fallback: null }, () => <></>)

      expectTypeOf([<Wrapped key="a" />, <Wrapped key="b" />]).toEqualTypeOf<Array<React.JSX.Element>>()

      assertType(
        // @ts-expect-error arbitrary props should still be rejected
        <Wrapped foo="bar" />
      )
    })

    it('should accept the key attribute along with inferred props', () => {
      const Wrapped = Suspense.with({ fallback: null }, ({ text }: { text: string }) => <>{text}</>)

      expectTypeOf(<Wrapped key="a" text="text" />).toEqualTypeOf<React.JSX.Element>()
    })
  })
})
