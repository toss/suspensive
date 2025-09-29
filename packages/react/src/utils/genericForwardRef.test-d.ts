import type { ComponentProps, RefAttributes } from 'react'
import { describe, expectTypeOf, it } from 'vitest'
import type { genericForwardRef } from './genericForwardRef'

describe('genericForwardRef', () => {
  it('should infer generic prop types and ref type correctly', () => {
    type TestComponent<T = unknown> = ReturnType<
      typeof genericForwardRef<HTMLDivElement, { value: T; anotherProp: string }>
    >

    // Check that the generic is preserved
    expectTypeOf<ComponentProps<TestComponent>['value']>().toEqualTypeOf<unknown>()

    // Check a specific prop
    expectTypeOf<ComponentProps<TestComponent>['anotherProp']>().toBeString()

    // Check the ref type
    expectTypeOf<ComponentProps<TestComponent>['ref']>().toEqualTypeOf<RefAttributes<HTMLDivElement>['ref']>()

    // Check usage with specific generic type
    type TestComponentString = TestComponent<string>
    expectTypeOf<ComponentProps<TestComponentString>['value']>().toBeString()

    type TestComponentNumber = TestComponent<number>
    expectTypeOf<ComponentProps<TestComponentNumber>['value']>().toBeNumber()
  })
})
