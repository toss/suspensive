import { isDifferentArray } from '.'

describe('isDifferentArray', () => {
  it('should return true if the two values are different in length.', () => {
    const value1 = [1]
    const value2 = [2, 3]

    const result = isDifferentArray(value1, value2)

    expect(result).toBe(true)
  })

  it('should return true if the two arrays have the same length but one primitive value is different.', () => {
    const value1 = [1, 3]
    const value2 = [1, 2]

    const result = isDifferentArray(value1, value2)

    expect(result).toBe(true)
  })

  it('should return true if two arrays have the same length but have different field', () => {
    const value1 = [{ test: 1 }, { test: 2 }]
    const value2 = [{ test: 1 }, { test: 3 }]

    const result = isDifferentArray(value1, value2)

    expect(result).toBe(true)
  })

  it('should return false when two array with primitive values is same', () => {
    const value1 = [1, 2]
    const value2 = [1, 2]

    const result = isDifferentArray(value1, value2)

    expect(result).toBe(false)
  })

  it('should return true when two array is same object', () => {
    const value1 = [{ test: 1 }, { test: 2 }]
    const value2 = [{ test: 1 }, { test: 2 }]

    const result = isDifferentArray(value1, value2)

    expect(result).toBe(true)
  })
})
