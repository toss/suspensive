import type { ComponentProps, ReactElement, Ref, RefAttributes } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import { genericForwardRef } from './genericForwardRef'

describe('genericForwardRef', () => {
  it('should infer generic prop types and ref type correctly', () => {
    const TestComponent = genericForwardRef(function TestComponent<T>(
      _props: { value: T; anotherProp: string },
      _ref: Ref<HTMLDivElement>
    ): ReactElement | null {
      return null
    })

    // Check that the generic is preserved
    expectTypeOf<ComponentProps<typeof TestComponent>['value']>().toBeAny

    // Check a specific prop
    expectTypeOf<ComponentProps<typeof TestComponent>['anotherProp']>().toBeString()

    // Check the ref type
    expectTypeOf<ComponentProps<typeof TestComponent>['ref']>().toEqualTypeOf<RefAttributes<HTMLDivElement>['ref']>()

    // Check usage with specific generic type
    const TestComponentString = TestComponent as <T extends string>(
      props: { value: T; anotherProp: string } & RefAttributes<HTMLDivElement>
    ) => ReactElement | null
    expectTypeOf<ComponentProps<typeof TestComponentString>['value']>().toBeString()

    const TestComponentNumber = TestComponent as <T extends number>(
      props: { value: T; anotherProp: string } & RefAttributes<HTMLDivElement>
    ) => ReactElement | null
    expectTypeOf<ComponentProps<typeof TestComponentNumber>['value']>().toBeNumber()
  })
})
