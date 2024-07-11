import { hasResetKeysChanged } from './hasResetKeysChanged'

const primitive = 0
const reference1 = { test: 0 }
const reference2 = { test: 0 }

describe('hasResetKeysChanged', () => {
  describe('true cases', () => {
    it('should return true if the two arrays have different lengths.', () => {
      const array1 = Array.from({ length: 1 }).map((_, index) => primitive + index)
      const array2 = Array.from({ length: 2 }).map((_, index) => primitive + index)

      expect(hasResetKeysChanged(array1, array2)).toBe(true)
    })

    it('should return true if the two arrays have same lengths but at least one primitive element is different in each index of arrays.', () => {
      const array1 = [primitive, primitive + 1]
      const array2 = [primitive, primitive]

      expect(hasResetKeysChanged(array1, array2)).toBe(true)
    })

    it('should return true if the two arrays have same lengths and have all same primitive elements but order is different', () => {
      const array1 = [primitive, primitive + 1]
      const array2 = [primitive + 1, primitive]

      expect(hasResetKeysChanged(array1, array2)).toBe(true)
    })

    it('should return true when two arrays have each references elements in index of array have different references', () => {
      const array1 = [reference1, { test: 2 }]
      const array2 = [reference1, { test: 2 }]

      expect(hasResetKeysChanged(array1, array2)).toBe(true)
    })
  })

  describe('false cases', () => {
    it('should return false if the two arrays have same lengths and same primitive element in each index of arrays.', () => {
      const array1 = Array.from({ length: 1 }).map((_, index) => primitive + index)
      const array2 = Array.from({ length: 1 }).map((_, index) => primitive + index)

      expect(hasResetKeysChanged(array1, array2)).toBe(false)
    })

    it('should return false when two arrays have each references elements in index of array have same references', () => {
      const array1 = [reference1, reference2]
      const array2 = [reference1, reference2]

      expect(hasResetKeysChanged(array1, array2)).toBe(false)
    })

    it('should return false when no arrays as parameters. because of default value', () => {
      expect(hasResetKeysChanged()).toBe(false)
    })
  })
})
