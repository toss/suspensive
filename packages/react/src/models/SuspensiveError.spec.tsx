import { SuspensiveError } from './SuspensiveError'

describe('SuspensiveError.assert', () => {
  it('should make assertion if condition is boolean', () => {
    const isRandomlyTrue = Math.random() > 0.5
    expectTypeOf(isRandomlyTrue).toEqualTypeOf<boolean>()
    try {
      SuspensiveError.assert(isRandomlyTrue, 'isRandomlyTrue should be true')
      expectTypeOf(isRandomlyTrue).toEqualTypeOf<true>()
      expect(isRandomlyTrue).toBe(true)
    } catch (error) {
      expect(error).toBeInstanceOf(SuspensiveError)
    }
  })
  it('should make assertion if condition is right', () => {
    const isAlwaysTrue = Math.random() > 0
    expectTypeOf(isAlwaysTrue).toEqualTypeOf<boolean>()
    SuspensiveError.assert(isAlwaysTrue, 'isAlwaysTrue should be true')
    expectTypeOf(isAlwaysTrue).toEqualTypeOf<true>()
    expect(isAlwaysTrue).toBe(true)
  })
  it('should throw SuspensiveError if condition is not right', () => {
    try {
      SuspensiveError.assert(Math.random() > 2, 'Math.random() should be greater than 2')
    } catch (error) {
      expect(error).toBeInstanceOf(SuspensiveError)
    }
  })
})
