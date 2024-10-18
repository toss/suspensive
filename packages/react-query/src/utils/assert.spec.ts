import { assert } from './assert'

describe('assert', () => {
  it('should make assertion if condition is boolean', () => {
    const isRandomlyTrue = Math.random() > 0.5
    expectTypeOf(isRandomlyTrue).toEqualTypeOf<boolean>()
    try {
      assert(isRandomlyTrue, 'isRandomlyTrue should be true')
      expectTypeOf(isRandomlyTrue).toEqualTypeOf<true>()
      expect(isRandomlyTrue).toBe(true)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })
  it('should make assertion if condition is right', () => {
    const isAlwaysTrue = Math.random() > 0
    expectTypeOf(isAlwaysTrue).toEqualTypeOf<boolean>()
    assert(isAlwaysTrue, 'isAlwaysTrue should be true')
    expectTypeOf(isAlwaysTrue).toEqualTypeOf<true>()
    expect(isAlwaysTrue).toBe(true)
  })
  it('should throw Error if condition is not right', () => {
    try {
      assert(Math.random() > 2, 'Math.random() should be greater than 2')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })
})
