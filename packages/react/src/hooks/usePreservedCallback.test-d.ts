import { usePreservedCallback } from './usePreservedCallback'

describe('usePreservedCallback', () => {
  it('type check', () => {
    expectTypeOf(
      usePreservedCallback(() => {
        /* empty */
      })
    ).toEqualTypeOf<() => void>()

    expectTypeOf(
      usePreservedCallback((a: number, b: string) => {
        a
        b
      })
    ).toEqualTypeOf<(a: number, b: string) => void>()

    expectTypeOf(
      usePreservedCallback((a: number, b: string) => {
        if (a > 0) {
          return b
        }

        return a
      })
    ).toEqualTypeOf<(a: number, b: string) => number | string>()
    expectTypeOf(
      usePreservedCallback((a) => {
        a
      })
    ).toEqualTypeOf<(a: any) => void>()
  })
})
