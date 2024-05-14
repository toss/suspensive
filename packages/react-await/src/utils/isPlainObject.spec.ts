import { isPlainObject } from './isPlainObject'

describe('isPlainObject', () => {
  describe('should return true', () => {
    it('for a plain object', () => {
      expect(isPlainObject({})).toBe(true)
    })

    it('for an object without a constructor', () => {
      expect(isPlainObject(Object.create(null))).toBe(true)
    })
  })

  describe('should return false', () => {
    it('for an array', () => {
      expect(isPlainObject([])).toBe(false)
    })

    it('for a null value', () => {
      expect(isPlainObject(null)).toBe(false)
    })

    it('for an undefined value', () => {
      expect(isPlainObject(undefined)).toBe(false)
    })

    it('for an object instance without an Object-specific method', () => {
      class Foo {
        abc: any
        constructor() {
          this.abc = {}
        }
      }
      expect(isPlainObject(new Foo())).toBe(false)
    })

    it('for an object with a custom prototype', () => {
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
