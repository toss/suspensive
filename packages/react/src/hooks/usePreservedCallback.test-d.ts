import { usePreservedCallback } from './usePreservedCallback'

describe('usePreservedCallback', () => {
  it('type check', () => {
    expectTypeOf(
      usePreservedCallback(() => {
        /* empty */
      })
    ).toEqualTypeOf<() => void>()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expectTypeOf(usePreservedCallback((a: number, b: string) => {})).toEqualTypeOf<(a: number, b: string) => void>()

    expectTypeOf(usePreservedCallback((a: number, b: string) => (Math.random() > 0.5 ? a : b))).toEqualTypeOf<
      (a: number, b: string) => number | string
    >()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expectTypeOf(usePreservedCallback((a) => {})).toEqualTypeOf<(a: any) => void>()
  })
})
