import { isPlainObject } from './isPlainObject'

describe('isPlainObject', () => {
  describe('true cases', () => {
    it('should return true for a plain object', () => {
      expect(isPlainObject({})).toBe(true)
    })

    it('should return true for an object without a constructor', () => {
      expect(isPlainObject(Object.create(null))).toBe(true)
    })
  })

  describe('If it is judged to be false', () => {
    it('should return false for an array', () => {
      expect(isPlainObject([])).toBe(false)
    })

    it('should return false for a null value', () => {
      expect(isPlainObject(null)).toBe(false)
    })

    it('should return false for an undefined value', () => {
      expect(isPlainObject(undefined)).toBe(false)
    })

    it('should return false for an object instance without an Object-specific method', () => {
      class Foo {
        abc: any
        constructor() {
          this.abc = {}
        }
      }
      expect(isPlainObject(new Foo())).toBe(false)
    })

    it('should return false for an object with a custom prototype', () => {
      function Graph(this: any) {
        this.vertices = []
        this.edges = []
      }
      Graph.prototype.addVertex = function (v: any) {
        this.vertices.push(v)
      }
      expect(isPlainObject(Object.create(Graph))).toBe(false)
    })
  })
})
